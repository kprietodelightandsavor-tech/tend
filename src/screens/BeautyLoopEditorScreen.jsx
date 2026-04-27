import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { DAYS } from "../data/seed";

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

export default function BeautyLoopEditorScreen({ settings, onNavigate }) {
  const userId = settings?.userId;
  const [loops, setLoops] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load beauty loops from Supabase on mount
  useEffect(() => {
    if (!userId) return;
    loadBeautyLoops();
  }, [userId]);

  const loadBeautyLoops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("beauty_loops")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      // Initialize with defaults, then overwrite with Supabase data
      const initialized = { ...BEAUTY_LOOP_DEFAULTS };
      if (data) {
        data.forEach(loop => {
          initialized[loop.day] = {
            id: loop.id,
            title: loop.title,
            description: loop.description || "",
            rotation: loop.rotation || "",
            note: loop.note || "",
          };
        });
      }
      setLoops(initialized);
    } catch (err) {
      console.error("Error loading beauty loops:", err);
      setLoops(BEAUTY_LOOP_DEFAULTS);
    } finally {
      setLoading(false);
    }
  };

  const saveLoop = async (day, loopData) => {
    if (!userId) return;
    try {
      setSaving(true);
      const { id, ...dataWithoutId } = loopData;

      if (id) {
        // Update existing
        const { error } = await supabase
          .from("beauty_loops")
          .update({
            ...dataWithoutId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("beauty_loops")
          .insert([
            {
              user_id: userId,
              day,
              ...dataWithoutId,
            },
          ]);

        if (error) throw error;
      }

      // Reload to get fresh data
      await loadBeautyLoops();
      setEditingDay(null);
    } catch (err) {
      console.error("Error saving beauty loop:", err);
      alert("Error saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteLoop = async (day) => {
    if (!userId || !loops[day]?.id) return;
    if (!confirm(`Delete ${day}'s beauty loop?`)) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("beauty_loops")
        .delete()
        .eq("id", loops[day].id)
        .eq("user_id", userId);

      if (error) throw error;

      // Reset to default
      setLoops(prev => ({
        ...prev,
        [day]: BEAUTY_LOOP_DEFAULTS[day],
      }));
      setEditingDay(null);
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="screen">
        <p style={{ textAlign: "center", color: "var(--ink-faint)" }}>Loading beauty loops...</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Delight & Savor</p>
      <h1 className="display serif" style={{ marginBottom: 8 }}>Beauty Loop</h1>
      <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 28, lineHeight: 1.6 }}>
        One moment of beauty woven into each day. Edit what calls to your family.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
        {DAYS.map(day => {
          const loop = loops[day] || BEAUTY_LOOP_DEFAULTS[day];
          const isEditing = editingDay === day;
          const isModified = loop.id !== undefined;

          return (
            <div
              key={day}
              style={{
                padding: "16px 16px",
                background: isModified ? "var(--sage-bg)" : "#F5F3F1",
                border: `1px solid ${isModified ? "var(--sage-md)" : "#E8DCD3"}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
              onClick={() => !isEditing && setEditingDay(day)}>
              {!isEditing ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                    <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: isModified ? "var(--sage)" : "var(--ink-faint)", marginBottom: 0 }}>
                      {day}
                    </p>
                    {isModified && (
                      <span style={{ fontSize: 8, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>
                        ✦ Edited
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", color: "var(--ink)", marginBottom: 6 }}>
                    {loop.title}
                  </p>
                  <p style={{ fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5, marginBottom: 8 }}>
                    {loop.description}
                  </p>
                  {loop.rotation && (
                    <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", color: "var(--sage)", marginBottom: 0 }}>
                      {loop.rotation}
                    </p>
                  )}
                </>
              ) : (
                <div onClick={e => e.stopPropagation()}>
                  <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
                    Edit {day}
                  </p>

                  <input
                    type="text"
                    placeholder="Title"
                    defaultValue={loop.title}
                    onChange={e => setLoops(prev => ({ ...prev, [day]: { ...prev[day], title: e.target.value } }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: 10,
                      border: "1px solid var(--rule)",
                      borderRadius: 3,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />

                  <textarea
                    placeholder="Description"
                    defaultValue={loop.description}
                    onChange={e => setLoops(prev => ({ ...prev, [day]: { ...prev[day], description: e.target.value } }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: 10,
                      border: "1px solid var(--rule)",
                      borderRadius: 3,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 12,
                      minHeight: 60,
                      outline: "none",
                      resize: "vertical",
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Rotation (e.g., 6-week, per term)"
                    defaultValue={loop.rotation}
                    onChange={e => setLoops(prev => ({ ...prev, [day]: { ...prev[day], rotation: e.target.value } }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: 10,
                      border: "1px solid var(--rule)",
                      borderRadius: 3,
                      fontFamily: "'Lato', sans-serif",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Note (optional)"
                    defaultValue={loop.note}
                    onChange={e => setLoops(prev => ({ ...prev, [day]: { ...prev[day], note: e.target.value } }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: 12,
                      border: "1px solid var(--rule)",
                      borderRadius: 3,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => saveLoop(day, loops[day])}
                      disabled={saving}
                      style={{
                        flex: 1,
                        background: "var(--sage)",
                        color: "white",
                        border: "none",
                        borderRadius: 2,
                        padding: "8px",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 10,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        cursor: saving ? "wait" : "pointer",
                        opacity: saving ? 0.7 : 1,
                      }}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingDay(null)}
                      style={{
                        flex: 1,
                        background: "none",
                        border: "1px solid var(--rule)",
                        borderRadius: 2,
                        padding: "8px",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 10,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}>
                      Cancel
                    </button>
                  </div>

                  {isModified && (
                    <button
                      onClick={() => deleteLoop(day)}
                      disabled={saving}
                      style={{
                        width: "100%",
                        marginTop: 8,
                        background: "none",
                        border: "1px solid #D9534F",
                        color: "#D9534F",
                        borderRadius: 2,
                        padding: "6px",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 10,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}>
                      Reset to default
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 20 }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            width: "100%",
            background: "var(--sage)",
            color: "white",
            border: "none",
            borderRadius: 2,
            padding: "12px",
            fontFamily: "'Lato', sans-serif",
            fontSize: 11,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
