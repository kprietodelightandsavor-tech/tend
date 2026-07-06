// src/screens/EveningCloseScreen.jsx
//
// The Evening Close — thirty seconds of keeping, then rest.
//   • Tap what happened today (no guilt for what didn't).
//   • One delight worth keeping.
//   • Three quiet circles for Mother Culture.
// Entries persist per-day in localStorage under tend_evening_close.
// (Future: sync to Supabase alongside daily state.)

import { useState } from "react";
import { DAYS, DAY_SCHEDULE } from "../data/seed";

const STORE_KEY = "tend_evening_close";

function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadAll() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}

function saveEntry(key, entry) {
  try {
    const all = loadAll();
    all[key] = entry;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {}
}

const MC_ITEMS = [
  { id: "movement", label: "Movement" },
  { id: "nature",   label: "Nature moment" },
  { id: "rest",     label: "Rest / quiet" },
];

const CLOSING_LINES = [
  "The day is kept. Let the rest go.",
  "Enough was done today. It always is.",
  "Small lines, faithfully kept, become a year.",
];

function schoolYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

// The quiet magic: what you keep here writes your Teaching Record for you.
async function syncToRecords(userId, key, blocks, doneIds, delight, mc) {
  if (!userId) return false;
  try {
    const doneBlocks = blocks.filter(b => doneIds.includes(b.id));
    await Promise.all(doneBlocks.map(b =>
      fetch("/.netlify/functions/teaching-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "upsert", userId, date: key,
          subject: b.subject, timeBlock: b.time || null,
          status: "completed", schoolYear: schoolYear(),
        }),
      })
    ));
    // delight + mother culture ride along in daily_state
    const res = await fetch("/.netlify/functions/daily-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "get", userId, date: key }),
    });
    const { state } = await res.json();
    await fetch("/.netlify/functions/daily-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "set", userId, date: key,
        state: { ...(state || {}), eveningClose: { done: doneIds, delight, mc } },
      }),
    });
    return true;
  } catch (e) {
    console.error("evening close sync:", e);
    return false;
  }
}

export default function EveningCloseScreen({ onNavigate, settings }) {
  const today = new Date();
  const key = dateKey(today);
  const todayIdx = today.getDay();
  const weekday = todayIdx >= 1 && todayIdx <= 5 ? DAYS[todayIdx - 1] : null;

  const existing = loadAll()[key];
  const blocks = weekday
    ? (DAY_SCHEDULE[weekday] || []).filter(b => !b.free && b.subject !== "Lunch")
    : [];

  const [done, setDone]       = useState(existing?.done || []);
  const [delight, setDelight] = useState(existing?.delight || "");
  const [mc, setMc]           = useState(existing?.mc || []);
  const [kept, setKept]       = useState(false);
  const [synced, setSynced]   = useState(false);

  const toggle = (list, setList, id) =>
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  const keep = () => {
    saveEntry(key, { done, delight: delight.trim(), mc, keptAt: new Date().toISOString() });
    setKept(true);
    // fire-and-forget: the kept day becomes Teaching Record entries
    syncToRecords(settings?.userId, key, blocks, done, delight.trim(), mc).then(setSynced);
  };

  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (kept) {
    const line = CLOSING_LINES[today.getDate() % CLOSING_LINES.length];
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>{dateLabel}</p>
        <h1 className="display serif" style={{ marginBottom: 18 }}>The day is kept.</h1>
        <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 40 }}>{line}</p>
        {delight.trim() && (
          <p className="corm italic" style={{ fontSize: 15, color: "var(--gold)", lineHeight: 1.7, marginBottom: 40 }}>
            “{delight.trim()}”
          </p>
        )}
        {synced && (
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 22 }}>
            ✓ written into your teaching record
          </p>
        )}
        <button className="btn-sage" style={{ maxWidth: 240, margin: "0 auto" }} onClick={() => onNavigate("home")}>
          Goodnight →
        </button>
        <button onClick={() => setKept(false)}
          style={{ background: "none", border: "none", cursor: "pointer", marginTop: 18, fontSize: 11, color: "var(--ink-faint)", fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>
          ← something happened since — adjust the day
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 4 }}>{dateLabel}</p>
      <h1 className="display serif" style={{ marginBottom: 6 }}>Close the day</h1>
      <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 30 }}>
        Thirty seconds, then rest. Tap what happened — and let what didn’t happen go without a word.
      </p>

      {/* What happened */}
      {blocks.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>What happened today</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {blocks.map(b => {
              const on = done.includes(b.id);
              return (
                <button key={b.id} onClick={() => toggle(done, setDone, b.id)}
                  style={{
                    padding: "9px 14px", borderRadius: 999, cursor: "pointer",
                    fontFamily: "'Lato', sans-serif", fontSize: 12.5, letterSpacing: ".02em",
                    background: on ? "var(--sage)" : "var(--cream)",
                    color: on ? "white" : "var(--ink-lt)",
                    border: `1px solid ${on ? "var(--sage)" : "var(--sage-md)"}`,
                    transition: "all .15s",
                  }}>
                  {on ? "✓ " : ""}{b.subject}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {blocks.length === 0 && (
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 30 }}>
          A weekend day — nothing to account for. Just keep the delight.
        </p>
      )}

      {/* One delight */}
      <div style={{ marginBottom: 30 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>One delight worth keeping</p>
        <textarea
          className="textarea"
          rows={2}
          placeholder="A line someone said, a thing you noticed, a small mercy…"
          value={delight}
          onChange={e => setDelight(e.target.value)}
        />
      </div>

      {/* Mother culture circles */}
      <div style={{ marginBottom: 36 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>And you, mother</p>
        <div style={{ display: "flex", gap: 22 }}>
          {MC_ITEMS.map(item => {
            const on = mc.includes(item.id);
            return (
              <button key={item.id} onClick={() => toggle(mc, setMc, item.id)}
                style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", margin: "0 auto 6px",
                  border: `1.5px solid ${on ? "var(--gold)" : "var(--sage-md)"}`,
                  background: on ? "var(--gold-bg)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--gold)", fontSize: 14, transition: "all .15s",
                }}>
                  {on ? "✓" : ""}
                </div>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: on ? "var(--gold)" : "var(--ink-faint)" }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button className="btn-sage" style={{ width: "100%" }} onClick={keep}>
        Keep &amp; close the day
      </button>
      <p className="caption italic" style={{ textAlign: "center", marginTop: 14 }}>
        Nothing here is a grade. It is only a record of a real day.
      </p>
    </div>
  );
}
