import { useState } from "react";
import { HABIT_PROMPTS, HABIT_KEYS } from "../data/seed";

// ─── HABIT ICONS (all inline — no external imports) ───────────────────────────
const HABIT_ICONS = {
  attention: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  narration: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  outdoor: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-8 4 5 3-3 4 6H3z"/>
      <circle cx="18" cy="6" r="2"/>
    </svg>
  ),
  stillness: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  orderly: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
};

// ─── TEND ICON ────────────────────────────────────────────────────────────────
function TendIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#A9B786" strokeWidth="1" fill="#F7F4EF"/>
      <line x1="32" y1="52" x2="32" y2="14" stroke="#A9B786" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="32" y1="44" x2="24" y2="40" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="44" x2="40" y2="40" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="23" y2="33" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="41" y2="33" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="24" y2="27" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="40" y2="27" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="26" x2="25" y2="21" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="26" x2="39" y2="21" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="32" cy="14" r="2" fill="#A9B786"/>
      <circle cx="24" cy="40" r="1.2" fill="#A9B786"/>
      <circle cx="40" cy="40" r="1.2" fill="#A9B786"/>
      <circle cx="23" cy="33" r="1.2" fill="#A9B786"/>
      <circle cx="41" cy="33" r="1.2" fill="#A9B786"/>
      <circle cx="24" cy="27" r="1.2" fill="#A9B786"/>
      <circle cx="40" cy="27" r="1.2" fill="#A9B786"/>
      <circle cx="25" cy="21" r="1.2" fill="#A9B786"/>
      <circle cx="39" cy="21" r="1.2" fill="#A9B786"/>
      <text x="32" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontSize="5" fill="#A9B786" fontStyle="italic" letterSpacing="0.08em">tend</text>
    </svg>
  );
}

// ─── 12-WEEK REFLECTION QUESTIONS ────────────────────────────────────────────
const REFLECTION_SCAFFOLD = [
  { q: "Think back to when you began focusing on this habit.", prompt: "What was it like in your home before you began? What made you choose this habit?" },
  { q: "Recall a specific moment from these twelve weeks.", prompt: "Was there a day — even a small one — when you noticed this habit taking hold? What did it look like?" },
  { q: "Consider the harder days.", prompt: "When did this habit feel difficult or forced? What got in the way? Is that still true?" },
  { q: "Look at your children.", prompt: "What do you observe in them around this habit? Have you seen any change — however small?" },
  { q: "Now consider yourself.", prompt: "How has working on this habit changed the atmosphere of your home, even slightly?" },
  { q: "Finally, look ahead.", prompt: "Does this habit need more time, or does your family feel ready to tend a new one? Trust your instinct — you know your home." },
];

// ─── HABIT SCREEN ─────────────────────────────────────────────────────────────
export default function HabitScreen() {
  const [activeHabit, setActiveHabit]             = useState("attention");
  const [habitStartDate, setHabitStartDate]       = useState(() => { const d = new Date(); d.setDate(d.getDate() - 77); return d; });
  const [view, setView]                           = useState("home");
  const [detailHabit, setDetailHabit]             = useState(null);
  const [reflectionAnswers, setReflectionAnswers] = useState({});
  const [reflectionStep, setReflectionStep]       = useState(0);
  const [reflectionDone, setReflectionDone]       = useState(false);

  const weeksPassed        = Math.floor((new Date() - habitStartDate) / (7 * 24 * 60 * 60 * 1000));
  const showReassessPrompt = weeksPassed >= 12 && !reflectionDone;

  const chooseHabit = (key) => {
    setActiveHabit(key);
    setHabitStartDate(new Date());
    setReflectionDone(false);
    setReflectionStep(0);
    setReflectionAnswers({});
    setView("home");
  };

  // ── REFLECTION VIEW ──────────────────────────────────────────────────────
  if (view === "reflect") {
    const step   = REFLECTION_SCAFFOLD[reflectionStep];
    const isLast = reflectionStep === REFLECTION_SCAFFOLD.length - 1;
    const answer = reflectionAnswers[reflectionStep] || "";
    return (
      <div className="screen">
        <button onClick={() => setView("home")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back
        </button>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Twelve Weeks · Reflection</p>
        <h1 className="display serif" style={{ marginBottom: 6 }}>{HABIT_PROMPTS[activeHabit].name}</h1>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 32, lineHeight: 1.7 }}>
          Take your time with each question. There is no right answer — only what is true for your home.
        </p>
        <div style={{ display: "flex", gap: 6, marginBottom: 32, justifyContent: "center" }}>
          {REFLECTION_SCAFFOLD.map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= reflectionStep ? "var(--sage)" : "var(--rule)", transition: "background .3s" }} />
          ))}
        </div>
        <div className="card-sage" style={{ marginBottom: 24 }}>
          <p className="serif" style={{ fontSize: 16, color: "var(--ink)", marginBottom: 8 }}>{step.q}</p>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8 }}>{step.prompt}</p>
        </div>
        <textarea className="textarea" placeholder="Write what comes to mind…" value={answer}
          onChange={e => setReflectionAnswers(prev => ({ ...prev, [reflectionStep]: e.target.value }))} rows={5} />
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {reflectionStep > 0 && (
            <button className="btn-ghost" onClick={() => setReflectionStep(s => s - 1)}>← Back</button>
          )}
          <button className="btn-sage" style={{ flex: 1 }}
            onClick={() => { if (isLast) { setReflectionDone(true); setView("library"); } else setReflectionStep(s => s + 1); }}>
            {isLast ? "Choose Our Next Habit →" : "Continue →"}
          </button>
        </div>
      </div>
    );
  }

  // ── HABIT DETAIL VIEW ────────────────────────────────────────────────────
  if (view === "detail" && detailHabit) {
    const h        = HABIT_PROMPTS[detailHabit];
    const HIcon    = HABIT_ICONS[detailHabit];
    const day      = new Date().getDay();
    const isActive = activeHabit === detailHabit;
    return (
      <div className="screen">
        <button onClick={() => setView("library")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Library
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <HIcon />
          <h1 className="display serif" style={{ fontSize: 26 }}>{h.name}</h1>
        </div>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8, marginBottom: 28 }}>{h.desc}</p>
        {isActive && (
          <div className="card-sage" style={{ marginBottom: 24 }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>Currently in focus</p>
            <p className="caption italic">Week {weeksPassed + 1} of 12</p>
          </div>
        )}
        <p className="eyebrow" style={{ marginBottom: 16 }}>Today's Ideas</p>
        {h.daily[new Date().getDay()].map((p, i) => (
          <div key={i} style={{ paddingBottom: i < h.daily[new Date().getDay()].length - 1 ? 14 : 0, marginBottom: i < h.daily[new Date().getDay()].length - 1 ? 14 : 0, borderBottom: i < h.daily[new Date().getDay()].length - 1 ? "1px solid var(--rule)" : "none" }}>
            <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{p}</p>
          </div>
        ))}
        {!isActive && (
          <button className="btn-sage" style={{ width: "100%", marginTop: 32 }} onClick={() => chooseHabit(detailHabit)}>
            Make This Our Focus
          </button>
        )}
      </div>
    );
  }

  // ── LIBRARY VIEW ─────────────────────────────────────────────────────────
  if (view === "library") {
    return (
      <div className="screen">
        <button onClick={() => setView("home")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back
        </button>
        <p className="eyebrow" style={{ marginBottom: 6 }}>The Five Habits</p>
        <h1 className="display serif" style={{ marginBottom: 8 }}>Choose Your Focus</h1>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 28, lineHeight: 1.7 }}>
          Charlotte Mason taught that one habit, tended faithfully over time, changes a child far more than many habits pursued at once.
        </p>
        {HABIT_KEYS.map(key => {
          const h      = HABIT_PROMPTS[key];
          const HIcon  = HABIT_ICONS[key];
          const isActive = activeHabit === key;
          return (
            <button key={key} onClick={() => { setDetailHabit(key); setView("detail"); }}
              style={{ width: "100%", background: isActive ? "var(--sage-bg)" : "none", border: isActive ? "1px solid var(--sage-md)" : "1px solid var(--rule)", borderRadius: 3, padding: "16px 18px", marginBottom: 10, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
              <HIcon />
              <div style={{ flex: 1 }}>
                <p className="serif" style={{ fontSize: 17, color: "var(--ink)", marginBottom: 3 }}>{h.name}</p>
                <p className="caption italic">{h.desc}</p>
              </div>
              {isActive && (
                <span style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", flexShrink: 0 }}>Active</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // ── HOME VIEW ────────────────────────────────────────────────────────────
  const active     = HABIT_PROMPTS[activeHabit];
  const ActiveIcon = HABIT_ICONS[activeHabit];
  const day        = new Date().getDay();

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <TendIcon size={52} />
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Habit Formation</p>
          <h1 className="display-sm serif">The Tended Life</h1>
        </div>
      </div>

      {showReassessPrompt && (
        <div className="card-gold" style={{ marginBottom: 24 }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Twelve Weeks</p>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8, marginBottom: 16 }}>
            Your family has been tending <em>{active.name}</em> for twelve weeks. It may be time to pause and reflect before choosing what to tend next.
          </p>
          <button className="btn-gold" style={{ width: "100%" }} onClick={() => setView("reflect")}>
            Begin Reflection →
          </button>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ActiveIcon />
            <p className="eyebrow" style={{ marginBottom: 0 }}>This Season's Habit</p>
          </div>
          <button onClick={() => setView("library")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "var(--ink-faint)", fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>
            Change
          </button>
        </div>

        <h2 className="serif" style={{ fontSize: 24, marginBottom: 6 }}>{active.name}</h2>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 20, lineHeight: 1.7 }}>{active.desc}</p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span className="caption">Week {Math.min(weeksPassed + 1, 12)} of 12</span>
            <span className="caption">{Math.round(Math.min(weeksPassed / 12, 1) * 100)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min((weeksPassed / 12) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="rule" />
        <p className="eyebrow" style={{ marginBottom: 16 }}>Today's Ideas</p>
        {active.daily[day].map((p, i) => (
          <div key={i} style={{ paddingBottom: i < active.daily[day].length - 1 ? 14 : 0, marginBottom: i < active.daily[day].length - 1 ? 14 : 0, borderBottom: i < active.daily[day].length - 1 ? "1px solid var(--rule)" : "none" }}>
            <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{p}</p>
          </div>
        ))}
      </div>

      <div className="rule" />
      <div className="card-gold" style={{ marginTop: 4 }}>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>
          "Habit is ten natures."
        </p>
        <p className="caption" style={{ marginTop: 8 }}>— Charlotte Mason</p>
      </div>

      <button className="btn-ghost" style={{ width: "100%", marginTop: 20 }} onClick={() => setView("library")}>
        Explore All Five Habits
      </button>
    </div>
  );
}
