import { useState } from "react";
import { CollapseSection } from "../components/SharedComponents";
import { Ic } from "../components/Icons";
import { HABITS } from "../data/seed";

export default function HabitsScreen() {
  const [done, setDone] = useState({});
  const toggle = id => setDone(d => ({ ...d, [id]: !d[id] }));
  const count  = Object.values(done).filter(Boolean).length;

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Daily Practice</p>
      <h1 className="display serif" style={{ marginBottom: 6 }}>Habit Trainer</h1>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", marginBottom: 28, lineHeight: 1.6 }}>
        "Habit is ten natures." — Charlotte Mason
      </p>

      <div className="card-sage" style={{ marginBottom: 28, textAlign: "center", padding: "16px 20px" }}>
        <span className="serif" style={{ fontSize: 32, color: "var(--sage)" }}>{count}</span>
        <span className="caption" style={{ display: "block", marginTop: 4 }}>of {HABITS.length} habits kept today</span>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {HABITS.map(h => (
            <div
              key={h.id}
              className={`habit-dot ${done[h.id] ? "done" : ""}`}
              onClick={() => toggle(h.id)}
              style={{ fontSize: 14 }}
            >
              {done[h.id] ? <Ic.Check /> : <span>{h.emoji}</span>}
            </div>
          ))}
        </div>
      </div>

      {HABITS.map(h => (
        <div key={h.id} className="habit-row">
          <button className={`habit-check ${done[h.id] ? "done" : ""}`} onClick={() => toggle(h.id)}>
            {done[h.id] && <Ic.Check />}
          </button>
          <div style={{ flex: 1 }}>
            <p className="serif" style={{ fontSize: 17, color: "var(--ink)" }}>{h.name}</p>
            <p className="caption italic" style={{ marginTop: 3 }}>{h.desc}</p>
          </div>
          <span style={{ fontSize: 20 }}>{h.emoji}</span>
        </div>
      ))}

      <div style={{ marginTop: 28 }}>
        <CollapseSection label="Why these five?">
          <p className="body" style={{ marginBottom: 12 }}>
            Charlotte Mason identified attention, narration, outdoor time, stillness, and orderly work as the foundational habits of a well-formed mind.
          </p>
          <p className="body">These are not rules — they are rhythms. Return to them gently each day.</p>
        </CollapseSection>
      </div>
    </div>
  );
}
