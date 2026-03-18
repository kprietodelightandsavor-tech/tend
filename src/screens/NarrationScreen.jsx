import { useState, useRef } from "react";
import { CollapseSection } from "../components/SharedComponents";
import { Ic } from "../components/Icons";
import {
  NARRATION_PROMPTS,
  NARRATION_STAGES,
  NARRATION_STAGE_LABELS,
  NARRATION_STAGE_PROMPTS,
} from "../data/seed";

export default function NarrationScreen() {
  const [stage, setStage]   = useState(0);
  const [texts, setTexts]   = useState(["", "", ""]);
  const [recording, setRec] = useState(false);
  const [done, setDone]     = useState(false);
  const promptIdx = useRef(Math.floor(Math.random() * NARRATION_PROMPTS.length));

  const cur   = NARRATION_STAGES[stage];
  const words = texts[stage].trim() ? texts[stage].trim().split(/\s+/).length : 0;

  const advance = () => {
    if (stage < 2) setStage(s => s + 1);
    else setDone(true);
  };

  if (done) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
        <p className="ornament" style={{ fontSize: 44, marginBottom: 16 }}>✦</p>
        <h2 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>Narration Kept</h2>
        <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-lt)", marginBottom: 32, lineHeight: 1.7 }}>
          You have found it, followed it, and framed it.
        </p>
        <button
          className="btn-sage"
          onClick={() => { setStage(0); setTexts(["", "", ""]); setDone(false); }}
        >
          Begin Again
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>In your own words</p>
      <h1 className="display serif" style={{ marginBottom: 18 }}>Narration</h1>

      {/* Stage indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {NARRATION_STAGES.map((s, i) => (
          <button
            key={s}
            onClick={() => setStage(i)}
            className={`stage-badge stage-${s}`}
            style={{ cursor: "pointer", border: "none", opacity: i > stage ? .45 : 1 }}
          >
            <span style={{ fontSize: 14 }}>{i === 0 ? "⌕" : i === 1 ? "⊞" : "⬡"}</span>
            {NARRATION_STAGE_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="card-sage" style={{ marginBottom: 22 }}>
        <p className="ornament" style={{ fontSize: 24, marginBottom: 4 }}>"</p>
        <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-lt)", lineHeight: 1.75 }}>
          {stage === 0 ? NARRATION_PROMPTS[promptIdx.current] : NARRATION_STAGE_PROMPTS[cur]}
        </p>
      </div>

      <textarea
        className="textarea"
        placeholder="Begin anywhere…"
        value={texts[stage]}
        onChange={e => setTexts(t => t.map((v, i) => i === stage ? e.target.value : v))}
        rows={7}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 24 }}>
        <span className="caption">{words > 0 ? `${words} word${words === 1 ? "" : "s"}` : ""}</span>
        <button className={`voice-btn ${recording ? "rec" : ""}`} onClick={() => setRec(r => !r)}>
          <Ic.Mic />
        </button>
      </div>

      <button
        className="btn-sage"
        onClick={advance}
        style={{ width: "100%" }}
        disabled={!texts[stage].trim()}
      >
        {stage < 2
          ? `Continue to ${NARRATION_STAGE_LABELS[NARRATION_STAGES[stage + 1]]} →`
          : "Keep This Narration"}
      </button>

      <CollapseSection label="Need more guidance?">
        {["What happened first?", "What surprised you?", "What image stayed with you?", "What matters here?", "What is the author doing?"]
          .map((q, i) => (
            <p key={i} className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", marginBottom: 12, lineHeight: 1.6 }}>{q}</p>
          ))}
      </CollapseSection>
    </div>
  );
}
