import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Enrichment options from seed.js
const ENRICHMENT_OPTIONS = [
  { id: "artist", label: "Artist Study", desc: "Picture study — observe, narrate, sketch" },
  { id: "poet", label: "Poet & Poetry Study", desc: "Read aloud twice; what image stayed?" },
  { id: "bio", label: "Biography & Citizenship", desc: "A life worth knowing; stories of virtue" },
  { id: "folk", label: "Folk Song & Recitation", desc: "Sing together; practice recitation" },
  { id: "composer", label: "Composer Study", desc: "Listen to one piece all the way through" },
  { id: "hymn", label: "Hymn Study", desc: "Sing slowly; let words land" },
  { id: "nature", label: "Nature Walk", desc: "Observe together; no agenda" },
  { id: "music", label: "Music Study", desc: "Listen; observe; appreciate" },
];

export default function BeautyLoopEditor({ settings }) {
  const userId = settings?.userId;
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [beautyLoops, setBeautyLoops] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load beauty loops from Supabase on mount
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadBeautyLoops = async () => {
      try {
        const { data, error } = await supabase
          .from("beauty_loops")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (data) {
          setBeautyLoops(data.loops || {});
        } else if (error?.code === "PGRST116") {
          // No record yet, create one
          const { data: newLoops } = await supabase
            .from("beauty_loops")
            .insert({
              user_id: userId,
              loops: {},
            })
            .select()
            .single();
          if (newLoops) setBeautyLoops(newLoops.loops || {});
        }
      } catch (err) {
        console.error("Error loading beauty loops:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBeautyLoops();
  }, [userId]);

  // Save to Supabase
  const saveBeautyLoops = async (updates) => {
    if (!userId) return;
    setSaving(true);
    try {
      await supabase
        .from("beauty_loops")
        .update({ loops: updates })
        .eq("user_id", userId);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle enrichment for a day
  const toggleEnrichment = (enrichmentId) => {
    const dayLoops = beautyLoops[selectedDay] || [];
    const index = dayLoops.findIndex((item) => item.id === enrichmentId);

    let newDayLoops;
    if (index >= 0) {
      // Remove
      newDayLoops = dayLoops.filter((_, i) => i !== index);
    } else {
      // Add
      newDayLoops = [
        ...dayLoops,
        { id: enrichmentId, label: ENRICHMENT_OPTIONS.find((e) => e.id === enrichmentId)?.label, note: "" },
      ];
    }

    const newLoops = { ...beautyLoops, [selectedDay]: newDayLoops };
    setBeautyLoops(newLoops);
    saveBeautyLoops(newLoops);
  };

  // Update note for an enrichment item
  const updateNote = (enrichmentId, note) => {
    const dayLoops = beautyLoops[selectedDay] || [];
    const newDayLoops = dayLoops.map((item) =>
      item.id === enrichmentId ? { ...item, note } : item
    );

    const newLoops = { ...beautyLoops, [selectedDay]: newDayLoops };
    setBeautyLoops(newLoops);
    saveBeautyLoops(newLoops);
  };

  const dayLoops = beautyLoops[selectedDay] || [];
  const selectedEnrichments = dayLoops.map((item) => item.id);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)" }}>
          Loading beauty loops…
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 18px 24px" }}>
      <p className="eyebrow" style={{ marginBottom: 16 }}>Beauty Loop · Customize Each Day</p>

      {/* Day Pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "7px 14px",
              borderRadius: 20,
              border: `1.5px solid ${selectedDay === day ? "var(--sage)" : "var(--rule)"}`,
              background: selectedDay === day ? "var(--sage)" : "var(--cream)",
              cursor: "pointer",
              fontSize: 11,
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

      {/* Selected Enrichments for This Day */}
      {dayLoops.length > 0 && (
        <div style={{ marginBottom: 24, padding: "16px", background: "var(--sage-bg)", borderRadius: 3, border: "1px solid var(--sage-md)" }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
            Selected for {selectedDay}
          </p>
          {dayLoops.map((item) => (
            <div key={item.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid rgba(169,183,134,.2)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "var(--ink)", margin: 0 }}>
                  {item.label}
                </p>
                <button
                  onClick={() => toggleEnrichment(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "var(--ink-faint)",
                  }}>
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="What are you studying?"
                value={item.note || ""}
                onChange={(e) => updateNote(item.id, e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--cream)",
                  border: "1px solid var(--rule)",
                  borderRadius: 2,
                  padding: "7px 10px",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "var(--ink-lt)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Available Enrichments */}
      <div>
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>
          Available Enrichments
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ENRICHMENT_OPTIONS.map((enrichment) => {
            const isSelected = selectedEnrichments.includes(enrichment.id);
            return (
              <button
                key={enrichment.id}
                onClick={() => toggleEnrichment(enrichment.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 12px",
                  background: isSelected ? "var(--sage-bg)" : "var(--cream)",
                  border: `1px solid ${isSelected ? "var(--sage)" : "var(--rule)"}`,
                  borderRadius: 2,
                  cursor: "pointer",
                  textAlign: "left",
                  opacity: isSelected ? 1 : 0.7,
                  transition: "all .2s",
                }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: `1.5px solid ${isSelected ? "var(--sage)" : "var(--rule)"}`,
                    background: isSelected ? "var(--sage)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                  {isSelected && (
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", color: "var(--ink)", margin: "0 0 3px 0" }}>
                    {enrichment.label}
                  </p>
                  <p style={{ fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", margin: 0, lineHeight: 1.4 }}>
                    {enrichment.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {saving && (
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", color: "var(--sage)", marginTop: 12, textAlign: "center" }}>
          Saving…
        </p>
      )}
    </div>
  );
}
