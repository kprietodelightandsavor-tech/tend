// src/components/MorningPlan.jsx
//
// Calm "morning with edges" — low-overwhelm (ADHD/dyslexia friendly):
//   • Shows ONE thing by default — what's now + its time.
//   • "The whole morning ›" reveals a clean, scannable list:
//       - one row per block, generous spacing, consistent columns
//       - the current block is marked with a sage bar, done blocks fade
//       - core lessons carry a gentle "then a telling" nudge for narration
//   • Reads from the real schedule when blocks are passed in, so co-op
//     days and edits show up here automatically. Falls back to defaults.

import { useState, useEffect } from "react";

const DEFAULT_MORNING = [
  { id: "rise",  label: "Morning Focus",           start: "7:30", end: "8:45" },
  { id: "bible", label: "Family Start · together", start: "9:00", end: "9:45" },
];

const CREATIVE_LINE = "Creative work waits for the afternoon.";

function toMin(t) {
  const m = String(t).match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  let h = +m[1];
  const min = +m[2];
  // schedule times like "1:00" mean afternoon
  if (h <= 6) h += 12;
  return h * 60 + min;
}

function isNarrated(subject = "") {
  const s = subject.toLowerCase();
  if (s.includes("pause")) return false;
  return s.startsWith("core") || s.includes("history") || s.includes("science") || s.includes("nature study");
}

function fromBlocks(blocks) {
  // the whole day, in order — so "min left" follows you past noon
  const day = (blocks || [])
    .map(b => ({ ...b, _m: toMin(b.time) }))
    .filter(b => b._m !== null)
    .sort((a, b) => a._m - b._m);
  return day.map((b, i) => ({
    id: b.id || `mp-${i}`,
    label: String(b.subject).replace(/^Core\s*[—-]\s*/, ""),
    start: b.time,
    end: day[i + 1] ? day[i + 1].time : to12(b._m + 45),
    narrate: isNarrated(b.subject),
  }));
}

function to12(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(mins / 60) % 12; if (h === 0) h = 12;
  return `${h}:${String(mins % 60).padStart(2, "0")}`;
}

export default function MorningPlan({ blocks = null, items = DEFAULT_MORNING, creative = CREATIVE_LINE }) {
  const [open, setOpen] = useState(false);
  // tick once a minute so "min left" stays honest (time-blindness aid)
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const list = blocks && blocks.length ? fromBlocks(blocks) : items;

  const nowMin = (() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); })();
  const currentIdx = list.findIndex(it => { const e = toMin(it.end); return e === null || nowMin < e; });
  const allDone = currentIdx === -1 || list.length === 0;
  const current = allDone ? null : list[currentIdx];
  const next = (!allDone && currentIdx + 1 < list.length) ? list[currentIdx + 1] : null;

  const hourNow = new Date().getHours();
  const chapter = hourNow < 12 ? "This morning" : hourNow < 17 ? "This afternoon" : "This evening";

  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--sage)", margin: "0 0 18px" }}>{chapter}</p>

      {allDone ? (
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--ink)", margin: "0 0 18px" }}>The day's blocks are done.</p>
      ) : (
        <>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", margin: "0 0 6px" }}>now</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, lineHeight: 1.25, color: "var(--ink)", margin: "0 0 8px" }}>{current.label}</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, letterSpacing: ".04em", color: "var(--gold)", margin: "0 0 8px" }}>
            {current.start} – {current.end}
            {(() => {
              const e = toMin(current.end);
              const left = e !== null ? e - nowMin : null;
              return left !== null && left > 0 && left < 240
                ? <span style={{ color: "var(--ink-faint)" }}>  ·  {left} min left</span>
                : null;
            })()}
          </p>
          {current.narrate && (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--sage)", margin: "0 0 16px" }}>
              …then a telling. A few sentences is plenty.
            </p>
          )}
          {next && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "var(--ink-faint)", margin: "0 0 22px" }}>then · {next.label.toLowerCase()}, {next.start}</p>}
        </>
      )}

      <button onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
        {open ? "‹ just what's now" : "the whole day ›"}
      </button>

      {open && (
        <div style={{ marginTop: 18 }}>
          {list.map((it, i) => {
            const done = !allDone ? i < currentIdx : true;
            const isNow = !allDone && i === currentIdx;
            return (
              <div key={it.id} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 12px", marginBottom: 6,
                background: isNow ? "var(--sage-bg)" : "transparent",
                borderRadius: 4,
                borderLeft: `3px solid ${isNow ? "var(--sage)" : "transparent"}`,
                opacity: done ? 0.45 : 1,
              }}>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "var(--ink-faint)", width: 44, flexShrink: 0, paddingTop: 3, textAlign: "right" }}>
                  {it.start}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: "'Playfair Display', serif", fontSize: 16, lineHeight: 1.35, color: "var(--ink)" }}>
                    {done ? "✓ " : ""}{it.label}
                  </span>
                  {it.narrate && !done && (
                    <span style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13.5, color: "var(--sage)", marginTop: 2 }}>
                      → then a telling
                    </span>
                  )}
                </span>
              </div>
            );
          })}
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", margin: "14px 0 0 12px" }}>{creative}</p>
        </div>
      )}
    </div>
  );
}
