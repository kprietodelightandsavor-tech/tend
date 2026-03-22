import { useState, useRef, useEffect } from "react";
import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES, RISE_SHINE_ITEMS } from "../data/seed";

// ─── HABIT ICONS ──────────────────────────────────────────────────────────────
const HABIT_ICONS = {
  attention: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  narration: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  outdoor: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-8 4 5 3-3 4 6H3z"/><circle cx="18" cy="6" r="2"/>
    </svg>
  ),
  stillness: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  orderly: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
};

const Icon = {
  Leaf:    () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Feather: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>),
  Sun:     () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Arrow:   () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  Sprout:  () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10C12 10 8 9 7 5c3 0 5 2 5 5z"/><path d="M12 10C12 10 16 9 17 5c-3 0-5 2-5 5z"/></svg>),
  Moon:    () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>),
  X:       () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

const getBlockColor = (subject) => {
  const s = subject.toLowerCase();
  if (s.includes("rise") || s.includes("bible") || s.includes("memory") || s.includes("living literature")) return "var(--block-morning)";
  if (s.includes("math") || s.includes("language") || s.includes("writing") || s.includes("copywork") || s.includes("history") || s.includes("science") || s.includes("geography") || s.includes("historical fiction") || s.includes("spanish") || s.includes("reading") || s.includes("timeline") || s.includes("commonplace")) return "var(--block-academic)";
  if (s.includes("nature") || s.includes("outdoor")) return "var(--block-nature)";
  if (s.includes("co-op") || s.includes("bach") || s.includes("chispa")) return "var(--block-coop)";
  if (s.includes("lunch") || s.includes("free") || s.includes("rest") || s.includes("afternoon")) return "var(--block-free)";
  return "var(--rule)";
};

const MOTHER_CULTURE_DAILY = [
  "Rest fully today. The week ahead needs a rested you.",
  "Step outside alone for 10 minutes before the day begins. Let the morning be yours first.",
  "Make yourself something warm to drink and sit with it before opening any screens.",
  "Take a short walk, even just around the property. Move your body gently.",
  "Rest your eyes from screens for 20 minutes today. Look at something far away.",
  "Go outside and look up. Sky, clouds, light — let it reset something in you.",
  "Linger over breakfast. Let the morning be unhurried.",
];

const REST_WEEK_RHYTHM = [
  [{ label: "Morning Quiet", note: "Sleep in. Linger over breakfast. No agenda." }, { label: "Church or Worship", note: "Let Sunday be what it is meant to be." }, { label: "Afternoon Rest", note: "Nap, read, sit outside. Simply be." }],
  [{ label: "Morning Outside", note: "Begin the rest week outdoors — longer than usual, no nature journal required." }, { label: "Creative Morning", note: "Art, music, handicraft. Let the children follow their own curiosity." }, { label: "Read Aloud", note: "A longer session than usual. Let the story breathe." }, { label: "Free Afternoon", note: "No assignments. No checklist." }],
  [{ label: "Morning Slow Start", note: "Breakfast together, no rush to begin anything." }, { label: "Outing or Errand", note: "Library, farm stand, nature trail, or simply a drive somewhere new." }, { label: "Quiet Afternoon", note: "Independent reading, drawing, rest." }],
  [{ label: "Morning Chores Together", note: "Tend the home slowly. Order as an act of love." }, { label: "Cook Something Together", note: "Let the kitchen be today's classroom." }, { label: "Outside Time", note: "Unstructured. Let them wander." }, { label: "Evening Rest", note: "A good book, early bedtime." }],
  [{ label: "Morning Quiet Time", note: "Bible, journaling, tea. Begin the day gently." }, { label: "Creative Project", note: "Something with hands — building, painting, sewing, baking." }, { label: "Nature Walk", note: "No sketching required today. Just walk and notice." }],
  [{ label: "Morning Outside", note: "End the rest week where you began — in the open air." }, { label: "Read Aloud", note: "Revisit a favourite, or begin something new for next term." }, { label: "Prepare for the Week", note: "Light tidying, gather books, set the table for Monday." }, { label: "Celebrate the Rest", note: "Name one good thing from this week away." }],
  [{ label: "Family Day", note: "No school, no agenda. Just be together." }, { label: "Outdoor Adventure", note: "A longer outing — park, trail, town, or simply the back pasture." }, { label: "Evening Gathering", note: "Good food, good conversation, early rest." }],
];

const FREE_KEYWORDS = ["rise", "chores", "piano", "free", "rest", "independent", "lunch", "outdoor", "nature", "afternoon"];
const isFreeBlock = (subject) => FREE_KEYWORDS.some(k => subject.toLowerCase().includes(k));

// ─── PREMIUM MODAL ────────────────────────────────────────────────────────────
// Drop this into HomeScreen.jsx, replacing the existing PremiumModal function.
// Everything else in HomeScreen.jsx stays exactly the same.

export function PremiumModal({ onClose }) {
  const Icon = {
    X: () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  };

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
    "Voice & photo import — speak or snap your paper planner",
    "Print your weekly schedule & export to Apple / Google Calendar",
    "Save day templates — set it once, reset anytime",
    "Beauty Loop with editable enrichments per day",
    "Term counter with rest week gentle rhythm",
    "All five Charlotte Mason habits with 12-week reflection",
    "Unlimited Consider the Lilies entries for every family member",
    "Unlimited narration sessions with AI coaching",
    "Unlimited student profiles with narration history",
    "Full rotating Mother Culture prompt bank",
  ];

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 52px", maxHeight: "92dvh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>
              Delight & Savor
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: "var(--ink)" }}>
              Tend Premium
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", marginTop: 4 }}>
            <Icon.X />
          </button>
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", marginBottom: 24, lineHeight: 1.8 }}>
          Beauty. Meaning. Connection.
        </p>

        {/* Description */}
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "16px 18px", marginBottom: 24 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.9 }}>
            Tend Premium is for the family that wants to go deeper — a full weekly planner that breathes with your rhythm, a living nature and commonplace journal, all five habits tended over twelve weeks, and the tools to make Charlotte Mason homeschooling feel as beautiful as it actually is.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.8, marginTop: 12 }}>
            When you're ready, we'd love to have you.
          </p>
        </div>

        {/* Pricing */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, border: "2px solid var(--sage)", borderRadius: 3, padding: "16px", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "var(--sage)", borderRadius: 20, padding: "2px 10px" }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "white" }}>Best value</p>
            </div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 6 }}>Annual</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "var(--ink)", marginBottom: 2, lineHeight: 1 }}>$47</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)", letterSpacing: ".06em" }}>per year</p>
          </div>
          <div style={{ flex: 1, border: "1px solid var(--rule)", borderRadius: 3, padding: "16px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6, marginTop: 6 }}>Monthly</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "var(--ink)", marginBottom: 2, lineHeight: 1 }}>$4.99</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)", letterSpacing: ".06em" }}>per month</p>
          </div>
        </div>

        {/* Free features */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>
            Free — always
          </p>
          {FREE_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>

        {/* Premium features */}
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "18px", marginBottom: 28 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 14 }}>
            Premium — everything above, plus
          </p>
          {PREMIUM_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✦</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://delightnsavor.gumroad.com/l/qrxxi"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", background: "var(--sage)", borderRadius: 2, padding: "14px 0", width: "100%", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "white", textAlign: "center", textDecoration: "none", marginBottom: 12 }}
        >
          Join Tend Premium →
        </a>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
          $47/year or $4.99/month · cancel anytime
        </p>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20, borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
          <a href="https://www.delightandsavor.com" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
            Explore curriculum & the blog at Delight & Savor →
          </a>
          <a href="https://substack.com/@delightandsavor" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", textDecoration: "none", padding: "12px 0" }}>
            Follow along on Substack →
          </a>
        </div>

        <button onClick={onClose}
          style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "11px 0", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}
// ─── OUTDOOR TRACKER ──────────────────────────────────────────────────────────
const OUTDOOR_GOAL_HOURS = 15;

function OutdoorTracker({ onNavigate, initialMinutes, saveToMeta }) {
  const [minutes, setMinutes] = useState(initialMinutes || 0);

  // Sync if initialMinutes changes (e.g. on load)
  useEffect(() => {
    setMinutes(initialMinutes || 0);
  }, [initialMinutes]);

  const adjust = async (n) => {
    const next = Math.max(0, minutes + n);
    setMinutes(next);
    if (saveToMeta) await saveToMeta({ outdoor_minutes: next });
  };

  const hours = Math.floor(minutes / 60);
  const mins  = minutes % 60;
  const pct   = Math.min(minutes / (OUTDOOR_GOAL_HOURS * 60), 1);
  const r = 34, circ = 2 * Math.PI * r, dash = circ * pct;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Leaf />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Outside This Week</p>
        </div>
        <button onClick={() => onNavigate("outdoors")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Nature <Icon.Arrow />
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--rule)" strokeWidth="5"/>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--sage)" strokeWidth="5"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .5s ease" }}/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span className="serif" style={{ fontSize: 15, color: "var(--sage)", lineHeight: 1 }}>
              {hours}<span style={{ fontSize: 10 }}>h</span>
              {mins > 0 && <span>{mins}<span style={{ fontSize: 10 }}>m</span></span>}
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: "var(--ink)", fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>
            {hours >= OUTDOOR_GOAL_HOURS ? "Goal reached this week ✦" : `${OUTDOOR_GOAL_HOURS - hours} hr${mins > 0 ? ` ${60 - mins} min` : ""} to go`}
          </p>
          <p className="caption italic" style={{ marginBottom: 10 }}>Goal: {OUTDOOR_GOAL_HOURS} hrs / week</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            {[15, 30, 45, 60].map(n => (
              <button key={n} onClick={() => adjust(n)}
                style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 2, padding: "5px 7px", fontSize: 10, fontFamily: "'Lato', sans-serif", color: "var(--sage)", cursor: "pointer" }}>
                +{n}m
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[15, 30].map(n => (
              <button key={n} onClick={() => adjust(-n)}
                style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "4px 7px", fontSize: 10, fontFamily: "'Lato', sans-serif", color: "var(--ink-faint)", cursor: "pointer" }}>
                −{n}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REST WEEK HOME ───────────────────────────────────────────────────────────
function RestWeekHome() {
  const day = new Date().getDay();
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "12px 16px", background: "var(--gold-bg)", borderRadius: 3, border: "1px solid #E0CBA8" }}>
        <Icon.Moon />
        <div>
          <p style={{ fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 2 }}>Rest Week</p>
          <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.6 }}>The rhythm rests so it can return stronger.</p>
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Icon.Sun />
          <p className="eyebrow" style={{ marginBottom: 0 }}>A Gentle Rhythm for Today</p>
        </div>
        <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 16, lineHeight: 1.7 }}>Not a schedule — just a shape for the day.</p>
        {REST_WEEK_RHYTHM[day].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", opacity: .5, marginTop: 8, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 16, color: "var(--ink)", fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>{r.label}</p>
              <p className="caption italic" style={{ lineHeight: 1.6 }}>{r.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Icon.Feather />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Mother Culture</p>
        </div>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{MOTHER_CULTURE_DAILY[new Date().getDay()]}</p>
      </div>
    </div>
  );
}

// ─── TODAY'S SCHEDULE ─────────────────────────────────────────────────────────
function TodaySchedule({ today, blocks, onNavigate }) {
  const [items, setItems]             = useState(blocks.map(b => ({ ...b, status: "pending", motherNote: "", subChecked: {} })));
  const [editingNote, setEditingNote] = useState(null);
  const lpt = useRef(null);
  const riseShineItems = RISE_SHINE_ITEMS[today] || [];

  const toggleDone = (id) => {
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      if (!t || t.status === "skipped") return prev;
      if (t.status === "done") {
        return prev.map(b => b.id === id ? { ...b, status: "pending" } : b)
          .sort((a, b) => blocks.findIndex(x => x.id === a.id) - blocks.findIndex(x => x.id === b.id));
      }
      const u = prev.map(b => b.id === id ? { ...b, status: "done" } : b);
      return [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
    });
  };

  const markSkipped = (id) => {
    setItems(prev => {
      const u = prev.map(b => b.id === id ? { ...b, status: "skipped" } : b);
      return [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
    });
  };

  const toggleSub = (blockId, subIdx) => {
    setItems(prev => prev.map(b => b.id === blockId ? { ...b, subChecked: { ...b.subChecked, [subIdx]: !b.subChecked[subIdx] } } : b));
  };

  const saveNote  = (id, note) => { setItems(prev => prev.map(b => b.id === id ? { ...b, motherNote: note } : b)); setEditingNote(null); };
  const startLP   = (id) => { lpt.current = setTimeout(() => { clearTimeout(lpt.current); markSkipped(id); }, 600); };
  const cancelLP  = () => clearTimeout(lpt.current);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Sun />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Today · {today}</p>
        </div>
        <button onClick={() => onNavigate("planner")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Full week <Icon.Arrow />
        </button>
      </div>

      {items.map(b => {
        const isDone = b.status === "done", isSkipped = b.status === "skipped";
        const showMother = isFreeBlock(b.subject) && !isSkipped;
        const blockColor = getBlockColor(b.subject);
        const isRise = b.riseShine === true;
        return (
          <div key={b.id} style={{ borderBottom: "1px solid var(--rule)" }}>
            <div onClick={() => toggleDone(b.id)}
              onTouchStart={() => { if (b.status === "pending") startLP(b.id); }} onTouchEnd={cancelLP}
              onMouseDown={() => { if (b.status === "pending") startLP(b.id); }} onMouseUp={cancelLP} onMouseLeave={cancelLP}
              style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px", cursor: b.status !== "skipped" ? "pointer" : "default", opacity: isDone ? 0.35 : isSkipped ? 0.45 : 1, transition: "opacity .4s ease" }}>
              <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: isDone || isSkipped ? "var(--rule)" : blockColor, marginRight: 12, flexShrink: 0, transition: "background .3s ease", minHeight: 36 }} />
              <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}>{b.time}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, color: isDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)", transition: "all .3s ease" }}>{b.subject}</p>
                {isSkipped && <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>skipped today</p>}
                {b.note && !isSkipped && !isDone && <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>{b.note}</p>}
                {isDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
              </div>
            </div>
            {isRise && !isDone && !isSkipped && riseShineItems.length > 0 && (
              <div style={{ paddingLeft: 53, paddingBottom: 10 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {riseShineItems.map((item, idx) => {
                    const checked = b.subChecked?.[idx];
                    return (
                      <button key={idx} onClick={() => toggleSub(b.id, idx)}
                        style={{ background: checked ? "var(--sage-bg)" : "none", border: `1px solid ${checked ? "var(--sage)" : "var(--rule)"}`, borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: checked ? "var(--sage)" : "var(--ink-faint)", transition: "all .2s", textDecoration: checked ? "line-through" : "none" }}>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {showMother && (
              <div style={{ paddingLeft: 53, paddingBottom: 8 }} onClick={e => e.stopPropagation()}>
                {editingNote === b.id ? (
                  <input autoFocus defaultValue={b.motherNote} placeholder="What will you tend during this time?"
                    onBlur={e => saveNote(b.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                    style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }}/>
                ) : (
                  <button onClick={() => setEditingNote(b.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", padding: 0, textAlign: "left", opacity: b.motherNote ? 1 : 0.5 }}>
                    {b.motherNote ? `✦ ${b.motherNote}` : "your time · what will you tend?"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap to complete · Tap again to undo · Hold to skip</p>
    </div>
  );
}

function MotherCulture() {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Icon.Feather />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Mother Culture</p>
      </div>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{MOTHER_CULTURE_DAILY[new Date().getDay()]}</p>
    </div>
  );
}

function HabitFocusCard({ activeHabit, onNavigate }) {
  const habit     = HABIT_PROMPTS[activeHabit];
  const HIcon     = HABIT_ICONS[activeHabit];
  const day       = new Date().getDay();
  const prompts   = habit.daily[day].slice(0, 2);
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const cmQuote   = CM_QUOTES[dayOfYear % CM_QUOTES.length];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon.Sprout />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Habit in Focus</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <HIcon />
        <p className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{habit.name}</p>
      </div>
      {prompts.map((p, i) => (
        <div key={i} style={{ paddingBottom: i < prompts.length - 1 ? 12 : 0, marginBottom: i < prompts.length - 1 ? 12 : 0, borderBottom: i < prompts.length - 1 ? "1px solid var(--rule)" : "none" }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8 }}>{p}</p>
        </div>
      ))}
      <button onClick={() => onNavigate("habits")}
        style={{ background: "none", border: "none", cursor: "pointer", marginTop: 14, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)" }}>
        Change habit focus →
      </button>
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--rule)" }}>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.85, marginBottom: 6 }}>"{cmQuote.quote}"</p>
        <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
export default function HomeScreen({ onNavigate, settings }) {
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayIndex  = Math.min(Math.max(new Date().getDay() - 1, 0), 4);
  const today       = DAYS[todayIndex] || "Monday";
  const todayBlocks = DAY_SCHEDULE[today] || DAY_SCHEDULE.Monday;
  const name        = settings?.name || "Friend";
  const activeHabit = settings?.activeHabit || "attention";
  const isRestWeek  = settings?.isRestWeek || false;

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>{greeting},<br />{name}.</h1>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", marginBottom: 28 }}>Begin with what is in front of you.</p>

      <OutdoorTracker
        onNavigate={onNavigate}
        initialMinutes={settings?.outdoorMinutes || 0}
        saveToMeta={settings?.saveToMeta}
      />

      <div style={{ height: 1, background: "var(--rule)", margin: "4px 0 24px" }} />

      {isRestWeek ? <RestWeekHome /> : (
        <>
          <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} />
          <div style={{ height: 1, background: "var(--rule)", margin: "0 0 24px" }} />
          <MotherCulture />
          <div style={{ height: 1, background: "var(--rule)", margin: "0 0 24px" }} />
        </>
      )}

      <HabitFocusCard activeHabit={activeHabit} onNavigate={onNavigate} />
    </div>
  );
}
