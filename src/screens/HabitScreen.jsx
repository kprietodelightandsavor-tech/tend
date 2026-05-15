import { useState, useRef, useEffect } from "react";
import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES, RISE_SHINE_ITEMS, BEAUTY_LOOP, getSaturdayRhythm, getSundayRhythm, NATURE_DAYS, NATURE_LOOP_STEPS, getNatureLoopStep, advanceNatureLoop, getBeautyForBlock } from "../data/seed";
import {
  SUMMER_MORNING_ANCHORS,
  getEveningAnchors,
  getSummerDayBlocks,
  getActivityChoices,
  getTomorrowActivity,
  isEveningSetupTime,
} from "../data/summer-seed";
import { supabase } from "../lib/supabase";

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
const EVE_ANCHORS_KEY = "tend_summer_evening_anchors";
const SKIP_SUBJECTS = ["Rise & Shine", "Lunch", "Outdoor Break", "Afternoon Pursuits", "House Reset & Animal Chores", "Tuesday Rhythm", "Tennis"];

// ─── ANCHOR CARDS ──────────────────────────────────────────────────────
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
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)" }}>
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
      <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 10 }}>
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

function ScreensBanner() {
  return (
    <div className="screens-banner">
      <strong>Phones</strong>
      <span>on the counter from 8:30 — yours included — until 2:00. Screens allowed 2:00–4:00, then back on the counter.</span>
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
    if (userId) saveDailyState(userId, dateKey, { day: today, items, beautyDone: next });
  };

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
      const { error } = await supabase.from("subject_notes").upsert({
        user_id: userId, date: dateKey, subject, notes: text || null,
        updated_at: new Date().toISOString(),
      });
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
    fetch("/.netlify/functions/teaching-log", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "upsert", userId, date: dateKey, subject: block.subject, timeBlock: block.time || null, note: block.note || null, status, schoolYear }),
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
    if (userId) saveDailyState(userId, dateKey, { day: today, items: newItems, beautyDone: newBeauty !== undefined ? newBeauty : beautyDone });
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
        return (
          <div key={b.id}>
            {wovenItem && <WovenBeautyCard item={wovenItem} checked={!!beautyDone[wovenItem.id]} onToggle={() => toggleBeauty(wovenItem.id)} />}
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
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>
                      {subjectNotes[b.subject] ? "Edit notes" : "Add notes"}
                    </p>
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
                    <input autoFocus defaultValue={b.motherNote} placeholder="What will you tend during this time?"
                      onBlur={e => saveNote(b.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                      style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }} />
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
      <button onClick={() => canGoBack && onChange(addDays(viewDate, -1))} disabled={!canGoBack}
        style={{ background: "none", border: "none", cursor: canGoBack ? "pointer" : "default", opacity: canGoBack ? 1 : 0.25, padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }}
        aria-label="Previous day"><Icon.ChevL /></button>

      <div style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>{dateLabel}</p>
        {!isToday && (
          <button onClick={onSnapToday} style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: "2px 10px", cursor: "pointer", fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>
            Today
          </button>
        )}
      </div>

      <button onClick={() => canGoForward && onChange(addDays(viewDate, 1))} disabled={!canGoForward}
        style={{ background: "none", border: "none", cursor: canGoForward ? "pointer" : "default", opacity: canGoForward ? 1 : 0.25, padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }}
        aria-label="Next day"><Icon.ChevR /></button>

      <button onClick={onCamera} aria-label="Take a memory photo"
        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }}>
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
  const dayName = DAYS[day === 0 ? 6 : day - 1];
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

  const weekendRhythm = !isSummer && isWeekend
    ? (dayName === "Saturday" ? getSaturdayRhythm(week) : getSundayRhythm(week))
    : null;

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

      {/* Summer mornings: anchors only (personal morning removed) */}
      {isSummer && isToday && <MorningAnchors />}

      {/* CM quote */}
      {isToday && (
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.85, marginBottom: 4 }}>"{cmQuote.quote}"</p>
          <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
        </div>
      )}

      {/* Schedule or weekend invitations */}
      {isSummer && isWeekend ? (
        <WeekendInvitations dayName={dayName} />
      ) : !isSummer && isWeekend ? (
        <WeekendRhythm rhythm={weekendRhythm} />
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

      {/* Evening anchors: every summer day, after the schedule/invitations */}
      {isSummer && isToday && <EveningAnchors dayName={dayName} />}

      {/* Morning activity card last */}
      {isSummer && isToday && <MorningActivityCard />}
    </div>
  );
}
// ─── HABIT TERM: STEWARDSHIP OF APPETITE ──────────────────────────────
// A 12-week Charlotte Mason habit term for parents and families.
// Three months, three appetites: body → will → world.
//
// Pacing: Lessons unlock one at a time. The family moves at its own pace.
// No calendar days are imposed. When a lesson is marked complete, the next
// becomes available. The "Practice begins this week" note appears on the
// lesson that introduces the family rhythm shift.

export const HABIT_TERM = {
  id: "stewardship-of-appetite",
  title: "Stewardship of Appetite",
  subtitle: "A Charlotte Mason habit term for parents and families",
  description:
    "Three months. Three appetites. One quiet practice at a time. " +
    "Body, will, world — the three places appetite shows up and asks to be governed.",
  arc: "body → will → world",
  totalMonths: 3,
  totalLessons: 27,
};

export const HABIT_MONTHS = [
  // ─── MONTH ONE: EATING ───────────────────────────────────────────────
  {
    id: "month-1-eating",
    number: 1,
    title: "Eating at the Table",
    subtitle: "Body",
    habit: "Temperance",
    habitDefinition: "Moderation in action, thought, or feeling; restraint",
    phrase: "Appetite is a good servant.",
    familyFocus:
      "Meals and snacks happen at the table, at set times. Grazing — " +
      "the all-day open kitchen — is the habit we're gently retiring. " +
      "Hunger between eating times is survivable, and it makes real food matter again.",
    parentAnchor: {
      title: "Self-Restraint in Indulgences",
      source: "Laying Down the Rails (adult)",
      pages: "p. 144",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 128.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Meals and snacks at the table, at set times. Water between. No grazing.",
    midMonthQuestion: "What's the difference between hungry and wanting?",
    midMonthQuestionAtLesson: 6,
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Temperance together. Discuss what it means to let appetite serve us instead of rule us. " +
          'Identify the family goal: "We will eat our meals and snacks at the table, at set times — and let our bodies feel real hunger between, instead of grazing all day." ' +
          "Get the kids' input on what changes feel doable.",
        teen: {
          reading: 'Ourselves, Book I, Part III, Ch. 1 — "The Appetites" (opening 2 pages)',
          source: "Ourselves by Charlotte Mason",
          question:
            "Mason calls appetite a servant. When in your life has it felt like the master?",
          note: "Leave the reading where they'll find it. Ask the question one-on-one when you're alone with them.",
        },
      },
      {
        number: 2,
        title: "Self-control brings joy",
        family:
          "Read 2 Peter 1:5–10. Discuss how temperance is also translated self-control. " +
          'Read "The Vulture" by Hilaire Belloc — "The Vulture eats between his meals, and that\'s the reason why he very, very, rarely feels as well as you and I."',
        teen: {
          quote: "We become temperate by doing temperate acts. — Aristotle",
          question:
            "Do you think that's true? What have you become by repetition without meaning to?",
          note: "Leave the quote on a card. Ask the question whenever you're alone together.",
        },
      },
      {
        number: 3,
        title: "Passing pleasure",
        family:
          "Read the Aristotle quote on moral excellence. " +
          'Read "The Flies and the Honey" from The Aesop for Children. ' +
          'Discuss greed for "a little passing pleasure" and how it can cost more than it gives.',
        teen: {
          reading: "Short passage from Ourselves on Gluttony",
          source: "Ourselves by Charlotte Mason",
          question: "What's the modern version of the flies in the honey?",
          note: "Mason names gluttony plainly, which teens respect. Let them answer without correcting.",
        },
      },
      {
        number: 4,
        title: "Parent share",
        family:
          "Tell a story from your own life — or about someone you've known — that shows temperance (or its absence). Read Titus 2:1–8.",
        teen: {
          question:
            "I'm not telling you this to teach you. I'm telling you because I'm still figuring it out.",
          note: "Tell them the story first, alone, before the family circle. Make it real — a time you couldn't stop, a time you wished you had. No moral attached.",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "Balance",
        family:
          'Serve a "feast" — a mix of healthful and less-healthful foods (desserts, fruit, vegetables, chips, cheese, etc.). ' +
          'Practice moderation in real time. "It\'s okay to eat some sugary foods and much healthful food. Don\'t take more than you can eat. Start small, add more if you\'re still hungry."',
        teen: {
          question: "What would you put on a table that would test you?",
          note: "Invite them to plan the feast with you. Authority shift. Ask while you're prepping together.",
        },
      },
      {
        number: 6,
        title: "Greed and the reflection",
        family:
          "Talk together about ways to overcome greed and selfish desire. " +
          'Read "The Dog and His Reflection" — the dog loses his real bone reaching for the bigger one in the water.',
        teen: {
          experiment:
            "Try going one day without your usual treat/drink/snack and write three sentences about what you noticed.",
          note: "Skip the fable. Offer the small self-experiment. No follow-up unless they bring it up.",
        },
        midMonth: true,
      },
      {
        number: 7,
        title: "The Proverbs",
        family:
          "Discuss the Proverbs list together: 10:19, 11:12–13, 15:1, 17:14, 17:28, 20:3, 20:19, 23:4–5, 23:20–21 (on drunkards and gluttons).",
        teen: {
          question: "Pick the one that hits hardest. Tell me why — or don't.",
          note: "Hand them the list privately. Leave it.",
        },
      },
      {
        number: 8,
        title: "Obsession",
        family:
          'Play "Continue the Story." Choose a character and pass the story around the circle. ' +
          "Play out a day where the character is obsessed with one activity and can't do anything else — including the consequences (hungry, bored, tired, ignoring family and friends). " +
          "Serious or silly.",
        teen: {
          note: "Optional join. If they decline, ask them to narrate the consequence chain aloud for the younger kids' story — they become the wise voice, not the student.",
        },
      },
      {
        number: 9,
        title: "Celebration",
        family:
          "Parent Share moment — share a story or person who exemplifies Temperance. " +
          "Hold your family celebration (the one you chose in Parent Prep). " +
          "End-of-month reflection: Where did appetite rule us? Where did we strengthen?",
        teen: {
          note: "Let them pick the celebration food, or opt out of the reflection circle and write one private line in a notebook only they see. The reflection doesn't have to be shared to count.",
        },
      },
    ],
  },

  // ─── MONTH TWO: SCREENS ──────────────────────────────────────────────
  {
    id: "month-2-screens",
    number: 2,
    title: "Screens",
    subtitle: "Will",
    habit: "Self-Control",
    habitDefinition: "Keeping back the expression of our passions and emotions",
    phrase: "I am the master of this, not the other way around.",
    familyFocus:
      "Screens 2–4 only. Intentional, not default. The pull to pick up, " +
      "the irritation when it's time to stop, the 'one more' — these are " +
      "passions to govern, not enemies to fear.",
    parentAnchor: {
      title: "Self-Control",
      source: "Laying Down the Rails (adult)",
      pages: "pp. 105–108",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 280.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Screens 2–4 only. Phones on the counter outside that window — parents' phones too.",
    midMonthQuestion: "What did boredom open up this week?",
    midMonthQuestionAtLesson: 6,
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Self-Control together. Discuss what it means to keep back the expression of our passions and emotions. " +
          'Identify the family goal: "We will pause and breathe when we feel the pull to pick up a screen outside our 2–4 window." ' +
          "Read James 1:19–20 — quick to hear, slow to speak, slow to anger. " +
          "Get the kids' input on what changes feel doable.",
        teen: {
          reading: "Ourselves, Book I, Part III — the opening section on the Will and self-government",
          source: "Ourselves by Charlotte Mason",
          question: "Mason says the will is what makes us free. What does your will feel like when it loses?",
          note: "One-on-one. Don't push for a long answer.",
        },
      },
      {
        number: 2,
        title: "Self-control brings joy",
        family:
          'Read the Tennyson quote: "The happiness of a man in this life does not consist in the absence but in the mastery of his passions." ' +
          'Read "Anger" by Charles Lamb — anger that lasts a minute may have grace; anger that lingers grows into poison. ' +
          "Apply it to the screen-pull: the urge passes if we don't feed it.",
        teen: {
          quote:
            "The happiness of a man in this life does not consist in the absence but in the mastery of his passions. — Tennyson",
          question:
            "Mastery, not absence. What's the difference between someone who doesn't want the thing and someone who wants it and chooses not to take it?",
          note: "Leave the quote on a card.",
        },
      },
      {
        number: 3,
        title: "Obedience as stepping-stone",
        family:
          "Talk about the restraint it takes to obey a command that doesn't seem pleasant. " +
          'Play the marshmallow-on-a-spoon relay — children carry a small object on a spoon to a finish line and back without dropping it. ' +
          'They must wait for the real "Go!" and not start on "Gomer" or "low." ' +
          "The pause before action is the same muscle as putting the phone down.",
        teen: {
          experiment:
            "When you feel the pull to check your phone, count to ten before you pick it up. Do it for one day. Tell me what you noticed, or don't.",
          note: "Skip the relay. Offer the small self-experiment.",
        },
      },
      {
        number: 4,
        title: "Conquest over the weak will",
        family:
          'Read the Seneca quote: "Most powerful is he who has himself in his own power." ' +
          'Read James 3:1–12 on taming the tongue — "if you can control your tongue, you\'ll be able to control yourself in other ways also." ' +
          "Discuss: the thumb on the screen is the same muscle as the tongue.",
        teen: {
          reading: "A short passage from Ourselves on the Will's daily training",
          source: "Ourselves by Charlotte Mason",
          question:
            "Mason says the will gets stronger or weaker every single day. Which direction did yours go this week?",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "What we persist in becomes easier",
        family:
          'Read the Emerson quote: "That which we persist in doing becomes easier — not that the task itself has become easier, but that our ability to perform it has improved." ' +
          "Play the stillness game — child stands or sits perfectly still for a set number of minutes while you try to make them laugh with jokes or funny faces. " +
          "Changing thoughts to stay focused is the same skill as not picking up the phone.",
        teen: {
          question: "Was it harder to stay still or to try to break them? Which one is the screen-pull?",
          note: "Invite them to run the stillness game for the younger kids — they pick the time, they make the faces. Authority shift. Ask afterward, alone.",
        },
      },
      {
        number: 6,
        title: "Outbursts bring heartache",
        family:
          'Read "The King and His Hawk" — Genghis Khan kills his hawk in a rage, then discovers the hawk had been knocking the cup away because the spring water was poisoned. ' +
          "Discuss: what do we destroy in haste when we can't pause?",
        teen: {
          question:
            "Name one thing you've damaged — a relationship, a chance, a project — because you couldn't pause. What would the pause have cost you?",
          note: "Skip the story. Offer the question alone, in writing or in passing.",
        },
        midMonth: true,
      },
      {
        number: 7,
        title: "The Scriptures",
        family:
          "Discuss together — Proverbs 14:29 (quick-tempered equals folly), Proverbs 18:13 (listen before answering), " +
          "Galatians 5:22–25 (self-control is a fruit of the Spirit), Ephesians 4:26–27 (in anger do not sin), " +
          "1 Thessalonians 5:6–8 (be alert and self-controlled).",
        teen: {
          question: "Pick one. Live with it for a few days. We don't have to talk about it.",
          note: "Hand them the list privately.",
        },
      },
      {
        number: 8,
        title: "Celebration",
        family:
          'Read the F.D.R. quote: "We cannot always build the future for our youth, but we can build our youth for the future." ' +
          "Hold your family celebration (the one you chose in Parent Prep). " +
          "End-of-month reflection: Who are we when the screens are off? Where did we strengthen?",
        teen: {
          note: "Let them pick the celebration, or opt out of the reflection circle and write one private line in their own notebook. The reflection doesn't have to be shared to count.",
        },
      },
    ],
  },

  // ─── MONTH THREE: SHOPPING ───────────────────────────────────────────
  {
    id: "month-3-shopping",
    number: 3,
    title: "Shopping",
    subtitle: "World",
    habit: "Self-Restraint in Indulgences",
    habitDefinition: "Enjoying pleasure in moderation; not being controlled by desire",
    phrase: "Not every desire needs a yes.",
    familyFocus:
      "We pause before buying. We look at what we already have first — and " +
      "ask how it could be used or worn differently, or whether something we " +
      "already own can do what the new item promises. Wanting more is a " +
      "feeling, not an instruction. Gratitude before wanting.",
    parentAnchor: {
      title: "Self-Restraint in Indulgences",
      source: "Laying Down the Rails (adult)",
      pages: "pp. 144–145",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 379.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Pause Before Yes. Before buying anything non-essential, wait 24 hours. " +
      "First look at what you already own — could something be used or worn differently? " +
      "Could something you have do what the new item promises?",
    midMonthQuestion:
      "What did we want this week that we didn't need? What did we already have that turned out to be enough?",
    midMonthQuestionAtLesson: 7,
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Self-Restraint in Indulgences together. Discuss what it means to enjoy pleasure in moderation without being controlled by desire. " +
          'Identify the family goal: "Before we buy something new, we will first look at what we already have. Can something be used or worn differently? Can something we own do what the new item promises?" ' +
          "Read Proverbs 23:29–35. Get the kids' input on what changes feel doable.",
        teen: {
          reading: "Ourselves, passages on Avarice and the desire for possessions (Vol. 4, Bk 1, pp. 191–203)",
          source: "Ourselves by Charlotte Mason",
          question:
            "Mason says wanting can become its own kind of master. When has wanting something stolen the enjoyment of what you already had?",
        },
      },
      {
        number: 2,
        title: "Industrious in free time",
        family:
          "Discuss point two together — how free time can either feed restlessness or feed real life. " +
          "As a family, compose a Top Ten (or Top Twenty) list of ways to use free time wisely that don't involve buying or scrolling. " +
          "Post it where everyone can see.",
        teen: {
          experiment: "Make your own list — private, just for you. No sharing required.",
          question: "Which of these would actually fill you, and which would just kill time?",
        },
      },
      {
        number: 3,
        title: "The Cup-bearer",
        family:
          'Read "The Cup-bearer" from Fifty Famous People — young Cyrus refuses to throw a feast because in Persia, ' +
          '"if anyone is hungry, he eats some bread and meat. We never go to all this trouble and expense of making a fine dinner in order that our friends may eat what is not good for them." ' +
          "Discuss self-restraint in food, drink, sleep, and entertainment.",
        teen: {
          reading: "Same story, or the Ourselves passage on the discipline of contentment",
          source: "Ourselves by Charlotte Mason",
          question: "Cyrus had access to everything and chose less. What's the modern version of refusing the feast?",
        },
      },
      {
        number: 4,
        title: "The Scriptures",
        family:
          "Discuss together how these relate to Self-Restraint — Proverbs 6:9–11 (too much sleep brings poverty), " +
          "Ecclesiastes 2:1–11 (too many possessions and entertainment is chasing the wind), " +
          "Ecclesiastes 5:10–20 (love of money is meaningless).",
        teen: {
          reading: "Ecclesiastes 2 and 5",
          source: "The Bible",
          question:
            "Solomon had everything. Read what he said about it. Tell me what you think — or don't.",
          note: "Hand them the passages privately.",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "Town Mouse and Country Mouse",
        family:
          'Read "The Town Mouse and the Country Mouse." ' +
          'Discuss the trade — luxuries and dainties versus "plain food and simple life with the peace and security that go with it." ' +
          "Sometimes people chase prestige, fine things, status — and lose tranquility in the chase.",
        teen: {
          question:
            "Look at your most-used apps or the places you scroll most. What are they selling you that you didn't know you wanted before you saw it? Tell me, or just sit with it.",
          note: "Skip the fable.",
        },
      },
      {
        number: 6,
        title: "Re-imagining what you have",
        family:
          "Family activity: Each person picks one item from their closet, room, or kitchen and finds three new ways to use or wear it. " +
          "Style a shirt differently. Use a pan for something it wasn't bought for. Rearrange a corner of a room with only what's already there. " +
          "Discuss together: what did we discover that we already had?",
        teen: {
          experiment:
            "Before you add anything to a cart this week — clothes, gear, app, anything — pause and find one thing you already own that could meet the same need. Take a picture of the swap if you want, just for you.",
          note: "This one is theirs. No reporting back required.",
        },
      },
      {
        number: 7,
        title: "The Scriptures and role play",
        family:
          "Discuss Ecclesiastes 7:3–4 (the heart of fools desires constant fun), Ephesians 5:18 (do not get drunk on wine), " +
          "Hebrews 11:24–27 (Moses chose to endure rather than enjoy the pleasures of sin). " +
          'Read the Thomas Jefferson quote: "We never repent of having eaten too little." ' +
          "Role play: what do you do if a friend or sibling is urging you to overindulge in something — buying, eating, scrolling?",
        teen: {
          quote: "We never repent of having eaten too little. — Thomas Jefferson",
          question: "What's something you've never regretted having less of?",
        },
        midMonth: true,
      },
      {
        number: 8,
        title: "The Dog and His Master's Dinner",
        family:
          'Read "The Dog and His Master\'s Dinner" — the faithful dog who guards his master\'s dinner from every other dog, until one day a pack overwhelms him and he gives up and grabs a piece for himself. ' +
          "Do not stop to argue with temptation. " +
          'Discuss the saying: "You can\'t stop a bird from flying over your head, but you can keep it from making a nest in your hair."',
        teen: {
          quote:
            "It is the great curse of Gluttony that it ends by destroying all sense of the precious, the unique, the irreplaceable. — Dorothy Sayers",
          question:
            "When too-much makes everything ordinary — what have you stopped being able to enjoy because you have too much of it?",
        },
      },
      {
        number: 9,
        title: "The Fisherman and His Wife",
        family:
          'Read "The Fisherman and His Wife." The wife asks for a cottage, then a castle, then to be king, then to be master of the sun — and ends back in the dirty hut by the sea. ' +
          "Discuss: discontentment leads to over-indulgence, which still does not satisfy. Wanting more, more, more leaves us with less than we started.",
        teen: {
          reading: "Same story, or a related Ourselves passage on contentment",
          source: "Ourselves by Charlotte Mason",
          question:
            "The fisherman's wife had each thing for a moment before she wanted the next. When have you had something for a moment before you wanted the next thing?",
        },
      },
      {
        number: 10,
        title: "Celebration and term reflection",
        family:
          "Parent Share moment — tell a story from your own life about someone who lived with real contentment, or about a time you bought something you regretted. " +
          "Hold your family celebration (the one you chose in Parent Prep). " +
          "End-of-term reflection: Where did appetite rule us across these three months — at the table, on the screen, in the store? " +
          "Where did we strengthen? What stays with us going forward?",
        teen: {
          note: "Let them pick the celebration, or opt out of the reflection circle entirely and write a private term reflection in their own notebook — three lines, just for them. The growth doesn't have to be witnessed to be real.",
        },
      },
    ],
  },
];
