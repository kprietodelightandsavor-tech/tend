// src/components/MotherCultureRow.jsx
//
// The mother's daily check-in — one quiet line, not a section.
// Four small pills: Movement · Protein meal · Nature moment · Rest & create.
// Tap as you go through the day; the Evening Close reads the same record.

import { useState } from "react";
import { MC_ITEMS, loadMC, toggleMC } from "../lib/motherCulture";

export default function MotherCultureRow() {
  const [done, setDone] = useState(() => loadMC());
  const allDone = MC_ITEMS.every(i => done.includes(i.id));

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, rowGap: 8, marginBottom: 18 }}>
      {MC_ITEMS.map(item => {
        const on = done.includes(item.id);
        return (
          <button key={item.id} onClick={() => setDone(toggleMC(item.id))}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 10px", borderRadius: 999, cursor: "pointer",
              border: `1px solid ${on ? "var(--gold)" : "var(--sage-md)"}`,
              background: on ? "var(--gold-bg)" : "transparent",
              transition: "all .15s",
            }}>
            <span style={{ fontSize: 9, color: on ? "var(--gold)" : "var(--sage-md)", lineHeight: 1 }}>
              {on ? "✓" : "○"}
            </span>
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 8.5, letterSpacing: ".07em", textTransform: "uppercase", color: on ? "var(--gold)" : "var(--ink-faint)", lineHeight: 1 }}>
              {item.label}
            </span>
          </button>
        );
      })}
      {allDone && (
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--gold)" }}>
          the cup is filled
        </span>
      )}
    </div>
  );
}
