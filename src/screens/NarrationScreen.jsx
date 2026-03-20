import { useState, useRef } from "react";
import { CollapseSection } from "../components/SharedComponents";
import { Ic } from "../components/Icons";
import {
  NARRATION_PROMPTS,
  NARRATION_STAGES,
  NARRATION_STAGE_LABELS,
  NARRATION_STAGE_PROMPTS,
} from "../data/seed";

// ─── FREE TIER CONFIG ─────────────────────────────────────────────────────────
const FREE_LIMIT = 5;
const STORAGE_KEY = "tend_narration_count";

function getCount() {
  try { return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10); } catch { return 0; }
}
function bumpCount() {
  try { localStorage.setItem(STORAGE_KEY, String(getCount() + 1)); } catch {}
}

// ─── PAYWALL BANNER ───────────────────────────────────────────────────────────
function NarrationPaywall() {
  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Faded teaser */}
      <div style={{
        pointerEvents: "none", userSelect: "none",
        maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
        maxHeight: 160, overflow: "hidden", opacity: 0.4,
      }}>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ fontSize: 44, marginBottom: 12 }}>✦</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>Narration Kept</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.7 }}>
            You have found it, followed it, and framed it.
          </p>
        </div>
      </div>
      {/* Gate */}
      <div style={{ paddingTop: 20, borderTop: "1px solid rgba(169,183,134,.2)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>
          ✦ You've used your 5 free narrations
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.75, maxWidth: 280, margin: "0 auto 22px" }}>
          Tend Premium unlocks unlimited narration sessions, all five habits, a full Lilies journal, and more.
        </p>
        <a href="https://payhip.com/b/NMQ4D" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", background: "var(--sage)", color: "white", fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", textDecoration: "none", padding: "13px 32px", borderRadius: 2, marginBottom: 10 }}>
          Unlock Premium · $47/year
        </a>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", color: "var(--ink-faint)" }}>
          Beauty. Meaning. Connection.
        </p>
      </div>
    </div>
  );
}

// ─── NARRATION SCREEN ─────────────────────────────────────────────────────────
export default function NarrationScreen({ settings, onNavigate }) {
  const isPaid = settings?.isPaid || false;
  const [sessionCount, setSessionCount] = useState(getCount);
  const isLocked = !isPaid && sessionCount >= FREE_LIMIT;

  const [stage, setStage] = useState(0);
  const [texts, setTexts] = useState(["", "", ""]);
  const [recording, setRec] = useState(false);
  const [done, setDone] = useState(false);
  const promptIdx = useRef(Math.floor(Math.random() * NARRATION_PROMPTS.length));

  const cur = NARRATION_STAGES[stage];
  const words = texts[stage].trim() ? texts[stage].trim().split(/\s+/).length : 0;

  const advance = () => {
    if (stage < 2) {
      setStage(s => s + 1);
    } else {
      if (!isPaid) { bumpCount(); setSessionCount(getCount()); }
      setDone(true);
    }
  };

  // ── HARD LOCKED ─────────────────────────────────────────────────────────
  if (isLocked) {
    return (
      <div className="screen">
        <p className="eyebrow" style={{ marginBottom: 6 }}>In your own words</p>
        <h1 className="display serif" style={{ marginBottom: 24 }}>Narration</h1>
        <NarrationPaywall />
      </div>
    );
  }

  // ── SESSION COMPLETE ─────────────────────────────────────────────────────
  if (done) {
    const remaining = FREE_LIMIT - sessionCount;
    const justHitLimit = !isPaid && sessionCount >= FREE_LIMIT;
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
        <p className="ornament" style={{ fontSize: 44, marginBottom: 16 }}>✦</p>
        <h2 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>Narration Kept</h2>
        <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-lt)", marginBottom: 20, lineHeight: 1.7 }}>
          You have found it, followed it, and framed it.
        </p>

        {/* Sessions remaining badge */}
        {!isPaid && !justHitLimit && (
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 24 }}>
            {remaining} free {remaining === 1 ? "session" : "sessions"} remaining
          </p>
        )}

        {/* Just hit the limit — upgrade nudge */}
        {justHitLimit && (
          <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "16px 20px", marginBottom: 24, maxWidth: 300 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.7, marginBottom: 12 }}>
              That was your last free narration. Upgrade to keep the practice going.
            </p>
            <a href="https://payhip.com/b/NMQ4D" target="_blank" rel="noopener noreferrer"
              style={{ display: "block", background: "var(--sage)", color: "white", fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none", padding: "11px 0", borderRadius: 2, textAlign: "center" }}>
              Unlock Premium →
            </a>
          </div>
        )}

        <button className="btn-sage" onClick={() => { setStage(0); setTexts(["", "", ""]); setDone(false); }}>
          Begin Again
        </button>
      </div>
    );
  }

  // ── SESSION IN PROGRESS ──────────────────────────────────────────────────
  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>In your own words</p>
      <h1 className="display serif" style={{ marginBottom: 18 }}>Narration</h1>

      {/* Free counter bar */}
      {!isPaid && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "8px 12px", background: "var(--sage-bg)", borderRadius: 3, border: "1px solid rgba(169,183,134,.2)" }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sage)", margin: 0 }}>
            {FREE_LIMIT - sessionCount} of {FREE_LIMIT} free sessions remaining
          </p>
          <a href="https://payhip.com/b/NMQ4D" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", color: "var(--sage)", textDecoration: "none" }}>
            Upgrade →
          </a>
        </div>
      )}

      {/* Stage indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {NARRATION_STAGES.map((s, i) => (
          <button key={s} onClick={() => setStage(i)}
            className={`stage-badge stage-${s}`}
            style={{ cursor: "pointer", border: "none", opacity: i > stage ? .45 : 1 }}>
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

      <textarea className="textarea" placeholder="Begin anywhere…"
        value={texts[stage]}
        onChange={e => setTexts(t => t.map((v, i) => i === stage ? e.target.value : v))}
        rows={7} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 24 }}>
        <span className="caption">{words > 0 ? `${words} word${words === 1 ? "" : "s"}` : ""}</span>
        <button className={`voice-btn ${recording ? "rec" : ""}`} onClick={() => setRec(r => !r)}>
          <Ic.Mic />
        </button>
      </div>

      <button className="btn-sage" onClick={advance} style={{ width: "100%" }} disabled={!texts[stage].trim()}>
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
