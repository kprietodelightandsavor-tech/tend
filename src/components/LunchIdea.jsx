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
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      padding: "12px 16px", marginBottom: 24,
      background: "var(--gold-bg)", border: "1px solid var(--rule)", borderRadius: 3,
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 4px" }}>
          Lunch, decided for you
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)", margin: "0 0 2px" }}>
          {idea.name}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>
          {idea.parts}
        </p>
      </div>
      <button onClick={() => setOffset(o => o + 1)}
        style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
        another ›
      </button>
    </div>
  );
}
