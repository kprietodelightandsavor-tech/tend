import { useState } from "react";
import { OUTDOOR_SUGGESTIONS } from "../data/seed";

const INITIAL_OBSERVATIONS = [
  { date: "March 14", note: "Two red-tailed hawks circling the south pasture. The horses watched them." },
  { date: "March 11", note: "Tiny purple wildflowers along the fence line — first of the season." },
];

export default function OutdoorsScreen() {
  const [text, setText]       = useState("");
  const [logged, setLogged]   = useState(false);
  const [observations, setObs] = useState(INITIAL_OBSERVATIONS);

  const save = () => {
    if (!text.trim()) return;
    setObs(o => [{ date: "Today", note: text }, ...o]);
    setText("");
    setLogged(true);
  };

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Nature Study</p>
      <h1 className="display serif" style={{ marginBottom: 24 }}>Outdoors</h1>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div className="counter-circle">
          <span className="serif" style={{ fontSize: 26, color: "var(--sage)", lineHeight: 1 }}>14</span>
          <span className="caption" style={{ marginTop: 2 }}>days</span>
        </div>
        <p className="caption italic" style={{ marginTop: 8 }}>You've stepped outside 14 days this month.</p>
      </div>

      <div className="rule" />

      {logged ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p className="ornament" style={{ fontSize: 36, marginBottom: 12 }}>✦</p>
          <p className="serif italic" style={{ fontSize: 18, color: "var(--ink-lt)", marginBottom: 24, lineHeight: 1.7 }}>Kept.</p>
          <button className="btn-ghost" onClick={() => setLogged(false)}>Add Another</button>
        </div>
      ) : (
        <>
          <p className="corm italic" style={{ fontSize: 18, color: "var(--ink-lt)", marginBottom: 18, lineHeight: 1.7 }}>
            What did you notice today?
          </p>
          <textarea
            className="textarea"
            placeholder="A note from outside…"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
          />
          {text.trim() && (
            <div style={{ textAlign: "right", marginTop: 16, marginBottom: 8 }}>
              <button className="btn-sage" onClick={save}>Keep This</button>
            </div>
          )}

          {/* Suggestions */}
          <div style={{ marginTop: 24 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>Suggestions</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {OUTDOOR_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setText(t => t ? `${t}. ${s}` : s)}
                  style={{
                    background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 2,
                    padding: "7px 13px", fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic", color: "var(--ink-lt)", cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {observations.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div className="rule" />
          <p className="eyebrow" style={{ marginBottom: 16 }}>Recent Observations</p>
          {observations.map((o, i) => (
            <div key={i} className="lily-entry">
              <p className="caption" style={{ marginBottom: 6 }}>{o.date}</p>
              <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.7 }}>{o.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
