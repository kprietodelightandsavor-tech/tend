import { useState, useEffect, useCallback } from "react";

// ── Bible API config ──────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_BIBLE_API_KEY || "";
const BASE = "https://api.scripture.api.bible/v1";

const BIBLE_IDS = {
  NIrV: "6580c53a98cb4b95-01",
  ESV:  "f421fe261da7624f-01",
};

// ── Book lists ────────────────────────────────────────────────────────────────
const OT_BOOKS = [
  { id: "GEN", name: "Genesis",       chapters: 50 },
  { id: "EXO", name: "Exodus",        chapters: 40 },
  { id: "LEV", name: "Leviticus",     chapters: 27 },
  { id: "NUM", name: "Numbers",       chapters: 36 },
  { id: "DEU", name: "Deuteronomy",   chapters: 34 },
  { id: "JOS", name: "Joshua",        chapters: 24 },
  { id: "JDG", name: "Judges",        chapters: 21 },
  { id: "RUT", name: "Ruth",          chapters: 4  },
  { id: "1SA", name: "1 Samuel",      chapters: 31 },
  { id: "2SA", name: "2 Samuel",      chapters: 24 },
  { id: "1KI", name: "1 Kings",       chapters: 22 },
  { id: "2KI", name: "2 Kings",       chapters: 25 },
  { id: "1CH", name: "1 Chronicles",  chapters: 29 },
  { id: "2CH", name: "2 Chronicles",  chapters: 36 },
  { id: "EZR", name: "Ezra",          chapters: 10 },
  { id: "NEH", name: "Nehemiah",      chapters: 13 },
  { id: "EST", name: "Esther",        chapters: 10 },
  { id: "JOB", name: "Job",           chapters: 42 },
  { id: "ISA", name: "Isaiah",        chapters: 66 },
  { id: "JER", name: "Jeremiah",      chapters: 52 },
  { id: "LAM", name: "Lamentations",  chapters: 5  },
  { id: "EZK", name: "Ezekiel",       chapters: 48 },
  { id: "DAN", name: "Daniel",        chapters: 12 },
  { id: "HOS", name: "Hosea",         chapters: 14 },
  { id: "JOL", name: "Joel",          chapters: 3  },
  { id: "AMO", name: "Amos",          chapters: 9  },
  { id: "OBA", name: "Obadiah",       chapters: 1  },
  { id: "JON", name: "Jonah",         chapters: 4  },
  { id: "MIC", name: "Micah",         chapters: 7  },
  { id: "NAM", name: "Nahum",         chapters: 3  },
  { id: "HAB", name: "Habakkuk",      chapters: 3  },
  { id: "ZEP", name: "Zephaniah",     chapters: 3  },
  { id: "HAG", name: "Haggai",        chapters: 2  },
  { id: "ZEC", name: "Zechariah",     chapters: 14 },
  { id: "MAL", name: "Malachi",       chapters: 4  },
];

const NT_BOOKS = [
  { id: "MAT", name: "Matthew",          chapters: 28 },
  { id: "MRK", name: "Mark",             chapters: 16 },
  { id: "LUK", name: "Luke",             chapters: 24 },
  { id: "JHN", name: "John",             chapters: 21 },
  { id: "ACT", name: "Acts",             chapters: 28 },
  { id: "ROM", name: "Romans",           chapters: 16 },
  { id: "1CO", name: "1 Corinthians",    chapters: 16 },
  { id: "2CO", name: "2 Corinthians",    chapters: 13 },
  { id: "GAL", name: "Galatians",        chapters: 6  },
  { id: "EPH", name: "Ephesians",        chapters: 6  },
  { id: "PHP", name: "Philippians",      chapters: 4  },
  { id: "COL", name: "Colossians",       chapters: 4  },
  { id: "1TH", name: "1 Thessalonians",  chapters: 5  },
  { id: "2TH", name: "2 Thessalonians",  chapters: 3  },
  { id: "1TI", name: "1 Timothy",        chapters: 6  },
  { id: "2TI", name: "2 Timothy",        chapters: 4  },
  { id: "TIT", name: "Titus",            chapters: 3  },
  { id: "PHM", name: "Philemon",         chapters: 1  },
  { id: "HEB", name: "Hebrews",          chapters: 13 },
  { id: "JAS", name: "James",            chapters: 5  },
  { id: "1PE", name: "1 Peter",          chapters: 5  },
  { id: "2PE", name: "2 Peter",          chapters: 3  },
  { id: "1JN", name: "1 John",           chapters: 5  },
  { id: "2JN", name: "2 John",           chapters: 1  },
  { id: "3JN", name: "3 John",           chapters: 1  },
  { id: "JUD", name: "Jude",             chapters: 1  },
  { id: "REV", name: "Revelation",       chapters: 22 },
];

const WISDOM_BOOKS = [
  { id: "PRO", name: "Proverbs",     chapters: 31 },
  { id: "ECC", name: "Ecclesiastes", chapters: 12 },
];

const SENSITIVE_CHAPTERS = new Set([
  "GEN-19","GEN-34","GEN-38","EXO-32","LEV-18","LEV-20","NUM-25","NUM-31",
  "JDG-19","JDG-20","2SA-11","2SA-13","1KI-11","EZK-16","EZK-23",
  "SON-1","SON-2","SON-3","SON-4","SON-5","SON-6","SON-7","SON-8",
  "REV-17","REV-18",
]);

const ROTATION = ["OT", "PSALM", "NT", "WISDOM"];

const SLOT_STYLES = {
  OT:    { accent: "#A9B786", light: "#EFF4EA", icon: "\u2726", label: "Old Testament",    short: "OT"     },
  PSALM: { accent: "#C29B61", light: "#FAF3E8", icon: "\u266a", label: "Psalm",            short: "Psalm"  },
  NT:    { accent: "#4A7C7E", light: "#EAF2F2", icon: "\u271d", label: "New Testament",    short: "NT"     },
  WISDOM:{ accent: "#8B7BAB", light: "#F3EFF8", icon: "\u25c8", label: "Proverbs & Wisdom",short: "Wisdom" },
};

// ── State helpers ─────────────────────────────────────────────────────────────
const FRESH_STATE = {
  onboarded: false,
  translation: "NIrV",
  rotationIndex: 0,
  ot:     { bookIndex: 0, chapter: 1 },
  psalm:  { chapter: 1 },
  nt:     { bookIndex: 0, chapter: 1 },
  wisdom: { bookIndex: 0, chapter: 1 },
  lastReadDate: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem("tend_bible_v2");
    return raw ? { ...FRESH_STATE, ...JSON.parse(raw) } : FRESH_STATE;
  } catch { return FRESH_STATE; }
}

function saveState(s) {
  localStorage.setItem("tend_bible_v2", JSON.stringify(s));
}

function getSlotReading(state, slot) {
  if (slot === "OT") {
    const book = OT_BOOKS[state.ot.bookIndex % OT_BOOKS.length];
    return { slot, book, chapter: state.ot.chapter };
  }
  if (slot === "PSALM") {
    return { slot, book: { id: "PSA", name: "Psalms", chapters: 150 }, chapter: state.psalm.chapter };
  }
  if (slot === "NT") {
    const book = NT_BOOKS[state.nt.bookIndex % NT_BOOKS.length];
    return { slot, book, chapter: state.nt.chapter };
  }
  const book = WISDOM_BOOKS[state.wisdom.bookIndex % WISDOM_BOOKS.length];
  return { slot, book, chapter: state.wisdom.chapter };
}

function advanceSlot(state, slot) {
  const next = { ...state, rotationIndex: state.rotationIndex + 1, lastReadDate: new Date().toDateString() };
  if (slot === "OT") {
    const book = OT_BOOKS[state.ot.bookIndex % OT_BOOKS.length];
    next.ot = state.ot.chapter >= book.chapters
      ? { bookIndex: (state.ot.bookIndex + 1) % OT_BOOKS.length, chapter: 1 }
      : { ...state.ot, chapter: state.ot.chapter + 1 };
  } else if (slot === "PSALM") {
    next.psalm = { chapter: state.psalm.chapter >= 150 ? 1 : state.psalm.chapter + 1 };
  } else if (slot === "NT") {
    const book = NT_BOOKS[state.nt.bookIndex % NT_BOOKS.length];
    next.nt = state.nt.chapter >= book.chapters
      ? { bookIndex: (state.nt.bookIndex + 1) % NT_BOOKS.length, chapter: 1 }
      : { ...state.nt, chapter: state.nt.chapter + 1 };
  } else {
    const book = WISDOM_BOOKS[state.wisdom.bookIndex % WISDOM_BOOKS.length];
    next.wisdom = state.wisdom.chapter >= book.chapters
      ? { bookIndex: (state.wisdom.bookIndex + 1) % WISDOM_BOOKS.length, chapter: 1 }
      : { ...state.wisdom, chapter: state.wisdom.chapter + 1 };
  }
  return next;
}

function isSensitive(bookId, chapter) {
  return SENSITIVE_CHAPTERS.has(`${bookId}-${chapter}`);
}

async function fetchChapter(bibleId, bookId, chapter) {
  const chapterId = `${bookId}.${chapter}`;
  const url = `${BASE}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`;
  const res = await fetch(url, { headers: { "api-key": API_KEY } });
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json();
  return data.data?.content || "";
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BibleReadingScreen({ compact = false }) {
  const [state, setState]           = useState(loadState);
  const [activeSlot, setActiveSlot] = useState(null);
  const [text, setText]             = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const suggestedSlot = ROTATION[state.rotationIndex % 4];

  useEffect(() => {
    if (state.onboarded && !activeSlot) setActiveSlot(suggestedSlot);
  }, [state.onboarded]);

  const reading    = activeSlot ? getSlotReading(state, activeSlot) : null;
  const slotStyle  = activeSlot ? SLOT_STYLES[activeSlot] : SLOT_STYLES.OT;
  const sensitive  = reading ? isSensitive(reading.book.id, reading.chapter) : false;

  const fetchText = useCallback(async () => {
    if (!activeSlot || !API_KEY) return;
    const r = getSlotReading(state, activeSlot);
    setLoading(true);
    setError("");
    setText("");
    try {
      const content = await fetchChapter(BIBLE_IDS[state.translation] || BIBLE_IDS.NIrV, r.book.id, r.chapter);
      setText(content);
    } catch {
      setError("Couldn\u2019t load scripture. Check your API key or connection.");
    } finally {
      setLoading(false);
    }
  }, [activeSlot, state.translation, state.ot, state.psalm, state.nt, state.wisdom]);

  useEffect(() => { fetchText(); }, [fetchText]);

  const handleMarkDone = () => {
    const next = advanceSlot(state, activeSlot);
    setState(next);
    saveState(next);
    setText("");
    setActiveSlot(ROTATION[next.rotationIndex % 4]);
  };

  const handleSlotSelect = (slot) => {
    if (slot !== activeSlot) { setActiveSlot(slot); setText(""); }
  };

  const handleTranslationToggle = () => {
    const next = { ...state, translation: state.translation === "NIrV" ? "ESV" : "NIrV" };
    setState(next);
    saveState(next);
  };

  // ── Onboarding ──────────────────────────────────────────────────────────────
  if (!state.onboarded) {
    return (
      <OnboardingFlow
        onComplete={(setup) => {
          const next = { ...FRESH_STATE, ...setup, onboarded: true };
          setState(next);
          saveState(next);
          setActiveSlot(ROTATION[next.rotationIndex % 4]);
        }}
      />
    );
  }

  // ── Compact (Morning Basket widget) ────────────────────────────────────────
  if (compact) {
    return (
      <div style={{
        background: slotStyle.light,
        borderLeft: `3px solid ${slotStyle.accent}`,
        borderRadius: "10px",
        padding: "14px 16px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          {ROTATION.map(slot => {
            const s = SLOT_STYLES[slot];
            const isActive = slot === activeSlot;
            const isSuggested = slot === suggestedSlot;
            return (
              <button key={slot} onClick={() => handleSlotSelect(slot)} style={{
                background: isActive ? s.accent : "white",
                color: isActive ? "white" : s.accent,
                border: `1.5px solid ${s.accent}`,
                borderRadius: "20px", padding: "3px 10px",
                fontSize: "11px", fontFamily: "system-ui", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
                opacity: isActive ? 1 : 0.75,
              }}>
                {s.icon} {s.short}
                {isSuggested && !isActive && <span style={{ fontSize: "7px" }}>\u25cf</span>}
              </button>
            );
          })}
        </div>
        {reading && (
          <>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#2D3748", lineHeight: 1.2 }}>
              {reading.book.name} {reading.chapter}
            </div>
            {sensitive && (
              <div style={{ fontSize: "11px", color: "#9B7B3F", marginTop: "4px", fontStyle: "italic" }}>
                \u26a0 Contains mature themes \u2014 preview before reading aloud
              </div>
            )}
            <button onClick={handleMarkDone} style={{
              marginTop: "10px", background: slotStyle.accent, color: "white",
              border: "none", borderRadius: "6px", padding: "6px 14px",
              fontSize: "12px", fontFamily: "system-ui", fontWeight: 600, cursor: "pointer",
            }}>
              Mark Read \u2192
            </button>
          </>
        )}
      </div>
    );
  }

  // ── Full screen ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", fontFamily: "'Cormorant Garamond', Georgia, serif", paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{
        background: "white", borderBottom: "1px solid #E8E4DC",
        padding: "20px 24px 0", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Daily Scripture
            </p>
            <h1 style={{ margin: "2px 0 0", fontSize: "22px", fontWeight: 700, color: "#2D3748" }}>
              {reading ? `${reading.book.name} ${reading.chapter}` : "\u2014"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={handleTranslationToggle} style={{
              background: "#F3F0E8", border: "none", borderRadius: "20px",
              padding: "5px 13px", fontSize: "12px", fontFamily: "system-ui",
              fontWeight: 700, color: "#4A5568", cursor: "pointer", letterSpacing: "0.05em",
            }}>
              {state.translation}
            </button>
            <button
              onClick={() => { const n = { ...state, onboarded: false }; setState(n); saveState(n); }}
              title="Adjust starting positions"
              style={{ background: "none", border: "none", fontSize: "17px", cursor: "pointer", color: "#C4B89A" }}
            >
              \u2699
            </button>
          </div>
        </div>

        {/* Slot tabs */}
        <div style={{ display: "flex", borderTop: "1px solid #F0EBE0" }}>
          {ROTATION.map(slot => {
            const s = SLOT_STYLES[slot];
            const isActive = slot === activeSlot;
            const isSuggested = slot === suggestedSlot;
            const r = getSlotReading(state, slot);
            return (
              <button key={slot} onClick={() => handleSlotSelect(slot)} style={{
                flex: 1, padding: "10px 4px 12px", background: "none", border: "none",
                borderBottom: isActive ? `3px solid ${s.accent}` : "3px solid transparent",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: "2px", transition: "border-color 0.2s",
              }}>
                <span style={{ fontSize: "14px", color: isActive ? s.accent : "#BDB5A8" }}>{s.icon}</span>
                <span style={{
                  fontFamily: "system-ui", fontSize: "9px", fontWeight: 700,
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  color: isActive ? s.accent : "#BDB5A8",
                }}>
                  {s.short}
                </span>
                <span style={{ fontFamily: "system-ui", fontSize: "9px", color: isActive ? "#4A5568" : "#C4B89A" }}>
                  {r.book.name} {r.chapter}
                </span>
                {isSuggested && (
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: s.accent, display: "block", opacity: isActive ? 0 : 0.55,
                    marginTop: "1px",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Off-rotation note */}
      {activeSlot && activeSlot !== suggestedSlot && (
        <div style={{
          margin: "14px 24px 0", padding: "8px 14px",
          background: "#F7F5F0", borderRadius: "8px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ color: SLOT_STYLES[suggestedSlot].accent, fontSize: "13px" }}>{SLOT_STYLES[suggestedSlot].icon}</span>
          <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "11px", color: "#9CA3AF" }}>
            Today\u2019s suggested track is{" "}
            <span style={{ color: SLOT_STYLES[suggestedSlot].accent, fontWeight: 700 }}>
              {SLOT_STYLES[suggestedSlot].label}
            </span>
            {" "}\u2014 but read what calls to you.
          </p>
        </div>
      )}

      {/* Sensitive warning */}
      {sensitive && (
        <div style={{
          margin: "16px 24px 0", background: "#FEF3C7",
          border: "1px solid #F59E0B", borderRadius: "10px",
          padding: "12px 16px", display: "flex", gap: "10px", alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "18px" }}>\u26a0\ufe0f</span>
          <div>
            <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "13px", fontWeight: 700, color: "#92400E" }}>
              Heads up before reading aloud
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "system-ui", fontSize: "12px", color: "#92400E", opacity: 0.85 }}>
              This chapter contains mature themes. Preview it and paraphrase for younger children if needed.
            </p>
          </div>
        </div>
      )}

      {/* Scripture */}
      <div style={{ padding: "20px 24px" }}>
        {!API_KEY && (
          <div style={{
            background: slotStyle.light, borderRadius: "12px", padding: "24px",
            textAlign: "center", border: `1px dashed ${slotStyle.accent}`,
          }}>
            <p style={{ margin: 0, color: "#4A5568", fontFamily: "system-ui", fontSize: "14px", lineHeight: 1.7 }}>
              Add your <strong>api.bible API key</strong> as{" "}
              <code style={{ background: "#E8E4DC", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>
                VITE_BIBLE_API_KEY
              </code>{" "}
              in Netlify to load scripture text.
            </p>
            <p style={{ margin: "10px 0 0", color: "#9CA3AF", fontFamily: "system-ui", fontSize: "12px" }}>
              Free at scripture.api.bible
            </p>
          </div>
        )}

        {API_KEY && loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `3px solid ${slotStyle.light}`, borderTop: `3px solid ${slotStyle.accent}`,
              animation: "spin 1s linear infinite", margin: "0 auto 12px",
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ fontFamily: "system-ui", fontSize: "13px", color: "#9CA3AF", margin: 0 }}>Loading scripture\u2026</p>
          </div>
        )}

        {API_KEY && error && (
          <div style={{ background: "#FEE2E2", borderRadius: "10px", padding: "16px", color: "#991B1B", fontFamily: "system-ui", fontSize: "13px" }}>
            {error}
          </div>
        )}

        {!loading && !error && text && (
          <div style={{
            background: "white", borderRadius: "14px", padding: "24px 28px",
            border: `1px solid ${slotStyle.light}`, boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          }}>
            <div
              style={{ fontSize: "18px", lineHeight: "1.9", color: "#2D3748", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        )}

        {!API_KEY && reading && (
          <div style={{ marginTop: "16px", background: "white", borderRadius: "14px", padding: "32px 28px", border: "1px solid #E8E4DC", textAlign: "center" }}>
            <p style={{ fontStyle: "italic", color: "#C4B89A", fontSize: "22px", margin: 0 }}>
              {reading.book.name} {reading.chapter}
            </p>
            <p style={{ color: "#D1CCC0", fontFamily: "system-ui", fontSize: "12px", marginTop: "12px" }}>
              Scripture text loads once your API key is configured.
            </p>
          </div>
        )}
      </div>

      {/* Fixed bottom action */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", borderTop: "1px solid #E8E4DC", padding: "14px 24px",
      }}>
        <button onClick={handleMarkDone} style={{
          width: "100%", background: slotStyle.accent, color: "white",
          border: "none", borderRadius: "12px", padding: "14px",
          fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em",
        }}>
          We read it \u2014 move on \u2192
        </button>
      </div>
    </div>
  );
}

// ── Onboarding flow ───────────────────────────────────────────────────────────
function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [setup, setSetup] = useState({
    translation: "NIrV",
    rotationIndex: 0,
    ot:     { bookIndex: 8,  chapter: 24 },  // 1 Samuel 24
    psalm:  { chapter: 102 },
    nt:     { bookIndex: 4,  chapter: 24 },  // Acts 24
    wisdom: { bookIndex: 0,  chapter: 20 },  // Proverbs 20
  });

  const steps = [
    { key: "welcome" },
    { key: "OT",      label: "Old Testament",    books: OT_BOOKS,     slotKey: "ot",     hasBooks: true  },
    { key: "PSALM",   label: "Psalms",            books: null,         slotKey: "psalm",  hasBooks: false },
    { key: "NT",      label: "New Testament",     books: NT_BOOKS,     slotKey: "nt",     hasBooks: true  },
    { key: "WISDOM",  label: "Proverbs & Wisdom", books: WISDOM_BOOKS, slotKey: "wisdom", hasBooks: true  },
    { key: "translation" },
  ];

  const current = steps[step];
  const s = (current.key !== "welcome" && current.key !== "translation") ? SLOT_STYLES[current.key] : SLOT_STYLES.OT;

  return (
    <div style={{
      minHeight: "100vh", background: "#FAFAF7",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Progress */}
      <div style={{ height: "3px", background: "#E8E4DC" }}>
        <div style={{
          height: "100%", background: "#A9B786",
          width: `${(step / (steps.length - 1)) * 100}%`,
          transition: "width 0.4s ease",
        }} />
      </div>

      <div style={{ flex: 1, padding: "40px 28px 100px", maxWidth: "480px", margin: "0 auto", width: "100%" }}>

        {/* Welcome screen */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>\u2726</div>
            <h2 style={{ margin: "0 0 12px", fontSize: "30px", fontWeight: 700, color: "#2D3748", lineHeight: 1.2 }}>
              Daily Scripture Reading
            </h2>
            <p style={{ margin: "0 0 12px", fontSize: "18px", color: "#6B7280", lineHeight: 1.7 }}>
              A gentle four-track plan that picks up right where you leave off.
            </p>
            <p style={{ margin: "0 0 8px", fontSize: "16px", color: "#9CA3AF", lineHeight: 1.7 }}>
              Each day moves through one of four tracks:
            </p>
            <div style={{ margin: "16px 0 28px" }}>
              {ROTATION.map(slot => {
                const s = SLOT_STYLES[slot];
                return (
                  <div key={slot} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <span style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: s.light, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "16px", color: s.accent, flexShrink: 0,
                    }}>
                      {s.icon}
                    </span>
                    <span style={{ fontSize: "17px", color: "#4A5568" }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ margin: "0 0 8px", fontSize: "15px", color: "#9CA3AF", fontStyle: "italic", lineHeight: 1.7 }}>
              Skip a day? No guilt \u2014 it just waits. You can also choose any track on any day.
            </p>
            <p style={{ margin: 0, fontSize: "15px", color: "#9CA3AF", fontStyle: "italic", lineHeight: 1.7 }}>
              Already in the middle of a reading program? We\u2019ll set your starting places next.
            </p>
          </div>
        )}

        {/* Book + chapter setup screens */}
        {current.hasBooks && current.books && (
          <SlotSetup
            slotStyle={s}
            label={current.label}
            books={current.books}
            value={setup[current.slotKey]}
            onChange={val => setSetup(prev => ({ ...prev, [current.slotKey]: val }))}
          />
        )}

        {/* Psalm setup */}
        {current.key === "PSALM" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <span style={{ fontSize: "28px", color: SLOT_STYLES.PSALM.accent }}>{SLOT_STYLES.PSALM.icon}</span>
              <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 700, color: "#2D3748" }}>Psalms</h2>
            </div>
            <p style={{ margin: "0 0 24px", fontSize: "16px", color: "#6B7280", lineHeight: 1.7 }}>
              Which Psalm are you currently reading?
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
              <span style={{ fontSize: "22px", color: "#9CA3AF" }}>Psalm</span>
              <StepInput
                value={setup.psalm.chapter}
                min={1} max={150}
                accent={SLOT_STYLES.PSALM.accent}
                onChange={v => setSetup(prev => ({ ...prev, psalm: { chapter: v } }))}
              />
            </div>
            <p style={{ margin: "8px 0 0", fontFamily: "system-ui", fontSize: "12px", color: "#C4B89A" }}>
              Cycles 1\u2013150 then restarts
            </p>
          </div>
        )}

        {/* Translation */}
        {current.key === "translation" && (
          <div>
            <h2 style={{ margin: "0 0 12px", fontSize: "26px", fontWeight: 700, color: "#2D3748" }}>
              Which translation?
            </h2>
            <p style={{ margin: "0 0 28px", fontSize: "16px", color: "#9CA3AF", lineHeight: 1.7 }}>
              You can switch any time from the reading screen.
            </p>
            {["NIrV", "ESV"].map(t => (
              <button key={t} onClick={() => setSetup(prev => ({ ...prev, translation: t }))} style={{
                display: "block", width: "100%", marginBottom: "12px",
                background: setup.translation === t ? "#EFF4EA" : "white",
                border: `2px solid ${setup.translation === t ? "#A9B786" : "#E8E4DC"}`,
                borderRadius: "12px", padding: "16px 20px", cursor: "pointer", textAlign: "left",
              }}>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#2D3748" }}>{t}</p>
                <p style={{ margin: "2px 0 0", fontFamily: "system-ui", fontSize: "12px", color: "#9CA3AF" }}>
                  {t === "NIrV"
                    ? "New International Reader\u2019s Version \u2014 simpler vocabulary, great for families"
                    : "English Standard Version \u2014 formal, word-for-word"}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", borderTop: "1px solid #E8E4DC",
        padding: "14px 28px", display: "flex", gap: "12px",
      }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            padding: "13px 20px", background: "#F3F0E8", border: "none",
            borderRadius: "12px", fontFamily: "system-ui", fontSize: "14px",
            fontWeight: 600, color: "#6B7280", cursor: "pointer",
          }}>
            \u2190 Back
          </button>
        )}
        <button
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete(setup)}
          style={{
            flex: 1, background: "#A9B786", color: "white", border: "none",
            borderRadius: "12px", padding: "14px",
            fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em",
          }}
        >
          {step === steps.length - 1 ? "Begin Reading \u2192" : "Continue \u2192"}
        </button>
      </div>
    </div>
  );
}

// ── SlotSetup ─────────────────────────────────────────────────────────────────
function SlotSetup({ slotStyle, label, books, value, onChange }) {
  const currentBook = books[value.bookIndex % books.length];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <span style={{ fontSize: "28px", color: slotStyle.accent }}>{slotStyle.icon}</span>
        <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 700, color: "#2D3748" }}>{label}</h2>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: "16px", color: "#6B7280", lineHeight: 1.7 }}>
        Where are you currently reading? Pick the book and chapter, or leave as-is to start from the beginning.
      </p>
      <label style={{
        display: "block", fontFamily: "system-ui", fontSize: "11px", fontWeight: 700,
        color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px",
      }}>
        Book
      </label>
      <select
        value={value.bookIndex}
        onChange={e => onChange({ bookIndex: parseInt(e.target.value), chapter: 1 })}
        style={{
          width: "100%", padding: "12px 16px", border: "2px solid #E8E4DC",
          borderRadius: "10px", fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "18px", color: "#2D3748", background: "white",
          appearance: "none", marginBottom: "20px", cursor: "pointer",
        }}
      >
        {books.map((book, i) => (
          <option key={book.id} value={i}>{book.name}</option>
        ))}
      </select>
      <label style={{
        display: "block", fontFamily: "system-ui", fontSize: "11px", fontWeight: 700,
        color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px",
      }}>
        Chapter
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <StepInput
          value={value.chapter}
          min={1}
          max={currentBook.chapters}
          accent={slotStyle.accent}
          onChange={v => onChange({ ...value, chapter: v })}
        />
        <span style={{ color: "#C4B89A", fontFamily: "system-ui", fontSize: "13px" }}>
          of {currentBook.chapters}
        </span>
      </div>
    </div>
  );
}

// ── StepInput ─────────────────────────────────────────────────────────────────
function StepInput({ value, min, max, accent, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} style={{
        width: "36px", height: "36px", borderRadius: "8px",
        background: "#F3F0E8", border: "none", cursor: "pointer",
        fontSize: "18px", fontWeight: 700, color: "#6B7280",
      }}>\u2212</button>
      <span style={{ minWidth: "48px", textAlign: "center", fontSize: "26px", fontWeight: 700, color: "#2D3748" }}>
        {value}
      </span>
      <button onClick={() => onChange(Math.min(max, value + 1))} style={{
        width: "36px", height: "36px", borderRadius: "8px",
        background: "#F3F0E8", border: "none", cursor: "pointer",
        fontSize: "18px", fontWeight: 700, color: "#6B7280",
      }}>+</button>
    </div>
  );
}
