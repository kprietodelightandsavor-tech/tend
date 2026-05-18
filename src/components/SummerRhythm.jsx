// src/components/SummerRhythm.jsx
// Quieter summer home view, modeled on Kim's Summer Rhythm poster.
// Folds Family Bible Study + Beauty + editable subject fields
// into a single expandable "Reading & learning" panel.

import { useState, useEffect } from "react";
import {
  CM_QUOTES,
  DAYS,
  NATURE_DAYS,
  NATURE_LOOP_STEPS,
  getNatureLoopStep,
  advanceNatureLoop,
} from "../data/seed";
import { HABIT_TERM, HABIT_MONTHS } from "../data/habit-term-seed";
import { isVolunteerTuesday } from "../data/beauty-seed";
import {
  getActivityChoices,
  getTomorrowActivity,
  isEveningSetupTime,
} from "../data/summer-seed";
import {
  FAMILY_BIBLE_STREAMS,
  getStreamView,
  loadAllStreamStates,
  applyMondayShifts,
  markStreamComplete,
  undoStreamComplete,
} from "../data/family-bible-seed";
import { supabase } from "../lib/supabase";

// ─── DATA LAYER: editable subject fields ─────────────────────────────
async function loadCurrentStudies(userId) {
  if (!userId) return {};
  try {
    const { data, error } = await supabase
      .from("current_studies")
      .select("subject, content")
      .eq("user_id", userId);
    if (error) throw error;
    const map = {};
    (data || []).forEach((r) => { map[r.subject] = r.content; });
    return map;
  } catch (err) {
    console.error("Error loading current studies:", err);
    return {};
  }
}

async function saveCurrentStudy(userId, subject, content) {
  if (!userId) return null;
  try {
    const { error } = await supabase
      .from("current_studies")
      .upsert(
        {
          user_id: userId,
          subject,
          content: content || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,subject" }
      );
    if (error) throw error;
    return content;
  } catch (err) {
    console.error("Error saving current study:", err);
    return null;
  }
}

// ─── EDITABLE STUDY FIELD ────────────────────────────────────────────
function StudyField({ label, value, placeholder, sublabel, onSave, checked, onToggleCheck }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  useEffect(() => { setDraft(value || ""); }, [value]);

  const commit = () => {
    onSave(draft.trim() || null);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value || "");
    setEditing(false);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            onClick={onToggleCheck}
            style={{
              width: 13,
              height: 13,
              borderRadius: 2,
              border: `1.5px solid ${checked ? "var(--sage)" : "var(--rule)"}`,
              background: checked ? "var(--sage)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {checked && (
              <svg width="7" height="7" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: checked ? "var(--ink-faint)" : "var(--ink-lt)", margin: 0 }}>
            {label}
            {sublabel && (
              <span style={{ textTransform: "none", letterSpacing: 0, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "var(--ink-faint)", marginLeft: 4 }}>
                {sublabel}
              </span>
            )}
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".06em", color: "var(--ink-faint)", padding: 0 }}
          >
            edit
          </button>
        )}
      </div>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          placeholder={placeholder}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid var(--sage-md)",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "var(--ink)",
            outline: "none",
            padding: "2px 0",
            marginLeft: 20,
          }}
        />
      ) : value ? (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: 13,
          lineHeight: 1.5,
          color: checked ? "var(--ink-faint)" : "var(--ink)",
          textDecoration: checked ? "line-through" : "none",
          textDecorationColor: "var(--sage-md)",
          margin: 0,
          paddingLeft: 20,
        }}>
          {value}
        </p>
      ) : (
        <p
          onClick={() => setEditing(true)}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink-faint)", margin: 0, cursor: "pointer", opacity: 0.7, paddingLeft: 20 }}
        >
          {placeholder}
        </p>
      )}
    </div>
  );
}

// ─── BIBLE BLOCK (folded into Reading & learning) ────────────────────
function BibleBlock({ userId, isToday }) {
  const [streamStates, setStreamStates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const states = await loadAllStreamStates(userId);
      if (cancelled) return;
      const finalStates = await applyMondayShifts(userId, states);
      if (!cancelled) {
        setStreamStates(finalStates);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const handleComplete = async (streamId) => {
    if (!isToday || busy[streamId]) return;
    setBusy((prev) => ({ ...prev, [streamId]: true }));
    const newState = await markStreamComplete(userId, streamId);
    if (newState) setStreamStates((prev) => ({ ...prev, [streamId]: newState }));
    setBusy((prev) => ({ ...prev, [streamId]: false }));
  };

  const handleUndo = async (streamId) => {
    if (!isToday || busy[streamId]) return;
    setBusy((prev) => ({ ...prev, [streamId]: true }));
    const newState = await undoStreamComplete(userId, streamId);
    if (newState) setStreamStates((prev) => ({ ...prev, [streamId]: newState }));
    setBusy((prev) => ({ ...prev, [streamId]: false }));
  };

  if (loading) {
    return (
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)", margin: 0 }}>
        Loading...
      </p>
    );
  }

  return (
    <div>
      {FAMILY_BIBLE_STREAMS.map((stream, idx) => {
        const state = streamStates?.[stream.id];
        const view = getStreamView(stream, state);
        const isBusy = !!busy[stream.id];
        const isLastStream = idx === FAMILY_BIBLE_STREAMS.length - 1;

        if (!view.active && view.completed.length === 0) return null;

        return (
          <div
            key={stream.id}
            style={{ marginBottom: isLastStream ? 0 : 11, opacity: isBusy ? 0.5 : 1, transition: "opacity .2s" }}
          >
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--sage)", margin: "0 0 4px" }}>
              {stream.label}
            </p>

            {/* completed readings — grayed, struck, last one tappable to undo */}
            {view.completed.map((reading, i) => {
              const isLastDone = i === view.completed.length - 1;
              return (
                <div
                  key={reading.id}
                  onClick={() => isToday && isLastDone && handleUndo(stream.id)}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    padding: "2px 0",
                    cursor: isToday && isLastDone && !isBusy ? "pointer" : "default",
                  }}
                >
                  <span style={{
                    width: 13,
                    height: 13,
                    borderRadius: 2,
                    border: "1.5px solid var(--sage)",
                    background: "var(--sage)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="7" height="7" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "var(--ink-faint)",
                    textDecoration: "line-through",
                    textDecorationColor: "var(--sage-md)",
                  }}>
                    {reading.reference}
                  </span>
                </div>
              );
            })}

            {/* next reading — tappable to mark read */}
            {view.active && (
              <div
                onClick={() => handleComplete(stream.id)}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "2px 0",
                  cursor: isToday && !isBusy ? "pointer" : "default",
                }}
              >
                <span style={{
                  width: 13,
                  height: 13,
                  borderRadius: 2,
                  border: "1.5px solid var(--rule)",
                  background: "none",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "var(--ink)",
                }}>
                  {view.active.reference}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── BEAUTY ROTATION ─────────────────────────────────────────────────
// Full enrichment set — any can be picked as an override.
const ENRICHMENTS = [
  { id: "artist", label: "Artist" },
  { id: "composer", label: "Composer" },
  { id: "natural_history", label: "Natural History" },
  { id: "recitation", label: "Recitation" },
  { id: "poetry", label: "Poetry" },
  { id: "folk_song", label: "Folk Song" },
  { id: "hymn", label: "Hymn" },
  { id: "biography", label: "Biography" },
  { id: "nature", label: "Nature Walk" },
  { id: "music", label: "Music" },
];
const ENRICHMENT_LABEL = ENRICHMENTS.reduce((m, e) => { m[e.id] = e.label; return m; }, {});

// Weekly rotation. Pairs alternate by A/B week parity.
const BEAUTY_ROTATION = {
  Monday: { pair: ["artist", "composer"] },
  Tuesday: { single: "natural_history" },
  Wednesday: { single: "recitation" },
  Friday: { pair: ["poetry", "folk_song"] },
};

// Anchor: Monday May 4, 2026 = Week A. Even weeks A, odd weeks B.
const BEAUTY_ANCHOR = new Date("2026-05-04T00:00:00");
function getBeautyWeekParity(date) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSince = Math.floor((date - BEAUTY_ANCHOR) / msPerWeek);
  return (((weeksSince % 2) + 2) % 2) === 0 ? "A" : "B";
}

// Returns { options: [ids shown by default], scheduled: id|null }
function getBeautyDay(dayName, viewDate) {
  const entry = BEAUTY_ROTATION[dayName];
  if (!entry) return { options: [], scheduled: null };
  if (entry.single) return { options: [entry.single], scheduled: entry.single };
  const parity = getBeautyWeekParity(viewDate);
  const scheduled = parity === "A" ? entry.pair[0] : entry.pair[1];
  return { options: entry.pair, scheduled };
}

// ─── BEAUTY NAME FIELD (inline editable — artist or composer) ────────
function BeautyNameField({ value, placeholder, done, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  useEffect(() => { setDraft(value || ""); }, [value]);

  const commit = () => {
    onSave(draft.trim() || null);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setDraft(value || ""); setEditing(false); }
        }}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid var(--sage-md)",
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "var(--ink)",
          outline: "none",
          padding: "2px 0",
        }}
      />
    );
  }

  return (
    <p
      onClick={() => setEditing(true)}
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: 13,
        lineHeight: 1.5,
        color: done && value ? "var(--ink-faint)" : (value ? "var(--ink)" : "var(--ink-faint)"),
        textDecoration: done && value ? "line-through" : "none",
        textDecorationColor: "var(--sage-md)",
        opacity: value ? 1 : 0.7,
        margin: 0,
        cursor: "pointer",
      }}
    >
      {value || placeholder}
    </p>
  );
}

// ─── READING & LEARNING EXPANDABLE ───────────────────────────────────
function ReadingAndLearning({ userId, today, viewDate, isToday, isNatureDay }) {
  const [expanded, setExpanded] = useState(false);
  const [studies, setStudies] = useState({});

  const dateKey = viewDate.toISOString().slice(0, 10);

  // Per-day "completed today" checkmarks for the learning items
  const [doneMap, setDoneMap] = useState({});
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_learning_done") || "null");
      setDoneMap(saved?.date === dateKey ? (saved.done || {}) : {});
    } catch {
      setDoneMap({});
    }
  }, [dateKey]);

  const toggleDone = (key) => {
    if (!isToday) return;
    setDoneMap((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("tend_learning_done", JSON.stringify({ date: dateKey, done: next }));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (!userId) return;
    loadCurrentStudies(userId).then(setStudies);
  }, [userId]);

  const handleSave = async (subject, content) => {
    setStudies((prev) => ({ ...prev, [subject]: content }));
    await saveCurrentStudy(userId, subject, content);
  };

  // Beauty: the day's scheduled enrichment, with per-day override
  const beautyDay = getBeautyDay(today, viewDate);
  const [beautyFocus, setBeautyFocus] = useState(beautyDay.scheduled);
  const [beautyShowAll, setBeautyShowAll] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_beauty_focus") || "null");
      if (saved?.date === dateKey && saved.focus) {
        setBeautyFocus(saved.focus);
        setBeautyShowAll(false);
        return;
      }
    } catch {}
    setBeautyFocus(beautyDay.scheduled);
    setBeautyShowAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const selectBeautyFocus = (id) => {
    setBeautyFocus(id);
    try {
      localStorage.setItem("tend_beauty_focus", JSON.stringify({ date: dateKey, focus: id }));
    } catch {}
  };

  return (
    <>
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "4px 0 0",
          padding: "6px 12px 6px 8px",
          background: expanded ? "var(--sage-bg)" : "rgba(232, 226, 213, 0.35)",
          borderRadius: 4,
          cursor: "pointer",
          transition: "background .2s",
        }}
      >
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, margin: 0, color: "var(--ink)", display: "flex", alignItems: "center", gap: 7 }}>
          Reading &amp; learning
          {isNatureDay && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="nature day">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6" />
            </svg>
          )}
        </p>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", color: "var(--ink-faint)" }}>
          {expanded ? "close" : "open"}
        </span>
      </div>

      {expanded && (
        <div
          style={{
            margin: "8px 0 4px",
            padding: "14px 18px",
            background: "rgba(232, 226, 213, 0.25)",
            borderLeft: "1.5px solid var(--sage-md)",
            borderRadius: "0 4px 4px 0",
          }}
        >
          {/* BIBLE */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: 0 }}>BIBLE</p>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 8, letterSpacing: ".12em", color: "var(--ink-faint)", fontStyle: "italic" }}>
                picking up where we left off
              </span>
            </div>
            <BibleBlock userId={userId} isToday={isToday} />
          </div>

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          {/* BEAUTY — enrichment rotation */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
              <div
                onClick={() => toggleDone("beauty")}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 2,
                  border: `1.5px solid ${doneMap["beauty"] ? "var(--sage)" : "var(--rule)"}`,
                  background: doneMap["beauty"] ? "var(--sage)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                {doneMap["beauty"] && (
                  <svg width="7" height="7" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: doneMap["beauty"] ? "var(--ink-faint)" : "var(--ink-lt)", margin: 0 }}>BEAUTY</p>
            </div>

            {/* enrichment pills — day's scheduled by default, 'other' reveals all */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", paddingLeft: 20, marginBottom: beautyFocus ? 7 : 0 }}>
              {(beautyShowAll || beautyDay.options.length === 0
                ? ENRICHMENTS.map((e) => e.id)
                : beautyDay.options
              ).map((id) => {
                const isActive = beautyFocus === id;
                const isScheduled = beautyDay.scheduled === id;
                return (
                  <button
                    key={id}
                    onClick={() => selectBeautyFocus(id)}
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: 9,
                      letterSpacing: ".06em",
                      color: isActive ? "white" : "var(--sage)",
                      background: isActive ? "var(--sage)" : "var(--sage-bg)",
                      border: `0.5px solid ${isScheduled && !isActive ? "var(--sage)" : "var(--sage-md)"}`,
                      borderRadius: 11,
                      padding: "3px 11px",
                      cursor: "pointer",
                    }}
                  >
                    {ENRICHMENT_LABEL[id]}
                  </button>
                );
              })}
              {beautyDay.options.length > 0 && (
                <button
                  onClick={() => setBeautyShowAll((v) => !v)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Lato', sans-serif",
                    fontSize: 9,
                    letterSpacing: ".08em",
                    textTransform: "lowercase",
                    color: "var(--ink-faint)",
                    padding: "3px 4px",
                  }}
                >
                  {beautyShowAll ? "less" : "other \u203a"}
                </button>
              )}
            </div>

            {/* name for the selected enrichment */}
            {beautyFocus && (
              <div style={{ paddingLeft: 20 }}>
                <BeautyNameField
                  value={studies[beautyFocus]}
                  placeholder="Tap to add what you are studying"
                  done={doneMap["beauty"]}
                  onSave={(content) => handleSave(beautyFocus, content)}
                />
              </div>
            )}
          </div>

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          {/* NATURE STUDY — only on nature days */}
          {isNatureDay && (
            <>
              <div style={{ marginBottom: 14 }}>
                <NatureStudySection isToday={isToday} viewDate={viewDate} />
              </div>
              <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>
            </>
          )}

          <StudyField
            label="FAMILY READ-ALOUD"
            value={studies["family_read_aloud"]}
            placeholder="Tap to add what you are reading"
            onSave={(content) => handleSave("family_read_aloud", content)}
            checked={!!doneMap["family_read_aloud"]}
            onToggleCheck={() => toggleDone("family_read_aloud")}
          />

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          <StudyField
            label="MATH"
            value={studies["math"]}
            placeholder="Tap to add what you are studying"
            onSave={(content) => handleSave("math", content)}
            checked={!!doneMap["math"]}
            onToggleCheck={() => toggleDone("math")}
          />

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          <StudyField
            label="HISTORY"
            sublabel="when included"
            value={studies["history"]}
            placeholder="Tap to add what you are studying"
            onSave={(content) => handleSave("history", content)}
            checked={!!doneMap["history"]}
            onToggleCheck={() => toggleDone("history")}
          />
        </div>
      )}
    </>
  );
}

// ─── BLOOM EFFECT (nature study completion) ──────────────────────────
function BloomEffect({ show }) {
  if (!show) return null;
  const palette = ["#A9B786", "#8FA374", "#C29B61", "#D4A574", "#E8C39E"];
  const flowers = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: Math.random() * 85 + 7,
    top: Math.random() * 75 + 12,
    delay: Math.random() * 0.6,
    size: 18 + Math.random() * 16,
    color: palette[Math.floor(Math.random() * palette.length)],
    rotate: Math.random() * 90 - 45,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {flowers.map((f) => (
        <svg
          key={f.id}
          width={f.size}
          height={f.size}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: `${f.left}%`,
            top: `${f.top}%`,
            color: f.color,
            opacity: 0,
            animation: `tend-bloom 2.4s ${f.delay}s ease-out forwards`,
            ["--tend-rot"]: `${f.rotate}deg`,
          }}
        >
          <g fill="currentColor" opacity="0.78">
            <circle cx="12" cy="6" r="3.4" />
            <circle cx="17.5" cy="9.5" r="3.4" />
            <circle cx="15.5" cy="16" r="3.4" />
            <circle cx="8.5" cy="16" r="3.4" />
            <circle cx="6.5" cy="9.5" r="3.4" />
          </g>
          <circle cx="12" cy="11" r="1.9" fill="#FAF6EE" />
        </svg>
      ))}
      <style>{`
        @keyframes tend-bloom {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(var(--tend-rot)); }
          25% { opacity: 1; transform: translate(-50%, -50%) scale(1.15) rotate(var(--tend-rot)); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--tend-rot)); }
          85% { opacity: 0.8; transform: translate(-50%, -50%) scale(1) rotate(var(--tend-rot)); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1) rotate(var(--tend-rot)); }
        }
      `}</style>
    </div>
  );
}

// ─── WATERCOLOR WASH (activity completion celebration) ───────────────
function WatercolorWash({ show }) {
  if (!show) return null;
  const palette = [
    "#A9B786", // sage
    "#C29B61", // amber
    "#B5C7CC", // soft sky
    "#C49E97", // dusty rose
    "#D4A574", // gold
    "#8FA374", // deep sage
    "#E8C39E", // pale amber
  ];

  const strokes = Array.from({ length: 7 }, (_, i) => {
    const y1 = 15 + Math.random() * 12;
    const y2 = 15 + Math.random() * 12;
    const y3 = 15 + Math.random() * 12;
    const y4 = 15 + Math.random() * 12;
    return {
      id: i,
      color: palette[Math.floor(Math.random() * palette.length)],
      delay: i * 0.22 + Math.random() * 0.15,
      duration: 1.4 + Math.random() * 0.6,
      top: 10 + Math.random() * 80,
      widthVw: 55 + Math.random() * 35,
      angle: Math.random() * 40 - 20,
      strokeWidth: 22 + Math.random() * 14,
      pathD: `M 5,${y1} Q 100,${y2} 200,${y3} T 395,${y4}`,
    };
  });

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {strokes.map((s) => (
        <svg
          key={s.id}
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: "50%",
            width: `${s.widthVw}vw`,
            height: "60px",
            opacity: 0,
            transform: `translate(-50%, -50%) rotate(${s.angle}deg)`,
            animation: `tend-wash ${s.duration + 1.2}s ${s.delay}s ease-out forwards`,
          }}
        >
          <path
            d={s.pathD}
            stroke={s.color}
            strokeWidth={s.strokeWidth}
            strokeLinecap="round"
            fill="none"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: `tend-paint ${s.duration}s ${s.delay}s ease-out forwards`,
            }}
          />
        </svg>
      ))}
      <style>{`
        @keyframes tend-wash {
          0% { opacity: 0; }
          18% { opacity: 0.55; }
          70% { opacity: 0.55; }
          100% { opacity: 0; }
        }
        @keyframes tend-paint {
          0% { stroke-dashoffset: 1; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── NATURE STUDY & LORE ─────────────────────────────────────────────
// ─── NATURE STUDY SECTION (folded into Reading & learning) ───────────
function NatureStudySection({ isToday, viewDate }) {
  const [loopStep, setLoopStep] = useState(getNatureLoopStep);
  const [showBloom, setShowBloom] = useState(false);

  const dateKey = viewDate.toISOString().slice(0, 10);

  const [natureCurrent] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_nature_current") || "null");
      if (saved?.subject) return saved;
    } catch {}
    return {
      subject: "The Story of the Tadpole",
      read: "The Year Round by C.J. Hylander \u00b7 Spring section",
      observe: "Go outside and look near ponds or puddles for frogs or tadpoles.",
    };
  });

  const [done, setDone] = useState(() => {
    if (!isToday) return false;
    try {
      const saved = JSON.parse(localStorage.getItem("tend_nature_done") || "null");
      return saved?.date === dateKey ? saved.done : false;
    } catch {
      return false;
    }
  });

  const markDone = () => {
    if (!isToday) return;
    setDone(true);
    try {
      localStorage.setItem("tend_nature_done", JSON.stringify({ date: dateKey, done: true }));
    } catch {}
    setLoopStep(advanceNatureLoop());
    setShowBloom(true);
    setTimeout(() => setShowBloom(false), 2800);
  };

  const undoDone = () => {
    if (!isToday) return;
    setDone(false);
    try {
      localStorage.setItem("tend_nature_done", JSON.stringify({ date: dateKey, done: false }));
    } catch {}
  };

  const step = NATURE_LOOP_STEPS[loopStep];
  const nextStep = NATURE_LOOP_STEPS[(loopStep + 1) % 3];

  return (
    <>
      <BloomEffect show={showBloom} />
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 3px" }}>
        NATURE STUDY
        {done && <span style={{ color: "var(--sage)", marginLeft: 8 }}>done today</span>}
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", margin: "0 0 8px" }}>
        {natureCurrent.subject}
      </p>

      {done ? (
        <>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink-lt)", margin: "0 0 8px" }}>
            Next step &middot; {nextStep.icon} {nextStep.label}
          </p>
          {isToday && (
            <button
              onClick={undoDone}
              style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "lowercase", color: "var(--ink-faint)" }}
            >
              tap to undo
            </button>
          )}
        </>
      ) : (
        <>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", margin: "0 0 2px" }}>
            {step.icon} {step.label}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink-lt)", margin: "0 0 8px" }}>
            {step.getInstruction(natureCurrent)}
          </p>
          {isToday && (
            <button
              onClick={markDone}
              style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "lowercase", color: "var(--sage)" }}
            >
              mark done
            </button>
          )}
        </>
      )}
    </>
  );
}

// ─── DAILY ACTIVITY (today's pick / tomorrow's setup) ────────────────
function DailyActivity({ isToday, viewDate }) {
  const evening = isEveningSetupTime();
  const choices = getActivityChoices(new Date(), 3);
  const tomorrow = getTomorrowActivity();
  const dateKey = viewDate.toISOString().slice(0, 10);

  const [selected, setSelected] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`tend_morning_pick_${dateKey}`) || "null");
    } catch {
      return null;
    }
  });

  const [activityDone, setActivityDone] = useState(() => {
    if (!isToday) return false;
    try {
      const saved = JSON.parse(localStorage.getItem(`tend_activity_done_${dateKey}`) || "null");
      return saved === true;
    } catch {
      return false;
    }
  });

  const [showPetals, setShowPetals] = useState(false);  const pickActivity = (activity) => {
    if (!isToday) return;
    setSelected(activity);
    try {
      localStorage.setItem(`tend_morning_pick_${dateKey}`, JSON.stringify(activity));
    } catch {}
  };

  const clearSelection = () => {
    if (!isToday) return;
    setSelected(null);
    setActivityDone(false);
    try {
      localStorage.removeItem(`tend_morning_pick_${dateKey}`);
      localStorage.removeItem(`tend_activity_done_${dateKey}`);
    } catch {}
  };

  const markActivityDone = () => {
    if (!isToday) return;
    setActivityDone(true);
    try {
      localStorage.setItem(`tend_activity_done_${dateKey}`, JSON.stringify(true));
    } catch {}
    setShowPetals(true);
    setTimeout(() => setShowPetals(false), 3800);
  };

  const undoActivityDone = () => {
    if (!isToday) return;
    setActivityDone(false);
    try {
      localStorage.removeItem(`tend_activity_done_${dateKey}`);
    } catch {}
  };

  // Evening: tomorrow's setup view
  if (evening && isToday) {
    return (
      <div style={{
        background: "rgba(232, 226, 213, 0.35)",
        borderRadius: 6,
        padding: "18px 20px",
      }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "lowercase", color: "var(--ink-faint)", margin: "0 0 10px" }}>
          tomorrow morning
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "var(--ink)", margin: "0 0 14px" }}>
          {tomorrow.label}
        </p>

        {tomorrow.setup && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--sage)", margin: "0 0 3px" }}>TONIGHT</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink-lt)", margin: 0 }}>
              {tomorrow.setup}
            </p>
          </div>
        )}

        {tomorrow.materials && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-lt)", margin: "0 0 3px" }}>MATERIALS</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>
              {tomorrow.materials}
            </p>
          </div>
        )}

        {tomorrow.steps && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-lt)", margin: "0 0 3px" }}>WHAT TO DO</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.65, color: "var(--ink)", margin: 0 }}>
              {tomorrow.steps}
            </p>
          </div>
        )}

        {tomorrow.kidsNeed && (
          <div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-faint)", margin: "0 0 3px" }}>THEY'LL NEED</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink-faint)", margin: 0 }}>
              {tomorrow.kidsNeed}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Selected: show today's pick
  if (selected) {
    return (
      <>
        <WatercolorWash show={showPetals} />
        <div style={{
          background: activityDone ? "rgba(169, 183, 134, 0.18)" : "rgba(232, 226, 213, 0.35)",
          borderRadius: 6,
          padding: "18px 20px",
          transition: "background .4s",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "lowercase", color: "var(--ink-faint)", margin: 0 }}>
              today's activity
              {activityDone && <span style={{ color: "var(--sage)", marginLeft: 8 }}>&#x2731; done</span>}
            </p>
            {isToday && (
              <button
                onClick={activityDone ? undoActivityDone : clearSelection}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", textTransform: "lowercase", color: "var(--ink-faint)", padding: 0 }}
              >
                {activityDone ? "tap to undo" : "change"}
              </button>
            )}
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "var(--ink)", margin: "0 0 14px" }}>
            {selected.label}
          </p>

          {selected.materials && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-lt)", margin: "0 0 3px" }}>MATERIALS</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>
                {selected.materials}
              </p>
            </div>
          )}

          {selected.steps && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-lt)", margin: "0 0 3px" }}>WHAT TO DO</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.65, color: "var(--ink)", margin: 0 }}>
                {selected.steps}
              </p>
            </div>
          )}

          {selected.kidsNeed && (
            <div style={{ marginBottom: activityDone || !isToday ? 0 : 16 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-faint)", margin: "0 0 3px" }}>THEY'LL NEED</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink-faint)", margin: 0 }}>
                {selected.kidsNeed}
              </p>
            </div>
          )}

          {!activityDone && isToday && (
            <button
              onClick={markActivityDone}
              style={{
                background: "var(--sage-bg)",
                border: "1px solid var(--sage-md)",
                borderRadius: 20,
                padding: "6px 16px",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 10,
                letterSpacing: ".12em",
                textTransform: "lowercase",
                color: "var(--sage)",
                marginTop: 4,
              }}
            >
              mark complete &#x2731;
            </button>
          )}
        </div>
      </>
    );
  }

  // No selection yet: picker
  return (
    <div style={{
      background: "rgba(232, 226, 213, 0.35)",
      borderRadius: 6,
      padding: "18px 20px",
    }}>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "lowercase", color: "var(--ink-faint)", margin: "0 0 6px" }}>
        today's activity
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", margin: "0 0 14px" }}>
        What feels good for today?
      </p>
      {choices.map((choice, idx) => (
        <div
          key={choice.id}
          onClick={() => pickActivity(choice)}
          style={{
            padding: "10px 0",
            borderTop: idx === 0 ? "0.5px solid var(--rule)" : "none",
            borderBottom: "0.5px solid var(--rule)",
            cursor: isToday ? "pointer" : "default",
          }}
        >
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)", margin: "0 0 3px" }}>
            {choice.label}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, lineHeight: 1.5, color: "var(--ink-faint)", margin: 0 }}>
            {choice.kidsNeed}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── HABIT FOCUS (term + month + lesson progress) ────────────────────
export function HabitFocus() {
  const [expanded, setExpanded] = useState(false);

  // progress: { [monthNumber]: [completed lesson numbers] }
  const [progress, setProgress] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_habit_term_progress") || "null");
      if (saved && typeof saved === "object") return saved;
    } catch {}
    return {};
  });

  const saveProgress = (next) => {
    setProgress(next);
    try { localStorage.setItem("tend_habit_term_progress", JSON.stringify(next)); } catch {}
  };

  // First month with incomplete lessons is the current month
  const currentMonth = HABIT_MONTHS.find((m) => {
    const completed = progress[m.number] || [];
    return completed.length < m.lessons.length;
  });

  // Term complete state
  if (!currentMonth) {
    return (
      <>
        <div
          onClick={() => setExpanded((e) => !e)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "4px 0 0",
            padding: "6px 12px 6px 8px",
            background: expanded ? "var(--sage-bg)" : "rgba(232, 226, 213, 0.35)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, margin: 0, color: "var(--ink)" }}>
            Habit focus &middot; <span style={{ color: "var(--sage)" }}>term complete &#x2731;</span>
          </p>
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", color: "var(--ink-faint)" }}>
            {expanded ? "close" : "open"}
          </span>
        </div>
        {expanded && (
          <div style={{ margin: "8px 0 4px", padding: "14px 18px", background: "rgba(232, 226, 213, 0.25)", borderLeft: "1.5px solid var(--sage-md)", borderRadius: "0 4px 4px 0" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.6, color: "var(--ink)", margin: "0 0 10px" }}>
              {HABIT_TERM.title} &mdash; you did all twenty-seven lessons. Body, will, world. Well done.
            </p>
            <button
              onClick={() => saveProgress({})}
              style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "lowercase", color: "var(--ink-faint)" }}
            >
              start a new term
            </button>
          </div>
        )}
      </>
    );
  }

  const completedThisMonth = progress[currentMonth.number] || [];
  const currentLesson = currentMonth.lessons.find((l) => !completedThisMonth.includes(l.number));
  if (!currentLesson) return null; // defensive

  const monthIndex = HABIT_MONTHS.findIndex((m) => m.number === currentMonth.number);
  const isFirstLessonOfMonth = currentLesson.number === 1 && completedThisMonth.length === 0;
  const practiceStarted = currentLesson.number >= currentMonth.practiceBeginsAtLesson;
  const midMonthShown = currentLesson.number >= currentMonth.midMonthQuestionAtLesson;

  const markLessonComplete = () => {
    const next = {
      ...progress,
      [currentMonth.number]: [...completedThisMonth, currentLesson.number],
    };
    saveProgress(next);
  };

  const undoLastLesson = () => {
    if (completedThisMonth.length > 0) {
      saveProgress({
        ...progress,
        [currentMonth.number]: completedThisMonth.slice(0, -1),
      });
    } else if (monthIndex > 0) {
      const prev = HABIT_MONTHS[monthIndex - 1];
      const prevDone = progress[prev.number] || [];
      saveProgress({ ...progress, [prev.number]: prevDone.slice(0, -1) });
    }
  };

  return (
    <>
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "4px 0 0",
          padding: "6px 12px 6px 8px",
          background: expanded ? "var(--sage-bg)" : "rgba(232, 226, 213, 0.35)",
          borderRadius: 4,
          cursor: "pointer",
          transition: "background .2s",
        }}
      >
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, margin: 0, color: "var(--ink)" }}>
          Habit focus &middot;{" "}
          <span style={{ color: "var(--sage)" }}>{currentMonth.habit}</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)", marginLeft: 8 }}>
            lesson {currentLesson.number} of {currentMonth.lessons.length}
          </span>
        </p>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", color: "var(--ink-faint)" }}>
          {expanded ? "close" : "open"}
        </span>
      </div>

      {expanded && (
        <div
          style={{
            margin: "8px 0 4px",
            padding: "14px 18px",
            background: "rgba(232, 226, 213, 0.25)",
            borderLeft: "1.5px solid var(--sage-md)",
            borderRadius: "0 4px 4px 0",
          }}
        >
          {/* TERM HEADLINE + MONTH PROGRESS DOTS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: 0 }}>
              {HABIT_TERM.title.toUpperCase()}
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              {HABIT_MONTHS.map((m, i) => {
                const isPast = i < monthIndex;
                const isCurrent = i === monthIndex;
                return (
                  <div
                    key={m.number}
                    title={m.habit}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: isPast || isCurrent ? "var(--sage)" : "transparent",
                      border: `1.5px solid ${isPast || isCurrent ? "var(--sage)" : "var(--sage-md)"}`,
                      opacity: isCurrent ? 1 : isPast ? 0.55 : 1,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* HABIT NAME + MONTH FRAME + DEFINITION + PHRASE */}
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "var(--ink)", margin: "0 0 2px" }}>
            {currentMonth.habit}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)", margin: "0 0 6px" }}>
            month {currentMonth.number} &middot; {currentMonth.title} &mdash; {currentMonth.subtitle}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.55, color: "var(--ink-lt)", margin: "0 0 6px" }}>
            {currentMonth.habitDefinition}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.55, color: "var(--sage)", margin: 0 }}>
            &ldquo;{currentMonth.phrase}&rdquo;
          </p>

          {/* PARENT ANCHOR (only at start of a new month) */}
          {isFirstLessonOfMonth && currentMonth.parentAnchor && (
            <div style={{
              margin: "14px 0 0",
              padding: "10px 12px",
              background: "rgba(195, 155, 97, 0.10)",
              borderLeft: "2px solid #C29B61",
              borderRadius: "0 4px 4px 0",
            }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "#A07F4C", margin: "0 0 4px" }}>
                BEFORE LESSON 1 &middot; PARENT READING
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "var(--ink)", margin: "0 0 2px" }}>
                {currentMonth.parentAnchor.title}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, lineHeight: 1.5, color: "var(--ink-lt)", margin: "0 0 4px" }}>
                {currentMonth.parentAnchor.source} &middot; {currentMonth.parentAnchor.pages}
              </p>
              {currentMonth.parentAnchor.note && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, lineHeight: 1.5, color: "var(--ink-faint)", margin: 0 }}>
                  {currentMonth.parentAnchor.note}
                </p>
              )}
            </div>
          )}

          {/* THIS MONTH'S PRACTICE (after practice begins) */}
          {practiceStarted && currentMonth.practiceText && (
            <>
              <div style={{ height: "0.5px", background: "var(--rule)", margin: "14px 0" }}></div>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--sage)", margin: "0 0 4px" }}>
                THIS MONTH&rsquo;S PRACTICE
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.55, color: "var(--ink)", margin: 0 }}>
                {currentMonth.practiceText}
              </p>
            </>
          )}

          {/* MID-MONTH QUESTION (when reached) */}
          {midMonthShown && currentMonth.midMonthQuestion && (
            <>
              <div style={{ height: "0.5px", background: "var(--rule)", margin: "14px 0" }}></div>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 4px" }}>
                TO ASK
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.55, color: "var(--ink)", margin: 0 }}>
                {currentMonth.midMonthQuestion}
              </p>
            </>
          )}

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "14px 0" }}></div>

          {/* CURRENT LESSON */}
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 4px" }}>
            LESSON {currentLesson.number} OF {currentMonth.lessons.length}
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", margin: "0 0 10px" }}>
            {currentLesson.title}
          </p>

          {/* FAMILY content */}
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-lt)", margin: "0 0 4px" }}>
            FAMILY
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>
            {currentLesson.family}
          </p>

          {/* TEEN content */}
          {currentLesson.teen && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-lt)", margin: "0 0 6px" }}>
                TEEN
              </p>
              {currentLesson.teen.reading && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: "0 0 6px" }}>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontStyle: "normal", letterSpacing: ".08em", color: "var(--ink-faint)", marginRight: 6 }}>READ</span>
                  {currentLesson.teen.reading}
                  {currentLesson.teen.source && (
                    <span style={{ color: "var(--ink-faint)" }}> &middot; {currentLesson.teen.source}</span>
                  )}
                </p>
              )}
              {currentLesson.teen.quote && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: "0 0 6px" }}>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontStyle: "normal", letterSpacing: ".08em", color: "var(--ink-faint)", marginRight: 6 }}>QUOTE</span>
                  {currentLesson.teen.quote}
                </p>
              )}
              {currentLesson.teen.experiment && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: "0 0 6px" }}>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontStyle: "normal", letterSpacing: ".08em", color: "var(--ink-faint)", marginRight: 6 }}>EXPERIMENT</span>
                  {currentLesson.teen.experiment}
                </p>
              )}
              {currentLesson.teen.question && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: "0 0 6px" }}>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontStyle: "normal", letterSpacing: ".08em", color: "var(--ink-faint)", marginRight: 6 }}>ASK</span>
                  {currentLesson.teen.question}
                </p>
              )}
              {currentLesson.teen.note && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, lineHeight: 1.55, color: "var(--ink-faint)", margin: 0 }}>
                  {currentLesson.teen.note}
                </p>
              )}
            </div>
          )}

          {/* MARK COMPLETE */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
            <button
              onClick={markLessonComplete}
              style={{
                background: "var(--sage-bg)",
                border: "1px solid var(--sage-md)",
                borderRadius: 20,
                padding: "6px 16px",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 10,
                letterSpacing: ".12em",
                textTransform: "lowercase",
                color: "var(--sage)",
              }}
            >
              mark lesson complete &#x2731;
            </button>
            {(completedThisMonth.length > 0 || monthIndex > 0) && (
              <button
                onClick={undoLastLesson}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 9,
                  letterSpacing: ".08em",
                  textTransform: "lowercase",
                  color: "var(--ink-faint)",
                  padding: 0,
                }}
              >
                undo last
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── RHYTHM SVG MARKERS (clean line icons, not emojis) ───────────────
const SunriseMarker = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3" />
    <path d="M4.5 8.5l1.6 1.6" />
    <path d="M19.5 8.5l-1.6 1.6" />
    <path d="M2 19h20" />
    <path d="M7 19a5 5 0 0 1 10 0" />
  </svg>
);
const SunMarker = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2v2.2" />
    <path d="M12 19.8V22" />
    <path d="M2 12h2.2" />
    <path d="M19.8 12H22" />
    <path d="M4.9 4.9l1.5 1.5" />
    <path d="M17.6 17.6l1.5 1.5" />
    <path d="M19.1 4.9l-1.5 1.5" />
    <path d="M6.4 17.6l-1.5 1.5" />
  </svg>
);
const MoonMarker = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z" />
  </svg>
);

// ─── RHYTHM SECTION (side marker + connecting rail, always open) ─────
function RhythmSection({ marker, title, showLine, children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* left marker rail */}
      <div style={{ width: 30, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginTop: 13 }}>{marker}</div>
        {showLine && <div style={{ width: 1, flex: 1, background: "var(--rule)", marginTop: 7 }} />}
      </div>
      {/* body */}
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400, color: "var(--ink)", margin: 0, padding: "11px 0 9px" }}>
          {title}
        </p>
        <div style={{ paddingBottom: 8 }}>{children}</div>
      </div>
    </div>
  );
}

const rhythmItemStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 15.5,
  lineHeight: 1.5,
  color: "var(--ink-lt)",
  padding: "3px 0",
  margin: 0,
};

// ─── MAIN SUMMER RHYTHM COMPONENT ────────────────────────────────────
export default function SummerRhythm({ userId, viewDate, isToday }) {
  const day = viewDate.getDay();
  const dayName = DAYS[day === 0 ? 6 : day - 1];
  const cmQuote = CM_QUOTES[day];

  const isVolunteerTue = dayName === "Tuesday" && isVolunteerTuesday(viewDate);
  const isNatureDay = NATURE_DAYS[dayName] === true;

  return (
    <div>
      {isToday && (
        <>
          {/* CM quote */}
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.75, color: "var(--ink-lt)", margin: "0 0 4px", textAlign: "center" }}>
            "{cmQuote.quote}"
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "lowercase", color: "var(--ink-faint)", margin: 0, textAlign: "center" }}>
            charlotte mason, {cmQuote.source}
          </p>

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "24px 0 26px" }}></div>
        </>
      )}

      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, fontWeight: 400, letterSpacing: ".18em", margin: "0 0 5px", color: "var(--ink)" }}>
          SUMMER RHYTHM
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", margin: "0 0 14px" }}>
          a gentle shape for our days
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          {["inspire wonder", "connection", "restoration"].map((v) => (
            <span
              key={v}
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 9,
                letterSpacing: ".08em",
                color: "var(--sage)",
                background: "var(--sage-bg)",
                border: "0.5px solid var(--sage-md)",
                borderRadius: 11,
                padding: "3px 10px",
              }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* ── HABIT FOCUS (term + month + lesson) ── */}
      <div style={{ marginTop: 22 }}>
        <HabitFocus />
      </div>

      {/* ── DAILY RHYTHM eyebrow ── */}
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".16em", textTransform: "lowercase", color: "var(--ink-faint)", margin: "26px 0 2px" }}>
        our daily rhythm
      </p>

      {/* ── MORNING ── */}
      <RhythmSection marker={SunriseMarker} title="Morning" showLine>
        <p style={rhythmItemStyle}>Slow beginnings</p>
        <p style={rhythmItemStyle}>Care for our home</p>
        <p style={rhythmItemStyle}>Outside early</p>

        {isVolunteerTue && (
          <div style={{
            margin: "6px 0 4px",
            padding: "8px 12px 8px 10px",
            background: "rgba(232, 226, 213, 0.45)",
            borderLeft: "2px solid var(--sage)",
            borderRadius: "0 4px 4px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--sage)", margin: "0 0 2px" }}>VOLUNTEER WITH CHISPA</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)", margin: 0 }}>Cibolo Rehab Center</p>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)" }}>
              10:30&ndash;12:00
            </span>
          </div>
        )}

        <ReadingAndLearning userId={userId} today={dayName} viewDate={viewDate} isToday={isToday} isNatureDay={isNatureDay} />

        <p style={{ ...rhythmItemStyle, margin: "4px 0 0" }}>Lunch together</p>
      </RhythmSection>

      {/* ── AFTERNOON ── */}
      <RhythmSection marker={SunMarker} title="Afternoon" showLine>
        <p style={rhythmItemStyle}>Play &middot; Projects &middot; Adventure</p>
        <p style={rhythmItemStyle}>Friends are welcome</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-faint)", margin: "7px 0 2px" }}>
          Room for wandering, library days, errands, and ordinary life.
        </p>
      </RhythmSection>

      {/* ── EVENING ── */}
      <RhythmSection marker={MoonMarker} title="Evening" showLine={false}>
        <p style={rhythmItemStyle}>Dinner together</p>
        <p style={rhythmItemStyle}>Outside at dusk</p>
        <p style={rhythmItemStyle}>Quiet hours</p>
        <p style={rhythmItemStyle}>Read-alouds or family TV</p>
        <p style={rhythmItemStyle}>Rest</p>
      </RhythmSection>

      {/* ── SCREENS — standalone card, always visible ── */}
      <div style={{
        margin: "16px 0 4px",
        padding: "13px 16px",
        background: "var(--sage-bg)",
        border: "0.5px solid var(--sage-md)",
        borderRadius: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5V12l3 2" />
          </svg>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--sage)", margin: 0 }}>
            Screens
          </p>
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)", margin: "0 0 5px", paddingLeft: 23 }}>
          Weekdays 2&ndash;5
          <span style={{ color: "var(--sage-md)", margin: "0 8px" }}>&middot;</span>
          Weekends 11&ndash;4
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12.5, lineHeight: 1.6, color: "var(--ink-faint)", margin: 0, paddingLeft: 23 }}>
          &ldquo;There&rsquo;s no WiFi in the forest, but you&rsquo;ll find a better connection.&rdquo;
        </p>
      </div>

      {/* ── TODAY'S CREATIVE INVITATION (DailyActivity — full logic preserved) ── */}
      {isToday && (
        <div style={{ margin: "22px 0 4px" }}>
          <DailyActivity isToday={isToday} viewDate={viewDate} />
        </div>
      )}
    </div>
  );
}
