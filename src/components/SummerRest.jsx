// src/components/SummerRest.jsx
//
// The mother's summer layer — one flowing typographic section, no boxes:
//   1. "Your work, with edges" — three things only; work rides the
//      children's screen window (opens 2:00, closes 4:00). After close,
//      it stops asking and starts protecting.
//   2. One gentle nod a day — toward the children, the marriage, or you.
// State lives in localStorage per-day.

import { useState } from "react";
import { WORK_OPENS_AT, WORK_CLOSES_AT, getTodayNudge } from "../data/summer-seed";

const WORK_KEY = "tend_summer_work";

function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadWork(key) {
  try {
    const all = JSON.parse(localStorage.getItem(WORK_KEY)) || {};
    return all[key] || { items: ["", "", ""], done: [false, false, false] };
  } catch {
    return { items: ["", "", ""], done: [false, false, false] };
  }
}

function saveWork(key, entry) {
  try {
    const all = JSON.parse(localStorage.getItem(WORK_KEY)) || {};
    all[key] = entry;
    localStorage.setItem(WORK_KEY, JSON.stringify(all));
  } catch {}
}

export default function SummerRest() {
  const key = dateKey();
  const [work, setWork] = useState(() => loadWork(key));
  const hour = new Date().getHours();
  // work rides the children's screen window: 2:00 - 4:00
  const workOpen = hour >= 14 && hour < 16;
  const workClosed = hour >= 16;
  const nudge = getTodayNudge();

  const update = (next) => { setWork(next); saveWork(key, next); };
  const setItem = (i, v) => update({ ...work, items: work.items.map((x, j) => (j === i ? v : x)) });
  const toggleDone = (i) => update({ ...work, done: work.done.map((x, j) => (j === i ? !x : x)) });

  const anyWork = work.items.some(x => x.trim());
  const allDone = anyWork && work.items.every((x, i) => !x.trim() || work.done[i]);

  return (
    <div style={{ marginBottom: 24 }}>
      {/* ── your work, with edges ── */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: workClosed ? 8 : 12 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--sage)", margin: 0 }}>
          Your work, with edges
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: workClosed ? "var(--gold)" : workOpen ? "var(--sage)" : "var(--ink-faint)", margin: 0 }}>
          {workClosed ? "closed for today" : workOpen ? `open until ${WORK_CLOSES_AT}` : `${WORK_OPENS_AT} – ${WORK_CLOSES_AT}, with their screens`}
        </p>
      </div>

      {workClosed ? (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15.5, color: "var(--ink-lt)", lineHeight: 1.7, margin: 0 }}>
          {allDone
            ? "Everything you chose is done. The rest of today belongs to summer."
            : "Screens are off and so are you. Whatever is unfinished will keep — it always does. The people in this house won't."}
        </p>
      ) : (
        <>
          {work.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
              <button onClick={() => toggleDone(i)} disabled={!item.trim()}
                style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, cursor: item.trim() ? "pointer" : "default", border: `1px solid ${work.done[i] ? "var(--sage)" : "var(--sage-md)"}`, background: work.done[i] ? "var(--sage)" : "transparent", color: "white", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                {work.done[i] ? "✓" : ""}
              </button>
              <input
                value={item}
                onChange={e => setItem(i, e.target.value)}
                placeholder={["the one that matters most", "if there's room", "only if it's light"][i]}
                style={{ flex: 1, border: "none", borderBottom: "0.5px solid var(--rule)", background: "transparent", padding: "3px 1px", fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "var(--ink)", textDecoration: work.done[i] ? "line-through" : "none", opacity: work.done[i] ? 0.45 : 1, outline: "none" }}
              />
            </div>
          ))}
        </>
      )}

      {/* ── one gentle nod a day ── */}
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "0.5px solid var(--rule)", paddingBottom: 18, borderBottom: "0.5px solid var(--rule)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.65, margin: 0 }}>
          {nudge.text}
          <span style={{ fontFamily: "'Lato', sans-serif", fontStyle: "normal", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginLeft: 10 }}>
            {nudge.tag}
          </span>
        </p>
      </div>
    </div>
  );
}
