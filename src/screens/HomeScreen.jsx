import { useState, useRef, useEffect } from "react";
import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES, RISE_SHINE_ITEMS, getSaturdayRhythm, getSundayRhythm, NATURE_DAYS, NATURE_LOOP_STEPS, getNatureLoopStep, advanceNatureLoop } from "../data/seed";
import {
  SUMMER_MORNING_ANCHORS,
  getEveningAnchors,
  getSummerDayBlocks,
  getActivityChoices,
  getTomorrowActivity,
  isEveningSetupTime,
} from "../data/summer-seed";
import {
  FAMILY_BIBLE_STREAMS,
  getStreamView,
  markStreamComplete,
  undoStreamComplete,
} from "../data/family-bible-seed";
import { supabase } from "../lib/supabase";

// ─── BEAUTY LOOP — simple weekly rotation ──────────────────────────────
// Anchor: Monday May 4, 2026 = Week A (Artist / Folk Song / Composer)
const BEAUTY_ANCHOR = new Date("2026-05-04T00:00:00");

function getBeautyWeekParity(date = new Date()) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSince = Math.floor((date - BEAUTY_ANCHOR) / msPerWeek);
  return weeksSince % 2 === 0 ? "A" : "B";
}

// Get today's beauty subjects
// Returns array of { label, scheduled: bool, isPrimary: bool }
// scheduled = the one currently in rotation this week
// isPrimary = always shown (Biography on Wed)
function getTodayBeauty(dayName, isSummer = false) {
  const week = getBeautyWeekParity();

  if (dayName === "Monday") {
    return week === "A"
      ? [{ label: "Artist Study", scheduled: true }, { label: "Poet Study", scheduled: false }]
      : [{ label: "Poet Study", scheduled: true }, { label: "Artist Study", scheduled: false }];
  }

  if (dayName === "Tuesday") {
    return [{ label: "Natural History", scheduled: true }];
  }

  if (dayName === "Wednesday") {
    if (isSummer) {
      // Summer: just Folk Song (no Biography, no Recitation)
      return [{ label: "Folk Song", scheduled: true }];
    }
    // School year: Biography always + rotating Folk Song / Recitation
    const rotating = week === "A"
      ? [{ label: "Folk Song", scheduled: true }, { label: "Recitation", scheduled: false }]
      : [{ label: "Recitation", scheduled: true }, { label: "Folk Song", scheduled: false }];
    return [{ label: "Biography", scheduled: true, isPrimary: true }, ...rotating];
  }

  if (dayName === "Friday") {
    return week === "A"
      ? [{ label: "Composer Study", scheduled: true }, { label: "Hymn Study", scheduled: false }]
      : [{ label: "Hymn Study", scheduled: true }, { label: "Composer Study", scheduled: false }];
  }

  return null; // Thursday, Saturday, Sunday — no beauty card
}

const Icon = {
  Leaf:    () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Sun:     () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Arrow:   () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  ChevL:   ({ color = "var(--ink-faint)" }) => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>),
  ChevR:   ({ color = "var(--ink-faint)" }) => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  Camera:  ({ color = "var(--sage)" }) => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>),
  X:       () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

const WeekendIcon = {
  Family:     () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16"/><path d="M5 11v8"/><path d="M19 11v8"/><circle cx="8" cy="14" r="0.6" fill="currentColor"/><circle cx="12" cy="14" r="0.6" fill="currentColor"/><circle cx="16" cy="14" r="0.6" fill="currentColor"/><path d="M3 19h18"/></svg>),
  Creativity: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l5-5"/><path d="M9 15l4-4 5 5-4 4z"/><path d="M14 10l3-3a2 2 0 012.8 2.8l-3 3"/></svg>),
  Body:       () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>),
  Horses:     () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21V11c0-3 2-5 5-5s5 2 5 5v10"/><path d="M7 21h10"/><path d="M9 14h6"/></svg>),
  Ranch:      () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M9 7c1 0 2 1 3 2 1-1 2-2 3-2"/><path d="M9 11c1 0 2 1 3 2 1-1 2-2 3-2"/><path d="M9 15c1 0 2 1 3 2 1-1 2-2 3-2"/></svg>),
};

const WEEKEND_INVITATIONS = {
  family:     { label: "Family",     icon: WeekendIcon.Family,     prompts: ["Who haven't you looked at lately?", "Is there a meal worth slowing down for?", "Anyone owed a long conversation?"] },
  creativity: { label: "Creativity", icon: WeekendIcon.Creativity, prompts: ["What's been sitting half-finished?", "Is there something you've been wanting to try?", "Old project or new one?"] },
  body:       { label: "Body",       icon: WeekendIcon.Body,       prompts: ["Walk, ride, swim, or sit?", "Strength training today?", "Stretch or yoga session?", "Where would the water be good today?", "What kind of tired do you want to be tonight?"] },
  horses:     { label: "Horses",     icon: WeekendIcon.Horses,     prompts: ["Saddle one up?", "Round pen work today?", "Who hasn't been brushed in a while?", "Is anyone limping or favoring something?", "Just go say hello?"] },
  ranch:      { label: "Ranch",      icon: WeekendIcon.Ranch,      prompts: ["What have you been ignoring?", "Anything broken that's nagging at you?", "Is there a corner that needs ten minutes?"] },
};
const WEEKEND_ORDER = ["family", "creativity", "body", "horses", "ranch"];

const getBlockColor = (subject) => {
  const s = subject.toLowerCase();
  if (s.includes("rise") || s.includes("bible") || s.includes("memory") || s.includes("living literature") || s.includes("hymn") || s.includes("read-aloud") || s.includes("read aloud")) return "var(--block-morning)";
  if (s.includes("math") || s.includes("language") || s.includes("writing") || s.includes("copywork") || s.includes("history") || s.includes("science") || s.includes("geography") || s.includes("spanish") || s.includes("reading") || s.includes("commonplace") || s.includes("rotation")) return "var(--block-academic)";
  if (s.includes("nature") || s.includes("outdoor") || s.includes("artist") || s.includes("composer") || s.includes("beauty") || s.includes("poet") || s.includes("biography") || s.includes("folk song")) return "var(--block-nature)";
  if (s.includes("co-op") || s.includes("bach") || s.includes("chispa") || s.includes("tennis") || s.includes("volunteer") || s.includes("swim") || s.includes("river")) return "var(--block-coop)";
  if (s.includes("lunch") || s.includes("free") || s.includes("rest") || s.includes("afternoon") || s.includes("break") || s.includes("pursuits") || s.includes("reset") || s.includes("flex")) return "var(--block-free)";
  return "var(--rule)";
};

const FREE_KEYWORDS = ["rise", "chores", "piano", "free", "rest", "independent", "lunch", "outdoor", "nature", "afternoon", "pursuits", "break", "reset", "flex"];
const isFreeBlock = (subject) => FREE_KEYWORDS.some(k => subject.toLowerCase().includes(k));

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayOffset(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function PremiumModal({ onClose }) {
  const FREE_FEATURES = [
    "Daily schedule — one repeating template",
    "Outdoor time tracker toward your weekly goal",
    "Consider the Lilies — up to 3 journal entries",
    "One habit focus (Attention) with today's ideas",
    "5 free narration sessions",
    "One student profile",
    "Daily Mother Culture prompt",
    "CM quote of the day",
  ];
  const PREMIUM_FEATURES = [
    "Full weekly planner — different schedule per day, editable blocks",
    "Week grid view — see your whole week at a glance",
    "Beauty Loop anchored to your daily subjects",
    "Term counter with rest week gentle rhythm",
    "All five Charlotte Mason habits with 12-week reflection",
    "Unlimited Consider the Lilies entries for every family member",
    "Unlimited narration sessions with AI coaching",
    "Unlimited student profiles with narration history",
    "Full rotating Mother Culture prompt bank",
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 52px", maxHeight: "92dvh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>Delight & Savor</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: "var(--ink)" }}>Tend Premium</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", marginTop: 4 }}><Icon.X /></button>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", marginBottom: 24, lineHeight: 1.8 }}>Beauty. Meaning. Connection.</p>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Free — always</p>
          {FREE_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "18px", marginBottom: 28 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 14 }}>Premium — everything above, plus</p>
          {PREMIUM_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✦</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>
        <a href="https://delightnsavor.gumroad.com/l/qrxxi" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "var(--sage)", borderRadius: 2, padding: "14px 0", width: "100%", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "white", textAlign: "center", textDecoration: "none", marginBottom: 12 }}>
          Join Tend Premium →
        </a>
        <button onClick={onClose} style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "11px 0", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

async function loadDailyState(userId, date) {
  try {
    const res = await fetch("/.netlify/functions/daily-state", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ method: "get", userId, date }) });
    const data = await res.json();
    return data.state || null;
  } catch { return null; }
}

async function saveDailyState(userId, date, state) {
  try {
    await fetch("/.netlify/functions/daily-state", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ method: "set", userId, date, state }) });
  } catch {}
}

const SCHEDULE_KEY = "tend_schedule_state";
const DAILY_OFFSET_KEY = "tend_daily_offset";
const ANCHORS_KEY = "tend_summer_anchors";
const EVE_ANCHORS_KEY = "tend_summer_evening_anchors";
const FB_EXPANDED_KEY = "tend_fb_expanded";
const SKIP_SUBJECTS = ["Rise & Shine", "Lunch", "Outdoor Break", "Afternoon Pursuits", "House Reset & Animal Chores", "Tuesday Rhythm", "Tennis"];

// ─── BEAUTY CARD ────────────────────────────────────────────────────────
function BeautyCard({ dayName, isSummer }) {
  const items = getTodayBeauty(dayName, isSummer);
  if (!items || items.length === 0) return null;

  return (
    <div style={{
      background: "var(--cream)",
      border: "1px solid var(--rule)",
      borderLeft: "3px solid var(--sage)",
      borderRadius: 3,
      padding: "12px 14px 14px",
      marginBottom: 24,
    }}>
      <p style={{
        fontSize: 9,
        fontFamily: "'Lato', sans-serif",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        color: "var(--sage)",
        marginBottom: 10,
      }}>
        Today's Beauty
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            {item.scheduled ? (
              <>
                <span style={{ color: "var(--sage)", fontSize: 11, lineHeight: 1, flexShrink: 0 }}>✦</span>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 15,
                  color: "var(--sage)",
                  fontWeight: 500,
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {item.label}
                </p>
              </>
            ) : (
              <>
                <span style={{ width: 11, flexShrink: 0 }} />
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 14,
                  color: "var(--ink-faint)",
                  fontWeight: 400,
                  margin: 0,
                  lineHeight: 1.4,
                  opacity: 0.7,
                }}>
                  {item.label}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAMILY BIBLE STUDY CARD (collapsible) ─────────────────────────────
function FamilyBibleStudy() {
  const [expanded, setExpanded] = useState(() => {
    try {
      const dateKey = new Date().toISOString().slice(0, 10);
      const saved = JSON.parse(localStorage.getItem(FB_EXPANDED_KEY) || "null");
      if (saved?.date === dateKey) return !!saved.expanded;
    } catch {}
    return false;
  });

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    try {
      const dateKey = new Date().toISOString().slice(0, 10);
      localStorage.setItem(FB_EXPANDED_KEY, JSON.stringify({ date: dateKey, expanded: next }));
    } catch {}
  };

  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const handleComplete = (stream) => { markStreamComplete(stream); refresh(); };
  const handleUndo = (stream) => { undoStreamComplete(stream); refresh(); };

  const streamProgress = FAMILY_BIBLE_STREAMS.map(stream => {
    const view = getStreamView(stream);
    return { id: stream.id, hasCompleted: view.completed.length > 0 };
  });

  return (
    <div style={{ background: "var(--cream)", border: "1px solid var(--sage-md)", borderRadius: 4, marginBottom: 24, overflow: "hidden" }}>
      <div onClick={toggleExpanded} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 0 }}>
            Family Bible Study
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {streamProgress.map(p => (
              <div key={p.id} style={{
                width: 7, height: 7, borderRadius: "50%",
                background: p.hasCompleted ? "var(--sage)" : "transparent",
                border: `1.5px solid ${p.hasCompleted ? "var(--sage)" : "var(--sage-md)"}`,
                transition: "all .2s",
              }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "'Lato', sans-serif", letterSpacing: ".05em", lineHeight: 1 }}>
            {expanded ? "↑" : "↓"}
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 18px 16px", borderTop: "1px solid var(--rule)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", marginTop: 12, marginBottom: 8, lineHeight: 1.5 }}>
            Read what fits the day. Tap to mark complete.
          </p>

          {FAMILY_BIBLE_STREAMS.map((stream, idx) => {
            const view = getStreamView(stream);
            const isLast = idx === FAMILY_BIBLE_STREAMS.length - 1;

            if (!view.active && view.completed.length === 0) {
              return (
                <div key={stream.id} style={{ padding: "10px 0", borderBottom: isLast ? "none" : "1px solid var(--rule)", opacity: 0.5 }}>
                  <p style={{ fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 2 }}>
                    {stream.label}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)" }}>
                    Complete · add more readings in settings
                  </p>
                </div>
              );
            }

            return (
              <div key={stream.id} style={{ padding: "10px 0", borderBottom: isLast ? "none" : "1px solid var(--rule)" }}>
                <p style={{ fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 6 }}>
                  {stream.label}
                </p>

                {view.active && (
                  <div onClick={() => handleComplete(stream)} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", padding: "4px 0" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 2, border: "1.5px solid var(--rule)", background: "none", flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      {view.active.label && (
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>
                          {view.active.label}
                        </p>
                      )}
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: view.active.label ? 13 : 14, color: view.active.label ? "var(--ink-lt)" : "var(--ink)", lineHeight: 1.5 }}>
                        {view.active.reference}
                      </p>
                    </div>
                  </div>
                )}

                {view.completed.length > 0 && (
                  <div style={{ marginTop: view.active ? 8 : 0 }}>
                    {view.completed.map((reading, i) => (
                      <div key={reading.id} onClick={() => i === view.completed.length - 1 && handleUndo(stream)} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "3px 0", opacity: 0.45, cursor: i === view.completed.length - 1 ? "pointer" : "default" }}>
                        <div style={{ width: 16, height: 16, borderRadius: 2, border: "1.5px solid var(--sage)", background: "var(--sage)", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          {reading.label && (
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "var(--ink-faint)", textDecoration: "line-through", textDecorationColor: "var(--sage-md)", marginBottom: 1 }}>
                              {reading.label}
                            </p>
                          )}
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: reading.label ? 12 : 13, color: "var(--ink-faint)", textDecoration: "line-through", textDecorationColor: "var(--sage-md)", lineHeight: 1.4 }}>
                            {reading.reference}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MorningAnchors() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const [done, setDone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(ANCHORS_KEY) || "null");
      if (saved?.date === dateKey) return saved.done;
    } catch {}
    return {};
  });

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    try { localStorage.setItem(ANCHORS_KEY, JSON.stringify({ date: dateKey, done: next })); } catch {}
  };

  return (
    <div className="anchors-card">
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
        Morning Anchors
      </p>
      {SUMMER_MORNING_ANCHORS.map(anchor => {
        const isDone = !!done[anchor.id];
        return (
          <div key={anchor.id} onClick={() => toggle(anchor.id)} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", cursor: "pointer", opacity: isDone ? 0.5 : 1, transition: "opacity .2s" }}>
            <div style={{ width: 16, height: 16, borderRadius: 2, border: `1.5px solid ${isDone ? "var(--sage)" : "var(--rule)"}`, background: isDone ? "var(--sage)" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              {isDone && <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", color: isDone ? "var(--ink-faint)" : "var(--ink)", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>
                {anchor.label}
              </p>
              {anchor.note && !isDone && (
                <p style={{ fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5, marginTop: 2 }}>
                  {anchor.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EveningAnchors({ dayName }) {
  const dateKey = new Date().toISOString().slice(0, 10);
  const anchors = getEveningAnchors(dayName);
  const [done, setDone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(EVE_ANCHORS_KEY) || "null");
      if (saved?.date === dateKey) return saved.done;
    } catch {}
    return {};
  });

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    try { localStorage.setItem(EVE_ANCHORS_KEY, JSON.stringify({ date: dateKey, done: next })); } catch {}
  };

  return (
    <div className="anchors-card">
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
        Day's Rhythm
      </p>
      {anchors.map(anchor => {
        const isDone = !!done[anchor.id];
        return (
          <div key={anchor.id} onClick={() => toggle(anchor.id)} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", cursor: "pointer", opacity: isDone ? 0.5 : 1, transition: "opacity .2s" }}>
            <div style={{ width: 16, height: 16, borderRadius: 2, border: `1.5px solid ${isDone ? "var(--sage)" : "var(--rule)"}`, background: isDone ? "var(--sage)" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              {isDone && <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", color: isDone ? "var(--ink-faint)" : "var(--ink)", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>
                {anchor.label}
              </p>
              {anchor.note && !isDone && (
                <p style={{ fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5, marginTop: 2 }}>
                  {anchor.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MorningActivityCard() {
  const evening = isEveningSetupTime();
  const choices = getActivityChoices(new Date(), 3);
  const tomorrow = getTomorrowActivity();
  const [selected, setSelected] = useState(() => {
    const dateKey = new Date().toISOString().slice(0, 10);
    try { return JSON.parse(localStorage.getItem(`tend_morning_pick_${dateKey}`) || "null"); }
    catch { return null; }
  });

  const pickActivity = (activity) => {
    const dateKey = new Date().toISOString().slice(0, 10);
    setSelected(activity);
    try { localStorage.setItem(`tend_morning_pick_${dateKey}`, JSON.stringify(activity)); } catch {}
  };

  if (evening) {
    return (
      <div className="morning-activity morning-activity-evening">
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>Set up for tomorrow morning</p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>{tomorrow.label}</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-lt)", lineHeight: 1.6, marginBottom: 4 }}>
          <strong style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontStyle: "normal", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", fontWeight: 400 }}>Tonight: </strong>
          {tomorrow.setup}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6 }}>
          <strong style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontStyle: "normal", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 400 }}>They'll need: </strong>
          {tomorrow.kidsNeed}
        </p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="morning-activity">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)" }}>Today's Morning Activity</p>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", color: "var(--ink-faint)", cursor: "pointer", textTransform: "uppercase" }}>Change</button>
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>{selected.label}</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-lt)", lineHeight: 1.6 }}>{selected.kidsNeed}</p>
      </div>
    );
  }

  return (
    <div className="morning-activity">
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 10 }}>Pick a morning activity</p>
      {choices.map(choice => (
        <div key={choice.id} onClick={() => pickActivity(choice)} style={{ borderTop: "1px solid var(--rule)", padding: "10px 0", cursor: "pointer" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>{choice.label}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)", lineHeight: 1.5 }}>{choice.kidsNeed}</p>
        </div>
      ))}
    </div>
  );
}

function ScreensBanner() {
  return (
    <div className="screens-banner">
      <strong>Phones</strong>
      <span>on the counter from 8:30 — yours included — until 2:00. Screens allowed 2:00–4:00, then back on the counter.</span>
    </div>
  );
}

function MemoryVerseBlock({ items, blockId, subChecked, onToggle, viewOnly }) {
  const [expanded, setExpanded] = useState(false);
  const memoryIdx = items.findIndex(i => typeof i === "string" && i.toLowerCase().includes("memory"));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, idx) => {
        const checked = subChecked?.[idx];
        const isMemory = idx === memoryIdx;
        if (isMemory) {
          return (
            <div key={idx} style={{ borderRadius: 3, border: "1px solid var(--rule)", overflow: "hidden" }}>
              <button onClick={() => setExpanded(e => !e)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "none", border: "none", cursor: "pointer" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--sage)" }}>Memory Verse</span>
                <span style={{ fontSize: 10, color: "var(--ink-faint)" }}>{expanded ? "↑" : "↓"}</span>
              </button>
              {expanded && (
                <div style={{ padding: "4px 10px 10px" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 8 }}>{item}</p>
                  {!viewOnly && (
                    <button onClick={() => onToggle(idx)} style={{ background: checked ? "var(--sage-bg)" : "none", border: `1px solid ${checked ? "var(--sage)" : "var(--rule)"}`, borderRadius: 20, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: checked ? "var(--sage)" : "var(--ink-faint)", textDecoration: checked ? "line-through" : "none" }}>
                      {checked ? "recited ✦" : "mark recited"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        }
        return (
          <button key={idx} onClick={() => !viewOnly && onToggle(idx)} disabled={viewOnly} style={{ background: checked ? "var(--sage-bg)" : "none", border: `1px solid ${checked ? "var(--sage)" : "var(--rule)"}`, borderRadius: 20, padding: "4px 10px", cursor: viewOnly ? "default" : "pointer", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: checked ? "var(--sage)" : "var(--ink-faint)", transition: "all .2s", textDecoration: checked ? "line-through" : "none", alignSelf: "flex-start" }}>
            {item}
          </button>
        );
      })}
    </div>
  );
}

function WeekendInvitations({ dayName }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 14 }}>{dayName}</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: "var(--ink)", marginBottom: 6, lineHeight: 1.2 }}>This day is yours.</h2>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "var(--ink-faint)", lineHeight: 1.6, marginBottom: 28 }}>What does it want to hold?</p>
      <div>
        {WEEKEND_ORDER.map((id, idx) => {
          const inv = WEEKEND_INVITATIONS[id];
          const IconComp = inv.icon;
          const isOpen = openId === id;
          const isLast = idx === WEEKEND_ORDER.length - 1;
          return (
            <div key={id} style={{ borderBottom: isLast ? "none" : "1px solid var(--rule)" }}>
              <div onClick={() => setOpenId(isOpen ? null : id)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 4px", cursor: "pointer" }}>
                <div style={{ color: isOpen ? "var(--sage)" : "var(--ink-faint)", transition: "color .2s", flexShrink: 0 }}><IconComp /></div>
                <p style={{ flex: 1, fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--ink)", fontWeight: 400 }}>{inv.label}</p>
              </div>
              {isOpen && (
                <div style={{ paddingLeft: 36, paddingBottom: 18, paddingTop: 0, borderLeft: "2px solid var(--sage)", marginLeft: 9, marginBottom: 4 }}>
                  {inv.prompts.map((prompt, i) => (
                    <p key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.7, marginBottom: i === inv.prompts.length - 1 ? 0 : 8 }}>{prompt}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodaySchedule({ today, blocks, onNavigate, settings, week, dailyOffset, viewDate, isToday, isViewOnly }) {
  const dateKey = viewDate.toISOString().slice(0, 10);
  const userId  = settings?.userId;
  const [synced, setSynced] = useState(false);

  const [subjectNotes, setSubjectNotes] = useState({});
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState("");

  useEffect(() => { if (userId) loadSubjectNotes(); }, [userId, dateKey]);

  const loadSubjectNotes = async () => {
    try {
      const { data, error } = await supabase.from("subject_notes").select("*").eq("user_id", userId).eq("date", dateKey);
      if (error) throw error;
      const notesMap = {};
      (data || []).forEach(note => { notesMap[note.subject] = note.notes; });
      setSubjectNotes(notesMap);
    } catch (err) { console.error("Error loading notes:", err); }
  };

  const saveSubjectNote = async (subject, text) => {
    if (!userId) return;
    try {
      const { error } = await supabase.from("subject_notes").upsert({ user_id: userId, date: dateKey, subject, notes: text || null, updated_at: new Date().toISOString() });
      if (error) throw error;
      setSubjectNotes(prev => ({ ...prev, [subject]: text }));
      setEditingNotes(null);
    } catch (err) { console.error("Error saving note:", err); alert("Error saving note. Please try again."); }
  };

  const logToTeachingRecord = async (block, status) => {
    if (!userId) return;
    if (SKIP_SUBJECTS.some(s => block.subject.includes(s))) return;
    if (block.free) return;
    const y = new Date().getFullYear(), m = new Date().getMonth();
    const schoolYear = m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
    fetch("/.netlify/functions/teaching-log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ method: "upsert", userId, date: dateKey, subject: block.subject, timeBlock: block.time || null, note: block.note || null, status, schoolYear }) }).catch(() => {});
  };

  const defaultItems = () => blocks.map(b => ({ ...b, status: "pending", motherNote: "", subChecked: {} }));
  const [items, setItems] = useState(() => {
    if (!isToday) return defaultItems();
    try {
      const saved = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || "null");
      if (saved && saved.date === dateKey && saved.day === today) return saved.items;
    } catch {}
    return defaultItems();
  });

  useEffect(() => {
    if (!isToday) { setItems(defaultItems()); return; }
    try {
      const saved = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || "null");
      if (saved && saved.date === dateKey && saved.day === today) { setItems(saved.items); return; }
    } catch {}
    setItems(defaultItems());
  }, [dateKey, today, isToday]);

  useEffect(() => {
    if (!userId || synced || !isToday) return;
    loadDailyState(userId, dateKey).then(remote => {
      if (remote?.items && remote?.day === today) {
        setItems(remote.items);
        try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: remote.items })); } catch {}
      }
      setSynced(true);
    });
  }, [userId, isToday]);

  const persist = (newItems) => {
    if (isViewOnly) return;
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: newItems })); } catch {}
    if (userId) saveDailyState(userId, dateKey, { day: today, items: newItems });
  };

  const toggleDone = (id) => {
    if (isViewOnly) return;
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      if (!t) return prev;
      let next;
      if (t.status === "skipped" || t.status === "done") {
        next = prev.map(b => b.id === id ? { ...b, status: "pending" } : b).sort((a, b) => blocks.findIndex(x => x.id === a.id) - blocks.findIndex(x => x.id === b.id));
        if (userId) {
          fetch("/.netlify/functions/teaching-log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ method: "delete", userId, date: dateKey, subject: t.subject }) }).catch(() => {});
        }
      } else {
        const u = prev.map(b => b.id === id ? { ...b, status: "done" } : b);
        next = [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
        logToTeachingRecord(t, "completed");
      }
      persist(next);
      return next;
    });
  };

  const markSkipped = (id) => {
    if (isViewOnly) return;
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      const u = prev.map(b => b.id === id ? { ...b, status: "skipped" } : b);
      const next = [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
      persist(next);
      if (t) logToTeachingRecord(t, "skipped");
      return next;
    });
  };

  const toggleSub = (blockId, subIdx) => {
    if (isViewOnly) return;
    setItems(prev => {
      const next = prev.map(b => b.id === blockId ? { ...b, subChecked: { ...b.subChecked, [subIdx]: !b.subChecked[subIdx] } } : b);
      persist(next);
      return next;
    });
  };

  const [editingNote, setEditingNote] = useState(null);
  const lpt = useRef(null);
  const riseShineItems = RISE_SHINE_ITEMS[today] || [];

  const saveNote = (id, note) => {
    if (isViewOnly) return;
    setItems(prev => prev.map(b => b.id === id ? { ...b, motherNote: note } : b));
    setEditingNote(null);
  };
  const startLP  = (id) => { if (isViewOnly) return; lpt.current = setTimeout(() => { clearTimeout(lpt.current); markSkipped(id); }, 1000); };
  const cancelLP = () => clearTimeout(lpt.current);

  const isNatureDay = NATURE_DAYS[today] === true;
  const [loopStep, setLoopStep] = useState(getNatureLoopStep);
  const [natureCurrent] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_nature_current") || "null");
      if (saved?.subject) return saved;
    } catch {}
    return { subject: "The Story of the Tadpole", read: "The Year Round by C.J. Hylander · Spring section", observe: "Go outside and look near ponds or puddles for frogs or tadpoles." };
  });
  const [natureDone, setNatureDone] = useState(() => {
    if (!isToday) return false;
    try {
      const saved = JSON.parse(localStorage.getItem("tend_nature_done") || "null");
      return saved?.date === dateKey ? saved.done : false;
    } catch { return false; }
  });

  const markNatureDone = () => {
    if (isViewOnly) return;
    setNatureDone(true);
    try { localStorage.setItem("tend_nature_done", JSON.stringify({ date: dateKey, done: true })); } catch {}
    setLoopStep(advanceNatureLoop());
  };
  const undoNatureDone = () => {
    if (isViewOnly) return;
    setNatureDone(false);
    try { localStorage.setItem("tend_nature_done", JSON.stringify({ date: dateKey, done: false })); } catch {}
  };

  const getAdjustedTime = (timeString, offset) => {
    if (!timeString || offset === 0) return timeString;
    if (!/^\d{1,2}:\d{2}/.test(timeString)) return timeString;
    const [hours, mins] = timeString.split(":").map(Number);
    const blockMinutes = hours * 60 + mins + offset;
    const newHours = Math.floor(blockMinutes / 60);
    const newMins = blockMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
  };

  const screenOpacity = isViewOnly ? 0.7 : 1;

  return (
    <div style={{ marginBottom: 28, opacity: screenOpacity, transition: "opacity .3s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Sun />
          <p className="eyebrow" style={{ marginBottom: 0 }}>{isToday ? "Today" : "Day"} · {today}</p>
        </div>
        <button onClick={() => onNavigate("planner")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Full week <Icon.Arrow />
        </button>
      </div>

      {isNatureDay && isToday && (() => {
        const step = NATURE_LOOP_STEPS[loopStep];
        return (
          <div onClick={natureDone ? undoNatureDone : markNatureDone} style={{ borderBottom: "1px solid var(--rule)", opacity: natureDone ? 0.35 : 1, transition: "opacity .3s", cursor: isViewOnly ? "default" : "pointer" }}>
            <div style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px" }}>
              <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: natureDone ? "var(--rule)" : "var(--sage)", marginRight: 12, flexShrink: 0, minHeight: 36 }} />
              <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}></span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, color: natureDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: natureDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>
                  Nature Study · {step.label}
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>
                  {natureCurrent.subject} · {step.icon} {step.step}
                </p>
                {!natureDone && (<p style={{ fontSize: 12, color: "var(--sage)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 4, lineHeight: 1.5 }}>{step.getInstruction(natureCurrent)}</p>)}
                {natureDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
              </div>
            </div>
          </div>
        );
      })()}

      {items.map(b => {
        const isDone = b.status === "done", isSkipped = b.status === "skipped";
        const showMother = isFreeBlock(b.subject) && !isSkipped && isToday;
        const blockColor = getBlockColor(b.subject);
        const isRise = b.riseShine === true;
        const displayTime = getAdjustedTime(b.time, dailyOffset);
        const isExpanded = expandedBlock === b.id;
        return (
          <div key={b.id}>
            <div style={{ borderBottom: "1px solid var(--rule)" }}>
              <div onClick={() => setExpandedBlock(isExpanded ? null : b.id)}
                onTouchStart={() => { if (b.status === "pending" && !isViewOnly) startLP(b.id); }} onTouchEnd={cancelLP}
                onMouseDown={() => { if (b.status === "pending" && !isViewOnly) startLP(b.id); }} onMouseUp={cancelLP} onMouseLeave={cancelLP}
                style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px", cursor: "pointer", opacity: isDone ? 0.35 : isSkipped ? 0.45 : 1, transition: "opacity .4s ease" }}>
                <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: isDone || isSkipped ? "var(--rule)" : blockColor, marginRight: 12, flexShrink: 0, transition: "background .3s ease", minHeight: 36 }} />
                <div onClick={e => { e.stopPropagation(); if (!isViewOnly) toggleDone(b.id); }} style={{ width: 18, height: 18, borderRadius: 2, border: `1.5px solid ${isDone ? "var(--sage)" : "var(--rule)"}`, background: isDone ? "var(--sage)" : "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: isViewOnly ? "default" : "pointer", flexShrink: 0, transition: "all .2s", marginRight: 10, opacity: isViewOnly ? 0.5 : 1 }}>
                  {isDone && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, color: isDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)", transition: "all .3s ease" }}>
                    {b.subject} <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{displayTime}</span>
                  </p>
                  {isSkipped && <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>skipped · tap to restore</p>}
                  {b.note && !isSkipped && !isDone && <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>{b.note}</p>}
                  {isDone && isToday && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
                </div>
              </div>

              {isExpanded && !isDone && !isSkipped && (
                <div style={{ paddingLeft: 51, paddingBottom: 12, paddingTop: 8 }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
                    <svg onClick={() => { setEditingNotes(b.id); setNotesText(subjectNotes[b.subject] || ""); }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer" }}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>{subjectNotes[b.subject] ? "Edit notes" : "Add notes"}</p>
                  </div>
                  {editingNotes === b.id ? (
                    <div style={{ marginBottom: 10 }}>
                      <textarea autoFocus value={notesText} onChange={e => setNotesText(e.target.value)} placeholder="Add notes..." style={{ width: "100%", padding: "8px", border: "1px solid var(--rule)", borderRadius: 3, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, minHeight: 60, outline: "none", resize: "vertical" }} />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button onClick={() => { saveSubjectNote(b.subject, notesText); setEditingNotes(null); }} style={{ flex: 1, background: "var(--sage)", color: "white", border: "none", borderRadius: 2, padding: "6px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>Save</button>
                        <button onClick={() => setEditingNotes(null)} style={{ flex: 1, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "6px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Cancel</button>
                      </div>
                    </div>
                  ) : subjectNotes[b.subject] ? (
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-lt)", lineHeight: 1.6, margin: 0, marginBottom: 10 }}>{subjectNotes[b.subject]}</p>
                  ) : null}
                </div>
              )}
              {isRise && !isDone && !isSkipped && riseShineItems.length > 0 && (
                <div style={{ paddingLeft: 53, paddingBottom: 10 }} onClick={e => e.stopPropagation()}>
                  <MemoryVerseBlock items={riseShineItems} blockId={b.id} subChecked={b.subChecked} onToggle={(idx) => toggleSub(b.id, idx)} viewOnly={isViewOnly} />
                </div>
              )}
              {showMother && !isViewOnly && (
                <div style={{ paddingLeft: 53, paddingBottom: 8 }} onClick={e => e.stopPropagation()}>
                  {editingNote === b.id ? (
                    <input autoFocus defaultValue={b.motherNote} placeholder="What will you tend during this time?" onBlur={e => saveNote(b.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }} style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }} />
                  ) : (
                    <button onClick={() => setEditingNote(b.id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", padding: 0, textAlign: "left", opacity: b.motherNote ? 1 : 0.5 }}>
                      {b.motherNote ? `✦ ${b.motherNote}` : "your time · what will you tend?"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {isToday && <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap checkbox to complete · Long press to skip · Tap to expand for notes</p>}
      {isViewOnly && <p className="caption italic" style={{ marginTop: 12, textAlign: "center", color: "var(--ink-faint)" }}>Viewing another day · tap a block to add or edit notes</p>}
    </div>
  );
}

function WeekendRhythm({ rhythm }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>Today's Rhythm</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 400, color: "var(--ink)", marginBottom: 12 }}>{rhythm.theme}</h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.8 }}>"{rhythm.quote}"</p>
      </div>
      <div>
        {rhythm.items.map((item, idx) => (
          <div key={idx} style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 6 }}>{item.time}</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>{item.label}</h3>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.6 }}>{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayNavigator({ viewDate, onChange, onSnapToday, onCamera }) {
  const offset = dayOffset(viewDate);
  const isToday = offset === 0;
  const canGoBack = offset > -7;
  const canGoForward = offset < 7;
  const dateLabel = viewDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
      <button onClick={() => canGoBack && onChange(addDays(viewDate, -1))} disabled={!canGoBack} style={{ background: "none", border: "none", cursor: canGoBack ? "pointer" : "default", opacity: canGoBack ? 1 : 0.25, padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }} aria-label="Previous day"><Icon.ChevL /></button>

      <div style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>{dateLabel}</p>
        {!isToday && (
          <button onClick={onSnapToday} style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: "2px 10px", cursor: "pointer", fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>Today</button>
        )}
      </div>

      <button onClick={() => canGoForward && onChange(addDays(viewDate, 1))} disabled={!canGoForward} style={{ background: "none", border: "none", cursor: canGoForward ? "pointer" : "default", opacity: canGoForward ? 1 : 0.25, padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }} aria-label="Next day"><Icon.ChevR /></button>

      <button onClick={onCamera} aria-label="Take a memory photo" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Icon.Camera />
      </button>
    </div>
  );
}

export default function HomeScreen({ onNavigate, settings }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const name = settings?.name || "Friend";

  const offset = dayOffset(viewDate);
  const isToday = offset === 0;
  const isViewOnly = !isToday;

  const day = viewDate.getDay();
  const dayName = DAYS[day];
  const today = dayName;
  const cmQuote = CM_QUOTES[day];

  const week = settings?.week || 1;
  const isWeekend = dayName === "Saturday" || dayName === "Sunday";
  const isSummer = settings?.mode === "summer";

  const todayBlocks = isSummer ? getSummerDayBlocks(dayName, viewDate) : (DAY_SCHEDULE[dayName] || []);

  const [dailyOffset, setDailyOffset] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_OFFSET_KEY) || "{}");
      const dateKey = now.toISOString().slice(0, 10);
      return saved[dateKey] || 0;
    } catch { return 0; }
  });

  const updateOffset = (minutes) => {
    const dateKey = now.toISOString().slice(0, 10);
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_OFFSET_KEY) || "{}");
      const updated = { ...saved, [dateKey]: minutes };
      localStorage.setItem(DAILY_OFFSET_KEY, JSON.stringify(updated));
      setDailyOffset(minutes);
    } catch (e) { console.error("Error saving offset:", e); }
  };

  const weekendRhythm = !isSummer && isWeekend ? (dayName === "Saturday" ? getSaturdayRhythm(week) : getSundayRhythm(week)) : null;

  const snapToToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setViewDate(d);
  };

  const openCamera = () => onNavigate("memory-book", "camera");

  return (
    <div className={`screen${isSummer ? " summer" : ""}`}>
      <DayNavigator viewDate={viewDate} onChange={setViewDate} onSnapToday={snapToToday} onCamera={openCamera} />
      {isToday && <h1 className="display serif" style={{ marginBottom: 4, marginTop: 8 }}>{greeting},<br />{name}.</h1>}
      {!isToday && (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", marginBottom: 18, marginTop: 8 }}>
          {offset < 0 ? `${Math.abs(offset)} day${Math.abs(offset) === 1 ? "" : "s"} ago` : `In ${offset} day${offset === 1 ? "" : "s"}`}
        </p>
      )}

      {isSummer && isToday && <ScreensBanner />}

      {!isSummer && isToday && (
        <div style={{ padding: "14px 16px", background: dailyOffset > 0 ? "var(--gold-bg)" : "var(--sage-bg)", border: `1px solid ${dailyOffset > 0 ? "#E0CBA8" : "var(--sage-md)"}`, borderRadius: 4, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: dailyOffset > 0 ? "var(--gold)" : "var(--sage)", marginBottom: 0 }}>
              {dailyOffset > 0 ? `Started ${dailyOffset}m late` : "On Schedule"}
            </p>
            {dailyOffset > 0 && <button onClick={() => updateOffset(0)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "underline" }}>Reset</button>}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[0, 15, 30, 45, 60].map((minutes) => (
              <button key={minutes} onClick={() => updateOffset(minutes)} style={{ padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${dailyOffset === minutes ? (dailyOffset > 0 ? "var(--gold)" : "var(--sage)") : "var(--rule)"}`, background: dailyOffset === minutes ? (dailyOffset > 0 ? "var(--gold)" : "var(--sage)") : "var(--cream)", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: dailyOffset === minutes ? "white" : "var(--ink-faint)", transition: "all .2s" }}>
                {minutes === 0 ? "On time" : `+${minutes}m`}
              </button>
            ))}
          </div>
        </div>
      )}

      {isSummer && isToday && <MorningAnchors />}

      {/* CM quote */}
      {isToday && (
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.85, marginBottom: 4 }}>"{cmQuote.quote}"</p>
          <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
        </div>
      )}

      {/* Today's Beauty card — both school year and summer, weekdays only */}
      {isToday && !isWeekend && <BeautyCard dayName={dayName} isSummer={isSummer} />}

      {/* Family Bible Study card — every day on today */}
      {isToday && <FamilyBibleStudy />}

      {/* Schedule or weekend invitations */}
      {isSummer && isWeekend ? (
        <WeekendInvitations dayName={dayName} />
      ) : !isSummer && isWeekend ? (
        <WeekendRhythm rhythm={weekendRhythm} />
      ) : (
        <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} settings={settings} week={week} dailyOffset={dailyOffset} viewDate={viewDate} isToday={isToday} isViewOnly={isViewOnly} />
      )}

      {isSummer && isToday && <EveningAnchors dayName={dayName} />}
      {isSummer && isToday && <MorningActivityCard />}
    </div>
  );
}
