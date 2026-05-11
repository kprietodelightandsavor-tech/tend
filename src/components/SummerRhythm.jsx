// src/components/SummerRhythm.jsx
// Quieter summer home view, modeled on Kim's Summer Rhythm poster.
// Folds Family Bible Study + Beauty + editable subject fields
// into a single expandable "Reading & learning" panel.

import { useState, useEffect } from "react";
import { CM_QUOTES, DAYS } from "../data/seed";
import { getTodayBeauty } from "../data/beauty-seed";
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
function StudyField({ label, value, placeholder, sublabel, onSave }) {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: 0 }}>
          {label}
          {sublabel && (
            <span style={{ textTransform: "none", letterSpacing: 0, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "var(--ink-faint)", marginLeft: 4 }}>
              {sublabel}
            </span>
          )}
        </p>
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
          }}
        />
      ) : value ? (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", margin: 0 }}>
          {value}
        </p>
      ) : (
        <p
          onClick={() => setEditing(true)}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink-faint)", margin: 0, cursor: "pointer", opacity: 0.7 }}
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
      {FAMILY_BIBLE_STREAMS.map((stream) => {
        const state = streamStates?.[stream.id];
        const view = getStreamView(stream, state);
        const isBusy = !!busy[stream.id];

        if (!view.active && view.completed.length === 0) return null;

        const ref = view.active
          ? view.active.reference
          : view.completed[view.completed.length - 1].reference;
        const isComplete = !view.active;

        return (
          <div
            key={stream.id}
            onClick={() => {
              if (isComplete) handleUndo(stream.id);
              else handleComplete(stream.id);
            }}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "baseline",
              padding: "3px 0",
              cursor: isToday && !isBusy ? "pointer" : "default",
              opacity: isBusy ? 0.5 : isComplete ? 0.5 : 1,
              transition: "opacity .2s",
            }}
          >
            <span
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 9,
                letterSpacing: ".12em",
                color: isComplete ? "var(--ink-faint)" : "var(--sage)",
                flexShrink: 0,
                minWidth: 72,
              }}
            >
              {stream.label}
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: 13,
                color: isComplete ? "var(--ink-faint)" : "var(--ink)",
                textDecoration: isComplete ? "line-through" : "none",
                textDecorationColor: "var(--sage-md)",
              }}
            >
              {ref}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── READING & LEARNING EXPANDABLE ───────────────────────────────────
function ReadingAndLearning({ userId, today, viewDate, isToday }) {
  const [expanded, setExpanded] = useState(false);
  const [studies, setStudies] = useState({});

  useEffect(() => {
    if (!userId) return;
    loadCurrentStudies(userId).then(setStudies);
  }, [userId]);

  const handleSave = async (subject, content) => {
    setStudies((prev) => ({ ...prev, [subject]: content }));
    await saveCurrentStudy(userId, subject, content);
  };

  // Today's scheduled beauty (from existing rotation)
  const beautyItems = getTodayBeauty(today, viewDate) || [];
  const beautyScheduled = beautyItems.find((b) => b.scheduled);

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
          Reading &amp; learning
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

          {/* BEAUTY */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 3px" }}>BEAUTY</p>
            {beautyScheduled ? (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", margin: 0 }}>
                {beautyScheduled.label}
                <span style={{ color: "var(--ink-faint)", fontSize: 11 }}> &middot; today</span>
              </p>
            ) : (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>
                No beauty scheduled for today.
              </p>
            )}
          </div>

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          <StudyField
            label="FAMILY READ-ALOUD"
            value={studies["family_read_aloud"]}
            placeholder="Tap to add what you are reading"
            onSave={(content) => handleSave("family_read_aloud", content)}
          />

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          <StudyField
            label="MATH"
            value={studies["math"]}
            placeholder="Tap to add what you are studying"
            onSave={(content) => handleSave("math", content)}
          />

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          <StudyField
            label="HISTORY"
            sublabel="when included"
            value={studies["history"]}
            placeholder="Tap to add what you are studying"
            onSave={(content) => handleSave("history", content)}
          />
        </div>
      )}
    </>
  );
}

// ─── MAIN SUMMER RHYTHM COMPONENT ────────────────────────────────────
export default function SummerRhythm({ userId, viewDate, isToday }) {
  const day = viewDate.getDay();
  const dayName = DAYS[day === 0 ? 6 : day - 1];
  const cmQuote = CM_QUOTES[day];

  return (
    <div>
      {isToday && (
        <>
          {/* A gentle morning - prose, not checklist */}
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "lowercase", color: "var(--ink-faint)", margin: "0 0 14px" }}>
            a gentle morning
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, lineHeight: 2, color: "var(--ink-lt)", margin: 0 }}>
            Get the day's first light.<br />
            Read before screens.<br />
            Step outside first.<br />
            Move slowly until the coffee is finished.
          </p>

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "26px 0 22px" }}></div>

          {/* CM quote */}
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.75, color: "var(--ink-lt)", margin: "0 0 4px", textAlign: "center" }}>
            "{cmQuote.quote}"
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "lowercase", color: "var(--ink-faint)", margin: 0, textAlign: "center" }}>
            charlotte mason, {cmQuote.source}
          </p>

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "24px 0 28px" }}></div>
        </>
      )}

      {/* SUMMER RHYTHM poster */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 400, letterSpacing: ".16em", textAlign: "center", margin: "0 0 4px", color: "var(--ink)" }}>
        SUMMER RHYTHM
      </h2>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", margin: "0 0 24px", textAlign: "center" }}>
        a gentle shape for our days
      </p>

      {/* MORNING */}
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".18em", color: "var(--ink)", margin: "0 0 10px" }}>MORNING</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, lineHeight: 1.9, color: "var(--ink)", margin: 0 }}>
        Slow beginnings<br />
        Care for our home<br />
        Outside early
      </p>

      <ReadingAndLearning userId={userId} today={dayName} viewDate={viewDate} isToday={isToday} />

      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, lineHeight: 1.9, color: "var(--ink)", margin: "4px 0 0" }}>
        Lunch together
      </p>

      <div style={{ height: "0.5px", background: "var(--rule)", margin: "22px 0 18px" }}></div>

      {/* AFTERNOON */}
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".18em", color: "var(--ink)", margin: "0 0 10px" }}>AFTERNOON</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, lineHeight: 1.9, color: "var(--ink)", margin: "0 0 8px" }}>
        Play &middot; Projects &middot; Adventure<br />
        Friends are welcome
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.7, color: "var(--ink-faint)", margin: 0 }}>
        Room for wandering, errands, library days, outings, rest, and ordinary life.
      </p>

      {/* SCREENS box */}
      <div style={{ border: "1px solid var(--sage-md)", borderRadius: 6, padding: "12px 16px", margin: "18px 0", background: "var(--sage-bg)", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ fontSize: 14, opacity: 0.55, marginTop: 1 }}>&#x1F550;</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".18em", color: "var(--ink)", margin: "0 0 6px" }}>SCREENS</p>
          <table style={{ width: "100%", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink)" }}>
            <tbody>
              <tr><td style={{ padding: "1px 0" }}>Weekdays</td><td style={{ textAlign: "right" }}>2:00 to 5:00</td></tr>
              <tr><td style={{ padding: "1px 0" }}>Weekends</td><td style={{ textAlign: "right" }}>11:00 to 4:00</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ height: "0.5px", background: "var(--rule)", margin: "18px 0" }}></div>

      {/* EVENING */}
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".18em", color: "var(--ink)", margin: "0 0 10px" }}>EVENING</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, lineHeight: 1.9, color: "var(--ink)", margin: 0 }}>
        Dinner together<br />
        Outside at dusk<br />
        Quiet rhythms<br />
        Read-alouds or family TV<br />
        Rest
      </p>

      <div style={{ height: "0.5px", background: "var(--rule)", margin: "28px 0 16px" }}></div>

      {/* SUMMER VALUES */}
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".18em", color: "var(--ink-faint)", margin: "0 0 8px", textAlign: "center" }}>
        OUR SUMMER VALUES
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", margin: 0, textAlign: "center" }}>
        inspire wonder &middot; connection &middot; restoration
      </p>
    </div>
  );
}
