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

      {dayName === "Tuesday" && isVolunteerTuesday(viewDate) && (
        <div style={{
          margin: "6px 0 0",
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

      {NATURE_DAYS[dayName] === true && (
        <NatureStudy isToday={isToday} viewDate={viewDate} />
      )}

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

      <div style={{ height: "0.5px", background: "var(--rule)", margin: "28px 0 22px" }}></div>

      {/* DAILY ACTIVITY — today's pick during the day, tomorrow's setup in the evening */}
      {isToday && <DailyActivity isToday={isToday} viewDate={viewDate} />}

      <div style={{ height: "0.5px", background: "var(--rule)", margin: "26px 0 16px" }}></div>

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
