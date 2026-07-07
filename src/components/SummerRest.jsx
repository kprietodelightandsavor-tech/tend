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
    <div style={{ marginBottom: 24 }}>
      {/* ── your work, with edges ── */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--sage)", margin: 0 }}>
          Your work, with edges
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: workClosed ? "var(--gold)" : workOpen ? "var(--sage)" : "var(--ink-faint)", margin: 0 }}>
          {workClosed ? "closed for today" : workOpen ? `open until ${WORK_CLOSES_AT}` : `${WORK_OPENS_AT} – ${WORK_CLOSES_AT}, with their screens`}
        </p>
      </div>

      {workClosed ? (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15.5, color: "var(--ink-lt)", lineHeight: 1.7, margin: 0 }}>
          Screens are off and so are you. Whatever is unfinished will keep — it always does. The people in this house won't.
        </p>
      ) : (
        <>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15.5, color: "var(--ink-lt)", lineHeight: 1.7, margin: "0 0 6px" }}>
            {workOpen
              ? "Two focused hours. What's the one piece of work that matters most right now?"
              : "Before the day pulls you along: what's the one piece of work that matters most today?"}
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0 }}>
            Name it in your planner.
          </p>
        </>
      )}

      {/* ── one gentle nod a day ── */}
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "0.5px solid var(--rule)", paddingBottom: 18, borderBottom: "0.5px solid var(--rule)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.65, margin: 0 }}>
          {nudge.text}
          <span style={{ fontFamily: "'Lato', sans-serif", fontStyle: "normal", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginLeft: 10 }}>
            {nudge.tag}
          </span>
        </p>
      </div>
    </div>
  );
}
