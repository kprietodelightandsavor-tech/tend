// src/components/TodayAppointments.jsx
//
// The day's appointments from a connected calendar (Apple, Google, or any
// public iCal link saved in Settings). Read-only, cached six hours.
// No box — just a quiet typographic block with a hairline beneath it,
// so the top of the day reads as one column, not a stack of cards.

import { useState, useEffect } from "react";

const URL_KEY = "tend_ics_url";
const CACHE_KEY = "tend_ics_cache";
const CACHE_HOURS = 6;

function timeLabel(iso) {
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

export default function TodayAppointments({ viewDate }) {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    let alive = true;
    loadEvents().then(evs => { if (alive) setEvents(evs); });
    return () => { alive = false; };
  }, []);

  if (!events || !events.length) return null;

  const day = viewDate ? new Date(viewDate) : new Date();
  const dayKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
  const todays = events.filter(e => {
    if (e.allDay) return e.date === dayKey;      // all-day events carry a plain date
    const d = new Date(e.start);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return k === dayKey;
  });

  if (!todays.length) return null;

  return (
    <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: "0.5px solid var(--rule)" }}>
      {todays.map((e, i) => (
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: i === todays.length - 1 ? 0 : 7 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, alignSelf: "center" }} />
          <span style={{ fontFamily: e.allDay ? "'Cormorant Garamond', serif" : "'Lato', sans-serif", fontStyle: e.allDay ? "italic" : "normal", fontSize: 12, letterSpacing: ".04em", color: "var(--gold)", width: 40, flexShrink: 0 }}>
            {e.allDay ? "all day" : timeLabel(e.start)}
          </span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)", lineHeight: 1.4 }}>
            {e.title}
          </span>
        </div>
      ))}
    </div>
  );
}
