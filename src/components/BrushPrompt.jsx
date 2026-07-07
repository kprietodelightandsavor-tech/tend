// src/components/BrushPrompt.jsx
//
// One watercolor / nature-journaling invitation a day — small, seasonal,
// never a lesson. It points into Consider the Lilies, where the entry
// (words, sketch, photo of the page) already knows how to live.

const PROMPTS = [
  "Paint the sky exactly as it is right now — no improving it.",
  "One leaf, life-size. Let it be the only thing on the page.",
  "Mix the color of today's heat. Name the color you made.",
  "A five-minute cloud study, wet on wet, before dinner.",
  "One wildflower, roots to bloom, labeled like a botanist.",
  "Paint what the cicadas sound like.",
  "The creek — or the hose water — in three greens.",
  "A feather, found or remembered.",
  "Three tomatoes on the counter. Or peaches. Whatever's ripest.",
  "The moon tonight, from memory, before you check.",
  "An animal asleep — gesture, not portrait. Thirty seconds.",
  "Rain, or the wish for it: paint the smell of a storm coming.",
  "Sunset in six stripes. Nothing else.",
  "The view from the porch, small as a postage stamp.",
  "One insect, honestly observed — count its legs before you draw them.",
];

export default function BrushPrompt({ onNavigate }) {
  const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const prompt = PROMPTS[dayIndex % PROMPTS.length];

  return (
    <div style={{
      background: "var(--parchment)",
      border: "0.5px solid var(--rule)",
      borderLeft: "3px solid var(--gold)",
      borderRadius: 8,
      padding: "14px 16px",
      marginTop: 12,
    }}>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 8px" }}>
        Brush & Notice
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, lineHeight: 1.6, color: "var(--ink-lt)", margin: "0 0 10px" }}>
        {prompt}
      </p>
      <button onClick={() => onNavigate && onNavigate("lilies")}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)" }}>
        ✎ Keep the page in the Lilies journal ›
      </button>
    </div>
  );
}
