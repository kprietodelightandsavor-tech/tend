import { useState, useRef } from "react";
import { DAYS, DAY_SCHEDULE } from "../data/seed";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 20.5C6.5 20.5 3 17 3 11.5C3 6.5 7.5 3 12 3C16.5 3 20 6 20 10.5C20 14 17.5 16.5 14 17L6.5 20.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L6.5 20.5" />
  </svg>
);

const SlateCheckIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FeatherIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM16 8L2 22M17.5 15H9" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-10H20M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

// ─── MOTHER CULTURE PROMPTS ───────────────────────────────────────────────────
// Indexed 0 (Sun) through 6 (Sat) to match getDay()
const MOTHER_CULTURE = [
  [ // Sunday
    "Rest fully today. The week ahead needs a rested you.",
    "Sit with Scripture or something that feeds your soul, slowly and without hurry.",
    "Name three things from this past week that went well. Let yourself receive them.",
  ],
  [ // Monday
    "Step outside alone for 10 minutes before the day begins. Let the morning be yours first.",
    "Read one poem slowly — not to teach it, just to receive it.",
    "Notice one beautiful thing today and write it down in your own words.",
  ],
  [ // Tuesday
    "Make yourself something warm to drink and sit with it before opening any screens.",
    "Pray or sit in silence for five minutes. You cannot pour from an empty vessel.",
    "Pick up a book you've been meaning to read — just one chapter.",
  ],
  [ // Wednesday
    "Take a short walk, even just around the property. Move your body gently.",
    "Write three sentences in your journal — no agenda, just what is true today.",
    "Listen to music you love while you work. Let it be a small gift to yourself.",
  ],
  [ // Thursday
    "Rest your eyes from screens for 20 minutes today. Look at something far away.",
    "Call or write to a friend — connection is its own kind of nourishment.",
    "Spend a few minutes with a craft, a sketchbook, or anything that uses your hands.",
  ],
  [ // Friday
    "Go outside and look up. Sky, clouds, light — let it reset something in you.",
    "Read something purely for your own delight today — fiction, poetry, biography.",
    "Give yourself permission to end the school day on time. Rest is not laziness.",
  ],
  [ // Saturday
    "Linger over breakfast. Let the morning be unhurried.",
    "Tend to your own space — a clean corner, fresh flowers, something that is yours.",
    "Do one thing today that has nothing to do with homeschooling.",
  ],
];

// ─── OUTDOOR TRACKER ──────────────────────────────────────────────────────────
const OUTDOOR_GOAL_HOURS = 15;

function OutdoorTracker() {
  const [minutes, setMinutes] = useState(347);
  const hours = Math.floor(minutes / 60);
  const mins  = minutes % 60;
  const pct   = Math.min(minutes / (OUTDOOR_GOAL_HOURS * 60), 1);
  const r     = 34;
  const circ  = 2 * Math.PI * r;
  const dash  = circ * pct;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <LeafIcon />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Outside This Week</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--rule)" strokeWidth="5" />
            <circle
              cx="40" cy="40" r={r} fill="none"
              stroke="var(--sage)" strokeWidth="5"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray .5s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span className="serif" style={{ fontSize: 15, color: "var(--sage)", lineHeight: 1 }}>
              {hours}<span style={{ fontSize: 10 }}>h</span>
              {mins > 0 && <span>{mins}<span style={{ fontSize: 10 }}>m</span></span>}
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: "var(--ink)", fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>
            {hours >= OUTDOOR_GOAL_HOURS
              ? "Goal reached this week ✦"
              : `${OUTDOOR_GOAL_HOURS - hours} hr ${mins > 0 ? `${60 - mins} min` : ""} to go`}
          </p>
          <p className="caption italic" style={{ marginBottom: 12 }}>Goal: {OUTDOOR_GOAL_HOURS} hrs / week</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(n => (
              <button key={n} onClick={() => setMinutes(m => m + n)}
                style={{
                  background: "var(--sage-bg)", border: "1px solid var(--sage-md)",
                  borderRadius: 2, padding: "5px 10px",
                  fontSize: 11, fontFamily: "'Lato', sans-serif",
                  color: "var(--sage)", cursor: "pointer", letterSpacing: ".06em",
                }}>
                +{n}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HABIT TRACKER ────────────────────────────────────────────────────────────
const HABIT_LIST = [
  { id: 1, name: "Attention",    emoji: "👁" },
  { id: 2, name: "Narration",    emoji: "🗣" },
  { id: 3, name: "Outdoor Time", emoji: "🌿" },
  { id: 4, name: "Stillness",    emoji: "🕊" },
  { id: 5, name: "Orderly Work", emoji: "📖" },
];
const WEEK_DAYS = ["M", "T", "W", "T", "F"];

function HabitTracker() {
  const [checked, setChecked] = useState({});
  const todayIdx = Math.min(Math.max(new Date().getDay() - 1, 0), 4);

  const toggle = (id, day) =>
    setChecked(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [day]: !(prev[id]?.[day]) },
    }));

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <SlateCheckIcon />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Habits This Week</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <div style={{ flex: 1 }} />
        {WEEK_DAYS.map((d, i) => (
          <div key={i} style={{
            width: 28, textAlign: "center", fontSize: 10,
            letterSpacing: ".08em", fontFamily: "'Lato', sans-serif",
            color: i === todayIdx ? "var(--sage)" : "var(--ink-faint)",
          }}>{d}</div>
        ))}
      </div>
      {HABIT_LIST.map(h => {
        const dayChecks = checked[h.id] || {};
        const count = Object.values(dayChecks).filter(Boolean).length;
        return (
          <div key={h.id} style={{ display: "flex", alignItems: "center", padding: "9px 0", borderTop: "1px solid var(--rule)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 12 }}>{h.emoji}</span>
                <span style={{ fontSize: 13, color: "var(--ink)", fontFamily: "'Playfair Display', serif" }}>{h.name}</span>
              </div>
              <div style={{ height: 2, background: "var(--rule)", borderRadius: 1, width: 56 }}>
                <div style={{ height: 2, background: "var(--sage)", borderRadius: 1, width: `${(count / 5) * 100}%`, transition: "width .3s ease" }} />
              </div>
            </div>
            {WEEK_DAYS.map((_, i) => (
              <button key={i} onClick={() => toggle(h.id, i)}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: `1.5px solid ${dayChecks[i] ? "var(--sage)" : "var(--rule)"}`,
                  background: dayChecks[i] ? "var(--sage)" : "none",
                  cursor: "pointer", transition: "all .2s",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                {dayChecks[i] && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="white" style={{ width: 12, height: 12, strokeWidth: 3 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── MOTHER CULTURE ───────────────────────────────────────────────────────────
function MotherCulture() {
  const prompts = MOTHER_CULTURE[new Date().getDay()];
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <FeatherIcon />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Mother Culture</p>
      </div>
      {prompts.map((p, i) => (
        <div key={i} style={{
          paddingBottom: i < prompts.length - 1 ? 14 : 0,
          marginBottom:  i < prompts.length - 1 ? 14 : 0,
          borderBottom:  i < prompts.length - 1 ? "1px solid var(--rule)" : "none",
        }}>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>
            {p}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── TODAY'S SCHEDULE ─────────────────────────────────────────────────────────
function TodaySchedule({ today, blocks, onNavigate }) {
  const [items, setItems] = useState(
    blocks.map((b, i) => ({ ...b, id: i, status: "pending" }))
  );
  const longPressTimer = useRef(null);

  const markDone = (id) => {
    setItems(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: "done" } : b);
      return [
        ...updated.filter(b => b.status === "pending"),
        ...updated.filter(b => b.status !== "pending"),
      ];
    });
  };

  const markSkipped = (id) => {
    setItems(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: "skipped" } : b);
      return [
        ...updated.filter(b => b.status === "pending"),
        ...updated.filter(b => b.status !== "pending"),
      ];
    });
  };

  const startLongPress = (id) => {
    longPressTimer.current = setTimeout(() => markSkipped(id), 600);
  };
  const cancelLongPress = () => clearTimeout(longPressTimer.current);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SunIcon />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Today · {today}</p>
        </div>
        <button
          onClick={() => onNavigate("planner")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            color: "var(--ink-faint)", fontSize: 11,
            fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase",
          }}
        >
          Full week <ArrowIcon />
        </button>
      </div>

      {items.map(b => {
        const isDone    = b.status === "done";
        const isSkipped = b.status === "skipped";
        return (
          <div
            key={b.id}
            onClick={() => { if (b.status === "pending") markDone(b.id); }}
            onTouchStart={() => startLongPress(b.id)}
            onTouchEnd={cancelLongPress}
            onMouseDown={() => startLongPress(b.id)}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "13px 0", borderBottom: "1px solid var(--rule)",
              cursor: b.status === "pending" ? "pointer" : "default",
              opacity: isDone ? 0.38 : isSkipped ? 0.5 : 1,
              transition: "opacity .4s ease",
            }}
          >
            {/* Status dot */}
            <div style={{
              width: 8, height: 8, borderRadius: "50%", marginTop: 7, flexShrink: 0,
              background: isDone ? "var(--sage)" : isSkipped ? "var(--gold)" : "transparent",
              border: isDone || isSkipped ? "none" : "1.5px solid var(--rule)",
              transition: "all .3s ease",
            }} />

            <span style={{
              fontSize: 11, color: "var(--ink-faint)", width: 36,
              paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif",
            }}>
              {b.time}
            </span>

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 15,
                color: isDone ? "var(--ink-faint)" : "var(--ink)",
                fontFamily: "'Playfair Display', serif",
                textDecoration: isDone ? "line-through" : "none",
                textDecorationColor: "var(--sage-md)",
                transition: "all .3s ease",
              }}>
                {b.subject}
              </p>
              {isSkipped && (
                <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>
                  skipped today
                </p>
              )}
              {b.note && !isSkipped && (
                <p className="caption italic" style={{ marginTop: 2 }}>{b.note}</p>
              )}
            </div>
          </div>
        );
      })}

      <p className="caption italic" style={{ marginTop: 14, textAlign: "center" }}>
        Tap to complete · Hold to skip
      </p>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
export default function HomeScreen({ onNavigate }) {
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayIndex  = Math.min(Math.max(new Date().getDay() - 1, 0), 4);
  const today       = DAYS[todayIndex] || "Monday";
  const todayBlocks = DAY_SCHEDULE[today] || DAY_SCHEDULE.Monday;

  return (
    <div className="screen">
      {/* Header */}
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>
        {greeting},<br />Kim.
      </h1>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", marginBottom: 28 }}>
        Begin with what is in front of you.
      </p>

      <OutdoorTracker />
      <HabitTracker />

      <div style={{ height: 1, background: "var(--rule)", margin: "8px 0 28px" }} />

      <MotherCulture />

      <div style={{ height: 1, background: "var(--rule)", margin: "0 0 28px" }} />

      <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} />

      {/* Quick begin */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BookIcon />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Quick Begin</p>
        </div>
        <button className="btn-text" onClick={() => onNavigate("narration")}>Write a Narration</button>
        <button className="btn-text" onClick={() => onNavigate("lilies")}>Open Consider the Lilies</button>
        <button className="btn-text" onClick={() => onNavigate("outdoors")}>Step Outside</button>
      </div>
    </div>
  );
}
