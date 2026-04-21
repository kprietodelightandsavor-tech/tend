import { useState, useRef, useEffect } from "react";
import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES, RISE_SHINE_ITEMS, BEAUTY_LOOP, getSaturdayRhythm, getSundayRhythm } from "../data/seed";
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
  Sprout:  () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10C12 10 8 9 7 5c3 0 5 2 5 5z"/><path d="M12 10C12 10 16 9 17 5c-3 0-5 2-5 5z"/></svg>),
  Moon:    () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>),
  X:       () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// ─── DAILY OFFSET ─────────────────────────────────────────────────────────────
const DAILY_OFFSET_KEY = "tend_daily_offset";

function DailyOffsetControl({ offset, onOffsetChange }) {
  const updateOffset = (minutes) => {
    const dateKey = new Date().toISOString().slice(0, 10);
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_OFFSET_KEY) || "{}");
      const updated = { ...saved, [dateKey]: minutes };
      localStorage.setItem(DAILY_OFFSET_KEY, JSON.stringify(updated));
      onOffsetChange(minutes);
    } catch (e) {
      console.error("Error saving offset:", e);
    }
  };

  const options = [0, 15, 30, 45, 60];

  return (
    <div style={{ padding: "14px 16px", background: offset > 0 ? "var(--gold-bg)" : "var(--sage-bg)", border: `1px solid ${offset > 0 ? "#E0CBA8" : "var(--sage-md)"}`, borderRadius: 4, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: offset > 0 ? "var(--gold)" : "var(--sage)", marginBottom: 0 }}>
          {offset > 0 ? `Started ${offset}m late` : "On Schedule"}
        </p>
        {offset > 0 && (
          <button onClick={() => updateOffset(0)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "underline" }}>
            Reset
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map((minutes) => (
          <button key={minutes} onClick={() => updateOffset(minutes)} style={{ padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${offset === minutes ? (offset > 0 ? "var(--gold)" : "var(--sage)") : "var(--rule)"}`, background: offset === minutes ? (offset > 0 ? "var(--gold)" : "var(--sage)") : "var(--cream)", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: offset === minutes ? "white" : "var(--ink-faint)", transition: "all .2s" }}>
            {minutes === 0 ? "On time" : `+${minutes}m`}
          </button>
        ))}
      </div>
    </div>
  );
}

function getAdjustedTime(timeString, offset) {
  if (!timeString || offset === 0) return timeString;
  const [hours, mins] = timeString.split(":").map(Number);
  const blockMinutes = hours * 60 + mins + offset;
  const newHours = Math.floor(blockMinutes / 60);
  const newMins = blockMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
}

// ─── PREMIUM MODAL ────────────────────────────────────────────────────────────
export function PremiumModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 52px", maxHeight: "92dvh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: "var(--ink)" }}>Tend Premium</h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", marginBottom: 24, lineHeight: 1.8 }}>Coming soon...</p>
        <button onClick={onClose} style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "11px 0", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function HomeScreen({ onNavigate, settings }) {
  const hour       = new Date().getHours();
  const greeting   = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayIdx   = new Date().getDay();
  const today      = todayIdx === 0 ? "Sunday" : todayIdx === 6 ? "Saturday" : DAYS[todayIdx - 1];
  const name       = settings?.name || "Friend";
  const cmQuote    = CM_QUOTES[Math.floor(Math.random() * CM_QUOTES.length)];
  
  const [dailyOffset, setDailyOffset] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_OFFSET_KEY) || "{}");
      const dateKey = new Date().toISOString().slice(0, 10);
      return saved[dateKey] || 0;
    } catch {
      return 0;
    }
  });

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>{greeting},<br />{name}.</h1>

      <DailyOffsetControl offset={dailyOffset} onOffsetChange={setDailyOffset} />

      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.85, marginBottom: 4 }}>"{cmQuote.quote}"</p>
        <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
      </div>

      <div style={{ marginTop: 40, marginBottom: 32, padding: "28px 20px 24px", borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", lineHeight: 2, marginBottom: 14 }}>
          The Lord is my shepherd; I shall not want.<br />
          He makes me lie down in green pastures.<br />
          He leads me beside still waters.<br />
          He restores my soul.<br />
          He leads me in paths of righteousness for his name's sake.<br />
          Even though I walk through the valley of the shadow of death,<br />
          I will fear no evil, for you are with me;<br />
          your rod and your staff, they comfort me.<br />
          You prepare a table before me in the presence of my enemies;<br />
          you anoint my head with oil; my cup overflows.<br />
          Surely goodness and mercy shall follow me all the days of my life,<br />
          and I shall dwell in the house of the Lord forever.
        </p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", opacity: 0.6 }}>
          Psalm 23 · ESV
        </p>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <img src="/ds-logo.png" alt="Delight & Savor" style={{ width: 64, height: 64, opacity: 0.12 }} />
        </div>
      </div>
    </div>
  );
}
