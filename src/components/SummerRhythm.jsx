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
  HABIT_PROMPTS,
  getNatureLoopStep,
  advanceNatureLoop,
} from "../data/seed";
import { getTodayBeauty, isVolunteerTuesday } from "../data/beauty-seed";
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
function NatureStudy({ isToday, viewDate }) {
  const [expanded, setExpanded] = useState(false);
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
          Nature study
          {done && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", color: "var(--sage)", marginLeft: 8 }}>done today</span>}
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
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 3px" }}>THIS WEEK</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", margin: 0 }}>
              {natureCurrent.subject}
            </p>
          </div>

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

          {done ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 3px" }}>NEXT STEP</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", margin: 0 }}>
                  {nextStep.icon} {nextStep.label}
                </p>
              </div>
              {isToday && (
                <button
                  onClick={undoDone}
                  style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "lowercase", color: "var(--ink-faint)" }}
                >
                  tap to undo
                </button>
              )}
            </>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 3px" }}>TODAY'S STEP</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", margin: "0 0 6px" }}>
                  {step.icon} {step.label}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ink-lt)", margin: 0 }}>
                  {step.getInstruction(natureCurrent)}
                </p>
              </div>
              {isToday && (
                <button
                  onClick={markDone}
                  style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "lowercase", color: "var(--sage)" }}
                >
                  mark done
                </button>
              )}
            </>
          )}
        </div>
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

// ─── HABIT FOCUS (term habit of choice) ──────────────────────────────
function HabitFocus({ viewDate }) {
  const [expanded, setExpanded] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [habitKey, setHabitKey] = useState(() => {
    try {
      const saved = localStorage.getItem("tend_summer_term_habit");
      if (saved && HABIT_PROMPTS[saved]) return saved;
    } catch {}
    return Object.keys(HABIT_PROMPTS)[0] || "attention";
  });

  const habit = HABIT_PROMPTS[habitKey];
  const dailyArr = habit?.daily || [];
  const dayIdx = viewDate.getDay();
  const promptPair = dailyArr.length > 0 ? dailyArr[dayIdx % dailyArr.length] : [];

  const setHabit = (key) => {
    setHabitKey(key);
    try { localStorage.setItem("tend_summer_term_habit", key); } catch {}
    setShowPicker(false);
  };

  const habitKeys = Object.keys(HABIT_PROMPTS);

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
          <span style={{ color: "var(--sage)" }}>{habit?.name || "Attention"}</span>
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
          {/* TERM HABIT */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 4px" }}>
              TERM HABIT
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "var(--ink)", margin: "0 0 4px" }}>
              {habit?.name}
            </p>
            {habit?.desc && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.55, color: "var(--ink-lt)", margin: 0 }}>
                {habit.desc}
              </p>
            )}
          </div>

          {promptPair.length > 0 && (
            <>
              <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 14px" }}></div>

              {/* TODAY'S PROMPTS */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", color: "var(--ink-lt)", margin: "0 0 6px" }}>
                  FOR TODAY
                </p>
                {promptPair.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "var(--ink)",
                      margin: i === promptPair.length - 1 ? 0 : "0 0 8px",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </>
          )}

          <div style={{ height: "0.5px", background: "var(--rule)", margin: "0 0 12px" }}></div>

          {/* CHANGE FOCUS */}
          {!showPicker ? (
            <button
              onClick={() => setShowPicker(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 9,
                letterSpacing: ".12em",
                textTransform: "lowercase",
                color: "var(--ink-faint)",
                padding: 0,
              }}
            >
              change focus &#8250;
            </button>
          ) : (
            <div>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", color: "var(--ink-lt)", margin: "0 0 8px" }}>
                CHOOSE THIS TERM&rsquo;S HABIT
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {habitKeys.map((key) => {
                  const isActive = key === habitKey;
                  return (
                    <button
                      key={key}
                      onClick={() => setHabit(key)}
                      style={{
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 10,
                        letterSpacing: ".06em",
                        color: isActive ? "white" : "var(--sage)",
                        background: isActive ? "var(--sage)" : "var(--sage-bg)",
                        border: `0.5px solid var(--sage-md)`,
                        borderRadius: 12,
                        padding: "4px 11px",
                        cursor: "pointer",
                      }}
                    >
                      {HABIT_PROMPTS[key].name}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowPicker(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 9,
                  letterSpacing: ".12em",
                  textTransform: "lowercase",
                  color: "var(--ink-faint)",
                  padding: "8px 0 0",
                }}
              >
                done
              </button>
            </div>
          )}
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

// ─── RHYTHM ACCORDION SHELL (side marker + connecting rail) ──────────
function RhythmAccordion({ marker, title, isOpen, onToggle, showLine, children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* left marker rail */}
      <div style={{ width: 30, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginTop: 13 }}>{marker}</div>
        {showLine && <div style={{ width: 1, flex: 1, background: "var(--rule)", marginTop: 7 }} />}
      </div>
      {/* body */}
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <div
          onClick={onToggle}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0 9px", cursor: "pointer" }}
        >
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400, color: "var(--ink)", margin: 0 }}>
            {title}
          </p>
          <svg
            width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: 0.35, transform: isOpen ? "none" : "rotate(-90deg)", transition: "transform .3s ease" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {isOpen && <div style={{ paddingBottom: 8 }}>{children}</div>}
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

  const [expandedSections, setExpandedSections] = useState({
    morning: true,
    afternoon: false,
    evening: false,
  });
  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

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

      {/* ── HABIT FOCUS (term habit of choice) ── */}
      <div style={{ marginTop: 22 }}>
        <HabitFocus viewDate={viewDate} />
      </div>

      {/* ── DAILY RHYTHM eyebrow ── */}
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".16em", textTransform: "lowercase", color: "var(--ink-faint)", margin: "26px 0 2px" }}>
        our daily rhythm
      </p>

      {/* ── MORNING (expanded by default) ── */}
      <RhythmAccordion
        marker={SunriseMarker}
        title="Morning"
        isOpen={expandedSections.morning}
        onToggle={() => toggleSection("morning")}
        showLine
      >
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

        {isNatureDay && <NatureStudy isToday={isToday} viewDate={viewDate} />}

        <ReadingAndLearning userId={userId} today={dayName} viewDate={viewDate} isToday={isToday} />

        <p style={{ ...rhythmItemStyle, margin: "4px 0 0" }}>Lunch together</p>
      </RhythmAccordion>

      {/* ── AFTERNOON ── */}
      <RhythmAccordion
        marker={SunMarker}
        title="Afternoon"
        isOpen={expandedSections.afternoon}
        onToggle={() => toggleSection("afternoon")}
        showLine
      >
        <p style={rhythmItemStyle}>Play &middot; Projects &middot; Adventure</p>
        <p style={rhythmItemStyle}>Friends are welcome</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-faint)", margin: "7px 0 2px" }}>
          Room for wandering, library days, errands, and ordinary life.
        </p>
      </RhythmAccordion>

      {/* ── EVENING ── */}
      <RhythmAccordion
        marker={MoonMarker}
        title="Evening"
        isOpen={expandedSections.evening}
        onToggle={() => toggleSection("evening")}
        showLine={false}
      >
        <p style={rhythmItemStyle}>Dinner together</p>
        <p style={rhythmItemStyle}>Outside at dusk</p>
        <p style={rhythmItemStyle}>Quiet hours</p>
        <p style={rhythmItemStyle}>Read-alouds or family TV</p>
        <p style={rhythmItemStyle}>Rest</p>
      </RhythmAccordion>

      {/* ── SCREENS — standalone, always visible ── */}
      <div style={{ margin: "14px 0 2px", padding: "13px 0 12px", borderTop: "0.5px solid var(--rule)", borderBottom: "0.5px solid var(--rule)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5V12l3 2" />
          </svg>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-lt)", margin: 0 }}>
            Screens&nbsp;&nbsp;Weekdays 2&ndash;5
            <span style={{ color: "var(--rule)", margin: "0 5px" }}>|</span>
            Weekends 11&ndash;4
          </p>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12.5, lineHeight: 1.6, color: "var(--ink-faint)", margin: "6px 0 0", paddingLeft: 22 }}>
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
