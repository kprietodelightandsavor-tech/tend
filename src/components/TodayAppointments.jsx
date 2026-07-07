// src/components/TodayAppointments.jsx
//
// Shared calendar-appointment plumbing. No standalone block anymore —
// appointments are woven into the daily rhythm at their actual time:
//   • useDayAppointments(viewDate) → { allDay, timed, morning, afternoon, evening }
//   • SummerApptRow — a quiet row for the summer rhythm sections
// Events come from the connected iCal link (Settings), cached six hours.

import { useState, useEffect, useMemo } from "react";

const URL_KEY = "tend_ics_url";
const CACHE_KEY = "tend_ics_cache";
const CACHE_HOURS = 6;

export function timeLabel(iso) {
  const d = new Date(iso);
  let h = d.getHours() % 12; if (h === 0) h = 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

async function loadEvents() {
  const url = localStorage.getItem(URL_KEY);
  if (!url) return null;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && cached.url === url && Date.now() - cached.ts < CACHE_HOURS * 3600000) {
      return cached.events;
    }
  } catch {}
  try {
    const res = await fetch("/.netlify/functions/sync-calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, days: 14, tz: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ url, ts: Date.now(), events: data.events || [] }));
    return data.events || [];
  } catch {
    return null;
  }
}

export function useDayAppointments(viewDate) {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    let alive = true;
    loadEvents().then(evs => { if (alive) setEvents(evs); });
    return () => { alive = false; };
  }, []);

  return useMemo(() => {
    const empty = { allDay: [], timed: [], morning: [], afternoon: [], evening: [] };
    if (!events || !events.length) return empty;
    const day = viewDate ? new Date(viewDate) : new Date();
    const dayKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;

    const allDay = [], timed = [];
    for (const e of events) {
      if (e.allDay) {
        if (e.date === dayKey) allDay.push(e);
        continue;
      }
      const d = new Date(e.start);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (k === dayKey) timed.push({ ...e, _min: d.getHours() * 60 + d.getMinutes() });
    }
    timed.sort((a, b) => a._min - b._min);
    return {
      allDay,
      timed,
      morning: timed.filter(e => e._min < 12 * 60),
      afternoon: timed.filter(e => e._min >= 12 * 60 && e._min < 17 * 60),
      evening: timed.filter(e => e._min >= 17 * 60),
    };
  }, [events, viewDate]);
}

// A quiet appointment row for the summer rhythm sections
export function SummerApptRow({ e }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 9, margin: "2px 0 6px" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, alignSelf: "center" }} />
      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11.5, letterSpacing: ".04em", color: "var(--gold)", width: 38, flexShrink: 0 }}>
        {e.allDay ? "all day" : timeLabel(e.start)}
      </span>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14.5, color: "var(--ink)", lineHeight: 1.4 }}>
        {e.title}
      </span>
    </div>
  );
}
