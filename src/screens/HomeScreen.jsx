import { useState, useRef, useEffect } from "react";
import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES, RISE_SHINE_ITEMS, BEAUTY_LOOP, getSaturdayRhythm, getSundayRhythm, NATURE_DAYS, NATURE_LOOP_STEPS, getNatureLoopStep, advanceNatureLoop, getBeautyForBlock } from "../data/seed";
import {
  SUMMER_DAILY_ANCHORS,
  SUMMER_PERSONAL_MORNING,
  SUMMER_WEEKEND_CATEGORIES,
  getSummerDayBlocks,
  getActivityChoices,
  getTomorrowActivity,
  isEveningSetupTime,
} from "../data/summer-seed";
import { supabase } from "../lib/supabase";

const HABIT_ICONS = {
  attention: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  narration: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>),
  outdoor:   () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-8 4 5 3-3 4 6H3z"/><circle cx="18" cy="6" r="2"/></svg>),
  stillness: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
  orderly:   () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
};

const Icon = {
  Leaf:    () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Feather: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>),
  Sun:     () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Arrow:   () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  ChevL:   ({ color = "var(--ink-faint)" }) => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>),
  ChevR:   ({ color = "var(--ink-faint)" }) => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  Sprout:  () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10C12 10 8 9 7 5c3 0 5 2 5 5z"/><path d="M12 10C12 10 16 9 17 5c-3 0-5 2-5 5z"/></svg>),
  Moon:    () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>),
  X:       () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// Line-art icons for the weekend invitations
const WeekendIcon = {
  Family: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16"/><path d="M5 11v8"/><path d="M19 11v8"/><circle cx="8" cy="14" r="0.6" fill="currentColor"/><circle cx="12" cy="14" r="0.6" fill="currentColor"/><circle cx="16" cy="14" r="0.6" fill="currentColor"/><path d="M3 19h18"/></svg>),
  Creativity: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l5-5"/><path d="M9 15l4-4 5 5-4 4z"/><path d="M14 10l3-3a2 2 0 012.8 2.8l-3 3"/></svg>),
  Body: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>),
  Horses: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21V11c0-3 2-5 5-5s5 2 5 5v10"/><path d="M7 21h10"/><path d="M9 14h6"/></svg>),
  Ranch: () => (<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M9 7c1 0 2 1 3 2 1-1 2-2 3-2"/><path d="M9 11c1 0 2 1 3 2 1-1 2-2 3-2"/><path d="M9 15c1 0 2 1 3 2 1-1 2-2 3-2"/></svg>),
};

// Refined invitation prompts
const WEEKEND_INVITATIONS = {
  family: {
    label: "Family",
    icon: WeekendIcon.Family,
    prompts: [
      "Who haven't you looked at lately?",
      "Is there a meal worth slowing down for?",
      "Anyone owed a long conversation?",
    ],
  },
  creativity: {
    label: "Creativity",
    icon: WeekendIcon.Creativity,
    prompts: [
      "What's been sitting half-finished?",
      "Is there something you've been wanting to try?",
      "Old project or new one?",
    ],
  },
  body: {
    label: "Body",
    icon: WeekendIcon.Body,
    prompts: [
      "Walk, ride, swim, or sit?",
      "Strength training today?",
      "Stretch or yoga session?",
      "Where would the water be good today?",
      "What kind of tired do you want to be tonight?",
    ],
  },
  horses: {
    label: "Horses",
    icon: WeekendIcon.Horses,
    prompts: [
      "Saddle one up?",
      "Round pen work today?",
      "Who hasn't been brushed in a while?",
      "Is anyone limping or favoring something?",
      "Just go say hello?",
    ],
  },
  ranch: {
    label: "Ranch",
    icon: WeekendIcon.Ranch,
    prompts: [
      "What have you been ignoring?",
      "Anything broken that's nagging at you?",
      "Is there a corner that needs ten minutes?",
    ],
  },
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

// ─── DATE HELPERS ─────────────────────────────────────────────────────────
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayOffset(date) {
  // returns positive int = days from today (ignoring time of day)
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

function WovenBeautyCard({ item, checked, onToggle }) {
  return (
    <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 15px", marginBottom: 0, background: checked ? "rgba(169,183,134,.06)" : "var(--sage-bg)", borderLeft: `3px solid ${checked ? "var(--sage-md)" : "var(--sage)"}`, cursor: "pointer", opacity: checked ? 0.5 : 1, transition: "all .2s" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${checked ? "var(--sage)" : "var(--sage-md)"}`, background: checked ? "var(--sage)" : "none", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
        {checked && <svg width="7" height="7" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)", flexShrink: 0 }}>Beauty</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "var(--ink)", textDecoration: checked ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>{item.label}</span>
      </div>
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

async function loadDailyState(userId, date) {
  try {
    const res = await fetch("/.netlify/functions/daily-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "get", userId, date }),
    });
    const data = await res.json();
    return data.state || null;
  } catch { return null; }
}

async function saveDailyState(userId, date, state) {
  try {
    await fetch("/.netlify/functions/daily-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "set", userId, date, state }),
    });
  } catch {}
}

const SCHEDULE_KEY = "tend_schedule_state";
const BEAUTY_KEY = "tend_beauty_state";
const DAILY_OFFSET_KEY = "tend_daily_offset";
const ANCHORS_KEY = "tend_summer_anchors";
const SKIP_SUBJECTS = ["Rise & Shine", "Lunch", "Outdoor Break", "Afternoon Pursuits", "House Reset & Animal Chores", "Tuesday Rhythm", "Tennis"];

// ─────────────────────────────────────────────────────────────────
// SUMMER MODE COMPONENTS
// ─────────────────────────────────────────────────────────────────

function ScreensBanner() {
  return (
    <div className="screens-banner">
      <strong>Phones</strong>
      <span>on the counter from 8:30 — yours included — until 2:00.</span>
    </div>
  );
}

function PersonalMorning() {
  return (
    <div className="personal-morning">
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>
        Your morning
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {SUMMER_PERSONAL_MORNING.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "var(--ink-faint)", minWidth: 90 }}>{item.time}</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyAnchors() {
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
    <div className="daily-anchors">
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
        Daily Anchors
      </p>
      {SUMMER_DAILY_ANCHORS.map(anchor => {
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
    try {
      const saved = JSON.parse(localStorage.getItem(`tend_morning_pick_${dateKey}`) || "null");
      return saved;
    } catch { return null; }
  });

  const pickActivity = (activity) => {
    const dateKey = new Date().toISOString().slice(0, 10);
    setSelected(activity);
    try { localStorage.setItem(`tend_morning_pick_${dateKey}`, JSON.stringify(activity)); } catch {}
  };

  if (evening) {
    return (
      <div className="morning-activity morning-activity-evening">
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>
          Set up for tomorrow morning
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>
          {tomorrow.label}
        </p>
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
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)" }}>
            Today's Morning Activity
          </p>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", color: "var(--ink-faint)", cursor: "pointer", textTransform: "uppercase" }}>
            Change
          </button>
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>
          {selected.label}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-lt)", lineHeight: 1.6 }}>
          {selected.kidsNeed}
        </p>
      </div>
    );
  }

  return (
    <div className="morning-activity">
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>
        Pick a morning activity
      </p>
      {choices.map(choice => (
        <div key={choice.id} onClick={() => pickActivity(choice)} style={{ borderTop: "1px solid var(--rule)", padding: "10px 0", cursor: "pointer" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>{choice.label}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)", lineHeight: 1.5 }}>
            {choice.kidsNeed}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── REFINED WEEKEND INVITATIONS ────────────────────────────────────────
function WeekendInvitations({ dayName }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 14 }}>
        {dayName}
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: "var(--ink)", marginBottom: 6, lineHeight: 1.2 }}>
        This day is yours.
      </h2>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "var(--ink-faint)", lineHeight: 1.6, marginBottom: 28 }}>
        What does it want to hold?
      </p>

      <div>
        {WEEKEND_ORDER.map((id, idx) => {
          const inv = WEEKEND_INVITATIONS[id];
          const IconComp = inv.icon;
          const isOpen = openId === id;
          const isLast = idx === WEEKEND_ORDER.length - 1;

          return (
            <div key={id} style={{ borderBottom: isLast ? "none" : "1px solid var(--rule)" }}>
              <div onClick={() => setOpenId(isOpen ? null : id)}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 4px", cursor: "pointer" }}>
                <div style={{ color: isOpen ? "var(--sage)" : "var(--ink-faint)", transition: "color .2s", flexShrink: 0 }}>
                  <IconComp />
                </div>
                <p style={{
                  flex: 1,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  color: "var(--ink)",
                  fontWeight: 400,
                }}>
                  {inv.label}
                </p>
              </div>

              {isOpen && (
                <div style={{ paddingLeft: 36, paddingBottom: 18, paddingTop: 0, borderLeft: "2px solid var(--sage)", marginLeft: 9, marginBottom: 4 }}>
                  {inv.prompts.map((prompt, i) => (
                    <p key={i} style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 15,
                      color: "var(--ink-lt)",
                      lineHeight: 1.7,
                      marginBottom: i === inv.prompts.length - 1 ? 0 : 8,
                    }}>
                      {prompt}
                    </p>
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

// ─── TODAY SCHEDULE — now supports view-only days ──────────────────────
function TodaySchedule({ today, blocks, onNavigate, settings, wovenBeauty, week, dailyOffset, viewDate, isToday, isViewOnly }) {
  const dateKey = viewDate.toISOString().slice(0, 10);
  const userId  = settings?.userId;

  const [synced, setSynced] = useState(false);

  const [beautyDone, setBeautyDone] = useState(() => {
    if (!isToday) return {};
    try {
      const saved = JSON.parse(localStorage.getItem(BEAUTY_KEY) || "null");
      if (saved?.date === dateKey && saved?.day === today) return saved.done;
    } catch {}
    return {};
  });

  const [subjectNotes, setSubjectNotes] = useState({});
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState("");

  const toggleBeauty = (id) => {
    if (isViewOnly) return;
    const next = { ...beautyDone, [id]: !beautyDone[id] };
    setBeautyDone(next);
    try { localStorage.setItem(BEAUTY_KEY, JSON.stringify({ date: dateKey, day: today, done: next })); } catch {}
    if (userId) {
      saveDailyState(userId, dateKey, { day: today, items, beautyDone: next });
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadSubjectNotes();
  }, [userId, dateKey]);

  const loadSubjectNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("subject_notes")
        .select("*")
        .eq("user_id", userId)
        .eq("date", dateKey);

      if (error) throw error;

      const notesMap = {};
      (data || []).forEach(note => {
        notesMap[note.subject] = note.notes;
      });
      setSubjectNotes(notesMap);
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  };

  const saveSubjectNote = async (subject, text) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("subject_notes")
        .upsert({
          user_id: userId,
          date: dateKey,
          subject,
          notes: text || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSubjectNotes(prev => ({
        ...prev,
        [subject]: text,
      }));
      setEditingNotes(null);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Error saving note. Please try again.");
    }
  };

  const logToTeachingRecord = async (block, status) => {
    if (!userId) return;
    if (SKIP_SUBJECTS.some(s => block.subject.includes(s))) return;
    if (block.free) return;
    const y = new Date().getFullYear(), m = new Date().getMonth();
    const schoolYear = m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
    fetch("/.netlify/functions/teaching-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method:     "upsert",
        userId,
        date:       dateKey,
        subject:    block.subject,
        timeBlock:  block.time || null,
        note:       block.note || null,
        status,
        schoolYear,
      }),
    }).catch(() => {});
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

  // Reset items when navigating to a different day
  useEffect(() => {
    if (!isToday) {
      setItems(defaultItems());
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || "null");
      if (saved && saved.date === dateKey && saved.day === today) {
        setItems(saved.items);
        return;
      }
    } catch {}
    setItems(defaultItems());
  }, [dateKey, today, isToday]);

  useEffect(() => {
    if (!userId || synced || !isToday) return;
    loadDailyState(userId, dateKey).then(remote => {
      if (remote?.items && remote?.day === today) {
        setItems(remote.items);
        if (remote.beautyDone) setBeautyDone(remote.beautyDone);
        try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: remote.items })); } catch {}
        try { localStorage.setItem(BEAUTY_KEY, JSON.stringify({ date: dateKey, day: today, done: remote.beautyDone || {} })); } catch {}
      }
      setSynced(true);
    });
  }, [userId, isToday]);

  const persist = (newItems, newBeauty) => {
    if (isViewOnly) return;
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: newItems })); } catch {}
    if (userId) {
      saveDailyState(userId, dateKey, {
        day: today,
        items: newItems,
        beautyDone: newBeauty !== undefined ? newBeauty : beautyDone,
      });
    }
  };

  const toggleDone = (id) => {
    if (isViewOnly) return;
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      if (!t) return prev;
      let next;
      if (t.status === "skipped" || t.status === "done") {
        next = prev.map(b => b.id === id ? { ...b, status: "pending" } : b)
          .sort((a, b) => blocks.findIndex(x => x.id === a.id) - blocks.findIndex(x => x.id === b.id));
        if (userId) {
          fetch("/.netlify/functions/teaching-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method: "delete", userId, date: dateKey, subject: t.subject }),
          }).catch(() => {});
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
    const next = advanceNatureLoop();
    setLoopStep(next);
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
        <button onClick={() => onNavigate("planner")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Full week <Icon.Arrow />
        </button>
      </div>

      {isNatureDay && isToday && (() => {
        const step = NATURE_LOOP_STEPS[loopStep];
        return (
          <div onClick={natureDone ? undoNatureDone : markNatureDone}
            style={{ borderBottom: "1px solid var(--rule)", opacity: natureDone ? 0.35 : 1, transition: "opacity .3s", cursor: isViewOnly ? "default" : "pointer" }}>
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
                {!natureDone && (
                  <p style={{ fontSize: 12, color: "var(--sage)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 4, lineHeight: 1.5 }}>
                    {step.getInstruction(natureCurrent)}
                  </p>
                )}
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
        const wovenItem = wovenBeauty && isToday ? getBeautyForBlock(b.subject, today, week || 1) : null;
        const displayTime = getAdjustedTime(b.time, dailyOffset);
        const isExpanded = expandedBlock === b.id;
        const hasNotes = subjectNotes[b.subject];

        return (
          <div key={b.id}>
            {wovenItem && (
              <WovenBeautyCard
                item={wovenItem}
                checked={!!beautyDone[wovenItem.id]}
                onToggle={() => toggleBeauty(wovenItem.id)}
              />
            )}
            <div style={{ borderBottom: "1px solid var(--rule)" }}>
              <div 
                onClick={() => setExpandedBlock(isExpanded ? null : b.id)}
                onTouchStart={() => { if (b.status === "pending" && !isViewOnly) startLP(b.id); }} 
                onTouchEnd={cancelLP}
                onMouseDown={() => { if (b.status === "pending" && !isViewOnly) startLP(b.id); }} 
                onMouseUp={cancelLP} 
                onMouseLeave={cancelLP}
                style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px", cursor: "pointer", opacity: isDone ? 0.35 : isSkipped ? 0.45 : 1, transition: "opacity .4s ease" }}>
                <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: isDone || isSkipped ? "var(--rule)" : blockColor, marginRight: 12, flexShrink: 0, transition: "background .3s ease", minHeight: 36 }} />
                
                <div
                  onClick={e => {
                    e.stopPropagation();
                    if (!isViewOnly) toggleDone(b.id);
                  }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 2,
                    border: `1.5px solid ${isDone ? "var(--sage)" : "var(--rule)"}`,
                    background: isDone ? "var(--sage)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isViewOnly ? "default" : "pointer",
                    flexShrink: 0,
                    transition: "all .2s",
                    marginRight: 10,
                    opacity: isViewOnly ? 0.5 : 1,
                  }}>
                  {isDone && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
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
                <div style={{ paddingLeft: 51, paddingBottom: 12, paddingTop: 8, opacity: 1 }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
                    <svg 
                      onClick={() => {
                        setEditingNotes(b.id);
                        setNotesText(subjectNotes[b.subject] || "");
                      }} 
                      width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                      style={{ cursor: "pointer", transition: "stroke .2s" }}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>
                      {subjectNotes[b.subject] ? "Edit notes" : "Add notes"}
                    </p>
                  </div>

                  {editingNotes === b.id ? (
                    <div style={{ marginBottom: 10 }}>
                      <textarea
                        autoFocus
                        value={notesText}
                        onChange={e => setNotesText(e.target.value)}
                        placeholder="Add notes for today..."
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid var(--rule)",
                          borderRadius: 3,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 13,
                          minHeight: 60,
                          outline: "none",
                          resize: "vertical",
                        }}
                      />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                          onClick={() => {
                            saveSubjectNote(b.subject, notesText);
                            setEditingNotes(null);
                          }}
                          style={{
                            flex: 1,
                            background: "var(--sage)",
                            color: "white",
                            border: "none",
                            borderRadius: 2,
                            padding: "6px",
                            cursor: "pointer",
                            fontSize: 10,
                            fontFamily: "'Lato', sans-serif",
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                          }}>
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotes(null)}
                          style={{
                            flex: 1,
                            background: "none",
                            border: "1px solid var(--rule)",
                            borderRadius: 2,
                            padding: "6px",
                            cursor: "pointer",
                            fontSize: 10,
                            fontFamily: "'Lato', sans-serif",
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            color: "var(--ink-faint)",
                          }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : subjectNotes[b.subject] ? (
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-lt)", lineHeight: 1.6, margin: 0, marginBottom: 10 }}>
                      {subjectNotes[b.subject]}
                    </p>
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
                    <input autoFocus defaultValue={b.motherNote} placeholder="What will you tend during this time?"
                      onBlur={e => saveNote(b.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                      style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }} />
                  ) : (
                    <button onClick={() => setEditingNote(b.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", padding: 0, textAlign: "left", opacity: b.motherNote ? 1 : 0.5 }}>
                      {b.motherNote ? `✦ ${b.motherNote}` : "your time · what will you tend?"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {isToday && (
        <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap checkbox to complete · Long press to skip · Tap to expand for notes</p>
      )}
      {isViewOnly && (
        <p className="caption italic" style={{ marginTop: 12, textAlign: "center", color: "var(--ink-faint)" }}>
          Viewing another day · tap a block to add or edit notes
        </p>
      )}
    </div>
  );
}

function WeekendRhythm({ rhythm, dayName }) {
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

      <div style={{ marginTop: 40, marginBottom: 32, padding: "28px 20px 24px", borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", lineHeight: 2, marginBottom: 14 }}>
          The Lord is my shepherd; I shall not want.<br />
          He makes me lie down in green pastures.<br />
          He leads me beside still waters.<br />
          He restores my soul.
        </p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", opacity: 0.6 }}>
          Psalm 23 · ESV
        </p>
      </div>
    </div>
  );
}

// ─── DAY NAVIGATOR ──────────────────────────────────────────────────────
function DayNavigator({ viewDate, onChange, onSnapToday }) {
  const offset = dayOffset(viewDate);
  const isToday = offset === 0;
  const canGoBack = offset > -7;
  const canGoForward = offset < 7;

  const dateLabel = viewDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
      <button
        onClick={() => canGoBack && onChange(addDays(viewDate, -1))}
        disabled={!canGoBack}
        style={{
          background: "none",
          border: "none",
          cursor: canGoBack ? "pointer" : "default",
          opacity: canGoBack ? 1 : 0.25,
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
        aria-label="Previous day"
      >
        <Icon.ChevL />
      </button>

      <div style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>{dateLabel}</p>
        {!isToday && (
          <button
            onClick={onSnapToday}
            style={{
              background: "var(--sage-bg)",
              border: "1px solid var(--sage-md)",
              borderRadius: 20,
              padding: "2px 10px",
              cursor: "pointer",
              fontSize: 9,
              fontFamily: "'Lato', sans-serif",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--sage)",
            }}
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={() => canGoForward && onChange(addDays(viewDate, 1))}
        disabled={!canGoForward}
        style={{
          background: "none",
          border: "none",
          cursor: canGoForward ? "pointer" : "default",
          opacity: canGoForward ? 1 : 0.25,
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
        aria-label="Next day"
      >
        <Icon.ChevR />
      </button>
    </div>
  );
}

// ─── MAIN HOMESCREEN ────────────────────────────────────────────────────
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
    } catch {
      return 0;
    }
  });

  const updateOffset = (minutes) => {
    const dateKey = now.toISOString().slice(0, 10);
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_OFFSET_KEY) || "{}");
      const updated = { ...saved, [dateKey]: minutes };
      localStorage.setItem(DAILY_OFFSET_KEY, JSON.stringify(updated));
      setDailyOffset(minutes);
    } catch (e) {
      console.error("Error saving offset:", e);
    }
  };

  const [showPremium, setShowPremium] = useState(false);
  const weekendRhythm = !isSummer && isWeekend
    ? (dayName === "Saturday" ? getSaturdayRhythm(week) : getSundayRhythm(week))
    : null;

  const snapToToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setViewDate(d);
  };

  return (
    <div className={`screen${isSummer ? " summer" : ""}`}>
      <DayNavigator viewDate={viewDate} onChange={setViewDate} onSnapToday={snapToToday} />
      {isToday && (
        <h1 className="display serif" style={{ marginBottom: 4, marginTop: 8 }}>{greeting},<br />{name}.</h1>
      )}
      {!isToday && (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", marginBottom: 18, marginTop: 8 }}>
          {offset < 0 ? `${Math.abs(offset)} day${Math.abs(offset) === 1 ? "" : "s"} ago` : `In ${offset} day${offset === 1 ? "" : "s"}`}
        </p>
      )}

      {/* Summer-only banner — only on today */}
      {isSummer && isToday && <ScreensBanner />}

      {/* School-year only: daily offset card — only on today */}
      {!isSummer && isToday && (
        <div style={{ padding: "14px 16px", background: dailyOffset > 0 ? "var(--gold-bg)" : "var(--sage-bg)", border: `1px solid ${dailyOffset > 0 ? "#E0CBA8" : "var(--sage-md)"}`, borderRadius: 4, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: dailyOffset > 0 ? "var(--gold)" : "var(--sage)", marginBottom: 0 }}>
              {dailyOffset > 0 ? `Started ${dailyOffset}m late` : "On Schedule"}
            </p>
            {dailyOffset > 0 && (
              <button onClick={() => updateOffset(0)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "underline" }}>
                Reset
              </button>
            )}
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

      {/* Summer-only: personal morning + daily anchors + morning activity (every day in summer) */}
{isSummer && isToday && (
  <>
    <PersonalMorning />
    <DailyAnchors />
    <MorningActivityCard />
  </>
)}

      {/* CM quote — same in both modes, only on today */}
      {isToday && (
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.85, marginBottom: 4 }}>"{cmQuote.quote}"</p>
          <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
        </div>
      )}

      {/* SCHEDULE / WEEKEND — varies by mode */}
      {isSummer && isWeekend ? (
        <WeekendInvitations dayName={dayName} />
      ) : !isSummer && isWeekend ? (
        <WeekendRhythm rhythm={weekendRhythm} dayName={dayName} />
      ) : (
        <TodaySchedule
          today={today}
          blocks={todayBlocks}
          onNavigate={onNavigate}
          settings={settings}
          wovenBeauty={!isSummer}
          week={week}
          dailyOffset={dailyOffset}
          viewDate={viewDate}
          isToday={isToday}
          isViewOnly={isViewOnly}
        />
      )}

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}
