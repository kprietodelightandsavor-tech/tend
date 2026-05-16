import { useState, useEffect } from "react";
import { TERMS, HABIT_MONTHS, SPINE, getMonthsForTerm } from "../data/habit-term-seed";
import { supabase } from "../lib/supabase";

// ─── ICONS ────────────────────────────────────────────────────────────
const Icon = {
  ChevL: ({ color = "var(--ink-faint)" }) => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Lock: () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--ink-faint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  Leaf: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z" />
    </svg>
  ),
  Sprout: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12c-3 0-6-2-6-6 3 0 6 2 6 6z" />
      <path d="M12 12c3 0 6-2 6-6-3 0-6 2-6 6z" />
    </svg>
  ),
};

// ─── PERSISTENCE ──────────────────────────────────────────────────────
const STORAGE_KEY = "tend_habit_term_progress";
const WEEKLY_PRACTICE_KEY = "tend_habit_term_weekly_practice";

const loadProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
};

// Weekly practice check-ins are stored separately from lesson progress.
// Shape: { [monthId]: { 1: true, 2: false, 3: true, 4: false } }
const loadWeeklyPractice = () => {
  try {
    return JSON.parse(localStorage.getItem(WEEKLY_PRACTICE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveWeeklyPractice = (weekly) => {
  try {
    localStorage.setItem(WEEKLY_PRACTICE_KEY, JSON.stringify(weekly));
  } catch {}
};

const isLessonUnlocked = (progress, monthId, lessonNum) => {
  if (lessonNum === 1) return true;
  const completed = progress[monthId] || [];
  return completed.includes(lessonNum - 1);
};

const isLessonComplete = (progress, monthId, lessonNum) => {
  const completed = progress[monthId] || [];
  return completed.includes(lessonNum);
};

// Months unlock in sequence WITHIN their own term. The first month of
// each term is always open; later months unlock when the previous month
// in that same term is fully complete.
const isMonthUnlocked = (progress, termMonths, monthIdxInTerm) => {
  if (monthIdxInTerm === 0) return true;
  const prevMonth = termMonths[monthIdxInTerm - 1];
  const completed = progress[prevMonth.id] || [];
  return completed.length === prevMonth.lessons.length;
};

const getMonthProgress = (progress, month) => {
  const completed = (progress[month.id] || []).length;
  return { completed, total: month.lessons.length };
};

// ─── TERM OVERVIEW ────────────────────────────────────────────────────
// Renders every term in TERMS, each with its own header, arc strip,
// and month list. Months unlock within their own term independently.
function TermOverview({ progress, onSelectMonth }) {
  return (
    <div className="screen">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.Sprout />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Habit Terms</p>
        </div>
        <h1 className="display serif" style={{ marginBottom: 8 }}>
          Habit Study.
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 17,
            color: "var(--ink-faint)",
            lineHeight: 1.6,
          }}
        >
          A Charlotte Mason habit term walks one virtue, three months at a time.
        </p>
      </div>

      {TERMS.map((term, termIdx) => {
        const termMonths = getMonthsForTerm(term.id);
        const arcFaces = term.arc
          .split("→")
          .map((s) => s.trim())
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

        return (
          <div
            key={term.id}
            style={{ marginBottom: termIdx === TERMS.length - 1 ? 0 : 40 }}
          >
            {/* Term header */}
            <div style={{ marginBottom: 18 }}>
              <p
                style={{
                  fontSize: 10,
                  fontFamily: "'Lato', sans-serif",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--sage)",
                  marginBottom: 6,
                }}
              >
                Term {term.number}
              </p>
              <h2
                className="serif"
                style={{
                  fontSize: 27,
                  fontWeight: 400,
                  color: "var(--ink)",
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                {term.title}.
              </h2>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "var(--ink-faint)",
                  lineHeight: 1.6,
                }}
              >
                {term.description}
              </p>
            </div>

            {/* Arc strip */}
            <div
              style={{
                padding: "14px 18px",
                background: "var(--sage-bg)",
                borderLeft: "3px solid var(--sage)",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  color: "var(--ink)",
                  lineHeight: 1.5,
                }}
              >
                {arcFaces.join(" · ")}
              </p>
              {term.phrase && (
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "var(--ink-lt)",
                    marginTop: 4,
                    lineHeight: 1.6,
                  }}
                >
                  {term.phrase}
                </p>
              )}
            </div>

            {/* Month list */}
            <div>
              {termMonths.map((month, idx) => {
                const unlocked = isMonthUnlocked(progress, termMonths, idx);
                const { completed, total } = getMonthProgress(progress, month);
                const isComplete = total > 0 && completed === total;
                const isCurrent = unlocked && !isComplete;
                const notReady = total === 0;

                return (
                  <div
                    key={month.id}
                    onClick={() =>
                      unlocked && !notReady && onSelectMonth(month.id)
                    }
                    style={{
                      borderBottom:
                        idx === termMonths.length - 1
                          ? "none"
                          : "1px solid var(--rule)",
                      padding: "20px 0",
                      cursor: unlocked && !notReady ? "pointer" : "default",
                      opacity: unlocked ? 1 : 0.4,
                      transition: "opacity .3s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: `1.5px solid ${
                            isComplete
                              ? "var(--sage)"
                              : isCurrent
                              ? "var(--sage-md)"
                              : "var(--rule)"
                          }`,
                          background: isComplete ? "var(--sage)" : "var(--cream)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 15,
                          color: isComplete ? "white" : "var(--ink-faint)",
                        }}
                      >
                        {isComplete ? (
                          <Icon.Check />
                        ) : !unlocked ? (
                          <Icon.Lock />
                        ) : (
                          month.number
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: 4,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 10,
                              fontFamily: "'Lato', sans-serif",
                              letterSpacing: ".14em",
                              textTransform: "uppercase",
                              color: "var(--sage)",
                            }}
                          >
                            Month {month.number} · {month.subtitle}
                          </p>
                          {unlocked && !notReady && (
                            <p
                              style={{
                                fontSize: 10,
                                fontFamily: "'Lato', sans-serif",
                                letterSpacing: ".08em",
                                color: "var(--ink-faint)",
                              }}
                            >
                              {completed}/{total}
                            </p>
                          )}
                          {notReady && (
                            <p
                              style={{
                                fontSize: 10,
                                fontFamily: "'Lato', sans-serif",
                                letterSpacing: ".08em",
                                color: "var(--ink-faint)",
                                fontStyle: "italic",
                              }}
                            >
                              Coming soon
                            </p>
                          )}
                        </div>
                        <h3
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 22,
                            fontWeight: 400,
                            color: "var(--ink)",
                            marginBottom: 4,
                            lineHeight: 1.25,
                          }}
                        >
                          {month.title}
                        </h3>
                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontStyle: "italic",
                            fontSize: 14,
                            color: "var(--ink-lt)",
                            lineHeight: 1.6,
                          }}
                        >
                          Habit: {month.habit}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Spine attribution — shared across all terms */}
      {SPINE && (
        <div
          style={{
            padding: "10px 14px",
            border: "1px solid var(--rule)",
            borderRadius: 3,
            marginTop: 32,
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontFamily: "'Lato', sans-serif",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
              marginBottom: 4,
            }}
          >
            The Spine
          </p>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 13,
              color: "var(--ink)",
              marginBottom: 2,
            }}
          >
            {SPINE.title}
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 12,
              color: "var(--ink-faint)",
              lineHeight: 1.5,
            }}
          >
            by {SPINE.author}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── MONTH OVERVIEW ───────────────────────────────────────────────────
function MonthOverview({ month, progress, weekly, onWeeklyToggle, onBack, onSelectLesson }) {
  const { completed, total } = getMonthProgress(progress, month);

  return (
    <div className="screen">
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: 0,
          marginBottom: 18,
          color: "var(--ink-faint)",
        }}
      >
        <Icon.ChevL />
        <span
          style={{
            fontSize: 10,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Term
        </span>
      </button>

      <p
        style={{
          fontSize: 10,
          fontFamily: "'Lato', sans-serif",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--sage)",
          marginBottom: 8,
        }}
      >
        Month {month.number} · {month.subtitle}
      </p>
      <h1 className="display serif" style={{ marginBottom: 8, fontSize: 32 }}>
        {month.title}.
      </h1>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: 16,
          color: "var(--ink-faint)",
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        {month.habit} — {month.habitDefinition.toLowerCase()}.
      </p>

      <div
        style={{
          padding: "14px 18px",
          background: "var(--sage-bg)",
          borderLeft: "3px solid var(--sage)",
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontSize: 9,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--sage)",
            marginBottom: 6,
          }}
        >
          Phrase
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            color: "var(--ink)",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          "{month.phrase}"
        </p>
      </div>

      <div style={{ marginBottom: 22 }}>
        <p
          style={{
            fontSize: 10,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
            marginBottom: 8,
          }}
        >
          Family Focus
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 15,
            color: "var(--ink-lt)",
            lineHeight: 1.7,
          }}
        >
          {month.familyFocus}
        </p>
      </div>

      <div
        style={{
          padding: "12px 16px",
          border: "1px solid var(--rule)",
          borderRadius: 3,
          marginBottom: 26,
        }}
      >
        <p
          style={{
            fontSize: 9,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
            marginBottom: 6,
          }}
        >
          Parent Anchor · Read before Lesson 1
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 14,
            color: "var(--ink)",
            marginBottom: 2,
          }}
        >
          {month.parentAnchor.title}
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 12,
            color: "var(--ink-faint)",
            lineHeight: 1.5,
          }}
        >
          {month.parentAnchor.source} · {month.parentAnchor.pages}
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 12,
            color: "var(--ink-faint)",
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {month.parentAnchor.note}
        </p>
      </div>

      {month.weeklyPractice?.enabled && (
        <div style={{ marginBottom: 28 }}>
          <p
            className="eyebrow"
            style={{ marginBottom: 10, color: "var(--sage)" }}
          >
            Weekly Practice
          </p>
          <div
            style={{
              padding: "14px 16px 12px",
              background: "var(--sage-bg)",
              borderLeft: "3px solid var(--sage)",
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "var(--ink)",
                marginBottom: 4,
                lineHeight: 1.5,
              }}
            >
              "{month.weeklyPractice.reminderPhrase}"
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: 13,
                color: "var(--ink-lt)",
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              {month.weeklyPractice.reminderPractice}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.from({ length: month.weeklyPractice.weeks }, (_, i) => i + 1).map(
                (weekNum) => {
                  const isChecked = !!(weekly && weekly[weekNum]);
                  return (
                    <div
                      key={weekNum}
                      onClick={() => onWeeklyToggle(weekNum)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        padding: "4px 0",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 2,
                          border: `1.5px solid ${isChecked ? "var(--sage)" : "var(--sage-md)"}`,
                          background: isChecked ? "var(--sage)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all .2s",
                        }}
                      >
                        {isChecked && <Icon.Check />}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 14,
                          color: isChecked ? "var(--sage)" : "var(--ink-lt)",
                          fontStyle: isChecked ? "italic" : "normal",
                          flex: 1,
                        }}
                      >
                        {isChecked
                          ? `Week ${weekNum} · ${month.weeklyPractice.affirmation}`
                          : `Week ${weekNum} · ${month.weeklyPractice.prompt}`}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>Lessons</p>
        <p
          style={{
            fontSize: 10,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".08em",
            color: "var(--ink-faint)",
          }}
        >
          {completed} of {total} complete
        </p>
      </div>

      <div>
        {month.lessons.map((lesson, idx) => {
          const unlocked = isLessonUnlocked(progress, month.id, lesson.number);
          const complete = isLessonComplete(progress, month.id, lesson.number);

          return (
            <div
              key={lesson.number}
              onClick={() => unlocked && onSelectLesson(lesson.number)}
              style={{
                borderBottom: idx === month.lessons.length - 1 ? "none" : "1px solid var(--rule)",
                padding: "14px 0",
                cursor: unlocked ? "pointer" : "default",
                opacity: complete ? 0.5 : unlocked ? 1 : 0.4,
                transition: "opacity .3s",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `1.5px solid ${complete ? "var(--sage)" : "var(--rule)"}`,
                  background: complete ? "var(--sage)" : "var(--cream)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 12,
                  color: complete ? "white" : "var(--ink-faint)",
                }}
              >
                {complete ? <Icon.Check /> : !unlocked ? <Icon.Lock /> : lesson.number}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 15,
                    color: complete ? "var(--ink-faint)" : "var(--ink)",
                    textDecoration: complete ? "line-through" : "none",
                    textDecorationColor: "var(--sage-md)",
                    lineHeight: 1.3,
                  }}
                >
                  {lesson.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LESSON DETAIL ────────────────────────────────────────────────────
function LessonDetail({ month, lesson, isLast, onBack, onComplete }) {
  const [showTeen, setShowTeen] = useState(false);
  const isMidMonth = lesson.midMonth;
  const practiceBegins = lesson.practiceBegins;

  return (
    <div className="screen">
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: 0,
          marginBottom: 18,
          color: "var(--ink-faint)",
        }}
      >
        <Icon.ChevL />
        <span
          style={{
            fontSize: 10,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          {month.title}
        </span>
      </button>

      <p
        style={{
          fontSize: 10,
          fontFamily: "'Lato', sans-serif",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--sage)",
          marginBottom: 6,
        }}
      >
        Lesson {lesson.number}
      </p>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 400,
          color: "var(--ink)",
          marginBottom: 24,
          lineHeight: 1.2,
        }}
      >
        {lesson.title}.
      </h1>

      {practiceBegins && (
        <div
          style={{
            padding: "12px 16px",
            background: "var(--gold-bg, #FAF3E3)",
            border: "1px solid #E0CBA8",
            borderRadius: 3,
            marginBottom: 22,
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontFamily: "'Lato', sans-serif",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--gold, #B89855)",
              marginBottom: 6,
            }}
          >
            Practice begins this week
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14,
              color: "var(--ink-lt)",
              lineHeight: 1.65,
              fontStyle: "italic",
            }}
          >
            {month.practiceText}
          </p>
        </div>
      )}

      {/* FAMILY */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Icon.Leaf />
          <p className="eyebrow" style={{ marginBottom: 0 }}>For the Family</p>
        </div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16,
            color: "var(--ink)",
            lineHeight: 1.75,
          }}
        >
          {lesson.family}
        </p>
      </div>

      {isMidMonth && (
        <div
          style={{
            padding: "14px 18px",
            background: "var(--sage-bg)",
            borderLeft: "3px solid var(--sage)",
            marginBottom: 28,
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontFamily: "'Lato', sans-serif",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--sage)",
              marginBottom: 6,
            }}
          >
            Mid-month tea question
          </p>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 15,
              color: "var(--ink)",
              lineHeight: 1.55,
              fontStyle: "italic",
            }}
          >
            {month.midMonthQuestion}
          </p>
        </div>
      )}

      {/* TEEN LINK */}
      <div
        style={{
          border: "1px solid var(--rule)",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 28,
        }}
      >
        <button
          onClick={() => setShowTeen((s) => !s)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: showTeen ? "var(--sage-bg)" : "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background .2s",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 9,
                fontFamily: "'Lato', sans-serif",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--sage)",
                marginBottom: 2,
              }}
            >
              Teen Link
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: 13,
                color: "var(--ink-faint)",
              }}
            >
              For older readers
            </p>
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{showTeen ? "↑" : "↓"}</span>
        </button>

        {showTeen && (
          <div style={{ padding: "16px 16px 18px", borderTop: "1px solid var(--rule)" }}>
            {lesson.teen.reading && (
              <div style={{ marginBottom: 14 }}>
                <p
                  style={{
                    fontSize: 9,
                    fontFamily: "'Lato', sans-serif",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    marginBottom: 4,
                  }}
                >
                  Reading
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 14,
                    color: "var(--ink)",
                    lineHeight: 1.5,
                    marginBottom: 2,
                  }}
                >
                  {lesson.teen.reading}
                </p>
                {lesson.teen.source && (
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 12,
                      color: "var(--ink-faint)",
                    }}
                  >
                    {lesson.teen.source}
                  </p>
                )}
              </div>
            )}

            {lesson.teen.quote && (
              <div style={{ marginBottom: 14 }}>
                <p
                  style={{
                    fontSize: 9,
                    fontFamily: "'Lato', sans-serif",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    marginBottom: 4,
                  }}
                >
                  Quote
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "var(--ink-lt)",
                    lineHeight: 1.65,
                  }}
                >
                  "{lesson.teen.quote}"
                </p>
              </div>
            )}

            {lesson.teen.experiment && (
              <div style={{ marginBottom: 14 }}>
                <p
                  style={{
                    fontSize: 9,
                    fontFamily: "'Lato', sans-serif",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    marginBottom: 4,
                  }}
                >
                  Experiment
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14,
                    color: "var(--ink-lt)",
                    lineHeight: 1.65,
                  }}
                >
                  {lesson.teen.experiment}
                </p>
              </div>
            )}

            {lesson.teen.question && (
              <div style={{ marginBottom: 14 }}>
                <p
                  style={{
                    fontSize: 9,
                    fontFamily: "'Lato', sans-serif",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    marginBottom: 4,
                  }}
                >
                  One-on-one question
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 14,
                    color: "var(--ink)",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  "{lesson.teen.question}"
                </p>
              </div>
            )}

            {lesson.teen.note && (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 12,
                  color: "var(--ink-faint)",
                  lineHeight: 1.6,
                  paddingTop: 8,
                  borderTop: "1px solid var(--rule)",
                  marginTop: 8,
                }}
              >
                {lesson.teen.note}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onComplete}
        style={{
          width: "100%",
          padding: "14px",
          background: "var(--sage)",
          color: "white",
          border: "none",
          borderRadius: 3,
          cursor: "pointer",
          fontSize: 11,
          fontFamily: "'Lato', sans-serif",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          marginBottom: 28,
        }}
      >
        {isLast ? "Complete this month" : "Mark complete · unlock next lesson"}
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function HabitTermScreen({ settings }) {
  const [progress, setProgress] = useState(loadProgress);
  const [weeklyPractice, setWeeklyPractice] = useState(loadWeeklyPractice);
  const [view, setView] = useState({ level: "term", monthId: null, lessonNum: null });
  const [synced, setSynced] = useState(false);

  // Sync from server on mount
  useEffect(() => {
    if (!settings?.userId || synced) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("habit_term_progress")
          .select("progress, weekly_practice")
          .eq("user_id", settings.userId)
          .single();
        if (data?.progress) {
          setProgress(data.progress);
          saveProgress(data.progress);
        }
        if (data?.weekly_practice) {
          setWeeklyPractice(data.weekly_practice);
          saveWeeklyPractice(data.weekly_practice);
        }
      } catch {}
      setSynced(true);
    })();
  }, [settings?.userId, synced]);

  const persistProgress = (next) => {
    setProgress(next);
    saveProgress(next);
    if (settings?.userId) {
      supabase
        .from("habit_term_progress")
        .upsert({
          user_id: settings.userId,
          progress: next,
          weekly_practice: weeklyPractice,
          updated_at: new Date().toISOString(),
        })
        .then(() => {}, () => {});
    }
  };

  const persistWeekly = (next) => {
    setWeeklyPractice(next);
    saveWeeklyPractice(next);
    if (settings?.userId) {
      supabase
        .from("habit_term_progress")
        .upsert({
          user_id: settings.userId,
          progress,
          weekly_practice: next,
          updated_at: new Date().toISOString(),
        })
        .then(() => {}, () => {});
    }
  };

  const handleSelectMonth = (monthId) => {
    setView({ level: "month", monthId, lessonNum: null });
  };

  const handleSelectLesson = (lessonNum) => {
    setView({ ...view, level: "lesson", lessonNum });
  };

  const handleBack = () => {
    if (view.level === "lesson") setView({ ...view, level: "month", lessonNum: null });
    else if (view.level === "month") setView({ level: "term", monthId: null, lessonNum: null });
  };

  const handleComplete = () => {
    const { monthId, lessonNum } = view;
    const monthCompleted = progress[monthId] || [];
    if (!monthCompleted.includes(lessonNum)) {
      const next = {
        ...progress,
        [monthId]: [...monthCompleted, lessonNum].sort((a, b) => a - b),
      };
      persistProgress(next);
    }
    setView({ ...view, level: "month", lessonNum: null });
  };

  const handleWeeklyToggle = (monthId, weekNum) => {
    const current = weeklyPractice[monthId] || {};
    const next = {
      ...weeklyPractice,
      [monthId]: {
        ...current,
        [weekNum]: !current[weekNum],
      },
    };
    persistWeekly(next);
  };

  if (view.level === "term") {
    return <TermOverview progress={progress} onSelectMonth={handleSelectMonth} />;
  }

  const month = HABIT_MONTHS.find((m) => m.id === view.monthId);
  if (!month) {
    setView({ level: "term", monthId: null, lessonNum: null });
    return null;
  }

  if (view.level === "month") {
    return (
      <MonthOverview
        month={month}
        progress={progress}
        weekly={weeklyPractice[month.id] || {}}
        onWeeklyToggle={(weekNum) => handleWeeklyToggle(month.id, weekNum)}
        onBack={handleBack}
        onSelectLesson={handleSelectLesson}
      />
    );
  }

  const lesson = month.lessons.find((l) => l.number === view.lessonNum);
  const isLast = view.lessonNum === month.lessons.length;
  return (
    <LessonDetail
      month={month}
      lesson={lesson}
      isLast={isLast}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
}
