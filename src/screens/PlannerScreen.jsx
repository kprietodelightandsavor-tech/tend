import { useState } from "react";
import { DAYS, DAY_SCHEDULE } from "../data/seed";

export default function PlannerScreen() {
  const [activeDay, setActiveDay] = useState("Monday");
  const [blocks, setBlocks] = useState(DAY_SCHEDULE);
  const [editingIdx, setEditingIdx] = useState(null);
  const [draftNote, setDraftNote] = useState("");

  const dayBlocks = blocks[activeDay] || [];

  const saveNote = () => {
    setBlocks(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].map((b, i) =>
        i === editingIdx ? { ...b, note: draftNote } : b
      ),
    }));
    setEditingIdx(null);
  };

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Term 2 · Week 4</p>
      <h1 className="display serif" style={{ marginBottom: 20 }}>Daily Planner</h1>

      {/* Day selector */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, marginBottom: 20 }}>
        {DAYS.map(d => (
          <button
            key={d}
            className={`day-pill ${activeDay === d ? "active" : ""}`}
            onClick={() => setActiveDay(d)}
          >
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="rule-gold" style={{ margin: "0 0 20px" }} />

      {/* Blocks */}
      {dayBlocks.map((b, i) => (
        <div key={i} className="planner-block">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span className="planner-time">{b.time}</span>
                <span className="planner-subject">{b.subject}</span>
              </div>
              {editingIdx === i ? (
                <div style={{ marginTop: 10 }}>
                  <input
                    className="input-line"
                    value={draftNote}
                    onChange={e => setDraftNote(e.target.value)}
                    placeholder="What do you plan to cover?"
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button className="btn-sage" style={{ padding: "7px 18px", fontSize: 10 }} onClick={saveNote}>Save</button>
                    <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: 10 }} onClick={() => setEditingIdx(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                b.note && <p className="caption italic" style={{ marginTop: 5 }}>{b.note}</p>
              )}
            </div>
            {editingIdx !== i && (
              <button
                onClick={() => { setEditingIdx(i); setDraftNote(b.note); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--ink-faint)", fontSize: 10, letterSpacing: ".1em",
                  textTransform: "uppercase", fontFamily: "'Lato', sans-serif",
                  paddingLeft: 12, flexShrink: 0, marginTop: 2,
                }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Beauty Loop / Morning Time note */}
      <div className="card-sage" style={{ marginTop: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>Beauty Loop</p>
        <p className="body">Hymn — <em>Come Thou Fount</em></p>
        <p className="body">Poetry — <em>Gerard Manley Hopkins</em></p>
        <p className="body">Scripture — <em>Psalm 23</em></p>
      </div>
    </div>
  );
}
