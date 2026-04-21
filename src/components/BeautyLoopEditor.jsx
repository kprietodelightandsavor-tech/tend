import { useState, useEffect } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const BEAUTY_LOOP_DEFAULTS = {
  Monday: {
    title: "Artist Study",
    description: "Put one print on the table. Look for 2–3 minutes in silence. Narrate what you see. Done.",
    rotation: "6-week rotation per artist",
    note: "",
  },
  Tuesday: {
    title: "Poetry",
    description: "One poem by your term's poet. Read once slowly. Read again. Don't analyze. Just receive.",
    rotation: "One per term",
    note: "",
  },
  Wednesday: {
    title: "Composer / Hymn Study",
    description: "Play one piece while the kids draw or sip tea. That's the whole lesson.",
    rotation: "6-week rotation per composer",
    note: "",
  },
  Thursday: {
    title: "Co-op Day",
    description: "No beauty loop needed.",
    rotation: "",
    note: "",
  },
  Friday: {
    title: "Citizenship / Biography OR Folk Song",
    description: "Alternate weeks, or pick one per term.",
    rotation: "",
    note: "",
  },
  Saturday: {
    title: "Optional",
    description: "Rest or revisit something from the week.",
    rotation: "",
    note: "",
  },
  Sunday: {
    title: "Optional",
    description: "Sabbath — no school work.",
    rotation: "",
    note: "",
  },
};

const BEAUTY_LOOP_STORAGE_KEY = "tend_beauty_loops_custom";

export default function BeautyLoopEditor() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [loops, setLoops] = useState({});
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BEAUTY_LOOP_STORAGE_KEY) || "{}");
      // Merge with defaults so all days are always present
      const merged = { ...BEAUTY_LOOP_DEFAULTS };
      Object.keys(saved).forEach((day) => {
        merged[day] = { ...BEAUTY_LOOP_DEFAULTS[day], ...saved[day] };
      });
      setLoops(merged);
    } catch (e) {
      setLoops(BEAUTY_LOOP_DEFAULTS);
    }
    setLoading(false);
  }, []);

  // Save to localStorage
  const saveToStorage = (newLoops) => {
    try {
      localStorage.setItem(BEAUTY_LOOP_STORAGE_KEY, JSON.stringify(newLoops));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  const updateDay = (day, field, value) => {
    const newLoops = {
      ...loops,
      [day]: {
        ...loops[day],
        [field]: value,
      },
    };
    setLoops(newLoops);
    saveToStorage(newLoops);
  };

  const resetToDefaults = () => {
    setLoops(BEAUTY_LOOP_DEFAULTS);
    localStorage.removeItem(BEAUTY_LOOP_STORAGE_KEY);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)" }}>
          Loading…
        </p>
      </div>
    );
  }

  const current = loops[selectedDay] || {};

  return (
    <div style={{ padding: "0 18px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>Beauty Loop · Weekly Rhythm</p>
        <button
          onClick={resetToDefaults}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
            textDecoration: "underline",
          }}>
          Reset
        </button>
      </div>

      {/* Day Pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              border: `1.5px solid ${selectedDay === day ? "var(--sage)" : "var(--rule)"}`,
              background: selectedDay === day ? "var(--sage)" : "var(--cream)",
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "'Lato', sans-serif",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: selectedDay === day ? "white" : "var(--ink-faint)",
              transition: "all .2s",
            }}>
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Current Day Editor */}
      <div style={{ padding: "16px", background: "var(--sage-bg)", borderRadius: 3, border: "1px solid var(--sage-md)" }}>
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
          {selectedDay}
        </p>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", display: "block", marginBottom: 6 }}>
            Enrichment Title
          </label>
          <input
            type="text"
            value={current.title || ""}
            onChange={(e) => updateDay(selectedDay, "title", e.target.value)}
            style={{
              width: "100%",
              background: "var(--cream)",
              border: "1px solid var(--rule)",
              borderRadius: 2,
              padding: "8px 10px",
              fontFamily: "'Playfair Display', serif",
              fontSize: 14,
              color: "var(--ink)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", display: "block", marginBottom: 6 }}>
            How to Do It
          </label>
          <textarea
            value={current.description || ""}
            onChange={(e) => updateDay(selectedDay, "description", e.target.value)}
            rows={3}
            style={{
              width: "100%",
              background: "var(--cream)",
              border: "1px solid var(--rule)",
              borderRadius: 2,
              padding: "8px 10px",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 13,
              color: "var(--ink-lt)",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>

        {/* Rotation */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", display: "block", marginBottom: 6 }}>
            Rotation / Duration
          </label>
          <input
            type="text"
            value={current.rotation || ""}
            onChange={(e) => updateDay(selectedDay, "rotation", e.target.value)}
            placeholder="e.g., 6-week rotation per artist"
            style={{
              width: "100%",
              background: "var(--cream)",
              border: "1px solid var(--rule)",
              borderRadius: 2,
              padding: "8px 10px",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 12,
              color: "var(--ink-lt)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Personal Notes */}
        <div>
          <label style={{ fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", display: "block", marginBottom: 6 }}>
            Your Notes (What You're Studying This Week)
          </label>
          <textarea
            value={current.note || ""}
            onChange={(e) => updateDay(selectedDay, "note", e.target.value)}
            placeholder="e.g., Monet's water lilies, Mary Oliver poems, Debussy Clair de Lune..."
            rows={2}
            style={{
              width: "100%",
              background: "var(--cream)",
              border: "1px solid var(--rule)",
              borderRadius: 2,
              padding: "8px 10px",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 13,
              color: "var(--ink)",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {/* Preview */}
      <div style={{ marginTop: 20, padding: "14px", background: "var(--cream)", borderRadius: 3, border: "1px solid var(--rule)" }}>
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 10 }}>
          How It Appears on Home Screen
        </p>
        <p style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", color: "var(--ink)", margin: "0 0 6px 0" }}>
          {current.title}
        </p>
        <p style={{ fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.6, margin: "0 0 8px 0" }}>
          {current.description}
        </p>
        {current.rotation && (
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", color: "var(--sage)", margin: "0 0 6px 0" }}>
            {current.rotation}
          </p>
        )}
        {current.note && (
          <p style={{ fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--sage)", margin: 0 }}>
            ✦ {current.note}
          </p>
        )}
      </div>

      <p style={{ fontSize: 11, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", marginTop: 16, textAlign: "center" }}>
        Changes save automatically to your device.
      </p>
    </div>
  );
}
