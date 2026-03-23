import { useState } from "react";
import { OUTDOOR_SUGGESTIONS } from "../data/seed";
import { PremiumModal } from "./HomeScreen";

// ─── ROTATING NATURE IDEAS ────────────────────────────────────────────────────
const NATURE_IDEAS = {
  observation: [
    "Find one thing that is perfectly still. Watch it for two minutes without moving.",
    "Look for evidence of an animal — tracks, feathers, droppings, a nest.",
    "Find something that has changed since last time you were outside.",
    "Observe one plant from root to tip. What is it doing today?",
    "Find three different shades of green. Notice how light changes each one.",
    "Look for something that doesn't belong — out of season, out of place.",
    "Find the oldest living thing you can see. What does its age look like?",
  ],
  sketch: [
    "Sketch one leaf exactly as it is — every vein, every imperfection.",
    "Draw the silhouette of one tree against the sky. Focus only on the outline.",
    "Sketch what is directly in front of you without looking down at your paper.",
    "Draw one cloud shape before it changes.",
    "Sketch the texture of one surface — bark, stone, soil, feather.",
    "Draw one insect or bird from memory after watching it for two minutes.",
    "Sketch the view from exactly where you are sitting, right now.",
  ],
  wonder: [
    "Find something you cannot explain. Sit with the question.",
    "What sound are you hearing that you usually ignore? Listen to it fully.",
    "Where is the light coming from? Follow it to its source.",
    "What is the smallest living thing you can find today?",
    "Find something that is in the process of changing — growing, dying, moving.",
    "What would this place look like in ten years? In a hundred?",
    "Find evidence of water — past or present. Where did it go?",
  ],
  nature_journal: [
    "Record today's weather in three specific words — not 'nice' or 'cold'.",
    "Write the date, location, and one living thing observed. That is a complete entry.",
    "Press one small leaf or flower into your journal today.",
    "Write what you heard before you wrote what you saw.",
    "Record the temperature, wind direction, and cloud cover.",
    "Draw a simple map of where you are right now.",
    "Write one question this place opens in you.",
  ],
};

const CATEGORIES = Object.keys(NATURE_IDEAS);

// ─── NATURE IDEA CARD ─────────────────────────────────────────────────────────
const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
);

function NatureIdeaCard({ isPaid, onShowPremium }) {
  if (!isPaid) {
    return (
      <div className="card-gold" style={{ marginBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Today's Nature Invitation</p>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8, marginBottom: 12 }}>
          Find one living thing and observe it for two full minutes before writing or sketching anything.
        </p>
        <div style={{ height: 1, background: "#D4B07A", opacity: .3, marginBottom: 12 }} />
        <p className="caption italic" style={{ marginBottom: 10 }}>
          Unlock daily rotating nature ideas — observation, sketching, wonder, and nature journal prompts — with Tend Premium.
        </p>
        <button onClick={onShowPremium}
          style={{ background: "var(--gold)", border: "none", borderRadius: 2, padding: "10px 0", width: "100%", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "white" }}>
          Learn about Tend Premium →
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <p className="eyebrow" style={{ marginBottom: 16 }}>Today's Nature Invitations</p>
      {CATEGORIES.map((cat, i) => {
        const ideas = NATURE_IDEAS[cat];
        const idea  = ideas[(dayOfYear + i) % ideas.length];
        const label = cat === "nature_journal" ? "Nature Journal" : cat.charAt(0).toUpperCase() + cat.slice(1);
        return (
          <div key={cat} style={{ padding: "14px 0", borderBottom: "1px solid var(--rule)" }}>
            <p className="eyebrow" style={{ marginBottom: 6, color: "var(--sage)", fontSize: 9 }}>{label}</p>
            <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{idea}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── NATURE LORE BOOKS ────────────────────────────────────────────────────────
const NATURE_LORE_BOOKS = [
  {
    title: "The Year Round",
    author: "C.J. Hylander",
    note: "A classic field guide organized by season — fauna, flora, and pen-and-ink drawings. Works alongside whatever you're seeing outside right now.",
    tag: "All ages · Seasons",
    current: true,
  },
  {
    title: "Burgess Bird Book for Children",
    author: "Thornton W. Burgess",
    note: "Peter Rabbit and Jenny Wren spend a summer meeting every bird in the Old Orchard. Habits, songs, nesting — learned through story, not lecture.",
    tag: "Living book · Birds",
    current: true,
  },
  {
    title: "Burgess Flower Book for Children",
    author: "Thornton W. Burgess",
    note: "Peter is back, this time discovering wildflowers across the Green Forest. Perfect for spring — read it as the bluebonnets and Indian paintbrushes come up.",
    tag: "Living book · Wildflowers",
    current: false,
    seasonal: "Spring",
  },
  {
    title: "Burgess Animal Book for Children",
    author: "Thornton W. Burgess",
    note: "The same gentle story-format as the bird and flower books — now covering mammals. A natural companion once you've finished the others.",
    tag: "Living book · Animals",
    current: false,
  },
];

function NatureLoreBooks() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? NATURE_LORE_BOOKS : NATURE_LORE_BOOKS.slice(0, 2);

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <p className="eyebrow" style={{ color: "var(--sage)", fontSize: 9 }}>Nature Lore</p>
        <p className="caption italic" style={{ fontSize: 11, color: "var(--ink-lt)" }}>living books for the study of nature</p>
      </div>

      {visible.map((book, i) => (
        <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--rule)", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(107,120,95,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <span style={{ fontSize: 16, opacity: 0.7 }}>🌿</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
              <p className="serif" style={{ fontSize: 15, color: "var(--ink)", fontStyle: "italic", lineHeight: 1.2 }}>
                {book.title}
              </p>
              {book.current && (
                <span style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 10, background: "rgba(107,120,95,0.12)", color: "var(--sage)", fontFamily: "'Lato', sans-serif" }}>reading now</span>
              )}
              {book.seasonal && !book.current && (
                <span style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 10, background: "rgba(191,155,111,0.12)", color: "#9E7A4A", fontFamily: "'Lato', sans-serif" }}>{book.seasonal}</span>
              )}
            </div>
            <p className="caption" style={{ marginBottom: 6, color: "var(--ink-lt)", fontSize: 11 }}>{book.author}</p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.7 }}>{book.note}</p>
            <p style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-lt)", marginTop: 6, fontFamily: "'Lato', sans-serif", opacity: 0.7 }}>{book.tag}</p>
          </div>
        </div>
      ))}

      {NATURE_LORE_BOOKS.length > 2 && (
        <button onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", cursor: "pointer", marginTop: 10, fontSize: 11, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", display: "block", width: "100%", textAlign: "left", padding: "4px 0" }}>
          {expanded ? "Show less ↑" : `+ ${NATURE_LORE_BOOKS.length - 2} more books`}
        </button>
      )}
    </div>
  );
}

// ─── INITIAL OBSERVATIONS ─────────────────────────────────────────────────────
const INITIAL_OBSERVATIONS = [
  { date: "March 14", note: "Two red-tailed hawks circling the south pasture. The horses watched them." },
  { date: "March 11", note: "Tiny purple wildflowers along the fence line — first of the season." },
];

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function OutdoorsScreen({ onNavigate, settings }) {
  const [text, setText]              = useState("");
  const [logged, setLogged]          = useState(false);
  const [observations, setObs]       = useState(INITIAL_OBSERVATIONS);
  const [showPremium, setShowPremium] = useState(false);
  const isPaid = settings?.isPaid || false;

  const save = () => {
    if (!text.trim()) return;
    setObs(o => [{ date: "Today", note: text }, ...o]);
    setText("");
    setLogged(true);
  };

  return (
    <div className="screen">
      <button onClick={() => onNavigate("home")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
        ← Home
      </button>
      <p className="eyebrow" style={{ marginBottom: 6 }}>Nature Study</p>
      <h1 className="display serif" style={{ marginBottom: 24 }}>Outdoors</h1>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div className="counter-circle">
          <span className="serif" style={{ fontSize: 26, color: "var(--sage)", lineHeight: 1 }}>14</span>
          <span className="caption" style={{ marginTop: 2 }}>days</span>
        </div>
        <p className="caption italic" style={{ marginTop: 8 }}>You've stepped outside 14 days this month.</p>
        <button onClick={() => onNavigate && onNavigate("home")}
          style={{ background: "none", border: "none", cursor: "pointer", marginTop: 8, fontSize: 11, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Log outdoor time →
        </button>
      </div>

      <div className="rule" />

      <NatureIdeaCard isPaid={isPaid} onShowPremium={() => setShowPremium(true)} />

      <NatureLoreBooks />

      {logged ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p className="ornament" style={{ fontSize: 36, marginBottom: 12 }}>✦</p>
          <p className="serif italic" style={{ fontSize: 18, color: "var(--ink-lt)", marginBottom: 24, lineHeight: 1.7 }}>Kept.</p>
          <button className="btn-ghost" onClick={() => setLogged(false)}>Add Another</button>
        </div>
      ) : (
        <>
          <p className="corm italic" style={{ fontSize: 18, color: "var(--ink-lt)", marginBottom: 18, lineHeight: 1.7 }}>
            What did you notice today?
          </p>
          <textarea className="textarea" placeholder="A note from outside…"
            value={text} onChange={e => setText(e.target.value)} rows={5} />
          {text.trim() && (
            <div style={{ textAlign: "right", marginTop: 16, marginBottom: 8 }}>
              <button className="btn-sage" onClick={save}>Keep This</button>
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>Suggestions</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {OUTDOOR_SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => setText(t => t ? `${t}. ${s}` : s)}
                  style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 2, padding: "7px 13px", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-lt)", cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {observations.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div className="rule" />
          <p className="eyebrow" style={{ marginBottom: 16 }}>Recent Observations</p>
          {observations.map((o, i) => (
            <div key={i} className="lily-entry">
              <p className="caption" style={{ marginBottom: 6 }}>{o.date}</p>
              <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.7 }}>{o.note}</p>
            </div>
          ))}
        </div>
      )}

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}
