// src/components/MorningPlan.jsx
//
// "Morning with edges" — every morning activity has a concrete START and END time,
// so it has a clear boundary. Open-ended creative work is deliberately pushed to
// later in the day, protecting the morning from sprawl.
//
// ✅ SAFE TO ADD: this is a brand-new file. It does not change anything else in
//    your app. Adding it cannot break or overwrite your existing work.
//
// To show it, we'll add two lines to your real HomeScreen together:
//    import MorningPlan from "../components/MorningPlan";
//    ...then render <MorningPlan /> where you want the morning to appear.
//
// Customize the morning by editing DEFAULT_MORNING below, or by passing your own:
//    <MorningPlan items={[{ id, label, start, end, note }]} creative={{...}} />
//
// (For now the check-offs are just for-the-day in your browser. Once you like it,
//  we can hook them into your Supabase the same way your other screens save.)

import { useState } from "react";

const DEFAULT_MORNING = [
  { id: "barn",      label: "Animal chores & barn",   start: "6:00", end: "6:45", note: "Outside before breakfast — light first." },
  { id: "breakfast", label: "Breakfast together",     start: "7:00", end: "7:30" },
  { id: "bible",     label: "Bible & Morning Basket",  start: "7:30", end: "8:15" },
  { id: "reading",   label: "Reading & learning",      start: "8:15", end: "9:00" },
];

const DEFAULT_CREATIVE = {
  when:  "Afternoon",
  label: "Creative work — curriculum, website, apps",
  note:  "Open-ended on purpose. It waits until the morning's edges are done, so it can run long without eating the parts of the day you don't want to lose.",
};

export default function MorningPlan({ items = DEFAULT_MORNING, creative = DEFAULT_CREATIVE }) {
  const [done, setDone] = useState({});
  const toggle = (id) => setDone(d => ({ ...d, [id]: !d[id] }));

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Morning header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>Morning</p>
      </div>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", margin: "0 0 14px", lineHeight: 1.6 }}>
        Each has a beginning and an end. When the morning's done, it's done.
      </p>

      {/* Morning items — each with a concrete start–end (its edges) */}
      {items.map((it) => {
        const isDone = !!done[it.id];
        return (
          <div key={it.id} onClick={() => toggle(it.id)}
            style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 0", borderBottom: "1px solid var(--rule)", cursor: "pointer", opacity: isDone ? 0.4 : 1, transition: "opacity .2s" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${isDone ? "var(--sage)" : "var(--sage-md)"}`, background: isDone ? "var(--sage)" : "none", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
              {isDone && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "var(--gold)", letterSpacing: ".04em", flexShrink: 0 }}>{it.start}–{it.end}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>{it.label}</span>
              </div>
              {it.note && <p className="caption italic" style={{ marginTop: 3, lineHeight: 1.5 }}>{it.note}</p>}
            </div>
          </div>
        );
      })}

      {/* The edge — a visible hard stop */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--gold)", opacity: .4 }} />
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)" }}>Morning ends here</span>
        <div style={{ flex: 1, height: 1, background: "var(--gold)", opacity: .4 }} />
      </div>

      {/* Creative work — deliberately deferred */}
      {creative && (
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 8, padding: "14px 16px" }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--sage)", margin: "0 0 4px" }}>Later today · {creative.when}</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", margin: "0 0 4px" }}>{creative.label}</p>
          {creative.note && <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.6, margin: 0 }}>{creative.note}</p>}
        </div>
      )}
    </div>
  );
}
