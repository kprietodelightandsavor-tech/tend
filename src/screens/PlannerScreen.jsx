import { useState, useRef } from "react";
import { DAYS, DAY_SCHEDULE, BEAUTY_LOOP, TERM_SETTINGS, REST_WEEK_SUGGESTIONS } from "../data/seed";
import { PremiumModal } from "./HomeScreen";

// ─── QUICK-FILL SUBJECTS ──────────────────────────────────────────────────────
const QUICK_SUBJECTS = [
  { label: "Morning Basket", time: "8:00"  },
  { label: "Bible / Memory", time: "8:30"  },
  { label: "Narration",      time: "9:00"  },
  { label: "Mathematics",    time: "9:45"  },
  { label: "Language Arts",  time: "10:30" },
  { label: "History",        time: "11:00" },
  { label: "Science",        time: "11:30" },
  { label: "Read Aloud",     time: "1:00"  },
  { label: "Nature Study",   time: "2:00"  },
  { label: "Copywork",       time: "10:00" },
  { label: "Handicrafts",    time: "2:30"  },
  { label: "Free Time",      time: "3:00"  },
  { label: "Lunch",          time: "12:00" },
  { label: "Outdoor Time",   time: "3:00"  },
  { label: "Co-op",          time: "9:00"  },
];

// ─── PRINT WEEKLY SCHEDULE ────────────────────────────────────────────────────
function printWeeklySchedule(schedule, term, week) {
  const win = window.open("", "_blank");
  const dayCols = DAYS.map(day => {
    const blocks = schedule[day] || [];
    return `<div class="day-col">
      <div class="day-hdr">${day}</div>
      ${blocks.map(b => `<div class="block">
        <span class="btime">${b.time || ""}</span>
        <span class="bsubj">${b.subject}</span>
        ${b.note ? `<span class="bnote">${b.note}</span>` : ""}
      </div>`).join("")}
      ${blocks.length === 0 ? `<p class="empty-day">—</p>` : ""}
    </div>`;
  }).join("");

  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>Tend · Week ${week}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Lato:wght@300;400&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Lato',sans-serif;background:#faf6ee;color:#2C2A27;padding:32px;}
      h1{font-family:'Playfair Display',serif;font-size:22px;font-weight:400;margin-bottom:4px;}
      .meta{font-size:11px;color:#A8A49E;letter-spacing:.1em;text-transform:uppercase;margin-bottom:24px;}
      .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;}
      .day-hdr{font-family:'Lato',sans-serif;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#A9B786;font-weight:700;padding-bottom:8px;border-bottom:2px solid #A9B786;margin-bottom:8px;}
      .block{padding:5px 0;border-bottom:1px solid #e8e4dc;}
      .btime{display:block;font-size:8px;color:#A8A49E;letter-spacing:.06em;}
      .bsubj{display:block;font-family:'Playfair Display',serif;font-size:12px;color:#2C2A27;line-height:1.3;}
      .bnote{display:block;font-family:'Cormorant Garamond',serif;font-size:10px;font-style:italic;color:#9a9488;margin-top:1px;}
      .empty-day{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:12px;color:#c5bfb6;text-align:center;margin-top:12px;}
      .footer{margin-top:28px;padding-top:16px;border-top:1px solid #e8e4dc;font-size:10px;color:#A8A49E;letter-spacing:.08em;text-align:center;}
      @media print{body{padding:20px;background:white;}}
    </style></head><body>
    <h1>Tend · Weekly Schedule</h1>
    <p class="meta">Term ${term} · Week ${week}</p>
    <div class="grid">${dayCols}</div>
    <p class="footer">Delight & Savor · tend-ds.netlify.app</p>
    </body></html>`);
  win.document.close();
  win.print();
}

// ─── CALENDAR EXPORT (.ics) ───────────────────────────────────────────────────
function exportToCalendar(schedule) {
  const today    = new Date();
  const dayOfWk  = today.getDay();
  const diffToMon = dayOfWk === 0 ? 1 : dayOfWk === 1 ? 0 : (8 - dayOfWk);
  const monday   = new Date(today);
  monday.setDate(today.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);

  const dayOffsets = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4 };
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tend//Tend App//EN",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Tend School Schedule",
  ];

  DAYS.forEach(day => {
    const blocks = schedule[day] || [];
    const offset = dayOffsets[day] ?? 0;
    const date   = new Date(monday);
    date.setDate(monday.getDate() + offset);

    blocks.forEach(b => {
      if (!b.time) return;
      const [hStr, mStr] = b.time.split(":");
      const dtStart = new Date(date);
      dtStart.setHours(parseInt(hStr, 10), parseInt(mStr || "0", 10), 0, 0);
      const dtEnd = new Date(dtStart);
      dtEnd.setMinutes(dtEnd.getMinutes() + 45);

      ics.push(
        "BEGIN:VEVENT",
        `DTSTART:${fmt(dtStart)}`,
        `DTEND:${fmt(dtEnd)}`,
        `SUMMARY:${b.subject}`,
        b.note ? `DESCRIPTION:${b.note}` : null,
        `UID:tend-${day}-${b.subject.replace(/\s/g,"-")}-${dtStart.getTime()}@tend`,
        "END:VEVENT"
      );
    });
  });

  ics.push("END:VCALENDAR");

  const blob = new Blob([ics.filter(Boolean).join("\r\n")], { type: "text/calendar" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "tend-schedule.ics"; a.click();
  URL.revokeObjectURL(url);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Up:    () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>),
  Down:  () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>),
  Edit:  () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Plus:  () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Copy:  () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>),
  Leaf:  () => (<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Moon:  () => (<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>),
  Check: () => (<svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>),
  Lock:  () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>),
  Grid:  () => (<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
  List:  () => (<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
  Print: () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>),
  Cal:   () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  Today: () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
};

const getBlockColor = (subject) => {
  const s = subject.toLowerCase();
  if (s.includes("rise") || s.includes("bible") || s.includes("memory") || s.includes("morning")) return "#C29B61";
  if (s.includes("nature") || s.includes("outdoor") || s.includes("narration")) return "#A9B786";
  if (s.includes("co-op") || s.includes("chispa")) return "#8A7A9E";
  if (s.includes("lunch") || s.includes("free") || s.includes("rest")) return "#9a9488";
  return "#7a8f9e";
};

// ─── FREE TIER ────────────────────────────────────────────────────────────────
function FreePlanner({ onShowPremium }) {
  const blocks = DAY_SCHEDULE.Monday || [];
  return (
    <div>
      <div className="card-gold" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Icon.Lock />
          <p className="eyebrow" style={{ marginBottom: 0, color: "var(--gold)" }}>Tend Premium</p>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8, marginBottom: 14 }}>
          The full planner — editable blocks, week grid view, print & calendar export, the Beauty Loop, term counter, and rest week rhythm — is available with Tend Premium.
        </p>
        <button onClick={onShowPremium}
          style={{ background: "var(--gold)", border: "none", borderRadius: 2, padding: "10px 0", width: "100%", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "white" }}>
          Learn about Tend Premium →
        </button>
      </div>
      {blocks.map((b, i) => (
        <div key={i} className="planner-block" style={{ opacity: 0.7 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span className="planner-time">{b.time}</span>
            <span className="planner-subject">{b.subject}</span>
          </div>
          {b.note && <p className="caption italic" style={{ marginTop: 4 }}>{b.note}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── TERM COUNTER ─────────────────────────────────────────────────────────────
function TermCounter({ isRestWeek, onToggleRest, term, week, onEdit }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        {isRestWeek ? (
          <div>
            <p className="eyebrow" style={{ marginBottom: 2, color: "var(--gold)" }}>Rest Week</p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)" }}>Counter paused</p>
          </div>
        ) : (
          <div>
            <p className="eyebrow" style={{ marginBottom: 2 }}>Term {term} · Week {week} of 12</p>
            <div style={{ width: 120, height: 2, background: "var(--rule)", borderRadius: 1, marginTop: 6 }}>
              <div style={{ height: 2, background: "var(--sage)", borderRadius: 1, width: `${(week / 12) * 100}%`, transition: "width .4s ease" }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "var(--ink-faint)", fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>Edit</button>
        <button onClick={onToggleRest}
          style={{ display: "flex", alignItems: "center", gap: 6, background: isRestWeek ? "var(--gold-bg)" : "var(--sage-bg)", border: `1px solid ${isRestWeek ? "#D4B07A" : "var(--sage-md)"}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: isRestWeek ? "var(--gold)" : "var(--sage)" }}>
          <Icon.Moon />{isRestWeek ? "Resume" : "Rest Week"}
        </button>
      </div>
    </div>
  );
}

// ─── REST WEEK ────────────────────────────────────────────────────────────────
function RestWeekView() {
  const day = new Date().getDay();
  const suggestions = [
    REST_WEEK_SUGGESTIONS[day % REST_WEEK_SUGGESTIONS.length],
    REST_WEEK_SUGGESTIONS[(day + 1) % REST_WEEK_SUGGESTIONS.length],
    REST_WEEK_SUGGESTIONS[(day + 3) % REST_WEEK_SUGGESTIONS.length],
  ];
  return (
    <div style={{ marginTop: 8 }}>
      <div className="card-gold" style={{ marginBottom: 24 }}>
        <p className="corm italic" style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1.8, marginBottom: 8 }}>A week set apart.</p>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8 }}>The rhythm rests so it can return stronger. There is nothing to accomplish today except to be.</p>
      </div>
      <p className="eyebrow" style={{ marginBottom: 16 }}>Gentle Invitations</p>
      {suggestions.map((s, i) => (
        <div key={i} style={{ paddingBottom: i < suggestions.length - 1 ? 16 : 0, marginBottom: i < suggestions.length - 1 ? 16 : 0, borderBottom: i < suggestions.length - 1 ? "1px solid var(--rule)" : "none" }}>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{s}</p>
        </div>
      ))}
    </div>
  );
}

// ─── BEAUTY LOOP ──────────────────────────────────────────────────────────────
function BeautyLoopSection({ day }) {
  const loops = BEAUTY_LOOP[day] || [];
  const [items, setItems] = useState(loops.map(l => ({ ...l, done: false })));
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState(loops.map(l => l.label));
  const isThursday = day === "Thursday";
  const toggle = (id) => setItems(prev => prev.map(l => l.id === id ? { ...l, done: !l.done } : l));
  const saveDrafts = () => { setItems(prev => prev.map((l, i) => ({ ...l, label: drafts[i] }))); setEditing(false); };
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon.Leaf /><p className="eyebrow" style={{ marginBottom: 0 }}>Beauty Loop</p></div>
        {!isThursday && (
          <button onClick={() => editing ? saveDrafts() : setEditing(true)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "var(--ink-faint)", fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>
            {editing ? "Save" : "Edit"}
          </button>
        )}
      </div>
      {isThursday ? (
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.8 }}>A full day away. Rest from the loop and trust what has already been tended.</p>
      ) : editing ? (
        <div>
          {drafts.map((d, i) => <input key={i} className="input-line" value={d} onChange={e => setDrafts(prev => prev.map((v, j) => j === i ? e.target.value : v))} style={{ marginBottom: 8 }} />)}
        </div>
      ) : (
        <>
          {items.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--rule)" }}>
              <button onClick={() => toggle(l.id)}
                style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${l.done ? "var(--sage)" : "var(--rule)"}`, background: l.done ? "var(--sage)" : "none", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, transition: "all .2s" }}>
                {l.done && <Icon.Check />}
              </button>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, color: l.done ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: l.done ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>{l.label}</p>
                {l.note && <p className="caption italic" style={{ marginTop: 3 }}>{l.note}</p>}
              </div>
            </div>
          ))}
          <p className="caption italic" style={{ marginTop: 12, lineHeight: 1.7 }}>Use these as a gathered morning, as quiet anchors throughout your day, or set them aside on full days.</p>
        </>
      )}
    </div>
  );
}

// ─── WEEK GRID ────────────────────────────────────────────────────────────────
function WeekGrid({ schedule, onDayTap, todayDay }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 8, minWidth: 320 }}>
        {DAYS.map(day => {
          const blocks = schedule[day] || [];
          const isToday = day === todayDay;
          return (
            <div key={day} style={{ flex: 1, minWidth: 56, cursor: "pointer" }} onClick={() => onDayTap(day)}>
              <div style={{ textAlign: "center", padding: "6px 4px 8px", borderBottom: `2px solid ${isToday ? "var(--sage)" : "var(--rule)"}`, marginBottom: 8 }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: isToday ? "var(--sage)" : "var(--ink-faint)", fontWeight: isToday ? 700 : 400 }}>
                  {day.slice(0, 3)}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {blocks.length === 0 ? (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "var(--ink-faint)", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>—</p>
                ) : blocks.slice(0, 8).map((b, i) => {
                  const color = getBlockColor(b.subject);
                  return (
                    <div key={i} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 5, paddingTop: 3, paddingBottom: 3, background: `${color}12`, borderRadius: "0 3px 3px 0" }}>
                      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 8.5, color: "var(--ink)", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 52 }}>{b.subject}</p>
                      {b.time && <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 7.5, color: "var(--ink-faint)", lineHeight: 1.2 }}>{b.time}</p>}
                    </div>
                  );
                })}
                {blocks.length > 8 && <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 8, color: "var(--ink-faint)", textAlign: "center", marginTop: 2 }}>+{blocks.length - 8} more</p>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap a day to edit its schedule</p>
    </div>
  );
}

// ─── SHEETS ───────────────────────────────────────────────────────────────────
function AddBlockSheet({ onSave, onClose }) {
  const [time, setTime]       = useState("");
  const [subject, setSubject] = useState("");
  const [note, setNote]       = useState("");
  const [showQuick, setShowQuick] = useState(true);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px", maxHeight: "88dvh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 16 }}>Add a Block</p>

        {/* Quick-fill chips */}
        {showQuick && (
          <div style={{ marginBottom: 16 }}>
            <p className="eyebrow" style={{ marginBottom: 10 }}>Quick add</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {QUICK_SUBJECTS.map(q => (
                <button key={q.label} onClick={() => { setSubject(q.label); setTime(q.time); setShowQuick(false); }}
                  style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid var(--sage-md)", background: "var(--sage-bg)", cursor: "pointer", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--sage)" }}>
                  {q.label}
                </button>
              ))}
            </div>
            <div style={{ height: 1, background: "var(--rule)", margin: "16px 0" }} />
          </div>
        )}

        <input className="input-line" placeholder="Time (e.g. 10:00)" value={time} onChange={e => setTime(e.target.value)} style={{ marginBottom: 14 }} />
        <input className="input-line" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} style={{ marginBottom: 14 }} autoFocus={!showQuick} />
        <input className="input-line" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} style={{ marginBottom: 28 }} />
        <button className="btn-sage" style={{ width: "100%" }} onClick={() => { if (subject.trim()) { onSave({ time, subject, note }); onClose(); } }}>Add Block</button>
      </div>
    </div>
  );
}

function EditBlockSheet({ block, onSave, onDelete, onClose }) {
  const [time, setTime]       = useState(block.time);
  const [subject, setSubject] = useState(block.subject);
  const [note, setNote]       = useState(block.note || "");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 20 }}>Edit Block</p>
        <input className="input-line" placeholder="Time" value={time} onChange={e => setTime(e.target.value)} style={{ marginBottom: 14 }} />
        <input className="input-line" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} style={{ marginBottom: 14 }} />
        <input className="input-line" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} style={{ marginBottom: 28 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-sage" style={{ flex: 1 }} onClick={() => { onSave({ ...block, time, subject, note }); onClose(); }}>Save</button>
          <button onClick={() => { onDelete(block.id); onClose(); }}
            style={{ background: "none", border: "1px solid #E8C4BB", borderRadius: 2, padding: "12px 18px", cursor: "pointer", color: "var(--red)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyDaySheet({ fromDay, onCopy, onClose }) {
  const [toDay, setToDay] = useState(null);
  const targets = DAYS.filter(d => d !== fromDay);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 6 }}>Copy {fromDay} to…</p>
        <p className="caption italic" style={{ marginBottom: 20 }}>Replaces the selected day's blocks entirely.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {targets.map(d => (
            <button key={d} onClick={() => setToDay(d)}
              style={{ background: toDay === d ? "var(--sage-bg)" : "none", border: `1px solid ${toDay === d ? "var(--sage)" : "var(--rule)"}`, borderRadius: 3, padding: "12px 16px", cursor: "pointer", textAlign: "left", fontFamily: "'Playfair Display', serif", fontSize: 16, color: toDay === d ? "var(--sage)" : "var(--ink)", transition: "all .2s" }}>
              {d}
            </button>
          ))}
        </div>
        <button className="btn-sage" style={{ width: "100%" }} disabled={!toDay} onClick={() => { if (toDay) { onCopy(toDay); onClose(); } }}>
          Copy to {toDay || "…"}
        </button>
      </div>
    </div>
  );
}

function SaveTemplateSheet({ day, onSave, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 8 }}>Save as Template?</p>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 24 }}>
          Saves your current {day} layout as the default. Use "Reset to Template" any time to restore it.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-sage" style={{ flex: 1 }} onClick={() => { onSave(); onClose(); }}>Save as Template</button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ExportSheet({ schedule, term, week, onClose }) {
  const [calExported, setCalExported] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 6 }}>Export Schedule</p>
        <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 24 }}>
          Term {term} · Week {week}
        </p>

        {/* Print */}
        <button onClick={() => { printWeeklySchedule(schedule, term, week); onClose(); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, cursor: "pointer", marginBottom: 10, textAlign: "left" }}>
          <Icon.Print />
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)", marginBottom: 2 }}>Print weekly schedule</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)" }}>Opens a print-ready view of your full week</p>
          </div>
        </button>

        {/* Calendar */}
        <button onClick={() => { exportToCalendar(schedule); setCalExported(true); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: calExported ? "var(--sage-bg)" : "white", border: `1px solid ${calExported ? "var(--sage)" : "var(--rule)"}`, borderRadius: 3, cursor: "pointer", marginBottom: 10, textAlign: "left", transition: "all .2s" }}>
          <Icon.Cal />
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: calExported ? "var(--sage)" : "var(--ink)", marginBottom: 2 }}>
              {calExported ? "✦ Downloading…" : "Add to Apple / Google Calendar"}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)" }}>
              Downloads a .ics file — open it to import into any calendar app
            </p>
          </div>
        </button>

        {calExported && (
          <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "var(--sage)", lineHeight: 1.6 }}>
              ✦ If you update your schedule, re-export to keep your calendar in sync.
            </p>
          </div>
        )}

        <button className="btn-ghost" style={{ width: "100%", marginTop: 4 }} onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

// ─── IMPORT SHEET ─────────────────────────────────────────────────────────────
// Voice + Photo import — both routes end at a review step
function ImportSheet({ activeDay, onImport, onClose }) {
  const [mode, setMode]           = useState("choose"); // "choose"|"voice"|"photo"|"review"
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError]   = useState("");
  const [pendingBlocks, setPendingBlocks] = useState([]);
  const [editIdx, setEditIdx]     = useState(null);
  const fileRef = useRef();
  const recogRef = useRef(null);

  // ── VOICE: parse transcript with Claude ──────────────────────────────────
  const parseVoice = async (text) => {
    if (!text.trim()) return;
    setMode("review");
    setPhotoLoading(true);
    try {
      const res = await fetch("/.netlify/functions/parse-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: null,
          voiceText: text,
          day: activeDay,
          isVoice: true,
        }),
      });
      const { blocks } = await res.json();
      setPendingBlocks(blocks || []);
    } catch {
      setPhotoError("Couldn't parse your schedule. Try again.");
      setMode("voice");
    } finally {
      setPhotoLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPhotoError("Voice input isn't supported in this browser. Try Safari on iPhone.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous     = true;
    recog.interimResults = true;
    recog.lang           = "en-US";
    recog.onresult = (e) => {
      let full = "";
      for (let i = 0; i < e.results.length; i++) full += e.results[i][0].transcript;
      setTranscript(full);
    };
    recog.onerror = () => setListening(false);
    recog.onend   = () => setListening(false);
    recogRef.current = recog;
    recog.start();
    setListening(true);
  };

  const stopListening = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  // ── PHOTO: encode and send to Netlify function ───────────────────────────
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMode("review");
    setPhotoLoading(true);
    setPhotoError("");
    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload  = () => res(reader.result.split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const response = await fetch("/.netlify/functions/parse-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: base64,
          mediaType: file.type,
          day: activeDay,
          isVoice: false,
        }),
      });
      const { blocks, error } = await response.json();
      if (error) throw new Error(error);
      setPendingBlocks(blocks || []);
    } catch (err) {
      setPhotoError("Couldn't read the image. Try a clearer photo.");
      setMode("photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  const updatePending = (idx, field, val) =>
    setPendingBlocks(prev => prev.map((b, i) => i === idx ? { ...b, [field]: val } : b));
  const removePending = (idx) =>
    setPendingBlocks(prev => prev.filter((_, i) => i !== idx));

  const confirm = () => {
    onImport(pendingBlocks);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.45)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 24px 52px", maxHeight: "92dvh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />

        {/* ── CHOOSE ── */}
        {mode === "choose" && (
          <>
            <p className="serif" style={{ fontSize: 20, marginBottom: 6 }}>Import Schedule</p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 24 }}>
              Speak your schedule or snap a photo of your paper planner — Tend will read it and fill in your blocks.
            </p>

            {/* Voice option */}
            <button onClick={() => setMode("voice")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, cursor: "pointer", marginBottom: 10, textAlign: "left" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--sage)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>Speak your schedule</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5 }}>Say something like "Math at 9, narration at 10, lunch at noon"</p>
              </div>
            </button>

            {/* Photo option */}
            <button onClick={() => fileRef.current?.click()}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "white", border: "1px solid var(--rule)", borderRadius: 3, cursor: "pointer", marginBottom: 10, textAlign: "left" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e8e4dc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--ink-faint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>Photo of your planner</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5 }}>Snap or upload a photo — Claude will read handwriting, printed schedules, tables</p>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhoto} />

            <button className="btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={onClose}>Cancel</button>
          </>
        )}

        {/* ── VOICE ── */}
        {mode === "voice" && (
          <>
            <p className="serif" style={{ fontSize: 20, marginBottom: 8 }}>Speak your schedule</p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 24 }}>
              Speak naturally — "Math at 9, narration at 10, lunch at noon, nature study at 2." Tend will sort it out.
            </p>

            {/* Mic button */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <button
                onClick={listening ? stopListening : startListening}
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: listening ? "#c0392b" : "var(--sage)",
                  border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  boxShadow: listening ? "0 0 0 12px rgba(192,57,43,.15), 0 0 0 24px rgba(192,57,43,.07)" : "0 4px 20px rgba(169,183,134,.4)",
                  transition: "all .3s",
                }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                </svg>
              </button>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: listening ? "#c0392b" : "var(--ink-faint)", marginTop: 12, transition: "color .3s" }}>
                {listening ? "Listening… tap to stop" : "Tap to speak"}
              </p>
            </div>

            {/* Live transcript */}
            {transcript && (
              <div style={{ background: "white", border: "1px solid var(--rule)", borderRadius: 3, padding: "12px 14px", marginBottom: 20, minHeight: 60 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.7 }}>
                  "{transcript}"
                </p>
              </div>
            )}

            {photoError && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "var(--red)", fontStyle: "italic", marginBottom: 16 }}>{photoError}</p>}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-ghost" onClick={() => { setMode("choose"); setTranscript(""); setPhotoError(""); }}>Back</button>
              <button className="btn-sage" style={{ flex: 1 }} disabled={!transcript.trim() || listening}
                onClick={() => parseVoice(transcript)}>
                Read my schedule →
              </button>
            </div>
          </>
        )}

        {/* ── REVIEW (loading) ── */}
        {mode === "review" && photoLoading && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V12M12 12C12 12 8 11 7 7c3 0 5 2 5 5zM12 12C12 12 16 11 17 7c-3 0-5 2-5 5z"/>
                <path d="M8 22h8"/>
              </svg>
            </div>
            <p className="serif" style={{ fontSize: 18, marginBottom: 8 }}>Reading your schedule…</p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7 }}>Claude is extracting your blocks. This takes just a moment.</p>
          </div>
        )}

        {/* ── REVIEW (results) ── */}
        {mode === "review" && !photoLoading && (
          <>
            <p className="serif" style={{ fontSize: 20, marginBottom: 6 }}>Review your blocks</p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 20 }}>
              {pendingBlocks.length > 0
                ? `Found ${pendingBlocks.length} block${pendingBlocks.length !== 1 ? "s" : ""}. Edit or remove any before adding to ${activeDay}.`
                : "No blocks found. Try a clearer photo or speak your schedule again."}
            </p>

            {pendingBlocks.length === 0 && (
              <button className="btn-ghost" style={{ width: "100%", marginBottom: 12 }} onClick={() => setMode("choose")}>
                Try again
              </button>
            )}

            {pendingBlocks.map((b, idx) => (
              <div key={b.id} style={{ background: "white", border: "1px solid var(--rule)", borderRadius: 3, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  {editIdx === idx ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <input className="input-line" value={b.time} placeholder="Time" onChange={e => updatePending(idx, "time", e.target.value)} style={{ fontSize: 13 }} />
                      <input className="input-line" value={b.subject} placeholder="Subject" onChange={e => updatePending(idx, "subject", e.target.value)} style={{ fontSize: 13 }} />
                      <input className="input-line" value={b.note} placeholder="Note (optional)" onChange={e => updatePending(idx, "note", e.target.value)} style={{ fontSize: 13 }} />
                      <button onClick={() => setEditIdx(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", padding: 0 }}>Done ✓</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                        {b.time && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "var(--ink-faint)" }}>{b.time}</span>}
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)" }}>{b.subject}</span>
                      </div>
                      {b.note && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)", marginTop: 2 }}>{b.note}</p>}
                    </>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => setEditIdx(editIdx === idx ? null : idx)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".06em" }}>
                    Edit
                  </button>
                  <button onClick={() => removePending(idx)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--red)", fontFamily: "'Lato', sans-serif", letterSpacing: ".06em" }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {pendingBlocks.length > 0 && (
              <button className="btn-sage" style={{ width: "100%", marginTop: 16 }} onClick={confirm}>
                Add {pendingBlocks.length} block{pendingBlocks.length !== 1 ? "s" : ""} to {activeDay} →
              </button>
            )}

            <button className="btn-ghost" style={{ width: "100%", marginTop: 10 }} onClick={onClose}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PLANNER SCREEN ───────────────────────────────────────────────────────────
export default function PlannerScreen({ settings }) {
  const isPaid   = settings?.isPaid || false;
  const todayIdx = Math.min(Math.max(new Date().getDay() - 1, 0), 4);
  const todayDay = DAYS[todayIdx];

  const [viewMode, setViewMode]         = useState("day");
  const [activeDay, setActiveDay]       = useState(todayDay);
  const [term, setTerm]                 = useState(settings?.term || TERM_SETTINGS.currentTerm);
  const [week, setWeek]                 = useState(settings?.week || TERM_SETTINGS.currentWeek);
  const [isRestWeek, setRestWeek]       = useState(settings?.isRestWeek || false);
  const [editingTerm, setEditingTerm]   = useState(false);
  const [draftTerm, setDraftTerm]       = useState(settings?.term || TERM_SETTINGS.currentTerm);
  const [draftWeek, setDraftWeek]       = useState(settings?.week || TERM_SETTINGS.currentWeek);
  const [showPremium, setShowPremium]   = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [addingAfterIdx, setAddingAfterIdx] = useState(null);
  const [copyingDay, setCopyingDay]     = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateSaved, setTemplateSaved]   = useState(false);
  const [showExport, setShowExport]     = useState(false);
  const [showImport, setShowImport]     = useState(false);

  const swipeRef  = useRef(null);
  const swipeStartX = useRef(null);

  const [schedule, setSchedule] = useState(() => {
    const s = {};
    DAYS.forEach(d => { s[d] = DAY_SCHEDULE[d].map((b, i) => ({ ...b, _idx: i })); });
    return s;
  });

  const [template, setTemplate] = useState(() => {
    const t = {};
    DAYS.forEach(d => { t[d] = DAY_SCHEDULE[d].map((b, i) => ({ ...b, _idx: i })); });
    return t;
  });

  const dayBlocks  = schedule[activeDay] || [];
  const isToday    = activeDay === todayDay;

  // ── Swipe handlers ──────────────────────────────────────────────────────
  const handleTouchStart = (e) => { swipeStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (swipeStartX.current === null) return;
    const diff = swipeStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return; // ignore small movements
    const idx = DAYS.indexOf(activeDay);
    if (diff > 0 && idx < DAYS.length - 1) setActiveDay(DAYS[idx + 1]); // swipe left → next day
    if (diff < 0 && idx > 0)              setActiveDay(DAYS[idx - 1]); // swipe right → prev day
    swipeStartX.current = null;
  };

  const moveBlock = (idx, dir) => {
    setSchedule(prev => {
      const blocks = [...prev[activeDay]];
      const target = idx + dir;
      if (target < 0 || target >= blocks.length) return prev;
      [blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
      return { ...prev, [activeDay]: blocks };
    });
  };

  const saveBlock  = (updated) => setSchedule(prev => ({ ...prev, [activeDay]: prev[activeDay].map(b => b.id === updated.id ? updated : b) }));
  const deleteBlock = (id)    => setSchedule(prev => ({ ...prev, [activeDay]: prev[activeDay].filter(b => b.id !== id) }));

  const addBlock = (newBlock) => {
    const block = { ...newBlock, id: `custom-${Date.now()}` };
    setSchedule(prev => {
      const blocks = [...prev[activeDay]];
      const insertAt = addingAfterIdx === -1 ? 0 : addingAfterIdx + 1;
      blocks.splice(insertAt, 0, block);
      return { ...prev, [activeDay]: blocks };
    });
    setAddingAfterIdx(null);
  };

  const copyDay = (toDay) => setSchedule(prev => ({ ...prev, [toDay]: prev[activeDay].map(b => ({ ...b, id: `${b.id}-copy-${Date.now()}` })) }));

  const saveAsTemplate = () => {
    setTemplate(prev => ({ ...prev, [activeDay]: schedule[activeDay].map(b => ({ ...b })) }));
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 2500);
  };

  const resetToTemplate = () => setSchedule(prev => ({ ...prev, [activeDay]: template[activeDay].map(b => ({ ...b, id: `${b.id}-reset-${Date.now()}` })) }));
  const importBlocks = (blocks) => {
    setSchedule(prev => ({
      ...prev,
      [activeDay]: [
        ...prev[activeDay],
        ...blocks.map(b => ({ ...b, id: b.id || `import-${Date.now()}-${Math.random()}` })),
      ],
    }));
  };

  const saveTerm = () => { setTerm(Number(draftTerm)); setWeek(Number(draftWeek)); setEditingTerm(false); };

  const handleGridDayTap = (day) => { setActiveDay(day); setViewMode("day"); };

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>Weekly Schedule</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Import + Export buttons */}
          {isPaid && (
            <>
              <button onClick={() => setShowImport(true)}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 2, padding: "5px 10px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sage)" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/></svg>
                Import
              </button>
              <button onClick={() => setShowExport(true)}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "5px 10px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                <Icon.Print /> Export
              </button>
            </>
          )}
          {/* Day/Week toggle */}
          {isPaid && !isRestWeek && (
            <div style={{ display: "flex", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: 2 }}>
              {[{ id: "day", Ic: Icon.List }, { id: "week", Ic: Icon.Grid }].map(({ id, Ic }) => (
                <button key={id} onClick={() => setViewMode(id)}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 18, border: "none", cursor: "pointer", background: viewMode === id ? "var(--sage)" : "none", color: viewMode === id ? "white" : "var(--sage)", transition: "all .2s", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
                  <Ic />{id}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <h1 className="display serif" style={{ marginBottom: 20 }}>Planner</h1>

      {!isPaid ? (
        <FreePlanner onShowPremium={() => setShowPremium(true)} />
      ) : (
        <>
          <TermCounter isRestWeek={isRestWeek} onToggleRest={() => setRestWeek(r => !r)} term={term} week={week} onEdit={() => setEditingTerm(true)} />

          {editingTerm && (
            <div className="card" style={{ marginBottom: 20 }}>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Set Term & Week</p>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <p className="caption" style={{ marginBottom: 6 }}>Term</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 3].map(n => (
                      <button key={n} onClick={() => setDraftTerm(n)}
                        style={{ flex: 1, padding: "10px 0", borderRadius: 2, border: `1px solid ${draftTerm === n ? "var(--sage)" : "var(--rule)"}`, background: draftTerm === n ? "var(--sage-bg)" : "none", cursor: "pointer", fontFamily: "'Playfair Display', serif", fontSize: 16, color: draftTerm === n ? "var(--sage)" : "var(--ink)" }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 2 }}>
                  <p className="caption" style={{ marginBottom: 6 }}>Week</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                      <button key={n} onClick={() => setDraftWeek(n)}
                        style={{ width: 32, height: 32, borderRadius: 2, border: `1px solid ${draftWeek === n ? "var(--sage)" : "var(--rule)"}`, background: draftWeek === n ? "var(--sage)" : "none", cursor: "pointer", fontSize: 13, color: draftWeek === n ? "white" : "var(--ink)", fontFamily: "'Lato', sans-serif" }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="btn-sage" onClick={saveTerm} style={{ width: "100%" }}>Save</button>
            </div>
          )}

          {isRestWeek ? (
            <RestWeekView />
          ) : (
            <>
              {/* WEEK GRID */}
              {viewMode === "week" && <WeekGrid schedule={schedule} onDayTap={handleGridDayTap} todayDay={todayDay} />}

              {/* DAY VIEW */}
              {viewMode === "day" && (
                <div ref={swipeRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

                  {/* Day pills + Today button */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, flex: 1 }}>
                      {DAYS.map(d => (
                        <button key={d} className={`day-pill ${activeDay === d ? "active" : ""}`} onClick={() => setActiveDay(d)}>
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                    {/* Today button — only shows when not on today */}
                    {!isToday && (
                      <button onClick={() => setActiveDay(todayDay)}
                        style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: "5px 10px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
                        <Icon.Today />Today
                      </button>
                    )}
                  </div>

                  <p className="caption italic" style={{ marginBottom: 12, color: "var(--ink-faint)" }}>
                    Swipe left or right to move between days
                  </p>

                  <div className="rule-gold" style={{ margin: "0 0 20px" }} />

                  {/* Day action buttons */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    <button onClick={() => setCopyingDay(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "6px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                      <Icon.Copy /> Copy day
                    </button>
                    <button onClick={() => setSavingTemplate(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: templateSaved ? "var(--sage-bg)" : "none", border: `1px solid ${templateSaved ? "var(--sage)" : "var(--rule)"}`, borderRadius: 2, padding: "6px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: templateSaved ? "var(--sage)" : "var(--ink-faint)", transition: "all .3s" }}>
                      {templateSaved ? "✦ Saved" : "Save template"}
                    </button>
                    <button onClick={resetToTemplate}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "6px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                      Reset
                    </button>
                  </div>

                  <BeautyLoopSection day={activeDay} />
                  <div className="rule" style={{ margin: "0 0 20px" }} />

                  {/* Add block at top */}
                  <button onClick={() => setAddingAfterIdx(-1)}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "4px 0 12px", color: "var(--sage)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>
                    <Icon.Plus /> Add block
                  </button>

                  {/* Empty state */}
                  {dayBlocks.length === 0 && (
                    <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
                      <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 16 }}>
                        {activeDay} is open.<br />Tap + to add your first block.
                      </p>
                    </div>
                  )}

                  {/* Schedule blocks */}
                  {dayBlocks.map((b, idx) => (
                    <div key={b.id}>
                      <div className="planner-block" style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
                          <button onClick={() => moveBlock(idx, -1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: idx === 0 ? 0.2 : 1 }}><Icon.Up /></button>
                          <button onClick={() => moveBlock(idx, 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: idx === dayBlocks.length - 1 ? 0.2 : 1 }}><Icon.Down /></button>
                        </div>
                        <div style={{ width: 3, alignSelf: "stretch", background: getBlockColor(b.subject), borderRadius: 2, flexShrink: 0, minHeight: 28 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                            <span className="planner-time">{b.time}</span>
                            <span className="planner-subject">{b.subject}</span>
                          </div>
                          {b.note && <p className="caption italic" style={{ marginTop: 4 }}>{b.note}</p>}
                        </div>
                        <button onClick={() => setEditingBlock(b)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, marginTop: 2 }}><Icon.Edit /></button>
                      </div>
                      <button onClick={() => setAddingAfterIdx(idx)}
                        style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "6px 0", color: "var(--sage-md)", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.7 }}>
                        <Icon.Plus /> Add block here
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Sheets */}
      {showImport        && <ImportSheet activeDay={activeDay} onImport={importBlocks} onClose={() => setShowImport(false)} />}
      {editingBlock      && <EditBlockSheet block={editingBlock} onSave={saveBlock} onDelete={deleteBlock} onClose={() => setEditingBlock(null)} />}
      {addingAfterIdx !== null && <AddBlockSheet onSave={addBlock} onClose={() => setAddingAfterIdx(null)} />}
      {copyingDay        && <CopyDaySheet fromDay={activeDay} onCopy={copyDay} onClose={() => setCopyingDay(false)} />}
      {savingTemplate    && <SaveTemplateSheet day={activeDay} onSave={saveAsTemplate} onClose={() => setSavingTemplate(false)} />}
      {showExport        && <ExportSheet schedule={schedule} term={term} week={week} onClose={() => setShowExport(false)} />}
      {showPremium       && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}
