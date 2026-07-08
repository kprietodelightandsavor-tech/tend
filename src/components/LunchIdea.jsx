// src/components/LunchIdea.jsx
//
// "What's for lunch" without the deciding.
// Appears on the home screen from 10:30am to 1:30pm. Offers one simple,
// protein-rich, balanced idea from the bank in seed.js — rotates daily,
// with an "another ›" tap for days when the first one gets a groan.

import { useState } from "react";
import { LUNCH_IDEAS } from "../data/seed";

export default function LunchIdea() {
  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  const inWindow = hour >= 10.5 && hour <= 13.5;
  const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % LUNCH_IDEAS.length;
  const [offset, setOffset] = useState(0);

  if (!inWindow || !LUNCH_IDEAS.length) return null;

  const idea = LUNCH_IDEAS[(dayIndex + offset) % LUNCH_IDEAS.length];

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 18 }}>
      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", flexShrink: 0 }}>
        Lunch
      </span>
      <span style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: 14.5, color: "var(--ink-lt)", lineHeight: 1.5 }}>
        <span style={{ fontStyle: "italic" }}>{idea.name}</span>
        <span style={{ color: "var(--ink-faint)" }}> — {idea.parts}</span>
      </span>
      <button onClick={() => setOffset(o => o + 1)}
        style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", padding: 0 }}>
        another ›
      </button>
    </div>
  );
}
