import { useState, useRef } from "react";
import { DAYS, DAY_SCHEDULE } from "../data/seed";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Leaf: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/>
    </svg>
  ),
  Feather: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
      <line x1="16" y1="8" x2="2" y2="22"/>
      <line x1="17.5" y1="15" x2="9" y2="15"/>
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  Book: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  Sprout: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10"/>
      <path d="M12 20V10"/>
      <path d="M12 10C12 10 8 9 7 5c3 0 5 2 5 5z"/>
      <path d="M12 10C12 10 16 9 17 5c-3 0-5 2-5 5z"/>
    </svg>
  ),
};

// ─── MOTHER CULTURE ───────────────────────────────────────────────────────────
const MOTHER_CULTURE = [
  [ // Sunday
    "Rest fully today. The week ahead needs a rested you.",
    "Sit with Scripture or something that feeds your soul, slowly and without hurry.",
    "Name three things from this past week that went well. Let yourself receive them.",
  ],
  [ // Monday
    "Step outside alone for 10 minutes before the day begins. Let the morning be yours first.",
    "Read one poem slowly — not to teach it, just to receive it.",
    "Notice one beautiful thing today and write it down in your own words.",
  ],
  [ // Tuesday
    "Make yourself something warm to drink and sit with it before opening any screens.",
    "Pray or sit in silence for five minutes. You cannot pour from an empty vessel.",
    "Pick up a book you've been meaning to read — just one chapter.",
  ],
  [ // Wednesday
    "Take a short walk, even just around the property. Move your body gently.",
    "Write three sentences in your journal — no agenda, just what is true today.",
    "Listen to music you love while you work. Let it be a small gift to yourself.",
  ],
  [ // Thursday
    "Rest your eyes from screens for 20 minutes today. Look at something far away.",
    "Call or write to a friend — connection is its own kind of nourishment.",
    "Spend a few minutes with a craft, a sketchbook, or anything that uses your hands.",
  ],
  [ // Friday
    "Go outside and look up. Sky, clouds, light — let it reset something in you.",
    "Read something purely for your own delight today — fiction, poetry, biography.",
    "Give yourself permission to end the school day on time. Rest is not laziness.",
  ],
  [ // Saturday
    "Linger over breakfast. Let the morning be unhurried.",
    "Tend to your own space — a clean corner, fresh flowers, something that is yours.",
    "Do one thing today that has nothing to do with homeschooling.",
  ],
];

// ─── HABIT DATA (shared shape — full detail lives in HabitsScreen) ────────────
export const HABIT_PROMPTS = {
  attention: {
    name: "Attention",
    desc: "The habit of giving full, unhurried focus to one thing at a time.",
    icon: () => (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    daily: [
      // indexed by day-of-week 0–6
      ["Ask your child to look at one thing for a full minute before speaking.", "Notice when attention wanders — gently call it back without shame.", "Choose one task today and do it without rushing to the next."],
      ["Read aloud slowly. Pause. Let the words settle before moving on.", "Practice looking at a speaker's eyes during conversation.", "After reading, sit quietly for 30 seconds before narrating."],
      ["Go outside and ask: what do you hear that you haven't noticed before?", "Put one thing away before beginning the next subject.", "Narrate back what you noticed on your walk — in detail."],
      ["Choose a piece of music and listen to the whole thing without doing anything else.", "Ask your child to draw what they remember from yesterday's read-aloud.", "Model attention by setting your phone in another room this morning."],
      ["Read a poem twice — once for sound, once for meaning.", "Notice one small beautiful thing and describe it in three sentences.", "End the day by asking: what held your attention today?"],
      ["Let Saturday be a day of unhurried noticing.", "Do one thing with your hands — slowly and well.", "Read something just for yourself, with full attention."],
      ["Rest is its own form of attention. Give it fully today.", "Sit outside for ten minutes and simply observe.", "Name one thing from this week that deserved more of your attention."],
    ],
  },
  narration: {
    name: "Narration",
    desc: "Telling back what was heard or read — the backbone of language and memory.",
    icon: () => (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
    daily: [
      ["Ask for one oral narration today — no prompts, just: tell me what you remember.", "Let a younger child narrate to an older one after read-aloud.", "Don't correct the narration. Receive it as offered."],
      ["After your read-aloud, ask: what image stayed with you?", "Try a written narration of just three sentences today.", "Narrate something yourself — show your child what it looks like."],
      ["Ask your child to narrate what they noticed outside today.", "Let narration be the only comprehension check you use today.", "Read one passage twice, then ask for a narration. Notice the difference."],
      ["Invite a drawn narration — a sketch of a scene from the book.", "Ask: what happened first? What happened next? What happened last?", "Try a narration at dinner — what did you learn or read today?"],
      ["End the week with one full oral narration of something read this week.", "Ask: what surprised you in what we read? Start there.", "Write down one narration word-for-word. Read it back to your child."],
      ["Narrate something from your own week — model the habit.", "Read a short poem aloud and ask: what do you see?", "Rest the habit today. Let the week's reading settle."],
      ["Recall one thing from this week's reading together at the table.", "Ask: what stayed with you from this week?", "Rest. Let what was read and heard become part of you."],
    ],
  },
  outdoor: {
    name: "Outdoor Time",
    desc: "Regular time in nature — for movement, observation, and living study.",
    icon: () => (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 5 3-3 4 6H3z"/>
        <circle cx="18" cy="6" r="2"/>
      </svg>
    ),
    daily: [
      ["Go outside before any screens today — even for ten minutes.", "Ask your child to find something living and observe it closely.", "Eat lunch outside if the weather allows."],
      ["Take the read-aloud outside today.", "Ask: what is different outside today than it was last week?", "Let outdoor time be unstructured — no agenda, no narration required."],
      ["Go out after morning time before moving into subjects.", "Find one thing to sketch in your nature journal today.", "Notice the light — where is it coming from? How has it changed?"],
      ["Take a longer outdoor break today — 45 minutes if you can.", "Ask your child to lead the walk. Follow them.", "Record the weather and one observation in your nature journal."],
      ["End the week with an outdoor afternoon — no school, just outside.", "Ask: what have you noticed this week that you hadn't seen before?", "Give your child time to simply play outside without direction."],
      ["Go outside as a family today.", "Find one living thing and look at it until you notice something new.", "Let Saturday's outdoor time be slow and unhurried."],
      ["Rest outside today — sit, breathe, let creation speak.", "Notice one thing in the sky.", "Give thanks for the outdoor world your children are growing up in."],
    ],
  },
  stillness: {
    name: "Stillness",
    desc: "A moment each day of quiet — no screen, no noise, no agenda.",
    icon: () => (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    daily: [
      ["Begin Morning Time with 60 seconds of silence before the hymn.", "Let there be one moment today with no background sound.", "Ask your child to sit still and close their eyes for two minutes."],
      ["After read-aloud, sit quietly for 30 seconds before discussing.", "Practice stillness yourself — model what it looks like.", "Turn off all sound during one subject block today."],
      ["Let outdoor time include five minutes of sitting still and listening.", "After lunch, try a five-minute rest before afternoon work.", "Ask: what did you hear in the quiet today?"],
      ["Begin one subject with a moment of stillness and a breath.", "Give your child permission to sit and do nothing for ten minutes.", "Practice stillness at bedtime — lie quiet before sleep."],
      ["End the school week with five minutes of grateful stillness.", "Ask: where did you find quiet this week?", "Let Friday afternoon be slower and quieter than the rest."],
      ["Let Saturday morning begin in quiet.", "Find one moment of stillness in today's activity.", "Sit outside in silence for five minutes."],
      ["Let Sunday be the fullest expression of this habit.", "Practice Sabbath stillness — unhurried, unscheduled.", "Rest in the quiet. This is the habit in its fullest form."],
    ],
  },
  orderly: {
    name: "Orderly Work",
    desc: "Beginning and finishing a task with care — order as an act of respect.",
    icon: () => (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    daily: [
      ["Ask your child to put away one thing before beginning the next.", "Set out materials before starting — order before work begins.", "End Morning Time by putting the room back to rights together."],
      ["Choose one subject and do it beginning to end without interruption.", "Ask your child to finish what they started before moving on.", "Model orderly work by completing one task fully before starting another."],
      ["Before going outside, tidy the school space together.", "Ask: did you finish what you began today?", "Let chores be done carefully, not just quickly."],
      ["Practice beginning well — a clear space, a settled mind, then begin.", "Ask your child to re-do one thing that was done carelessly.", "End the day by putting everything in its place before dinner."],
      ["Celebrate orderly work — notice and name it when you see it.", "Ask: what did you begin and finish well this week?", "Let Friday be a day of finishing — complete what was left undone."],
      ["Tend your home with care today — order as an act of love.", "Let Saturday chores be done slowly and well.", "Notice the peace that comes from an ordered space."],
      ["Rest in an ordered home today.", "Give thanks for the work of the week — completed and set aside.", "Let Sunday be free of unfinished business."],
    ],
  },
};

export const HABIT_KEYS = ["attention", "narration", "outdoor", "stillness", "orderly"];

// ─── OUTDOOR TRACKER ──────────────────────────────────────────────────────────
const OUTDOOR_GOAL_HOURS = 15;

function OutdoorTracker() {
  const [minutes, setMinutes] = useState(347);
  const hours = Math.floor(minutes / 60);
  const mins  = minutes % 60;
  const pct   = Math.min(minutes / (OUTDOOR_GOAL_HOURS * 60), 1);
  const r = 34, circ = 2 * Math.PI * r, dash = circ * pct;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon.Leaf />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Outside This Week</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--rule)" strokeWidth="5"/>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--sage)" strokeWidth="5"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              style={{ transition: "stroke-dasharray .5s ease" }}/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span className="serif" style={{ fontSize: 15, color: "var(--sage)", lineHeight: 1 }}>
              {hours}<span style={{ fontSize: 10 }}>h</span>
              {mins > 0 && <span>{mins}<span style={{ fontSize: 10 }}>m</span></span>}
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: "var(--ink)", fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>
            {hours >= OUTDOOR_GOAL_HOURS ? "Goal reached this week ✦" : `${OUTDOOR_GOAL_HOURS - hours} hr${mins > 0 ? ` ${60 - mins} min` : ""} to go`}
          </p>
          <p className="caption italic" style={{ marginBottom: 12 }}>Goal: {OUTDOOR_GOAL_HOURS} hrs / week</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(n => (
              <button key={n} onClick={() => setMinutes(m => m + n)}
                style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 2, padding: "5px 10px", fontSize: 11, fontFamily: "'Lato', sans-serif", color: "var(--sage)", cursor: "pointer", letterSpacing: ".06em" }}>
                +{n}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MOTHER CULTURE ───────────────────────────────────────────────────────────
function MotherCulture() {
  const prompts = MOTHER_CULTURE[new Date().getDay()];
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <Icon.Feather />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Mother Culture</p>
      </div>
      {prompts.map((p, i) => (
        <div key={i} style={{
          paddingBottom: i < prompts.length - 1 ? 14 : 0,
          marginBottom:  i < prompts.length - 1 ? 14 : 0,
          borderBottom:  i < prompts.length - 1 ? "1px solid var(--rule)" : "none",
        }}>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{p}</p>
        </div>
      ))}
    </div>
  );
}

// ─── HABIT FOCUS CARD ─────────────────────────────────────────────────────────
function HabitFocusCard({ activeHabit, onNavigate }) {
  const habit  = HABIT_PROMPTS[activeHabit];
  const HIcon  = habit.icon;
  const day    = new Date().getDay();
  const prompts = habit.daily[day];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <Icon.Sprout />
        <p className="eyebrow" style={{ marginBottom: 0 }}>Habit in Focus</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <HIcon />
        <p className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{habit.name}</p>
      </div>
      {prompts.map((p, i) => (
        <div key={i} style={{
          paddingBottom: i < prompts.length - 1 ? 12 : 0,
          marginBottom:  i < prompts.length - 1 ? 12 : 0,
          borderBottom:  i < prompts.length - 1 ? "1px solid var(--rule)" : "none",
        }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8 }}>{p}</p>
        </div>
      ))}
      <button
        onClick={() => onNavigate("habits")}
        style={{ background: "none", border: "none", cursor: "pointer", marginTop: 16, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)" }}>
        Change habit focus →
      </button>
    </div>
  );
}

// ─── TODAY'S SCHEDULE ─────────────────────────────────────────────────────────
const FREE_BLOCK_KEYWORDS = ["rise & shine", "rise and shine", "free", "rest", "independent", "chores", "piano", "outdoor", "nature", "afternoon"];
const isFreeBlock = (subject) => FREE_BLOCK_KEYWORDS.some(k => subject.toLowerCase().includes(k));

function TodaySchedule({ today, blocks, onNavigate }) {
  const [items, setItems]       = useState(blocks.map((b, i) => ({ ...b, id: i, status: "pending", motherNote: "" })));
  const [editingNote, setEditingNote] = useState(null);
  const longPressTimer = useRef(null);

  const toggleDone = (id) => {
    setItems(prev => {
      const target = prev.find(b => b.id === id);
      if (!target || target.status === "skipped") return prev;
      if (target.status === "done") {
        return prev.map(b => b.id === id ? { ...b, status: "pending" } : b).sort((a, b) => a.id - b.id);
      }
      const updated = prev.map(b => b.id === id ? { ...b, status: "done" } : b);
      return [...updated.filter(b => b.status === "pending"), ...updated.filter(b => b.status !== "pending")];
    });
  };

  const markSkipped = (id) => {
    setItems(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: "skipped" } : b);
      return [...updated.filter(b => b.status === "pending"), ...updated.filter(b => b.status !== "pending")];
    });
  };

  const saveNote = (id, note) => { setItems(prev => prev.map(b => b.id === id ? { ...b, motherNote: note } : b)); setEditingNote(null); };
  const startLongPress = (id) => { longPressTimer.current = setTimeout(() => { cancelLongPress(); markSkipped(id); }, 600); };
  const cancelLongPress = () => clearTimeout(longPressTimer.current);

  return (
    <div style={{ marginBottom: 32 }}>
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

      {items.map(b => {
        const isDone = b.status === "done", isSkipped = b.status === "skipped";
        const showMother = isFreeBlock(b.subject) && !isSkipped;
        return (
          <div key={b.id} style={{ borderBottom: "1px solid var(--rule)" }}>
            <div
              onClick={() => toggleDone(b.id)}
              onTouchStart={() => { if (b.status === "pending") startLongPress(b.id); }}
              onTouchEnd={cancelLongPress}
              onMouseDown={() => { if (b.status === "pending") startLongPress(b.id); }}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "13px 0 6px", cursor: b.status !== "skipped" ? "pointer" : "default", opacity: isDone ? 0.38 : isSkipped ? 0.5 : 1, transition: "opacity .4s ease" }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 7, flexShrink: 0, background: isDone ? "var(--sage)" : isSkipped ? "var(--gold)" : "transparent", border: isDone || isSkipped ? "none" : "1.5px solid var(--rule)", transition: "all .3s ease" }} />
              <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}>{b.time}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, color: isDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)", transition: "all .3s ease" }}>
                  {b.subject}
                </p>
                {isSkipped && <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>skipped today</p>}
                {b.note && !isSkipped && <p className="caption italic" style={{ marginTop: 2 }}>{b.note}</p>}
                {isDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 3 }}>tap to undo</p>}
              </div>
            </div>
            {showMother && (
              <div style={{ paddingLeft: 58, paddingBottom: 10 }} onClick={e => e.stopPropagation()}>
                {editingNote === b.id ? (
                  <input autoFocus defaultValue={b.motherNote}
                    placeholder="What will you tend during this time?"
                    onBlur={e => saveNote(b.id, e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                    style={{ flex: 1, background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0", width: "100%" }}
                  />
                ) : (
                  <button onClick={() => setEditingNote(b.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", padding: 0, textAlign: "left", opacity: b.motherNote ? 1 : 0.55 }}>
                    {b.motherNote ? `✦ ${b.motherNote}` : "your time · what will you tend?"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <p className="caption italic" style={{ marginTop: 14, textAlign: "center" }}>Tap to complete · Tap again to undo · Hold to skip</p>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
export default function HomeScreen({ onNavigate }) {
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayIndex  = Math.min(Math.max(new Date().getDay() - 1, 0), 4);
  const today       = DAYS[todayIndex] || "Monday";
  const todayBlocks = DAY_SCHEDULE[today] || DAY_SCHEDULE.Monday;

  // Active habit — in real app this would come from persistent storage
  // Default to "attention" until parent chooses
  const [activeHabit] = useState("attention");

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>{greeting},<br />Kim.</h1>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", marginBottom: 28 }}>Begin with what is in front of you.</p>

      <OutdoorTracker />

      <div style={{ height: 1, background: "var(--rule)", margin: "4px 0 28px" }} />

      <MotherCulture />

      <div style={{ height: 1, background: "var(--rule)", margin: "0 0 28px" }} />

      <HabitFocusCard activeHabit={activeHabit} onNavigate={onNavigate} />

      <div style={{ height: 1, background: "var(--rule)", margin: "0 0 28px" }} />

      <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} />

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Icon.Book />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Quick Begin</p>
        </div>
        <button className="btn-text" onClick={() => onNavigate("narration")}>Write a Narration</button>
        <button className="btn-text" onClick={() => onNavigate("lilies")}>Open Consider the Lilies</button>
        <button className="btn-text" onClick={() => onNavigate("outdoors")}>Step Outside</button>
      </div>
    </div>
  );
}
