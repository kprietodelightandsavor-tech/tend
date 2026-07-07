// src/components/SomethingBeautiful.jsx
//
// One box, one invitation a day — a line from your reading, a watercolor,
// a noticing. Not a tracker: nothing to maintain, nothing to fall behind on.
// Words kept here land in Consider the Lilies as commonplace entries;
// painted pages go in through the journal itself (tap the link).

import { useState } from "react";
import { supabase } from "../lib/supabase";

const INVITATIONS = [
  { kind: "line",  text: "What line stood out in your reading today? Keep it before it slips." },
  { kind: "brush", text: "Paint the sky exactly as it is right now — no improving it." },
  { kind: "line",  text: "A sentence worth copying, from any page you touched today." },
  { kind: "brush", text: "One leaf, life-size. Let it be the only thing on the page." },
  { kind: "line",  text: "Something someone said today that deserves keeping word-for-word." },
  { kind: "brush", text: "Mix the color of today's heat. Name the color you made." },
  { kind: "line",  text: "Three colors you saw outside today — name them like paints." },
  { kind: "brush", text: "A five-minute cloud study before dinner. Wet on wet." },
  { kind: "line",  text: "One true sentence about this exact season of your life." },
  { kind: "brush", text: "One wildflower, roots to bloom, labeled like a botanist." },
  { kind: "line",  text: "A verse or poem line you want to carry into tomorrow." },
  { kind: "brush", text: "Paint what the cicadas sound like." },
  { kind: "line",  text: "The funniest thing a child said this week. Word-for-word." },
  { kind: "brush", text: "The moon tonight, from memory, before you check." },
  { kind: "line",  text: "Copy the line you underlined and almost didn't." },
  { kind: "brush", text: "Sunset in six stripes. Nothing else." },
];

export default function SomethingBeautiful({ userId, onNavigate }) {
  const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const invitation = INVITATIONS[dayIndex % INVITATIONS.length];

  const [open, setOpen] = useState(false);
  const [words, setWords] = useState("");
  const [source, setSource] = useState("");
  const [saving, setSaving] = useState(false);
  const [keptMsg, setKeptMsg] = useState("");

  const keep = async () => {
    if (!userId || !words.trim()) return;
    setSaving(true);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const { error } = await supabase.from("journal_entries").insert({
      user_id: userId,
      owner_id: "mother",
      owner_name: "Mother",
      type: "commonplace",
      date: today,
      quote: words.trim(),
      source: source.trim() || null,
      preview: words.trim().slice(0, 120),
    });
    setSaving(false);
    if (!error) {
      setWords(""); setSource(""); setOpen(false);
      setKeptMsg("Kept in Consider the Lilies.");
      setTimeout(() => setKeptMsg(""), 4000);
    } else {
      setKeptMsg("Couldn't save — try again in a moment.");
    }
  };

  const inputStyle = { width: "100%", border: "none", borderBottom: "0.5px solid var(--rule)", background: "transparent", outline: "none", padding: "4px 1px" };

  return (
    <div style={{
      background: "var(--parchment)",
      border: "0.5px solid var(--rule)",
      borderLeft: "3px solid var(--gold)",
      borderRadius: 8,
      padding: "14px 16px",
    }}>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 8px" }}>
        Something Beautiful
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, lineHeight: 1.6, color: "var(--ink-lt)", margin: "0 0 10px" }}>
        {invitation.text}
      </p>

      {open ? (
        <div>
          <textarea autoFocus rows={3} value={words} onChange={e => setWords(e.target.value)}
            placeholder="The words worth keeping…"
            style={{ ...inputStyle, resize: "none", marginBottom: 10, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, lineHeight: 1.6, color: "var(--ink)" }} />
          <input value={source} onChange={e => setSource(e.target.value)} onKeyDown={e => e.key === "Enter" && keep()}
            placeholder="From — a book, a person, a place (optional)…"
            style={{ ...inputStyle, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)" }} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-sage" style={{ flex: 1, opacity: saving || !words.trim() ? 0.6 : 1 }} disabled={saving || !words.trim()} onClick={keep}>
              {saving ? "Keeping…" : "Keep it"}
            </button>
            <button onClick={() => { setOpen(false); setWords(""); setSource(""); }}
              style={{ background: "none", border: "0.5px solid var(--rule)", borderRadius: 2, padding: "0 14px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
              Not now
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <button onClick={() => setOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)" }}>
            ✎ Keep a few words ›
          </button>
          <button onClick={() => onNavigate && onNavigate("lilies")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
            or paint the page — open the journal ›
          </button>
        </div>
      )}

      {keptMsg && (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--gold)", margin: "10px 0 0" }}>
          {keptMsg}
        </p>
      )}
    </div>
  );
}
