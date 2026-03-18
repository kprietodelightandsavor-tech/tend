import { useState } from "react";
import { DAYS, DAY_SCHEDULE } from "../data/seed";

// ─── WEEKLY OUTDOOR TRACKER ───────────────────────────────────────────────────
const OUTDOOR_GOAL_HOURS = 15;

function OutdoorTracker() {
  const [minutes, setMinutes] = useState(347); // ~5.8 hrs — replace with real state/storage later
  const hours = Math.floor(minutes / 60);
  const mins  = minutes % 60;
  const pct   = Math.min(minutes / (OUTDOOR_GOAL_HOURS * 60), 1);

  const addMinutes = (n) => setMinutes(m => Math.max(0, m + n));

  // SVG arc math
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <p className="eyebrow" style={{ marginBottom: 14 }}>Outside This Week</p>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

        {/* Arc circle */}
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
            {/* Track */}
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--rule)" strokeWidth="5" />
            {/* Fill */}
            <circle
              cx="40" cy="40" r={r} fill="none"
              stroke="var(--sage)" strokeWidth="5"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray .5s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span className="serif" style={{ fontSize: 15, color: "var(--sage)", lineHeight: 1 }}>
              {hours}<span style={{ fontSize: 10 }}>h</span>{mins > 0 ? <span>{mins}<span style={{ fontSize: 10 }}>m</span></span> : null}
            </span>
          </div>
        </div>

        {/* Text + buttons */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: "var(--ink)", fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>
            {hours >= OUTDOOR_GOAL_HOURS
              ? "Goal reached this week ✦"
              : `${OUTDOOR_GOAL_HOURS - hours}h ${mins > 0 ? `${60 - mins}m` : ""} to go`}
          </p>
          <p className="caption italic" style={{ marginBottom: 12 }}>Goal: {OUTDOOR_GOAL_HOURS} hrs / week</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(n => (
              <button key={n} onClick={() => addMinutes(n)}
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

// ─── DAILY HABIT TRACKER ──────────────────────────────────────────────────────
const HABIT_LIST = [
  { id: 1, name: "Attention",    emoji: "👁" },
  { id: 2, name: "Narration",    emoji: "🗣" },
  { id: 3, name: "Outdoor Time", emoji: "🌿" },
  { id: 4, name: "Stillness",    emoji: "🕊" },
  { id: 5, name: "Orderly Work", emoji: "📖" },
];

const WEEK_DAYS = ["M", "T", "W", "T", "F"];

function HabitTracker() {
  // checked[habitId][dayIndex] = true/false
  const [checked, setChecked] = useState({});

  const toggle = (id, day) => {
    setChecked(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [day]: !(prev[id]?.[day]) },
    }));
  };

  const todayIdx = Math.min(new Date().getDay() - 1, 4);

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <p className="eyebrow" style={{ marginBottom: 14 }}>Habits This Week</p>

      {/* Day header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <div style={{ flex: 1 }} />
        {WEEK_DAYS.map((d, i) => (
          <div key={i} style={{
            width: 28, textAlign: "center",
            fontSize: 10, letterSpacing: ".08em",
            fontFamily: "'Lato', sans-serif",
            color: i === todayIdx ? "var(--sage)" : "var(--ink-faint)",
            fontWeight: i === todayIdx ? 400 : 300,
          }}>
            {d}
          </div>
        ))}
      </div>

      {HABIT_LIST.map(h => {
        const dayChecks = checked[h.id] || {};
        const count = Object.values(dayChecks).filter(Boolean).length;
        return (
          <div key={h.id} style={{
            display: "flex", alignItems: "center",
            padding: "9px 0", borderTop: "1px solid var(--rule)",
          }}>
            {/* Habit name + progress */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{h.emoji}</span>
                <span style={{ fontSize: 13, color: "var(--ink)", fontFamily: "'Playfair Display', serif" }}>{h.name}</span>
              </div>
              {/* Mini progress bar */}
              <div style={{ height: 2, background: "var(--rule)", borderRadius: 1, width: 60 }}>
                <div style={{
                  height: 2, background: "var(--sage)", borderRadius: 1,
                  width: `${(count / 5) * 100}%`, transition: "width .3s ease",
                }} />
              </div>
            </div>
            {/* Day dots */}
            {WEEK_DAYS.map((_, i) => (
              <button key={i} onClick={() => toggle(h.id, i)}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: `1.5px solid ${dayChecks[i] ? "var(--sage)" : "var(--rule)"}`,
                  background: dayChecks[i] ? "var(--sage)" : "none",
                  cursor: "pointer", transition: "all .2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
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
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayIndex = Math.min(new Date().getDay() - 1, 4);
  const today = DAYS[todayIndex < 0 ? 0 : todayIndex] || "Monday";
  const todayBlocks = DAY_SCHEDULE[today] || DAY_SCHEDULE.Monday;

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>
        {greeting},<br />Kim.
      </h1>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", marginBottom: 28 }}>
        Begin with what is in front of you.
      </p>

      {/* Outdoor tracker */}
      <OutdoorTracker />

      {/* Habit tracker */}
      <HabitTracker />

      {/* Today's schedule */}
      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Today · {today}</p>
        {todayBlocks.slice(0, 3).map((b, i) => (
          <div key={i} style={{
            display: "flex", gap: 14, alignItems: "flex-start",
            padding: "12px 0", borderBottom: "1px solid var(--rule)",
          }}>
            <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}>
              {b.time}
            </span>
            <div>
              <p style={{ fontSize: 15, color: "var(--ink)", fontFamily: "'Playfair Display', serif" }}>{b.subject}</p>
              {b.note && <p className="caption italic" style={{ marginTop: 2 }}>{b.note}</p>}
            </div>
          </div>
        ))}
        <button className="btn-text" style={{ marginTop: 8 }} onClick={() => onNavigate("planner")}>
          See full day
        </button>
      </div>

      {/* Quick actions */}
      <div>
        <p className="eyebrow" style={{ marginBottom: 4 }}>Quick Begin</p>
        <button className="btn-text" onClick={() => onNavigate("narration")}>Write a Narration</button>
        <button className="btn-text" onClick={() => onNavigate("lilies")}>Open Consider the Lilies</button>
        <button className="btn-text" onClick={() => onNavigate("outdoors")}>Step Outside</button>
      </div>
    </div>
  );
}
