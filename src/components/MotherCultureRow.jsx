// src/components/MotherCultureRow.jsx
//
// The mother's daily check-in, always in view: four quiet circles —
// Movement · Protein meal · Nature moment · Rest & create.
// Tap as you go through the day; the Evening Close reads the same record.

import { useState } from "react";
import { MC_ITEMS, loadMC, toggleMC } from "../lib/motherCulture";

export default function MotherCultureRow() {
  const [done, setDone] = useState(() => loadMC());
  const allDone = MC_ITEMS.every(i => done.includes(i.id));

  return (
    <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "0.5px solid var(--rule)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>
          Mother Culture
        </p>
        {allDone && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--gold)", margin: 0 }}>
            the cup is filled ✓
          </p>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {MC_ITEMS.map(item => {
          const on = done.includes(item.id);
          return (
            <button key={item.id} onClick={() => setDone(toggleMC(item.id))}
              style={{ flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: "50%", margin: "0 auto 5px",
                border: `1.5px solid ${on ? "var(--gold)" : "var(--sage-md)"}`,
                background: on ? "var(--gold-bg)" : "transparent",
                color: "var(--gold)", fontSize: 13, transition: "all .15s",
              }}>
                {on ? "✓" : ""}
              </span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".06em", textTransform: "uppercase", color: on ? "var(--gold)" : "var(--ink-faint)", lineHeight: 1.3, display: "block" }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
