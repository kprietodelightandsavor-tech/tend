// src/components/CurrentlyReading.jsx
//
// "Currently Reading" — mother culture's front door.
// The book and where-we-stopped persist in Supabase (profiles).
// The point of the card: "keep a line" — capture a passage or thought
// from the reading and it lands in Consider the Lilies as a commonplace
// entry (type "commonplace", source = the book), exactly as if written
// there. Reading → keeping → the digital commonplace journal.

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function CurrentlyReading({ userId }) {
  const [title, setTitle] = useState("");
  const [spot, setSpot] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("view"); // view | book | keep
  const [quote, setQuote] = useState("");
  const [response, setResponse] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keptMsg, setKeptMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!userId) { setLoaded(true); return; }
      const { data } = await supabase
        .from("profiles").select("reading_title, reading_spot, name").eq("id", userId).single();
      if (alive && data) {
        setTitle(data.reading_title || "");
        setSpot(data.reading_spot || "");
        setName(data.name || "");
      }
      if (alive) setLoaded(true);
    })();
    return () => { alive = false; };
  }, [userId]);

  const saveBook = async () => {
    setSaving(true);
    if (userId) {
      await supabase.from("profiles").update({ reading_title: title.trim(), reading_spot: spot.trim() }).eq("id", userId);
    }
    setSaving(false);
    setMode("view");
  };

  const keepLine = async () => {
    if (!userId || !quote.trim()) return;
    setSaving(true);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const { error } = await supabase.from("journal_entries").insert({
      user_id: userId,
      owner_id: "mother",
      owner_name: name || "Mother",
      type: "commonplace",
      date: today,
      quote: quote.trim(),
      source: title.trim() || null,
      response: response.trim() || null,
      preview: quote.trim().slice(0, 120),
    });
    setSaving(false);
    if (!error) {
      setQuote(""); setResponse(""); setMode("view");
      setKeptMsg("Kept in Consider the Lilies.");
      setTimeout(() => setKeptMsg(""), 4000);
    } else {
      setKeptMsg("Couldn't save — try again in a moment.");
    }
  };

  if (!loaded) return null;

  const inputStyle = { width: "100%", border: "none", borderBottom: "0.5px solid var(--rule)", background: "transparent", outline: "none", padding: "4px 1px" };

  return (
    <div style={{
      background: "var(--parchment)",
      border: "0.5px solid var(--rule)",
      borderLeft: "3px solid var(--sage)",
      borderRadius: 8,
      padding: "14px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>
          Currently Reading
        </p>
        {mode === "view" && (
          <button onClick={() => setMode("book")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)", padding: 0 }}>
            {title ? "change book" : "set the book"}
          </button>
        )}
      </div>

      {/* ── edit the book ── */}
      {mode === "book" && (
        <div>
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title…"
            style={{ ...inputStyle, marginBottom: 10, fontFamily: "'Playfair Display', serif", fontSize: 17, color: "var(--ink)" }} />
          <input value={spot} onChange={e => setSpot(e.target.value)} onKeyDown={e => e.key === "Enter" && saveBook()}
            placeholder="Where we stopped — chapter, page, or scene…"
            style={{ ...inputStyle, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-lt)" }} />
          <button className="btn-sage" style={{ width: "100%", opacity: saving ? 0.6 : 1 }} disabled={saving} onClick={saveBook}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      {/* ── keep a line ── */}
      {mode === "keep" && (
        <div>
          <textarea autoFocus rows={3} value={quote} onChange={e => setQuote(e.target.value)}
            placeholder="The line or passage that stopped you…"
            style={{ ...inputStyle, resize: "none", marginBottom: 10, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, lineHeight: 1.6, color: "var(--ink)" }} />
          <input value={response} onChange={e => setResponse(e.target.value)} onKeyDown={e => e.key === "Enter" && keepLine()}
            placeholder="Your thought, if one is stirring (optional)…"
            style={{ ...inputStyle, marginBottom: 14, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)" }} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-sage" style={{ flex: 1, opacity: saving || !quote.trim() ? 0.6 : 1 }} disabled={saving || !quote.trim()} onClick={keepLine}>
              {saving ? "Keeping…" : "Keep in the Lilies journal"}
            </button>
            <button onClick={() => { setMode("view"); setQuote(""); setResponse(""); }}
              style={{ background: "none", border: "0.5px solid var(--rule)", borderRadius: 2, padding: "0 14px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
              Not now
            </button>
          </div>
        </div>
      )}

      {/* ── view ── */}
      {mode === "view" && (
        title ? (
          <>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, lineHeight: 1.3, color: "var(--ink)", margin: "0 0 6px" }}>
              {title}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", border: "1px solid var(--gold)", background: "var(--gold-bg)", flexShrink: 0 }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14.5, color: "var(--ink-faint)", margin: 0 }}>
                {spot || "mark where you stopped — tap change book"}
              </p>
            </div>
            <button onClick={() => setMode("keep")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)" }}>
              ✎ Keep a line from this book ›
            </button>
            {keptMsg && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--gold)", margin: "8px 0 0" }}>
                {keptMsg}
              </p>
            )}
          </>
        ) : (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", margin: 0 }}>
            What are you reading right now, for you? Set the book — then keep the lines that stop you.
          </p>
        )
      )}
    </div>
  );
}
