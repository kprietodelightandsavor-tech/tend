// src/components/FocusTimer.jsx
//
// A quiet visual timer for short lessons and pomodoro work.
//   • Collapsed to one line until wanted — timers should serve, not loom.
//   • Presets: 15 (young lesson), 20 (CM short lesson), 25 (pomodoro).
//   • A thin sage bar drains as time passes; big friendly mm:ss.
//   • At zero: a gentle line — "tell it back" for lessons, "five minutes
//     of nothing" for pomodoro — plus a soft vibration where supported.
// Works on both the school-year and summer home screens.

import { useState, useEffect, useRef } from "react";

const PRESETS = [
  { min: 15, label: "15 · young lesson" },
  { min: 20, label: "20 · short lesson" },
  { min: 25, label: "25 · pomodoro" },
];

export default function FocusTimer() {
  const [open, setOpen] = useState(false);
  const [endsAt, setEndsAt] = useState(null);   // timestamp ms
  const [totalMs, setTotalMs] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [finished, setFinished] = useState(null); // preset min that finished
  const buzzed = useRef(false);

  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [endsAt]);

  const remaining = endsAt ? Math.max(0, endsAt - now) : null;

  useEffect(() => {
    if (endsAt && remaining === 0 && !buzzed.current) {
      buzzed.current = true;
      setFinished(Math.round(totalMs / 60000));
      setEndsAt(null);
      try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch {}
    }
  }, [remaining, endsAt, totalMs]);

  const start = (min) => {
    buzzed.current = false;
    setFinished(null);
    setTotalMs(min * 60000);
    setEndsAt(Date.now() + min * 60000);
  };

  const stop = () => { setEndsAt(null); setFinished(null); };

  const mmss = (ms) => {
    const s = Math.ceil(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  // ── collapsed ──
  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 18 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5" />
          <path d="M9 2h6" />
          <path d="M12 2v3" />
        </svg>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          need a timer?
        </span>
      </button>
    );
  }

  const pct = remaining !== null && totalMs ? remaining / totalMs : 1;

  return (
    <div style={{ marginBottom: 24, padding: "12px 14px", border: "0.5px solid var(--rule)", borderLeft: "3px solid var(--sage)", borderRadius: 8, background: "var(--cream)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--sage)", margin: 0 }}>
          Focus Timer
        </p>
        <button onClick={() => { stop(); setOpen(false); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", padding: 0 }}>
          close
        </button>
      </div>

      {endsAt ? (
        <>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, lineHeight: 1, color: "var(--ink)", margin: "0 0 10px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {mmss(remaining)}
          </p>
          {/* the visual: a thin bar that drains */}
          <div style={{ height: 4, borderRadius: 2, background: "var(--rule)", marginBottom: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct * 100}%`, background: "var(--sage)", borderRadius: 2, transition: "width .5s linear" }} />
          </div>
          <button onClick={stop}
            style={{ width: "100%", background: "none", border: "0.5px solid var(--rule)", borderRadius: 2, padding: "8px 0", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
            Stop early — that's allowed
          </button>
        </>
      ) : finished ? (
        <>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, lineHeight: 1.6, color: "var(--ink-lt)", margin: "0 0 12px", textAlign: "center" }}>
            {finished >= 25
              ? "Time. Five minutes of nothing now — you've earned the pause."
              : "Time. Close the book and let them tell it back."}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {PRESETS.map(p => (
              <button key={p.min} onClick={() => start(p.min)}
                style={{ flex: 1, background: "var(--sage-bg)", border: "0.5px solid var(--sage-md)", borderRadius: 2, padding: "8px 0", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sage)" }}>
                again · {p.min}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          {PRESETS.map(p => (
            <button key={p.min} onClick={() => start(p.min)}
              style={{ flex: 1, background: "var(--sage-bg)", border: "0.5px solid var(--sage-md)", borderRadius: 2, padding: "10px 0", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--sage)" }}>
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
