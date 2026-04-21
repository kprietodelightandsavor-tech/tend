import { useState, useRef, useEffect } from "react"
import { DAYS, DAY_SCHEDULE, BEAUTY_LOOP, TERM_SETTINGS, REST_WEEK_SUGGESTIONS, getSaturdayRhythm, getSundayRhythm } from "../data/seed";
import { PremiumModal } from "./HomeScreen";

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const isWeekend = (day) => day === "Saturday" || day === "Sunday";

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
};

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
          The full planner — different schedules for each day, editable blocks, the Beauty Loop, term counter, and rest week rhythm — is available with Tend Premium.
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Leaf />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Beauty Loop</p>
        </div>
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
          {drafts.map((d, i) => (
            <input key={i} className="input-line" value={d}
              onChange={e => setDrafts(prev => prev.map((v, j) => j === i ? e.target.value : v))}
              style={{ marginBottom: 8 }} />
          ))}
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
          <p className="caption italic" style={{ marginTop: 12, lineHeight: 1.7 }}>
            Use these as a gathered morning, as quiet anchors throughout your day, or set them aside on full days.
          </p>
        </>
      )}
    </div>
  );
}

function WeekendRhythmView({ day, week }) {
  const rhythm = day === "Saturday" ? getSaturdayRhythm(week) : getSundayRhythm(week);
  const isSunday = day === "Sunday";
  return (
    <div>
      <div style={{ padding: "14px 16px", background: isSunday ? "var(--gold-bg)" : "var(--sage-bg)", borderRadius: 3, border: `1px solid ${isSunday ? "#E0CBA8" : "var(--sage-md)"}`, marginBottom: 20 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: isSunday ? "var(--gold)" : "var(--sage)", marginBottom: 3 }}>
          {day} · {rhythm.theme}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.7 }}>
          "{rhythm.quote}"
        </p>
      </div>
      <p className="eyebrow" style={{ marginBottom: 16 }}>A Gentle Shape for the Day</p>
      {rhythm.items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < rhythm.items.length - 1 ? "1px solid var(--rule)" : "none" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: isSunday ? "var(--gold)" : "var(--sage)", opacity: .6, marginTop: 8, flexShrink: 0 }} />
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 3 }}>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)" }}>{item.time}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)" }}>{item.label}</span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.65 }}>{item.note}</p>
          </div>
        </div>
      ))}
      <p className="caption italic" style={{ marginTop: 20, textAlign: "center" }}>Not a schedule — just a gentle shape. This rhythm rotates each week.</p>
    </div>
  );
}

function AddBlockSheet({ onSave, onClose }) {
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 20 }}>Add a Block</p>
        <input className="input-line" placeholder="Time (e.g. 10:00)" value={time} onChange={e => setTime(e.target.value)} style={{ marginBottom: 14 }} />
        <input className="input-line" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} style={{ marginBottom: 14 }} />
        <input className="input-line" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} style={{ marginBottom: 28 }} />
        <button className="btn-sage" style={{ width: "100%" }} onClick={() => { if (subject.trim()) { onSave({ time, subject, note }); onClose(); } }}>Add Block</button>
      </div>
    </div>
  );
}

function EditBlockSheet({ block, onSave, onDelete, onClose }) {
  const [time, setTime] = useState(block.time);
  const [subject, setSubject] = useState(block.subject);
  const [note, setNote] = useState(block.note || "");
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
  const targets = ALL_DAYS.filter(d => d !== fromDay);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 6 }}>Copy {fromDay} to…</p>
        <p className="caption italic" style={{ marginBottom: 20 }}>This will replace the selected day's blocks entirely.</p>
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

function WeekGrid({ schedule, onDayTap, todayDay }) {
  const getBlockColor = (subject) => {
    const s = subject.toLowerCase();
    if (s.includes("rise") || s.includes("bible") || s.includes("memory") || s.includes("morning")) return "#C29B61";
    if (s.includes("nature") || s.includes("outdoor") || s.includes("narration")) return "#A9B786";
    if (s.includes("co-op") || s.includes("chispa")) return "#8A7A9E";
    if (s.includes("lunch") || s.includes("free") || s.includes("rest")) return "#9a9488";
    return "#7a8f9e";
  };
  return (
    <div style={{ overflowX: "auto", marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 8, minWidth: 300 }}>
        {DAYS.map(day => {
          const blocks = schedule[day] || [];
          const isToday = day === todayDay;
          return (
            <div key={day} style={{ flex: 1, minWidth: 52, cursor: "pointer" }} onClick={() => onDayTap(day)}>
              <div style={{ textAlign: "center", padding: "6px 4px 8px", borderBottom: `2px solid ${isToday ? "var(--sage)" : "var(--rule)"}`, marginBottom: 8 }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: isToday ? "var(--sage)" : "var(--ink-faint)", fontWeight: isToday ? 700 : 400 }}>
                  {day.slice(0, 3)}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {blocks.length === 0 ? (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "var(--ink-faint)", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>—</p>
                ) : blocks.slice(0, 9).map((b, i) => {
                  const color = getBlockColor(b.subject);
                  return (
                    <div key={i} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 4, paddingTop: 2, paddingBottom: 2, background: `${color}18`, borderRadius: "0 2px 2px 0" }}>
                      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 8, color: "var(--ink)", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 48 }}>{b.subject}</p>
                      {b.time && <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 7, color: "var(--ink-faint)", lineHeight: 1.2 }}>{b.time}</p>}
                    </div>
                  );
                })}
                {blocks.length > 9 && <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 7, color: "var(--ink-faint)", textAlign: "center" }}>+{blocks.length - 9}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap a day to edit</p>
    </div>
  );
}

export default function PlannerScreen({ settings }) {
  const isPaid = settings?.isPaid || false;
  const todayIdx = new Date().getDay();
  const todayDay = todayIdx === 0 ? "Sunday" : todayIdx === 6 ? "Saturday" : DAYS[todayIdx - 1];

  const [activeDay, setActiveDay]       = useState(todayDay);
  const [viewMode, setViewMode]         = useState("day");
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

  const [wovenBeauty, setWovenBeauty] = useState(() => {
    try { return localStorage.getItem("tend_beauty_woven") === "true"; } catch { return false; }
  });

  const toggleWoven = () => {
    const next = !wovenBeauty;
    setWovenBeauty(next);
    try { localStorage.setItem("tend_beauty_woven", String(next)); } catch {}
  };

  const [schedule, setSchedule] = useState(() => {
    const s = {};
    DAYS.forEach(d => { s[d] = (DAY_SCHEDULE[d] || []).map((b, i) => ({ ...b, _idx: i })); });
    return s;
  });

  const dayBlocks = schedule[activeDay] || [];

  const moveBlock = (idx, dir) => {
    setSchedule(prev => {
      const blocks = [...prev[activeDay]];
      const target = idx + dir;
      if (target < 0 || target >= blocks.length) return prev;
      [blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
      return { ...prev, [activeDay]: blocks };
    });
  };

  const saveBlock   = (updated) => setSchedule(prev => ({ ...prev, [activeDay]: prev[activeDay].map(b => b.id === updated.id ? updated : b) }));
  const deleteBlock = (id)      => setSchedule(prev => ({ ...prev, [activeDay]: prev[activeDay].filter(b => b.id !== id) }));

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

  const copyDay  = (toDay) => setSchedule(prev => ({ ...prev, [toDay]: prev[activeDay].map(b => ({ ...b, id: `${b.id}-copy-${Date.now()}` })) }));
  const saveTerm = () => { setTerm(Number(draftTerm)); setWeek(Number(draftWeek)); setEditingTerm(false); };

  const getBlockColor = (subject) => {
    const s = subject.toLowerCase();
    if (s.includes("rise") || s.includes("bible") || s.includes("memory") || s.includes("morning")) return "#C29B61";
    if (s.includes("nature") || s.includes("outdoor") || s.includes("narration")) return "#A9B786";
    if (s.includes("co-op") || s.includes("chispa")) return "#8A7A9E";
    if (s.includes("lunch") || s.includes("free") || s.includes("rest")) return "#9a9488";
    return "#7a8f9e";
  };

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>Weekly Schedule</p>
        {!isRestWeek && (
          <div style={{ display: "flex", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: 2 }}>
            {["day", "week"].map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                style={{ padding: "5px 12px", borderRadius: 18, border: "none", cursor: "pointer", background: viewMode === v ? "var(--sage)" : "none", color: viewMode === v ? "white" : "var(--sage)", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", transition: "all .2s" }}>
                {v}
              </button>
            ))}
          </div>
        )}
      </div>
      <h1 className="display serif" style={{ marginBottom: 16 }}>Planner</h1>

      {isPaid && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "10px 14px", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3 }}>
          <div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 2 }}>Beauty Loop Style</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)" }}>
              {wovenBeauty ? "Woven — appears before anchor subjects" : "Separate — shown as its own card"}
            </p>
          </div>
          <button onClick={toggleWoven}
            style={{ flexShrink: 0, background: wovenBeauty ? "var(--sage)" : "none", border: "1px solid var(--sage-md)", borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: wovenBeauty ? "white" : "var(--sage)", transition: "all .2s" }}>
            {wovenBeauty ? "Woven ✦" : "Separate"}
          </button>
        </div>
      )}

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
              {/* Week grid view */}
              {viewMode === "week" && (
                <WeekGrid
                  schedule={schedule}
                  onDayTap={(day) => { setActiveDay(day); setViewMode("day"); }}
                  todayDay={todayDay}
                />
              )}

              {/* Day view */}
              {viewMode === "day" && (
              <>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 16, marginBottom: 4 }}>
                {ALL_DAYS.map(d => (
                  <button key={d} className={`day-pill ${activeDay === d ? "active" : ""}`} onClick={() => setActiveDay(d)}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className="rule-gold" style={{ margin: "0 0 20px" }} />

              {isWeekend(activeDay) ? (
                <WeekendRhythmView day={activeDay} week={week} />
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                    <button onClick={() => setCopyingDay(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "6px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                      <Icon.Copy /> Copy {activeDay}
                    </button>
                  </div>
                  
                  <BeautyLoopSection day={activeDay} />
                  <div className="rule" style={{ margin: "0 0 20px" }} />
                  <button onClick={() => setAddingAfterIdx(-1)}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "4px 0 12px", color: "var(--sage)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>
                    <Icon.Plus /> Add block here
                  </button>
                  {dayBlocks.map((b, idx) => (
                    <div key={b.id}>
                      <div className="planner-block" style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
                          <button onClick={() => moveBlock(idx, -1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: idx === 0 ? 0.2 : 1 }}><Icon.Up /></button>
                          <button onClick={() => moveBlock(idx, 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: idx === dayBlocks.length - 1 ? 0.2 : 1 }}><Icon.Down /></button>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                            <span className="planner-time">{b.time}</span>
                            <span className="planner-subject">{b.subject}</span>
                          </div>
                          {b.note && <p className="caption italic" style={{ marginTop: 4 }}>{b.note}</p>}
                        </div>
                        <button onClick={() => setEditingBlock(b)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, marginTop: 2 }}>
                          <Icon.Edit />
                        </button>
                      </div>
                      <button onClick={() => setAddingAfterIdx(idx)}
                        style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "6px 0", color: "var(--sage-md)", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.7 }}>
                        <Icon.Plus /> Add block here
                      </button>
                    </div>
                  ))}
                </>
              )}
              </>
              )}
            </>
          )}
        </>
      )}
    
      {editingBlock      && <EditBlockSheet block={editingBlock} onSave={saveBlock} onDelete={deleteBlock} onClose={() => setEditingBlock(null)} />}
      {addingAfterIdx !== null && <AddBlockSheet onSave={addBlock} onClose={() => setAddingAfterIdx(null)} />}
      {copyingDay        && <CopyDaySheet fromDay={activeDay} onCopy={copyDay} onClose={() => setCopyingDay(false)} />}
      {showPremium       && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}
