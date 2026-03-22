import { useState } from "react";
import SproutMark from "../components/SproutMark";

const GRADES = ["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const COLORS  = ["#7A8F6F", "#B8935A", "#8A7A9E", "#6B8E9E", "#9E6B6B", "#7A9E8E", "#8E8A6B"];
const HABITS  = [
  { key: "attention", label: "Attention",   desc: "Training the mind to focus fully on what is before it." },
  { key: "narration", label: "Narration",   desc: "Telling back in your own words — the act of knowing." },
  { key: "outdoor",   label: "Outdoor Time", desc: "Time in the open air as a daily non-negotiable." },
  { key: "stillness", label: "Stillness",   desc: "Learning to be quiet — a gift increasingly rare." },
  { key: "orderly",   label: "Orderliness", desc: "A place for everything, and everything in its place." },
];

const STEPS = ["welcome", "name", "children", "habit", "done"];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep]             = useState(0);
  const [parentName, setParentName] = useState("");
  const [children, setChildren]     = useState([{ name: "", grade: "7th", color: COLORS[0] }]);
  const [activeHabit, setHabit]     = useState("attention");

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const addChild = () => {
    if (children.length >= 8) return;
    setChildren(prev => [...prev, { name: "", grade: "7th", color: COLORS[prev.length % COLORS.length] }]);
  };

  const updateChild = (idx, field, val) =>
    setChildren(prev => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));

  const removeChild = (idx) =>
    setChildren(prev => prev.filter((_, i) => i !== idx));

  const finish = () => {
    onComplete({
      name: parentName.trim() || "Friend",
      activeHabit,
      term: 1,
      week: 1,
      children: children.filter(c => c.name.trim()),
    });
  };

  const current = STEPS[step];

  // Progress dots
  const ProgressDots = () => (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 36 }}>
      {STEPS.slice(0, -1).map((_, i) => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= step ? "var(--sage)" : "var(--rule)", transition: "background .3s" }} />
      ))}
    </div>
  );

  // ── WELCOME ────────────────────────────────────────────────────────────────
  if (current === "welcome") return (
    <div style={{ minHeight: "100dvh", background: "var(--cream)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 32px", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <SproutMark size={72} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, color: "var(--ink)", marginBottom: 10 }}>
          Welcome to Tend
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.7, maxWidth: 280, margin: "0 auto" }}>
          A daily rhythm for your Charlotte Mason family. Let's take two minutes to set things up.
        </p>
      </div>

      <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "16px 18px", marginBottom: 32 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.8 }}>
          "Education is an atmosphere, a discipline, a life."
        </p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: 8 }}>
          — Charlotte Mason
        </p>
      </div>

      <button className="btn-sage" style={{ width: "100%", fontSize: 13, padding: "14px 0" }} onClick={next}>
        Let's begin →
      </button>
    </div>
  );

  // ── NAME ───────────────────────────────────────────────────────────────────
  if (current === "name") return (
    <div style={{ minHeight: "100dvh", background: "var(--cream)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 32px", maxWidth: 430, margin: "0 auto" }}>
      <ProgressDots />
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>Step 1 of 3</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 8, lineHeight: 1.2 }}>
        What shall we call you?
      </h2>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 32 }}>
        This is how Tend greets you each morning.
      </p>

      <input
        className="input-line"
        placeholder="Your first name…"
        value={parentName}
        onChange={e => setParentName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && next()}
        style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", marginBottom: 32 }}
        autoFocus
      />

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-ghost" onClick={back}>Back</button>
        <button className="btn-sage" style={{ flex: 1 }} onClick={next}>
          Continue →
        </button>
      </div>
      <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", marginTop: 14, fontSize: 12, color: "var(--ink-faint)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em" }}>
        Skip for now
      </button>
    </div>
  );

  // ── CHILDREN ───────────────────────────────────────────────────────────────
  if (current === "children") return (
    <div style={{ minHeight: "100dvh", background: "var(--cream)", padding: "48px 32px", maxWidth: 430, margin: "0 auto", overflowY: "auto" }}>
      <ProgressDots />
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>Step 2 of 3</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 8, lineHeight: 1.2 }}>
        Tell us about your students.
      </h2>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>
        Add as many as you like. You can always change this later in Settings.
      </p>

      {children.map((child, idx) => (
        <div key={idx} style={{ background: "white", border: "1px solid var(--rule)", borderRadius: 3, padding: "16px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Color dot */}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: child.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "white" }}>
                  {child.name ? child.name[0].toUpperCase() : "?"}
                </span>
              </div>
              <input
                className="input-line"
                placeholder={`Student ${idx + 1} name…`}
                value={child.name}
                onChange={e => updateChild(idx, "name", e.target.value)}
                style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", border: "none", padding: 0, flex: 1 }}
              />
            </div>
            {children.length > 1 && (
              <button onClick={() => removeChild(idx)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: 18, lineHeight: 1 }}>
                ×
              </button>
            )}
          </div>

          {/* Grade */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {GRADES.map(g => (
              <button key={g} onClick={() => updateChild(idx, "grade", g)}
                style={{ padding: "4px 10px", borderRadius: 2, border: `1px solid ${child.grade === g ? "var(--sage)" : "var(--rule)"}`, background: child.grade === g ? "var(--sage-bg)" : "none", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", color: child.grade === g ? "var(--sage)" : "var(--ink-faint)" }}>
                {g}
              </button>
            ))}
          </div>

          {/* Color */}
          <div style={{ display: "flex", gap: 8 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => updateChild(idx, "color", c)}
                style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: child.color === c ? "2.5px solid var(--ink)" : "2.5px solid transparent", cursor: "pointer", transition: "border .2s" }} />
            ))}
          </div>
        </div>
      ))}

      {children.length < 8 && (
        <button onClick={addChild}
          style={{ width: "100%", background: "none", border: "1px dashed var(--rule)", borderRadius: 3, padding: "12px 0", cursor: "pointer", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", marginBottom: 24 }}>
          + Add another student
        </button>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button className="btn-ghost" onClick={back}>Back</button>
        <button className="btn-sage" style={{ flex: 1 }} onClick={next}>Continue →</button>
      </div>
    </div>
  );

  // ── HABIT ──────────────────────────────────────────────────────────────────
  if (current === "habit") return (
    <div style={{ minHeight: "100dvh", background: "var(--cream)", padding: "48px 32px", maxWidth: 430, margin: "0 auto", overflowY: "auto" }}>
      <ProgressDots />
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>Step 3 of 3</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 8, lineHeight: 1.2 }}>
        Choose your first habit to tend.
      </h2>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>
        Charlotte Mason taught one habit at a time, over twelve weeks. You can change this later.
      </p>

      {HABITS.map(h => (
        <button key={h.key} onClick={() => setHabit(h.key)}
          style={{ width: "100%", background: activeHabit === h.key ? "var(--sage-bg)" : "none", border: `1px solid ${activeHabit === h.key ? "var(--sage)" : "var(--rule)"}`, borderRadius: 3, padding: "14px 16px", cursor: "pointer", textAlign: "left", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, transition: "all .2s" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: activeHabit === h.key ? "var(--sage)" : "var(--rule)", flexShrink: 0, transition: "background .2s" }} />
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: activeHabit === h.key ? "var(--sage)" : "var(--ink)", marginBottom: 3 }}>{h.label}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5 }}>{h.desc}</p>
          </div>
        </button>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn-ghost" onClick={back}>Back</button>
        <button className="btn-sage" style={{ flex: 1 }} onClick={next}>Continue →</button>
      </div>
    </div>
  );

  // ── DONE ───────────────────────────────────────────────────────────────────
  if (current === "done") return (
    <div style={{ minHeight: "100dvh", background: "var(--cream)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 32px", maxWidth: 430, margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <SproutMark size={64} />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 400, color: "var(--ink)", marginBottom: 10 }}>
        Your rhythm is ready.
      </h2>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.75, marginBottom: 12, maxWidth: 280, margin: "0 auto 20px" }}>
        {parentName ? `Welcome, ${parentName.trim()}.` : "Welcome."} Tend is set up for your family. Begin with what is in front of you.
      </p>

      <div style={{ height: 1, background: "rgba(169,183,134,.2)", margin: "20px 0" }} />

      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 32 }}>
        "Begin with what is in front of you."
      </p>

      <button className="btn-sage" style={{ width: "100%", fontSize: 13, padding: "14px 0" }} onClick={finish}>
        Open Tend →
      </button>
    </div>
  );

  return null;
}
