// netlify/functions/sync-calendar.js
//
// Fetches a public iCal (.ics) calendar link server-side and returns the
// upcoming events (expanding repeating events, incl. every-other-week).

const ical = require("node-ical");

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
    // webcal:// links are really https://
    url = url.replace(/^webcal:\/\//i, "https://");

    const windowDays = Number(body.days) || 30;
    const now = new Date();
    const rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const rangeEnd = new Date(rangeStart.getTime() + windowDays * 86400000);

    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error("Calendar fetch failed (" + res.status + ")");
    const text = await res.text();
    const data = await ical.async.parseICS(text);

    const out = [];
    for (const k in data) {
      const ev = data[k];
      if (!ev || ev.type !== "VEVENT") continue;
      const title = ev.summary || "Busy";
      const dur = (ev.end && ev.start) ? (new Date(ev.end) - new Date(ev.start)) : 0;

      if (ev.rrule) {
        let dates = [];
        try { dates = ev.rrule.between(rangeStart, rangeEnd, true); } catch (e) {}
        const ex = ev.exdate || {};
        for (const d of dates) {
          const dayKey = new Date(d).toISOString().slice(0, 10);
          if (ex[dayKey]) continue;
          out.push({ title, start: new Date(d).toISOString(), end: new Date(new Date(d).getTime() + dur).toISOString() });
        }
      } else if (ev.start) {
        const s = new Date(ev.start);
        if (s >= rangeStart && s <= rangeEnd) {
          out.push({ title, start: s.toISOString(), end: ev.end ? new Date(ev.end).toISOString() : s.toISOString() });
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
