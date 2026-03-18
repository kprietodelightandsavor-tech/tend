import { useState } from "react";
import { HABIT_PROMPTS, HABIT_KEYS } from "../data/seed";

// ─── HABIT ICONS ─────────────────────────────────────────────────────────────
const HABIT_ICONS = {
  attention: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  narration: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  outdoor: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-8 4 5 3-3 4 6H3z"/>
      <circle cx="18" cy="6" r="2"/>
    </svg>
  ),
  stillness: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  orderly: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
};

const STEPS = ["welcome", "name", "habit", "term", "done"];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep]           = useState(0);
  const [name, setName]           = useState("");
  const [activeHabit, setHabit]   = useState("attention");
  const [term, setTerm]           = useState(1);
  const [week, setWeek]           = useState(1);

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onComplete({ name, activeHabit, term, week });
  };

  const current = STEPS[step];

  return (
    <div style={{
      minHeight: "100dvh", background: "var(--cream)",
      display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "48px 32px",
      maxWidth: 430, margin: "0 auto",
      animation: "fadeUp .38s ease both",
    }}>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 48, justifyContent: "center" }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6, borderRadius: 3,
            background: i <= step ? "var(--sage)" : "var(--rule)",
            transition: "all .3s ease",
          }} />
        ))}
      </div>

      {/* ── WELCOME ── */}
      {current === "welcome" && (
        <div style={{ textAlign: "center" }}>
          <p className="ornament" style={{ fontSize: 48, marginBottom: 24 }}>✦</p>
          <h1 className="display serif" style={{ marginBottom: 12 }}>Welcome to Tend</h1>
          <p className="corm italic" style={{ fontSize: 18, color: "var(--ink-lt)", lineHeight: 1.8, marginBottom: 16 }}>
            A daily rhythm app for Charlotte Mason homeschool families.
          </p>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 48 }}>
            It will take just a moment to make this your own.
          </p>
          <button className="btn-sage" style={{ width: "100%" }} onClick={next}>
            Begin →
          </button>
        </div>
      )}

      {/* ── NAME ── */}
      {current === "name" && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Step One</p>
          <h2 className="display serif" style={{ marginBottom: 8 }}>What is your name?</h2>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 32 }}>
            Tend will greet you each morning by name.
          </p>
          <input
            className="input-line"
            placeholder="Your first name…"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            style={{ fontSize: 22, marginBottom: 48, fontFamily: "'Playfair Display', serif" }}
          />
          <button className="btn-sage" style={{ width: "100%" }}
            onClick={next} disabled={!name.trim()}>
            Continue →
          </button>
        </div>
      )}

      {/* ── HABIT ── */}
      {current === "habit" && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Step Two</p>
          <h2 className="display serif" style={{ marginBottom: 8 }}>Choose your family's first habit</h2>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>
            Charlotte Mason taught that one habit, tended faithfully over time, changes a child far more than many pursued at once. You can change this anytime.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
            {HABIT_KEYS.map(key => {
              const h     = HABIT_PROMPTS[key];
              const HIcon = HABIT_ICONS[key];
              const isActive = activeHabit === key;
              return (
                <button key={key} onClick={() => setHabit(key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: isActive ? "var(--sage-bg)" : "none",
                    border: `1px solid ${isActive ? "var(--sage)" : "var(--rule)"}`,
                    borderRadius: 3, padding: "14px 16px", cursor: "pointer",
                    textAlign: "left", transition: "all .2s",
                  }}>
                  <HIcon />
                  <div>
                    <p className="serif" style={{ fontSize: 16, color: "var(--ink)", marginBottom: 2 }}>{h.name}</p>
                    <p className="caption italic">{h.desc}</p>
                  </div>
                  {isActive && (
                    <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "var(--sage)", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
          <button className="btn-sage" style={{ width: "100%" }} onClick={next}>
            Continue →
          </button>
        </div>
      )}

      {/* ── TERM ── */}
      {current === "term" && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Step Three</p>
          <h2 className="display serif" style={{ marginBottom: 8 }}>Where are you in your year?</h2>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 32 }}>
            Charlotte Mason homeschooling runs in three terms of twelve weeks. You can adjust this anytime in Settings.
          </p>

          <p className="eyebrow" style={{ marginBottom: 12 }}>Term</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {[1, 2, 3].map(n => (
              <button key={n} onClick={() => setTerm(n)}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 2,
                  border: `1px solid ${term === n ? "var(--sage)" : "var(--rule)"}`,
                  background: term === n ? "var(--sage-bg)" : "none",
                  cursor: "pointer", fontFamily: "'Playfair Display', serif",
                  fontSize: 20, color: term === n ? "var(--sage)" : "var(--ink)",
                  transition: "all .2s",
                }}>
                {n}
              </button>
            ))}
          </div>

          <p className="eyebrow" style={{ marginBottom: 12 }}>Week</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setWeek(n)}
                style={{
                  width: 44, height: 44, borderRadius: 2,
                  border: `1px solid ${week === n ? "var(--sage)" : "var(--rule)"}`,
                  background: week === n ? "var(--sage)" : "none",
                  cursor: "pointer", fontSize: 14,
                  color: week === n ? "white" : "var(--ink)",
                  fontFamily: "'Lato', sans-serif",
                  transition: "all .2s",
                }}>
                {n}
              </button>
            ))}
          </div>

          <button className="btn-sage" style={{ width: "100%" }} onClick={next}>
            Continue →
          </button>
        </div>
      )}

      {/* ── DONE ── */}
      {current === "done" && (
        <div style={{ textAlign: "center" }}>
          <p className="ornament" style={{ fontSize: 48, marginBottom: 24 }}>✦</p>
          <h2 className="display serif" style={{ marginBottom: 12 }}>
            Good morning, {name}.
          </h2>
          <p className="corm italic" style={{ fontSize: 18, color: "var(--ink-lt)", lineHeight: 1.8, marginBottom: 16 }}>
            Tend is ready for your family.
          </p>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 48 }}>
            Begin with what is in front of you.
          </p>
          <button className="btn-sage" style={{ width: "100%" }} onClick={next}>
            Open Tend →
          </button>
        </div>
      )}
    </div>
  );
}
