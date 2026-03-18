import { useState } from "react";
import { Sheet } from "../components/SharedComponents";
import { Ic } from "../components/Icons";
import { LILY_ENTRIES } from "../data/seed";

export default function LiliesScreen() {
  const [entries, setEntries] = useState(LILY_ENTRIES);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft]     = useState({ quote: "", source: "", reflection: "" });

  const save = () => {
    if (!draft.quote.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
    setEntries(e => [{ id: Date.now(), date: today, ...draft }, ...e]);
    setDraft({ quote: "", source: "", reflection: "" });
    setShowAdd(false);
  };

  return (
    <>
      <div className="screen">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 6 }}>Commonplace & Journal</p>
            <h1 className="display serif">Consider the<br />Lilies</h1>
          </div>
          <button
            className="btn-ghost"
            onClick={() => setShowAdd(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", marginBottom: 4 }}
          >
            <Ic.Plus /> Keep
          </button>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginTop: 6, marginBottom: 24, lineHeight: 1.7 }}>
          "Consider the lilies of the field, how they grow."
        </p>
        <div className="rule" style={{ margin: "0 0 4px" }} />

        {entries.map(e => (
          <div key={e.id} className="lily-entry">
            <p className="caption" style={{ marginBottom: 8 }}>{e.date}</p>
            <p className="corm italic" style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1.75, marginBottom: 8 }}>
              "{e.quote}"
            </p>
            <p className="caption">— {e.source}</p>
            {e.reflection && (
              <p className="body italic" style={{ marginTop: 10, fontSize: 14 }}>{e.reflection}</p>
            )}
          </div>
        ))}

        <p className="caption" style={{ textAlign: "center", marginTop: 28, fontStyle: "italic" }}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"} kept
        </p>
      </div>

      {showAdd && (
        <Sheet onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <p className="serif" style={{ fontSize: 20 }}>What would you like to keep?</p>
            <button
              onClick={() => setShowAdd(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)" }}
            >
              <Ic.X />
            </button>
          </div>
          <textarea
            className="textarea"
            placeholder="The passage, line, or thought…"
            value={draft.quote}
            onChange={e => setDraft(d => ({ ...d, quote: e.target.value }))}
            rows={4}
          />
          <input
            className="input-line"
            placeholder="Source or author"
            style={{ marginTop: 16 }}
            value={draft.source}
            onChange={e => setDraft(d => ({ ...d, source: e.target.value }))}
          />
          <input
            className="input-line"
            placeholder="Why does it matter? (optional)"
            style={{ marginTop: 14, marginBottom: 28 }}
            value={draft.reflection}
            onChange={e => setDraft(d => ({ ...d, reflection: e.target.value }))}
          />
          <button className="btn-sage" onClick={save} style={{ width: "100%" }}>Keep This</button>
        </Sheet>
      )}
    </>
  );
}
