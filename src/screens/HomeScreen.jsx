import { useState, useRef } from "react";
import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES } from "../data/seed";
import { AttentionIcon, NarrationIcon, OutdoorIcon, StillnessIcon, OrderlyIcon } from "../components/HabitIcons";

const HABIT_ICON_MAP = { attention: AttentionIcon, narration: NarrationIcon, outdoor: OutdoorIcon, stillness: StillnessIcon, orderly: OrderlyIcon };

const Icon = {
  Leaf: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Feather: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>),
  Sun: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Arrow: () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  Sprout: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10C12 10 8 9 7 5c3 0 5 2 5 5z"/><path d="M12 10C12 10 16 9 17 5c-3 0-5 2-5 5z"/></svg>),
};

const MOTHER_CULTURE_DAILY = [
  "Rest fully today. The week ahead needs a rested you.",
  "Step outside alone for 10 minutes before the day begins. Let the morning be yours first.",
  "Make yourself something warm to drink and sit with it before opening any screens.",
  "Take a short walk, even just around the property. Move your body gently.",
  "Rest your eyes from screens for 20 minutes today. Look at something far away.",
  "Go outside and look up. Sky, clouds, light — let it reset something in you.",
  "Linger over breakfast. Let the morning be unhurried.",
];

const FREE_KEYWORDS = ["wake up", "chores", "piano", "free", "rest", "independent", "lunch", "outdoor", "nature", "afternoon"];
const isFreeBlock = (subject) => FREE_KEYWORDS.some(k => subject.toLowerCase().includes(k));

const OUTDOOR_GOAL_HOURS = 15;

function OutdoorTracker() {
  const [minutes, setMinutes] = useState(347);
  const hours = Math.floor(minutes / 60);
  const mins  = minutes % 60;
  const pct   = Math.min(minutes / (OUTDOOR_GOAL_HOURS * 60), 1);
  const r = 34, circ = 2 * Math.PI * r, dash = circ * pct;
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon.Leaf /><p className="eyebrow" style={{ marginBottom: 0 }}>Outside This Week</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--rule)" strokeWidth="5"/>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--sage)" strokeWidth="5" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .5s ease" }}/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span className="serif" style={{ fontSize: 15, color: "var(--sage)", lineHeight: 1 }}>
              {hours}<span style={{ fontSize: 10 }}>h</span>{mins > 0 && <span>{mins}<span style={{ fontSize: 10 }}>m</span></span>}
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: "var(--ink)", fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>
            {hours >= OUTDOOR_GOAL_HOURS ? "Goal reached this week ✦" : `${OUTDOOR_GOAL_HOURS - hours} hr${mins > 0 ? ` ${60 - mins} min` : ""} to go`}
          </p>
          <p className="caption italic" style={{ marginBottom: 12 }}>Goal: {OUTDOOR_GOAL_HOURS} hrs / week</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(n => (
              <button key={n} onClick={() => setMinutes(m => m + n)}
                style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 2, padding: "5px 10px", fontSize: 11, fontFamily: "'Lato', sans-serif", color: "var(--sage)", cursor: "pointer", letterSpacing: ".06em" }}>
                +{n}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TodaySchedule({ today, blocks, onNavigate }) {
  const [items, setItems]             = useState(blocks.map(b => ({ ...b, status: "pending", motherNote: "" })));
  const [editingNote, setEditingNote] = useState(null);
  const lpt = useRef(null);

  const toggleDone = (id) => {
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      if (!t || t.status === "skipped") return prev;
      if (t.status === "done") {
        return prev.map(b => b.id === id ? { ...b, status: "pending" } : b)
          .sort((a, b) => blocks.findIndex(x => x.id === a.id) - blocks.findIndex(x => x.id === b.id));
      }
      const u = prev.map(b => b.id === id ? { ...b, status: "done" } : b);
      return [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
    });
  };

  const markSkipped = (id) => {
    setItems(prev => {
      const u = prev.map(b => b.id === id ? { ...b, status: "skipped" } : b);
      return [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
    });
  };

  const saveNote = (id, note) => { setItems(prev => prev.map(b => b.id === id ? { ...b, motherNote: note } : b)); setEditingNote(null); };
  const startLP  = (id) => { lpt.current = setTimeout(() => { clearTimeout(lpt.current); markSkipped(id); }, 600); };
  const cancelLP = () => clearTimeout(lpt.current);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Sun /><p className="eyebrow" style={{ marginBottom: 0 }}>Today · {today}</p>
        </div>
        <button onClick={() => onNavigate("planner")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Full week <Icon.Arrow />
        </button>
      </div>
      {items.map(b => {
        const isDone = b.status === "done", isSkipped = b.status === "skipped";
        const showMother = isFreeBlock(b.subject) && !isSkipped;
        return (
          <div key={b.id} style={{ borderBottom: "1px solid var(--rule)" }}>
            <div onClick={() => toggleDone(b.id)}
              onTouchStart={() => { if (b.status === "pending") startLP(b.id); }} onTouchEnd={cancelLP}
              onMouseDown={() => { if (b.status === "pending") startLP(b.id); }} onMouseUp={cancelLP} onMouseLeave={cancelLP}
              style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0 6px", cursor: b.status !== "skipped" ? "pointer" : "default", opacity: isDone ? 0.35 : isSkipped ? 0.45 : 1, transition: "opacity .4s ease" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: isDone ? "var(--sage)" : isSkipped ? "var(--gold)" : "transparent", border: isDone || isSkipped ? "none" : "1.5px solid var(--rule)", transition: "all .3s ease" }} />
              <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 1, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}>{b.time}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, color: isDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)", transition: "all .3s ease" }}>{b.subject}</p>
                {isSkipped && <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>skipped today</p>}
                {b.note && !isSkipped && <p className="caption italic" style={{ marginTop: 2 }}>{b.note}</p>}
                {isDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
              </div>
            </div>
            {showMother && (
              <div style={{ paddingLeft: 58, paddingBottom: 8 }} onClick={e => e.stopPropagation()}>
                {editingNote === b.id ? (
                  <input autoFocus defaultValue={b.motherNote} placeholder="What will you tend during this time?"
                    onBlur={e => saveNote(b.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                    style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }}/>
                ) : (
                  <button onClick={() => setEditingNote(b.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", padding: 0, textAlign: "left", opacity: b.motherNote ? 1 : 0.5 }}>
                    {b.motherNote ? `✦ ${b.motherNote}` : "your time · what will you tend?"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap to complete · Tap again to undo · Hold to skip</p>
    </div>
  );
}

function MotherCulture() {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Icon.Feather /><p className="eyebrow" style={{ marginBottom: 0 }}>Mother Culture</p>
      </div>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>
        {MOTHER_CULTURE_DAILY[new Date().getDay()]}
      </p>
    </div>
  );
}

function HabitFocusCard({ activeHabit, onNavigate }) {
  const habit     = HABIT_PROMPTS[activeHabit];
  const HIcon     = HABIT_ICON_MAP[activeHabit];
  const day       = new Date().getDay();
  const prompts   = habit.daily[day].slice(0, 2);
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const cmQuote   = CM_QUOTES[dayOfYear % CM_QUOTES.length];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon.Sprout /><p className="eyebrow" style={{ marginBottom: 0 }}>Habit in Focus</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <HIcon /><p className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{habit.name}</p>
      </div>
      {prompts.map((p, i) => (
        <div key={i} style={{ paddingBottom: i < prompts.length - 1 ? 12 : 0, marginBottom: i < prompts.length - 1 ? 12 : 0, borderBottom: i < prompts.length - 1 ? "1px solid var(--rule)" : "none" }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8 }}>{p}</p>
        </div>
      ))}
      <button onClick={() => onNavigate("habits")}
        style={{ background: "none", border: "none", cursor: "pointer", marginTop: 14, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)" }}>
        Change habit focus →
      </button>
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--rule)" }}>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.85, marginBottom: 6 }}>"{cmQuote.quote}"</p>
        <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
      </div>
    </div>
  );
}

export default function HomeScreen({ onNavigate }) {
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayIndex  = Math.min(Math.max(new Date().getDay() - 1, 0), 4);
  const today       = DAYS[todayIndex] || "Monday";
  const todayBlocks = DAY_SCHEDULE[today] || DAY_SCHEDULE.Monday;
  const [activeHabit] = useState("attention");

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>{greeting},<br />Kim.</h1>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", marginBottom: 28 }}>Begin with what is in front of you.</p>
      <OutdoorTracker />
      <div style={{ height: 1, background: "var(--rule)", margin: "4px 0 24px" }} />
      <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} />
      <div style={{ height: 1, background: "var(--rule)", margin: "0 0 24px" }} />
      <MotherCulture />
      <div style={{ height: 1, background: "var(--rule)", margin: "0 0 24px" }} />
      <HabitFocusCard activeHabit={activeHabit} onNavigate={onNavigate} />
    </div>
  );
}
