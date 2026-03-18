import { DAYS, DAY_SCHEDULE } from "../data/seed";

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

      {/* Today's first few blocks */}
      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Today · {today}</p>
        {todayBlocks.slice(0, 3).map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "12px 0", borderBottom: "1px solid var(--rule)",
            }}
          >
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

      {/* Continue Reading */}
      <div className="card" style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Continue Reading</p>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div className="book-spine">
            <span style={{ color: "rgba(255,255,255,.5)", fontSize: 8, writingMode: "vertical-rl", letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "'Playfair Display', serif" }}>
              Macbeth
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p className="serif" style={{ fontSize: 17, marginBottom: 3 }}>Macbeth</p>
            <p className="caption italic">Act II — The Dagger Scene</p>
            <div className="progress-track" style={{ marginTop: 12 }}>
              <div className="progress-fill" style={{ width: "38%" }} />
            </div>
            <p className="caption" style={{ marginTop: 5 }}>Act II of V · 38%</p>
          </div>
        </div>
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
