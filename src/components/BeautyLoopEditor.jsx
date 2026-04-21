// Add this to your PlannerScreen or Settings area
// Lets you pick which block gets the beauty loop that day

import { useState, useEffect } from "react";

const BEAUTY_ANCHOR_KEY = "tend_beauty_anchor";

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

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function BeautyLoopAnchorEditor() {
  const [anchors, setAnchors] = useState({});
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load anchors from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BEAUTY_ANCHOR_KEY) || "{}");
      setAnchors(saved);
    } catch (e) {
      setAnchors({});
    }
    setLoading(false);
  }, []);

  // Get available subjects for the selected day from DAY_SCHEDULE
  useEffect(() => {
    // Import DAY_SCHEDULE from seed.js
    // For now, we'll use a simple approach: show common subjects
    const subjects = [
      "Rise & Shine",
      "Living Literature & Language",
      "Math",
      "History & Geography",
      "Science",
      "Outdoor Break",
      "Afternoon Pursuits",
    ];
    setAvailableSubjects(subjects);
  }, [selectedDay]);

  // Save anchor to localStorage
  const saveAnchor = (day, subject) => {
    const newAnchors = { ...anchors, [day]: subject };
    setAnchors(newAnchors);
    try {
      localStorage.setItem(BEAUTY_ANCHOR_KEY, JSON.stringify(newAnchors));
    } catch (e) {
      console.error("Error saving anchor:", e);
    }
  };

  // Remove anchor for a day
  const removeAnchor = (day) => {
    const newAnchors = { ...anchors };
    delete newAnchors[day];
    setAnchors(newAnchors);
    try {
      localStorage.setItem(BEAUTY_ANCHOR_KEY, JSON.stringify(newAnchors));
    } catch (e) {
      console.error("Error removing anchor:", e);
    }
  };

  const currentAnchor = anchors[selectedDay];

  if (loading) {
    return <p style={{ padding: "20px", textAlign: "center" }}>Loading…</p>;
  }

  return (
    <div style={{ padding: "0 18px 28px" }}>
      <p className="eyebrow" style={{ marginBottom: 16 }}>Beauty Loop · Where Does It Live?</p>

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

      {/* Current Selection */}
      {currentAnchor ? (
        <div style={{ padding: "14px 16px", background: "var(--sage-bg)", borderRadius: 3, border: "1px solid var(--sage-md)", marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>
            {selectedDay}
          </p>
          <p style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", color: "var(--ink)", margin: "0 0 10px 0" }}>
            {BEAUTY_LOOP_DEFAULTS[selectedDay]?.title}
          </p>
          <p style={{ fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", margin: "0 0 10px 0", lineHeight: 1.5 }}>
            Appears during: <strong>{currentAnchor}</strong>
          </p>
          <button
            onClick={() => removeAnchor(selectedDay)}
            style={{
              background: "none",
              border: "1px solid var(--sage)",
              borderRadius: 2,
              padding: "6px 12px",
              fontSize: 10,
              fontFamily: "'Lato', sans-serif",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--sage)",
              cursor: "pointer",
            }}>
            Change Placement
          </button>
        </div>
      ) : (
        <div style={{ padding: "14px 16px", background: "#F5F3F1", borderRadius: 3, border: "1px solid #E8DCD3", marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>
            {selectedDay}
          </p>
          <p style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", color: "var(--ink)", margin: "0 0 6px 0" }}>
            {BEAUTY_LOOP_DEFAULTS[selectedDay]?.title}
          </p>
          <p style={{ fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)" }}>
            Not anchored to a block yet. Choose one below.
          </p>
        </div>
      )}

      {/* Subject Options */}
      <div>
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>
          Which block gets the beauty loop?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {availableSubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => saveAnchor(selectedDay, subject)}
              style={{
                padding: "10px 12px",
                background: currentAnchor === subject ? "var(--sage-bg)" : "var(--cream)",
                border: `1px solid ${currentAnchor === subject ? "var(--sage)" : "var(--rule)"}`,
                borderRadius: 2,
                cursor: "pointer",
                textAlign: "left",
                fontSize: 13,
                fontFamily: "'Playfair Display', serif",
                color: currentAnchor === subject ? "var(--sage)" : "var(--ink)",
                transition: "all .2s",
              }}>
                {currentAnchor === subject && "✓ "}
                {subject}
              </button>
            ))}
        </div>
      </div>

      <p style={{ fontSize: 11, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", marginTop: 16, textAlign: "center" }}>
        The beauty loop card will appear within that block on your home screen.
      </p>
    </div>
  );
}

// ─── HELPER FUNCTION ────────────────────────────────────────────────────────
// Use this in TodaySchedule to check if a block should show the beauty loop

export function getBeautyLoopAnchor() {
  try {
    return JSON.parse(localStorage.getItem(BEAUTY_ANCHOR_KEY) || "{}");
  } catch {
    return {};
  }
}

export function shouldShowBeautyInBlock(today, blockSubject) {
  const anchors = getBeautyLoopAnchor();
  const anchoredBlock = anchors[today];
  if (!anchoredBlock) return false;
  // Simple string match
  return blockSubject.toLowerCase().includes(anchoredBlock.toLowerCase());
}
