// src/components/SummerModeToggle.jsx
// Drop this into your SettingsScreen — usually near the top of the
// settings list. It's a self-contained toggle that reads/writes to
// the user_settings table (which you'll create with summer-mode.sql).

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function SummerModeToggle({ userId, onModeChange }) {
  const [mode, setMode] = useState("school");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadMode();
  }, [userId]);

  const loadMode = async () => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("mode")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      if (data?.mode) setMode(data.mode);
    } catch (err) {
      console.error("Error loading mode:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = async () => {
    if (saving) return;
    const newMode = mode === "summer" ? "school" : "summer";
    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: userId,
          mode: newMode,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMode(newMode);
      if (onModeChange) onModeChange(newMode);
    } catch (err) {
      console.error("Error saving mode:", err);
      alert("Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const isSummer = mode === "summer";

  return (
    <div style={{
      padding: "16px",
      background: isSummer ? "#EEF2F7" : "var(--cream)",
      border: `1px solid ${isSummer ? "#A8BCD3" : "var(--rule)"}`,
      borderRadius: 4,
      marginBottom: 20,
      transition: "all .3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 10,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: isSummer ? "#7A95B5" : "var(--ink-faint)",
            marginBottom: 6,
          }}>
            Rhythm
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            color: "var(--ink)",
            marginBottom: 4,
          }}>
            {isSummer ? "Summer" : "School Year"}
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "var(--ink-faint)",
            lineHeight: 1.5,
          }}>
            {isSummer
              ? "Daily anchors, personal mornings, free afternoons, weekend categories."
              : "Full schedule with Beauty Loop, Rise & Shine, and habit focus."}
          </p>
        </div>

        <button
          onClick={toggleMode}
          disabled={saving}
          style={{
            position: "relative",
            width: 52,
            height: 30,
            borderRadius: 30,
            border: "none",
            background: isSummer ? "#7A95B5" : "var(--rule)",
            cursor: saving ? "wait" : "pointer",
            transition: "background .3s",
            flexShrink: 0,
            marginLeft: 16,
            opacity: saving ? 0.6 : 1,
          }}
          aria-label={`Switch to ${isSummer ? "school year" : "summer"} mode`}
        >
          <div style={{
            position: "absolute",
            top: 3,
            left: isSummer ? 25 : 3,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "white",
            transition: "left .3s",
            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          }} />
        </button>
      </div>

      {isSummer && (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: 12,
          color: "#7A95B5",
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid #C5D3E2",
          lineHeight: 1.5,
        }}>
          Toggle off in fall to return to your school-year schedule with everything intact.
        </p>
      )}
    </div>
  );
}
