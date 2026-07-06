// src/components/MorningPlan.jsx
//
// Calm "morning with edges" — low-overwhelm (ADHD/dyslexia friendly):
//   • Shows ONE thing by default — what's now + its time.
//   • A quiet "the whole morning ›" tap reveals the short list.
//   • No checkboxes. White space. Short lines.
//   • Creative work is parked for the afternoon (one line at the bottom).
//
// ✅ SAFE: brand-new file, changes nothing else.
// Edit DEFAULT_MORNING to change names/times. (start + end = the edges.)

import { useState } from "react";

const DEFAULT_MORNING = [
  { id: "rise",  label: "Morning Focus",           start: "7:30", end: "8:45"  },
  { id: "bible", label: "Family Start · together", start: "9:00", end: "9:45"  },
];

const CREATIVE_LINE = "Creative work waits for the afternoon.";

function toMin(t) {
  const m = String(t).match(/(\d{1,2}):(\d{2})/);
  return m ? (+m[1]) * 60 + (+m[2]) : null;
}

export default function MorningPlan({ items = DEFAULT_MORNING, creative = CREATIVE_LINE }) {
  const [open, setOpen] = useState(false);

  const nowMin = (() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); })();
  const currentIdx = items.findIndex(it => { const e = toMin(it.end); return e === null || nowMin < e; });
  const allDone = currentIdx === -1;
  const current = allDone ? null : items[currentIdx];
  const next = (!allDone && currentIdx + 1 < items.length) ? items[currentIdx + 1] : null;

  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--sage)", margin: "0 0 18px" }}>This morning</p>

      {allDone ? (
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--ink)", margin: "0 0 18px" }}>The morning is done.</p>
      ) : (
        <>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", margin: "0 0 6px" }}>now</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, lineHeight: 1.25, color: "var(--ink)", margin: "0 0 8px" }}>{current.label}</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, letterSpacing: ".04em", color: "var(--gold)", margin: "0 0 24px" }}>{current.start} – {current.end}</p>
          {next && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "var(--ink-faint)", margin: "0 0 22px" }}>then · {next.label.toLowerCase()}, {next.start}</p>}
        </>
      )}

      <button onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>
        {open ? "hide the morning" : "the whole morning ›"}
      </button>

      {open && (
        <div style={{ marginTop: 18 }}>
          {items.map((it, i) => {
            const cur = i === currentIdx;
            return (
              <div key={it.id}
                style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 18, borderLeft: cur ? "2px solid var(--sage)" : "none", paddingLeft: cur ? 12 : 0, marginLeft: cur ? -14 : 0 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--ink)" }}>{it.label}</span>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "var(--gold)", flexShrink: 0, marginLeft: 12 }}>{it.start}–{it.end}</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 18, marginTop: 18 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--sage)", margin: 0 }}>{creative}</p>
      </div>
    </div>
  );
}
