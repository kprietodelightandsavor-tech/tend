import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const Icon = {
  X: () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Flame: () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s-6 5.5-6 10c0 3.31 2.69 6 6 6s6-2.69 6-6c0-4.5-6-10-6-10z"/></svg>),
};

// Memory verses with durations — fetch text from API.Bible if available
const MEMORY_VERSES = [
  { ref: "Genesis 1:1",     weeks: 2 },
  { ref: "Psalm 23",        weeks: 3 },
  { ref: "John 3:16",       weeks: 2 },
  { ref: "Romans 5:8",      weeks: 2 },
  { ref: "Matthew 28:19-20", weeks: 3 },
];

function getMemoryVerseForWeek(week) {
  let weekCounter = 0;
  for (const verse of MEMORY_VERSES) {
    weekCounter += verse.weeks;
    if (week <= weekCounter) return verse;
  }
  return MEMORY_VERSES[0];
}

export default function BibleReadingScreen({ onNavigate, settings }) {
  const week = settings?.week || 1;
  const verseData = getMemoryVerseForWeek(week);
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from API.Bible if key exists
    if (process.env.VITE_BIBLE_API_KEY) {
      fetch(`https://api.api.bible/v1/bibles/de4e12af7f28f599-01/search?query=${encodeURIComponent(verseData.ref)}`, {
        headers: { "api-key": process.env.VITE_BIBLE_API_KEY }
      })
      .then(r => r.json())
      .then(data => {
        if (data.passages?.[0]) {
          setVerse({ text: data.passages[0].content, ref: verseData.ref });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [verseData.ref]);

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Flame />
          <h1 className="serif" style={{ marginBottom: 0, fontSize: 24 }}>Scripture</h1>
        </div>
        <button onClick={() => onNavigate("home")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)" }}>
          <Icon.X />
        </button>
      </div>

      <div style={{ marginBottom: 28, padding: "16px 18px", background: "var(--sage-bg)", borderRadius: 4, border: "1px solid var(--sage-md)" }}>
        <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>
          Memory Verse This Week
        </p>
        {loading ? (
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", margin: 0 }}>Loading...</p>
        ) : verse?.text ? (
          <>
            <p className="corm italic" style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.75, margin: "0 0 6px" }}>"{verse.text}"</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--sage)", letterSpacing: ".06em", margin: 0 }}>{verseData.ref} · ESV</p>
          </>
        ) : (
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", margin: 0 }}>{verseData.ref} · ESV</p>
        )}
      </div>

      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>A Gentle Feast Reading Plan</p>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.8 }}>
          A balanced, nourishing approach to Scripture reading — Old Testament, New Testament, Psalms, and Proverbs woven together.
        </p>
        <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--cream)", borderLeft: "3px solid var(--sage)", borderRadius: 2 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.7, margin: 0 }}>
            Week {week}: Genesis · Psalm 23 · Matthew 1 · Proverbs 1
          </p>
        </div>
      </div>

      <div style={{ marginTop: 40, padding: "20px", textAlign: "center", borderTop: "1px solid var(--rule)" }}>
        <button onClick={() => onNavigate("home")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--sage)" }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
