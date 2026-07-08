// src/components/SummerRest.jsx
//
// The mother's summer layer — one flowing typographic section, no boxes:
//   1. "Your work, with edges" — a prompt, not a list. One reflective
//      question; the naming happens in the paper planner. Work rides the
//      children's screen window (opens 2:00, closes 4:00); after close,
//      the card stops asking and starts protecting.
//   2. One gentle nod a day — toward the children, the marriage, or you.
// Nothing here is stored. It is a voice, not a form.

import { WORK_OPENS_AT, WORK_CLOSES_AT, getTodayNudge } from "../data/summer-seed";

export default function SummerRest() {
  const hour = new Date().getHours();
  // work rides the children's screen window: 2:00 - 4:00
  const workOpen = hour >= 14 && hour < 16;
  const workClosed = hour >= 16;
  const nudge = getTodayNudge();

  return (
    <div style={{ marginBottom: 22 }}>
      {/* ── your work, with edges — one line, same grammar as Lunch ── */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)", flexShrink: 0 }}>
          Work
        </span>
        <span style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14.5, color: "var(--ink-lt)", lineHeight: 1.6 }}>
          {workClosed
            ? "Closed for today. Whatever is unfinished will keep — it always does."
            : workOpen
              ? "Two focused hours — what's the one piece that matters most? Name it in your planner."
              : "What's the one piece that matters most today? Name it in your planner."}
          <span style={{ fontFamily: "'Lato', sans-serif", fontStyle: "normal", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: workClosed ? "var(--gold)" : "var(--ink-faint)", marginLeft: 8 }}>
            {workClosed ? "closed" : workOpen ? `until ${WORK_CLOSES_AT}` : `${WORK_OPENS_AT} – ${WORK_CLOSES_AT}`}
          </span>
        </span>
      </div>

      {/* ── one gentle nod a day — a voice, not a box ── */}
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15.5, color: "var(--ink-lt)", lineHeight: 1.65, margin: 0 }}>
        {nudge.text}
        <span style={{ fontFamily: "'Lato', sans-serif", fontStyle: "normal", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginLeft: 10 }}>
          {nudge.tag}
        </span>
      </p>
    </div>
  );
}
