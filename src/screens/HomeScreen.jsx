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

  const toggleBeauty = (id) => {
    const next = { ...beautyDone, [id]: !beautyDone[id] };
    setBeautyDone(next);
    try { localStorage.setItem(BEAUTY_KEY, JSON.stringify({ date: dateKey, day: today, done: next })); } catch {}
    // Sync to Supabase with current items
    if (userId) {
      saveDailyState(userId, dateKey, { day: today, items, beautyDone: next });
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
note:       block.motherNote || block.note || null,
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

  // Load from Supabase on mount — overwrites localStorage if Supabase is newer
  useEffect(() => {
    if (!userId || synced) return;
    loadDailyState(userId, dateKey).then(remote => {
      if (remote?.items && remote?.day === today) {
        setItems(remote.items);
        if (remote.beautyDone) setBeautyDone(remote.beautyDone);
        // Also update localStorage
        try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: remote.items })); } catch {}
        try { localStorage.setItem(BEAUTY_KEY, JSON.stringify({ date: dateKey, day: today, done: remote.beautyDone || {} })); } catch {}
      }
      setSynced(true);
    });
  }, [userId]);

  const persist = (newItems, newBeauty) => {
    // Save to localStorage immediately
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ date: dateKey, day: today, items: newItems })); } catch {}
    // Save to Supabase for cross-device sync
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
        // Remove from teaching log when un-completing
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

  const saveNote = (id, note) => {   setItems(prev => {     const next = prev.map(b => b.id === id ? { ...b, motherNote: note } : b);     persist(next);     return next;   });   setEditingNote(null); };
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
  onTouchStart={() => { if (b.status === "pending") startLP(b.id); }} onTouchEnd={cancelLP}
  onMouseDown={() => { if (b.status === "pending") startLP(b.id); }} onMouseUp={cancelLP} onMouseLeave={cancelLP}
  style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px", opacity: isDone ? 0.35 : isSkipped ? 0.45 : 1, transition: "opacity .4s ease" }}>
  <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: isDone || isSkipped ? "var(--rule)" : blockColor, marginRight: 12, flexShrink: 0, transition: "background .3s ease", minHeight: 36 }} />
  <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}>{displayTime}</span>
  <button
    onClick={(e) => { e.stopPropagation(); toggleDone(b.id); }}
    aria-label={isDone ? "Mark incomplete" : "Mark complete"}
    style={{ background: "none", border: `1.5px solid ${isDone ? "var(--sage)" : "var(--ink-faint)"}`, borderRadius: 3, width: 16, height: 16, marginRight: 10, marginTop: 3, cursor: "pointer", flexShrink: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sage)", fontSize: 11, lineHeight: 1 }}>
    {isDone ? "✓" : ""}
  </button>
  <div
    onClick={() => {
      if (isDone || isSkipped) toggleDone(b.id);
      else setEditingNote(editingNote === b.id ? null : b.id);
    }}
    style={{ flex: 1, cursor: "pointer" }}>
    <p style={{ fontSize: 16, color: isDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)", transition: "all .3s ease" }}>{b.subject}</p>
    {b.motherNote && !isSkipped && editingNote !== b.id && (
      <p style={{ fontSize: 13, color: "var(--sage)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>✦ {b.motherNote}</p>
    )}
    {isSkipped && <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>skipped · tap to restore</p>}
    {b.note && !isSkipped && !isDone && <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>{b.note}</p>}
    {isDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
  </div>
  {!isSkipped && !isDone && (
    <button
      onClick={(e) => { e.stopPropagation(); setEditingNote(editingNote === b.id ? null : b.id); }}
      aria-label="Edit note"
      style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", marginTop: 1, color: editingNote === b.id ? "var(--sage)" : "var(--ink-faint)", fontSize: 14, opacity: editingNote === b.id ? 1 : 0.55, flexShrink: 0 }}>
      ✎
    </button>
  )}
</div>

{editingNote === b.id && !isSkipped && (
  <div style={{ paddingLeft: 77, paddingBottom: 8, paddingRight: 10 }} onClick={e => e.stopPropagation()}>
    <input autoFocus defaultValue={b.motherNote} placeholder="add a note for this subject…"
      onBlur={e => saveNote(b.id, e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter") saveNote(b.id, e.target.value);
        if (e.key === "Escape") setEditingNote(null);
      }}
      style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }} />
  </div>
)}

              <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap ☐ to complete · Tap row to add note · Hold to skip</p>
    </div>
  );
}
