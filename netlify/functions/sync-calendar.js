// netlify/functions/sync-calendar.js
//
// Fetches a public iCal (.ics) calendar link server-side and returns upcoming
// events (expanding repeating events), timezone-correct:
//   • The client sends its IANA timezone (e.g. "America/Chicago"); floating
//     times (no TZID) are interpreted as wall-clock time in that zone.
//   • Events with a TZID keep their own zone, and recurring occurrences are
//     re-anchored to the series' wall-clock time so DST never drifts them.
//   • All-day events are returned as { allDay: true, date: "YYYY-MM-DD" }
//     with no fabricated times.

const ical = require("node-ical");

// offset (ms) of `tz` from UTC at the moment `date`
function tzOffsetMs(tz, date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map(x => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return asUTC - date.getTime();
}

// build the UTC instant for a wall-clock time in `tz`
function wallToUTC(y, mo, d, h, mi, s, tz) {
  let guess = Date.UTC(y, mo, d, h, mi, s);
  for (let i = 0; i < 2; i++) {
    guess = Date.UTC(y, mo, d, h, mi, s) - tzOffsetMs(tz, new Date(guess));
  }
  return new Date(guess);
}

// wall-clock parts of a UTC instant, seen from `tz`
function wallParts(date, tz) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map(x => [x.type, x.value]));
  return { y: +p.year, mo: +p.month - 1, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  try {
    const body = JSON.parse(event.body || "{}");
    let url = (body.url || "").trim();
    if (!url) {
      return { statusCode: 400, body: JSON.stringify({ error: "No calendar link provided" }) };
    }
    url = url.replace(/^webcal:\/\//i, "https://");

    // the user's timezone, sent by the client; floating times live here
    const homeTz = body.tz || "America/Chicago";

    const windowDays = Number(body.days) || 30;
    const now = new Date();
    const rangeStart = new Date(now.getTime() - 26 * 3600000); // small back-window for tz edges
    const rangeEnd = new Date(now.getTime() + windowDays * 86400000);

    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error("Calendar fetch failed (" + res.status + ")");
    const text = await res.text();
    const data = await ical.async.parseICS(text);

    const out = [];
    for (const k in data) {
      const ev = data[k];
      if (!ev || ev.type !== "VEVENT") continue;
      const title = ev.summary || "Busy";
      const isAllDay = ev.datetype === "date";
      const evTz = (ev.start && ev.start.tz) || null; // TZID if present
      const durMs = (ev.end && ev.start) ? (new Date(ev.end) - new Date(ev.start)) : 0;

      const pushTimed = (startDate) => {
        if (startDate >= rangeStart && startDate <= rangeEnd) {
          out.push({
            title,
            start: startDate.toISOString(),
            end: new Date(startDate.getTime() + durMs).toISOString(),
          });
        }
      };
      const pushAllDay = (dateStr) => {
        out.push({ title, allDay: true, date: dateStr, start: dateStr + "T00:00:00.000Z" });
      };

      // resolve one non-recurring start to a correct UTC instant
      const resolveStart = (d) => {
        if (evTz) return new Date(d); // parser already anchored TZID times correctly
        // floating: the parser used the server's zone (UTC) — reinterpret as homeTz wall time
        return wallToUTC(
          d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
          d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), homeTz
        );
      };

      if (ev.rrule) {
        let dates = [];
        try { dates = ev.rrule.between(rangeStart, rangeEnd, true); } catch (e) {}
        const ex = ev.exdate || {};

        // the series' wall-clock time-of-day, in its own zone
        const seriesTz = evTz || homeTz;
        const seriesWall = wallParts(resolveStart(new Date(ev.start)), seriesTz);

        for (const d of dates) {
          const exKey = new Date(d).toISOString().slice(0, 10);
          if (ex[exKey]) continue;

          if (isAllDay) {
            pushAllDay(new Date(d).toISOString().slice(0, 10));
            continue;
          }
          // re-anchor: take the occurrence's DATE in the series zone,
          // then apply the series' original wall-clock time — DST-proof
          const occDay = wallParts(new Date(d), seriesTz);
          const startDate = wallToUTC(occDay.y, occDay.mo, occDay.d, seriesWall.h, seriesWall.mi, seriesWall.s, seriesTz);
          pushTimed(startDate);
        }
      } else if (ev.start) {
        if (isAllDay) {
          const s = new Date(ev.start);
          const dateStr = s.toISOString().slice(0, 10);
          const dayEnd = new Date(dateStr + "T23:59:59Z");
          if (dayEnd >= rangeStart && s <= rangeEnd) pushAllDay(dateStr);
        } else {
          pushTimed(resolveStart(new Date(ev.start)));
        }
      }
    }

    out.sort((a, b) => new Date(a.start) - new Date(b.start));
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: out.slice(0, 200) }),
    };
  } catch (err) {
    console.error("sync-calendar error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || "Failed to sync calendar" }) };
  }
};
