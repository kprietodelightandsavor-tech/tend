import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES, RISE_SHINE_ITEMS, BEAUTY_LOOP, getSaturdayRhythm, getSundayRhythm, NATURE_DAYS, NATURE_LOOP_STEPS, getNatureLoopStep, advanceNatureLoop, getBeautyForBlock } from "../data/seed";
import { supabase } from "../lib/supabase";

const HABIT_ICONS = {
  attention: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  narration: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>),
  outdoor:   () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-8 4 5 3-3 4 6H3z"/><circle cx="18" cy="6" r="2"/></svg>),
  stillness: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
  orderly:   () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
};

const Icon = {
  Leaf:    () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Feather: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>),
  Sun:     () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Arrow:   () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  Sprout:  () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10C12 10 8 9 7 5c3 0 5 2 5 5z"/><path d="M12 10C12 10 16 9 17 5c-3 0-5 2-5 5z"/></svg>),
  Moon:    () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>),
  X:       () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

const getBlockColor = (subject) => {
  const s = subject.toLowerCase();
  if (s.includes("rise") || s.includes("bible") || s.includes("memory") || s.includes("living literature") || s.includes("hymn")) return "var(--block-morning)";
  if (s.includes("math") || s.includes("language") || s.includes("writing") || s.includes("copywork") || s.includes("history") || s.includes("science") || s.includes("geography") || s.includes("spanish") || s.includes("reading") || s.includes("commonplace")) return "var(--block-academic)";
  if (s.includes("nature") || s.includes("outdoor") || s.includes("artist") || s.includes("composer") || s.includes("beauty") || s.includes("poet") || s.includes("biography")) return "var(--block-nature)";
  if (s.includes("co-op") || s.includes("bach") || s.includes("chispa") || s.includes("tennis")) return "var(--block-coop)";
  if (s.includes("lunch") || s.includes("free") || s.includes("rest") || s.includes("afternoon") || s.includes("break") || s.includes("pursuits") || s.includes("reset")) return "var(--block-free)";
  return "var(--rule)";
};

const FREE_KEYWORDS = ["rise", "chores", "piano", "free", "rest", "independent", "lunch", "outdoor", "nature", "afternoon", "pursuits", "break", "reset"];
const isFreeBlock = (subject) => FREE_KEYWORDS.some(k => subject.toLowerCase().includes(k));

export function PremiumModal({ onClose }) {
  const FREE_FEATURES = [
    "Daily schedule — one repeating template",
    "Outdoor time tracker toward your weekly goal",
    "Consider the Lilies — up to 3 journal entries",
    "One habit focus (Attention) with today's ideas",
    "5 free narration sessions",
    "One student profile",
    "Daily Mother Culture prompt",
    "CM quote of the day",
  ];
  const PREMIUM_FEATURES = [
    "Full weekly planner — different schedule per day, editable blocks",
    "Week grid view — see your whole week at a glance",
    "Beauty Loop anchored to your daily subjects",
    "Term counter with rest week gentle rhythm",
    "All five Charlotte Mason habits with 12-week reflection",
    "Unlimited Consider the Lilies entries for every family member",
    "Unlimited narration sessions with AI coaching",
    "Unlimited student profiles with narration history",
    "Full rotating Mother Culture prompt bank",
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 52px", maxHeight: "92dvh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>Delight & Savor</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: "var(--ink)" }}>Tend Premium</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", marginTop: 4 }}><Icon.X /></button>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", marginBottom: 24, lineHeight: 1.8 }}>Beauty. Meaning. Connection.</p>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Free — always</p>
          {FREE_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "18px", marginBottom: 28 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 14 }}>Premium — everything above, plus</p>
          {PREMIUM_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✦</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>
        <a href="https://delightnsavor.gumroad.com/l/qrxxi" target="_blank" rel="noopener noreferrer"
          style={{ display: "block", background: "var(--sage)", borderRadius: 2, padding: "14px 0", width: "100%", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "white", textAlign: "center", textDecoration: "none", marginBottom: 12 }}>
          Join Tend Premium →
        </a>
        <button onClick={onClose}
          style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "11px 0", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

function WovenBeautyCard({ item, checked, onToggle }) {
  return (
    <div onClick={onToggle}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 15px", marginBottom: 0, background: checked ? "rgba(169,183,134,.06)" : "var(--sage-bg)", borderLeft: `3px solid ${checked ? "var(--sage-md)" : "var(--sage)"}`, cursor: "pointer", opacity: checked ? 0.5 : 1, transition: "all .2s" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${checked ? "var(--sage)" : "var(--sage-md)"}`, background: checked ? "var(--sage)" : "none", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
        {checked && <svg width="7" height="7" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)", flexShrink: 0 }}>Beauty</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "var(--ink)", textDecoration: checked ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>{item.label}</span>
      </div>
    </div>
  );
}

function MemoryVerseBlock({ items, blockId, subChecked, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const memoryIdx = items.findIndex(i => typeof i === "string" && i.toLowerCase().includes("memory"));
  const bibleIdx  = items.findIndex(i => typeof i === "string" && i.toLowerCase().includes("bible"));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, idx) => {
        const checked = subChecked?.[idx];
        const isMemory = idx === memoryIdx;
        const isBible  = idx === bibleIdx;

        if (isMemory) {
          return (
            <div key={idx} style={{ borderRadius: 3, border: "1px solid var(--rule)", overflow: "hidden" }}>
              <button onClick={() => setExpanded(e => !e)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "none", border: "none", cursor: "pointer" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--sage)" }}>Memory Verse</span>
                <span style={{ fontSize: 10, color: "var(--ink-faint)" }}>{expanded ? "↑" : "↓"}</span>
              </button>
              {expanded && (
                <div style={{ padding: "4px 10px 10px" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 8 }}>{item}</p>
                  <button onClick={() => onToggle(idx)}
                    style={{ background: checked ? "var(--sage-bg)" : "none", border: `1px solid ${checked ? "var(--sage)" : "var(--rule)"}`, borderRadius: 20, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: checked ? "var(--sage)" : "var(--ink-faint)", textDecoration: checked ? "line-through" : "none" }}>
                    {checked ? "recited ✦" : "mark recited"}
                  </button>
                </div>
              )}
            </div>
          );
        }

        return (
          <button key={idx} onClick={() => onToggle(idx)}
            style={{ background: checked ? "var(--sage-bg)" : "none", border: `1px solid ${checked ? "var(--sage)" : "var(--rule)"}`, borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: checked ? "var(--sage)" : "var(--ink-faint)", transition: "all .2s", textDecoration: checked ? "line-through" : "none", alignSelf: "flex-start" }}>
            {item}
          </button>
        );
      })}
    </div>
  );
}

async function loadDailyState(userId, date) {
  try {
    const res = await fetch("/.netlify/functions/daily-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "get", userId, date }),
    });
    const data = await res.json();
    return data.state || null;
  } catch { return null; }
}

async function saveDailyState(userId, date, state) {
  try {
    await fetch("/.netlify/functions/daily-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "set", userId, date, state }),
    });
  } catch {}
}

// ─── TODAY'S SCHEDULE ─────────────────────────────────────────────────────────
const SCHEDULE_KEY = "tend_schedule_state";
const BEAUTY_KEY = "tend_beauty_state";

const SKIP_SUBJECTS = ["Rise & Shine", "Lunch", "Outdoor Break", "Afternoon Pursuits", "House Reset & Animal Chores", "Tuesday Rhythm", "Tennis"];

function TodaySchedule({ today, blocks, onNavigate, settings, wovenBeauty, week, dailyOffset }) {
  const dateKey = new Date().toISOString().slice(0, 10);
  const userId  = settings?.userId;

  const [synced, setSynced] = useState(false);

  const [beautyDone, setBeautyDone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BEAUTY_KEY) || "null");
      if (saved?.date === dateKey && saved?.day === today) return saved.done;
    } catch {}
    return {};
  });

  const [subjectNotes, setSubjectNotes] = useState({});
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState("");

  const toggleBeauty = (id) => {
    const next = { ...beautyDone, [id]: !beautyDone[id] };
    setBeautyDone(next);
    try { localStorage.setItem(BEAUTY_KEY, JSON.stringify({ date: dateKey, day: today, done: next })); } catch {}
    if (userId) {
      saveDailyState(userId, dateKey, { day: today, items, beautyDone: next });
    }
  };

  // Load subject notes from Supabase
  useEffect(() => {
    if (!userId) return;
    loadSubjectNotes();
  }, [userId]);

  const loadSubjectNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("subject_notes")
        .select("*")
        .eq("user_id", userId)
        .eq("date", dateKey);

      if (error) throw error;

      const notesMap = {};
      (data || []).forEach(note => {
        notesMap[note.subject] = note.notes;
      });
      setSubjectNotes(notesMap);
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  };

  const saveSubjectNote = async (subject, text) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("subject_notes")
        .upsert(
          {
            user_id: userId,
            date: dateKey,
            subject,
            notes: text || null,
            updated_at: new Date().toISOString(),
          },
        , { onConflict: "user_id,date,subject" });

      if (error) throw error;

      setSubjectNotes(prev => ({
        ...prev,
        [subject]: text,
      }));
      setEditingNotes(null);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Error saving note. Please try again.");
    }
  };

  const getSchoolYear = () => {
    const y = new Date().getFullYear(), m = new Date().getMonth();
    return m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
  };

  const logToTeachingRecord = async (block, status) => {
    if (!userId) return;
    if (SKIP_SUBJECTS.some(s => block.subject.includes(s))) return;
    if (block.free) return;
    const y = new Date().getFullYear(), m = new Date().getMonth();
    const schoolYear = m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
    fetch("/.netlify/functions/teaching-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method:     "upsert",
        userId,
        date:       dateKey,
        subject:    block.subject,
        timeBlock:  block.time || null,
        note:       block.note || null,
        status,
        schoolYear,
      }),
    }).catch(() => {});
  };

  const defaultItems = () => blocks.map(b => ({ ...b, status: "pending", motherNote: "", subChecked: {} }));

  const [items, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || "null");
      if (saved && saved.date === dateKey && saved.day === today) return saved.items;
    } catch {}
    return defaultItems();
  });

  useEffect(() => {
    if (!userId || synced) return;
    loadDailyState(userId, dateKey).then(remote => {
      if (remote?.items && remote?.day === today) {
        setItems(remote.items);
        if (remote.beautyDone) setBeautyDone(remote.beautyDone);
        try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: remote.items })); } catch {}
        try { localStorage.setItem(BEAUTY_KEY, JSON.stringify({ date: dateKey, day: today, done: remote.beautyDone || {} })); } catch {}
      }
      setSynced(true);
    });
  }, [userId]);

  const persist = (newItems, newBeauty) => {
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: newItems })); } catch {}
    if (userId) {
      saveDailyState(userId, dateKey, {
        day: today,
        items: newItems,
        beautyDone: newBeauty !== undefined ? newBeauty : beautyDone,
      });
    }
  };

  const toggleDone = (id) => {
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      if (!t) return prev;
      let next;
      if (t.status === "skipped" || t.status === "done") {
        next = prev.map(b => b.id === id ? { ...b, status: "pending" } : b)
          .sort((a, b) => blocks.findIndex(x => x.id === a.id) - blocks.findIndex(x => x.id === b.id));
        if (userId) {
          fetch("/.netlify/functions/teaching-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method: "delete", userId, date: dateKey, subject: t.subject }),
          }).catch(() => {});
        }
      } else {
        const u = prev.map(b => b.id === id ? { ...b, status: "done" } : b);
        next = [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
        logToTeachingRecord(t, "completed");
      }
      persist(next);
      return next;
    });
  };

  const markSkipped = (id) => {
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      const u = prev.map(b => b.id === id ? { ...b, status: "skipped" } : b);
      const next = [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
      persist(next);
      if (t) logToTeachingRecord(t, "skipped");
      return next;
    });
  };

  const toggleSub = (blockId, subIdx) => {
    setItems(prev => {
      const next = prev.map(b => b.id === blockId ? { ...b, subChecked: { ...b.subChecked, [subIdx]: !b.subChecked[subIdx] } } : b);
      persist(next);
      return next;
    });
  };

  const [editingNote, setEditingNote] = useState(null);
  const lpt = useRef(null);
  const riseShineItems = RISE_SHINE_ITEMS[today] || [];

  const saveNote = (id, note) => { setItems(prev => prev.map(b => b.id === id ? { ...b, motherNote: note } : b)); setEditingNote(null); };
  const startLP  = (id) => { lpt.current = setTimeout(() => { clearTimeout(lpt.current); markSkipped(id); }, 1000); };
  const cancelLP = () => clearTimeout(lpt.current);

  const isNatureDay = NATURE_DAYS[today] === true;
  const [loopStep, setLoopStep] = useState(getNatureLoopStep);
  const [natureCurrent] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_nature_current") || "null");
      if (saved?.subject) return saved;
    } catch {}
    return { subject: "The Story of the Tadpole", read: "The Year Round by C.J. Hylander · Spring section", observe: "Go outside and look near ponds or puddles for frogs or tadpoles." };
  });
  const [natureDone, setNatureDone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_nature_done") || "null");
      return saved?.date === dateKey ? saved.done : false;
    } catch { return false; }
  });

  const markNatureDone = () => {
    setNatureDone(true);
    try { localStorage.setItem("tend_nature_done", JSON.stringify({ date: dateKey, done: true })); } catch {}
    const next = advanceNatureLoop();
    setLoopStep(next);
  };

  const undoNatureDone = () => {
    setNatureDone(false);
    try { localStorage.setItem("tend_nature_done", JSON.stringify({ date: dateKey, done: false })); } catch {}
  };

  const getAdjustedTime = (timeString, offset) => {
    if (!timeString || offset === 0) return timeString;
    const [hours, mins] = timeString.split(":").map(Number);
    const blockMinutes = hours * 60 + mins + offset;
    const newHours = Math.floor(blockMinutes / 60);
    const newMins = blockMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Sun />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Today · {today}</p>
        </div>
        <button onClick={() => onNavigate("planner")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Full week <Icon.Arrow />
        </button>
      </div>

      {/* Nature loop block — Monday and Friday only */}
      {isNatureDay && (() => {
        const step = NATURE_LOOP_STEPS[loopStep];
        return (
          <div onClick={natureDone ? undoNatureDone : markNatureDone}
            style={{ borderBottom: "1px solid var(--rule)", opacity: natureDone ? 0.35 : 1, transition: "opacity .3s", cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px" }}>
              <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: natureDone ? "var(--rule)" : "var(--sage)", marginRight: 12, flexShrink: 0, minHeight: 36 }} />
              <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}></span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, color: natureDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: natureDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)" }}>
                  Nature Study · {step.label}
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>
                  {natureCurrent.subject} · {step.icon} {step.step}
                </p>
                {!natureDone && (
                  <p style={{ fontSize: 12, color: "var(--sage)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 4, lineHeight: 1.5 }}>
                    {step.getInstruction(natureCurrent)}
                  </p>
                )}
                {natureDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
              </div>
            </div>
            {/* Loop dots */}
            {!natureDone && (
              <div style={{ display: "flex", gap: 5, alignItems: "center", paddingLeft: 51, paddingBottom: 8 }}>
                {NATURE_LOOP_STEPS.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === loopStep ? "var(--sage)" : "var(--rule)" }} />
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 7, letterSpacing: ".08em", color: i === loopStep ? "var(--sage)" : "var(--ink-faint)", textTransform: "uppercase" }}>{s.step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {items.map(b => {
        const isDone = b.status === "done", isSkipped = b.status === "skipped";
        const showMother = isFreeBlock(b.subject) && !isSkipped;
        const blockColor = getBlockColor(b.subject);
        const isRise = b.riseShine === true;
        const wovenItem = wovenBeauty ? getBeautyForBlock(b.subject, today, week || 1) : null;
        const displayTime = getAdjustedTime(b.time, dailyOffset);
        const isExpanded = expandedBlock === b.id;
        const hasNotes = subjectNotes[b.subject];

        return (
          <div key={b.id}>
            {/* Beauty mini card — woven before anchor subject */}
            {wovenItem && (
              <WovenBeautyCard
                item={wovenItem}
                checked={!!beautyDone[wovenItem.id]}
                onToggle={() => toggleBeauty(wovenItem.id)}
              />
            )}
            <div style={{ borderBottom: "1px solid var(--rule)" }}>
              <div 
                onClick={() => setExpandedBlock(isExpanded ? null : b.id)}
                onTouchStart={() => { if (b.status === "pending") startLP(b.id); }} 
                onTouchEnd={cancelLP}
                onMouseDown={() => { if (b.status === "pending") startLP(b.id); }} 
                onMouseUp={cancelLP} 
                onMouseLeave={cancelLP}
                style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px", cursor: "pointer", opacity: isDone ? 0.35 : isSkipped ? 0.45 : 1, transition: "opacity .4s ease" }}>
                <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: isDone || isSkipped ? "var(--rule)" : blockColor, marginRight: 12, flexShrink: 0, transition: "background .3s ease", minHeight: 36 }} />
                
                {/* Checkbox */}
                <div
                  onClick={e => {
                    e.stopPropagation();
                    toggleDone(b.id);
                  }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 2,
                    border: `1.5px solid ${isDone ? "var(--sage)" : "var(--rule)"}`,
                    background: isDone ? "var(--sage)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all .2s",
                    marginRight: 10,
                  }}>
                  {isDone && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, color: isDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)", transition: "all .3s ease" }}>
                    {b.subject} <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{displayTime}</span>
                  </p>
                  {isSkipped && <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>skipped · tap to restore</p>}
                  {b.note && !isSkipped && !isDone && <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>{b.note}</p>}
                  {isDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
                </div>
              </div>

              {/* Expanded Notes Section */}
              {isExpanded && !isDone && !isSkipped && (
                <div style={{ paddingLeft: 51, paddingBottom: 12, paddingTop: 8 }} onClick={e => e.stopPropagation()}>
                  {/* Pencil icon + notes */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
                    <svg 
                      onClick={() => {
                        setEditingNotes(b.id);
                        setNotesText(subjectNotes[b.subject] || "");
                      }} 
                      width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                      style={{ cursor: "pointer", transition: "stroke .2s" }}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>
                      {subjectNotes[b.subject] ? "Edit notes" : "Add notes"}
                    </p>
                  </div>

                  {/* Notes display or edit mode */}
                  {editingNotes === b.id ? (
                    <div style={{ marginBottom: 10 }}>
                      <textarea
                        autoFocus
                        value={notesText}
                        onChange={e => setNotesText(e.target.value)}
                        placeholder="Add notes for today..."
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid var(--rule)",
                          borderRadius: 3,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 13,
                          minHeight: 60,
                          outline: "none",
                          resize: "vertical",
                        }}
                      />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                          onClick={() => {
                            saveSubjectNote(b.subject, notesText);
                            setEditingNotes(null);
                          }}
                          style={{
                            flex: 1,
                            background: "var(--sage)",
                            color: "white",
                            border: "none",
                            borderRadius: 2,
                            padding: "6px",
                            cursor: "pointer",
                            fontSize: 10,
                            fontFamily: "'Lato', sans-serif",
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                          }}>
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotes(null)}
                          style={{
                            flex: 1,
                            background: "none",
                            border: "1px solid var(--rule)",
                            borderRadius: 2,
                            padding: "6px",
                            cursor: "pointer",
                            fontSize: 10,
                            fontFamily: "'Lato', sans-serif",
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            color: "var(--ink-faint)",
                          }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : subjectNotes[b.subject] ? (
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-lt)", lineHeight: 1.6, margin: 0, marginBottom: 10 }}>
                      {subjectNotes[b.subject]}
                    </p>
                  ) : null}
                </div>
              )}
              {isRise && !isDone && !isSkipped && riseShineItems.length > 0 && (
                <div style={{ paddingLeft: 53, paddingBottom: 10 }} onClick={e => e.stopPropagation()}>
                  <MemoryVerseBlock items={riseShineItems} blockId={b.id} subChecked={b.subChecked} onToggle={(idx) => toggleSub(b.id, idx)} />
                </div>
              )}
              {showMother && (
                <div style={{ paddingLeft: 53, paddingBottom: 8 }} onClick={e => e.stopPropagation()}>
                  {editingNote === b.id ? (
                    <input autoFocus defaultValue={b.motherNote} placeholder="What will you tend during this time?"
                      onBlur={e => saveNote(b.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                      style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }} />
                  ) : (
                    <button onClick={() => setEditingNote(b.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", padding: 0, textAlign: "left", opacity: b.motherNote ? 1 : 0.5 }}>
                      {b.motherNote ? `✦ ${b.motherNote}` : "your time · what will you tend?"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap checkbox to complete · Long press to skip · Tap to expand for notes</p>
    </div>
  );
}

// Main HomeScreen
export default function HomeScreen({ onNavigate, settings }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const name = settings?.name || "Friend";

  const day = now.getDay();
  const dayName = DAYS[day];
  const today = dayName;
  const todayBlocks = DAY_SCHEDULE[dayName] || [];
  const cmQuote = CM_QUOTES[day];
  const activeHabit = settings?.activeHabit || "attention";
  const HIcon = HABIT_ICONS[activeHabit];
  const habit = HABIT_PROMPTS[activeHabit];

  const week = settings?.week || 1;
  const isRestWeek = settings?.isRestWeek || false;
  const isWeekend = dayName === "Saturday" || dayName === "Sunday";

  const [dailyOffset, setDailyOffset] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tend_daily_offset") || "{}");
      const dateKey = now.toISOString().slice(0, 10);
      return saved[dateKey] || 0;
    } catch {
      return 0;
    }
  });

  const [showPremium, setShowPremium] = useState(false);

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>{greeting},<br />{name}.</h1>

      {/* Daily Offset Control */}
      <div style={{ padding: "14px 16px", background: dailyOffset > 0 ? "var(--gold-bg)" : "var(--sage-bg)", border: `1px solid ${dailyOffset > 0 ? "#E0CBA8" : "var(--sage-md)"}`, borderRadius: 4, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: dailyOffset > 0 ? "var(--gold)" : "var(--sage)", marginBottom: 0 }}>
            {dailyOffset > 0 ? `Started ${dailyOffset}m late` : "On Schedule"}
          </p>
          {dailyOffset > 0 && (
            <button onClick={() => setDailyOffset(0)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "underline" }}>
              Reset
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[0, 15, 30, 45, 60].map((minutes) => (
            <button key={minutes} onClick={() => setDailyOffset(minutes)} style={{ padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${dailyOffset === minutes ? (dailyOffset > 0 ? "var(--gold)" : "var(--sage)") : "var(--rule)"}`, background: dailyOffset === minutes ? (dailyOffset > 0 ? "var(--gold)" : "var(--sage)") : "var(--cream)", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: dailyOffset === minutes ? "white" : "var(--ink-faint)", transition: "all .2s" }}>
              {minutes === 0 ? "On time" : `+${minutes}m`}
            </button>
          ))}
        </div>
      </div>

      {/* CM Quote */}
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.85, marginBottom: 4 }}>"{cmQuote.quote}"</p>
        <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
      </div>

      {/* Main Content */}
      {!isRestWeek && !isWeekend && (
        <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} settings={settings} wovenBeauty={false} week={week} dailyOffset={dailyOffset} />
      )}

      {/* Psalm 23 footer */}
      <div style={{ marginTop: 40, marginBottom: 32, padding: "28px 20px 24px", borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", lineHeight: 2, marginBottom: 14 }}>
          The Lord is my shepherd; I shall not want.<br />
          He makes me lie down in green pastures.<br />
          He leads me beside still waters.<br />
          He restores my soul.
        </p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", opacity: 0.6 }}>
          Psalm 23 · ESV
        </p>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <img src="/ds-logo.png" alt="Delight & Savor" style={{ width: 64, height: 64, opacity: 0.12 }} />
        </div>
      </div>

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}
