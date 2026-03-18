import { useState, useRef } from "react";
import { DAYS, DAY_SCHEDULE } from "../data/seed";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Leaf: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/>
    </svg>
  ),
  Feather: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
      <line x1="16" y1="8" x2="2" y2="22"/>
      <line x1="17.5" y1="15" x2="9" y2="15"/>
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  Book: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  // Habit-specific icons — sage
  Eye: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Voice: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  Outdoors: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-8 4 5 3-3 4 6H3z"/>
      <circle cx="18" cy="6" r="2"/>
    </svg>
  ),
  Stillness: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  Orderly: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
};

// ─── MOTHER CULTURE PROMPTS ───────────────────────────────────────────────────
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

// Which block subjects are "free" / independent (show mother's note)
const FREE_BLOCK_KEYWORDS = [
  "rise & shine", "rise and shine", "free", "rest", "independent",
  "chores", "piano", "outdoor", "nature", "afternoon",
];

const isFreeBlock = (subject) =>
  FREE_BLOCK_KEYWORDS.some(k => subject.toLowerCase().includes(k));

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
        <Icon.Leaf />
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
              : `${OUTDOOR_GOAL_HOURS - hours} hr${mins > 0 ? ` ${60 - mins} min` : ""} to go`}
          </p>
          <p className="caption italic" style={{ marginBottom: 12 }}>Goal: {OUTDOOR_GOAL_HOURS} hrs / week</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(n => (
              <button key={n} onClick={() => setMinutes(m => m + n)}
                style={{
                  background: "var(--sage-bg)", border: "1px solid var(--sage-md)",
                  borderRadius: 2, padding: "5px 10px", fontSize: 11,
                  fontFamily: "'Lato', sans-serif", color: "var(--sage)",
                  cursor: "pointer", letterSpacing: ".06em",
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

// ─── MOTHER CULTURE ───────────────────────────────────────────────────────────
function MotherCulture() {
  const prompts = MOTHER_CULTURE[new Date().getDay()];
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <Icon.Feather />
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
    blocks.map((b, i) => ({ ...b, id: i, status: "pending", motherNote: "" }))
  );
  const [editingNote, setEditingNote] = useState(null);
  const longPressTimer = useRef(null);

  const toggleDone = (id) => {
    setItems(prev => {
      const target = prev.find(b => b.id === id);
      if (!target) return prev;

      // if already done — undo back to pending, move back to position by id
      if (target.status === "done") {
        const restored = prev.map(b => b.id === id ? { ...b, status: "pending" } : b);
        return restored.sort((a, b) => a.id - b.id);
      }

      // mark done, slide to bottom
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

  const saveNote = (id, note) => {
    setItems(prev => prev.map(b => b.id === id ? { ...b, motherNote: note } : b));
    setEditingNote(null);
  };

  const startLongPress = (id) => {
    longPressTimer.current = setTimeout(() => {
      cancelLongPress();
      markSkipped(id);
    }, 600);
  };
  const cancelLongPress = () => clearTimeout(longPressTimer.current);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Sun />
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
          Full week <Icon.Arrow />
        </button>
      </div>

      {items.map(b => {
        const isDone    = b.status === "done";
        const isSkipped = b.status === "skipped";
        const showMother = isFreeBlock(b.subject) && !isSkipped;

        return (
          <div key={b.id} style={{ borderBottom: "1px solid var(--rule)" }}>
            <div
              onClick={() => { if (b.status !== "skipped") toggleDone(b.id); }}
              onTouchStart={() => { if (b.status === "pending") startLongPress(b.id); }}
              onTouchEnd={cancelLongPress}
              onMouseDown={() => { if (b.status === "pending") startLongPress(b.id); }}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "13px 0 6px",
                cursor: b.status !== "skipped" ? "pointer" : "default",
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
                  fontSize: 15, color: isDone ? "var(--ink-faint)" : "var(--ink)",
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
                {isDone && (
                  <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 3 }}>
                    tap to undo
                  </p>
                )}
              </div>
            </div>

            {/* Mother's quiet note — free blocks only */}
            {showMother && (
              <div style={{ paddingLeft: 58, paddingBottom: 10 }}
                onClick={e => e.stopPropagation()}>
                {editingNote === b.id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      autoFocus
                      defaultValue={b.motherNote}
                      placeholder="What will you tend during this time?"
                      onBlur={e => saveNote(b.id, e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                      style={{
                        flex: 1, background: "none", border: "none",
                        borderBottom: "1px solid var(--rule)",
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontStyle: "italic", fontSize: 14,
                        color: "var(--ink-lt)", outline: "none",
                        padding: "4px 0",
                      }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingNote(b.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic", fontSize: 14,
                      color: b.motherNote ? "var(--ink-faint)" : "var(--ink-faint)",
                      padding: 0, textAlign: "left",
                      opacity: b.motherNote ? 1 : 0.55,
                    }}
                  >
                    {b.motherNote
                      ? `✦ ${b.motherNote}`
                      : "your time · what will you tend?"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <p className="caption italic" style={{ marginTop: 14, textAlign: "center" }}>
        Tap to complete · Tap again to undo · Hold to skip
      </p>
    </div>
  );
}

// ─── HABIT TRACKER ────────────────────────────────────────────────────────────
const HABIT_LIST = [
  { id: 1, name: "Attention",    Icon: Icon.Eye      },
  { id: 2, name: "Narration",    Icon: Icon.Voice    },
  { id: 3, name: "Outdoor Time", Icon: Icon.Outdoors },
  { id: 4, name: "Stillness",    Icon: Icon.Stillness },
  { id: 5, name: "Orderly Work", Icon: Icon.Orderly  },
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
    <div className="card" style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon.Check />
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
          <div key={h.id} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--rule)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <h.Icon />
                <span style={{ fontSize: 13, color: "var(--ink)", fontFamily: "'Playfair Display', serif" }}>{h.name}</span>
              </div>
              <div style={{ height: 2, background: "var(--rule)", borderRadius: 1, width: 56 }}>
                <div style={{
                  height: 2, background: "var(--sage)", borderRadius: 1,
                  width: `${(count / 5) * 100}%`, transition: "width .3s ease",
                }} />
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

      <div style={{ height: 1, background: "var(--rule)", margin: "4px 0 28px" }} />

      <MotherCulture />

      <div style={{ height: 1, background: "var(--rule)", margin: "0 0 28px" }} />

      <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} />

      {/* Quick begin */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Icon.Book />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Quick Begin</p>
        </div>
        <button className="btn-text" onClick={() => onNavigate("narration")}>Write a Narration</button>
        <button className="btn-text" onClick={() => onNavigate("lilies")}>Open Consider the Lilies</button>
        <button className="btn-text" onClick={() => onNavigate("outdoors")}>Step Outside</button>
      </div>

      <div style={{ height: 1, background: "var(--rule)", margin: "0 0 28px" }} />

      <HabitTracker />

    </div>
  );
}
