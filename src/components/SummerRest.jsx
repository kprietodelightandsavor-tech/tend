// src/components/SummerRest.jsx
//
// The mother's summer layer — two quiet pieces:
//   1. "Your work, with edges" — three things only, and work CLOSES at 2:00
//      (the same hour the children's screens come on). After close, the card
//      stops asking and starts protecting: whatever is unfinished will keep.
//   2. One gentle nod a day — toward the children, the marriage, or yourself.
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
    <div style={{ marginBottom: 26 }}>
      {/* ── your work, with edges ── */}
      <div style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--rule)", borderRadius: 3, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)", margin: 0 }}>
            Your work, with edges
          </p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: workClosed ? "var(--gold)" : workOpen ? "var(--sage)" : "var(--ink-faint)", margin: 0 }}>
            {workClosed ? "closed for today" : workOpen ? `open · closes at ${WORK_CLOSES_AT}` : `opens at ${WORK_OPENS_AT} · with their screens`}
          </p>
        </div>

        {workClosed ? (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.7, margin: 0 }}>
            {allDone
              ? "Everything you chose is done. The rest of today belongs to summer."
              : "Screens are off and so are you. Whatever is unfinished will keep — it always does. The people in this house won't."}
          </p>
        ) : (
          <>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", margin: "0 0 10px" }}>
              {workOpen
                ? "Two focused hours while their screens are on. Three things, no more - it fits in three lines or it waits."
                : "The morning belongs to the children. Jot your three things now if they're circling your head - then let them wait for 2:00."}
            </p>
            {work.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                <button onClick={() => toggleDone(i)} disabled={!item.trim()}
                  style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: item.trim() ? "pointer" : "default", border: `1.5px solid ${work.done[i] ? "var(--sage)" : "var(--sage-md)"}`, background: work.done[i] ? "var(--sage)" : "transparent", color: "white", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {work.done[i] ? "✓" : ""}
                </button>
                <input
                  value={item}
                  onChange={e => setItem(i, e.target.value)}
                  placeholder={["the one that matters most", "if there's room", "only if it's light"][i]}
                  style={{ flex: 1, border: "none", borderBottom: "1px solid var(--rule)", background: "transparent", padding: "4px 2px", fontFamily: "'Lato', sans-serif", fontSize: 13.5, color: "var(--ink)", textDecoration: work.done[i] ? "line-through" : "none", opacity: work.done[i] ? 0.5 : 1, outline: "none" }}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── one gentle nod a day ── */}
      <div style={{ padding: "12px 16px", background: "var(--gold-bg)", border: "1px solid var(--rule)", borderRadius: 3 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 5px" }}>
          Today's gentle nod · {nudge.tag}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15.5, color: "var(--ink-lt)", lineHeight: 1.6, margin: 0 }}>
          {nudge.text}
        </p>
      </div>
    </div>
  );
}
