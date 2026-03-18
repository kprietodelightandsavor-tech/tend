// ─── SEED DATA ────────────────────────────────────────────────────────────────

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ─── BEAUTY LOOP (per day — different each day, resets daily) ─────────────────
export const BEAUTY_LOOP = {
  Monday: [
    { id: "bl-m-1", label: "Artist & Picture Study" },
    { id: "bl-m-2", label: "Poet & Poetry Study" },
  ],
  Tuesday: [
    { id: "bl-t-1", label: "Composer Study" },
  ],
  Wednesday: [
    { id: "bl-w-1", label: "Biography or Citizenship" },
    { id: "bl-w-2", label: "Folk Song" },
  ],
  Thursday: [], // Full co-op day — no Beauty Loop
  Friday: [
    { id: "bl-f-1", label: "Hymn Study", note: "Introduce this term's hymn — it will carry through morning alarms." },
    { id: "bl-f-2", label: "Recitation" },
  ],
};

// ─── DAILY SCHEDULE ───────────────────────────────────────────────────────────
export const DAY_SCHEDULE = {
  Monday: [
    // Rise & Shine
    { id: "m-1",  subject: "Wake Up & Morning Chores",      time: "7:30", note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "m-2",  subject: "Piano",                         time: "8:00", note: "15 minutes independent practice", free: true },
    { id: "m-3",  subject: "Teaching Textbooks — Math",     time: "8:15", note: "One lesson", free: true },
    { id: "m-4",  subject: "Reading",                       time: "8:35", note: "20 minutes — Epic or assigned book", free: true },
    { id: "m-5",  subject: "Writing",                       time: "8:55", note: "Rise & Shine writing block", free: true },
    // Morning Time
    { id: "m-6",  subject: "Bible & Memory Work",           time: "9:00", note: "A Gentle Feast · Simply Charlotte Mason verses" },
    // Living Literature
    { id: "m-7",  subject: "Living Literature",             time: "9:15", note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    // First Rotation
    { id: "m-8",  subject: "Language Arts & Math",          time: "10:30", note: "First subject rotation" },
    // Nature Study
    { id: "m-9",  subject: "Nature Study",                  time: "11:45", note: "Outdoor observation — sketch & narrate" },
    // Lunch
    { id: "m-10", subject: "Lunch",                         time: "12:00", note: "", free: true },
    // Second Rotation
    { id: "m-11", subject: "Science",                       time: "1:00", note: "Nature Explorers or current science unit" },
    { id: "m-12", subject: "Commonplace Book",              time: "1:45", note: "Copywork from today's reading + drawing" },
    // Spanish
    { id: "m-13", subject: "Spanish",                       time: "2:30", note: "Spanish with Sophie" },
  ],
  Tuesday: [
    { id: "t-1",  subject: "Wake Up & Morning Chores",      time: "7:30", note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "t-2",  subject: "Piano",                         time: "8:00", note: "15 minutes independent practice", free: true },
    { id: "t-3",  subject: "Teaching Textbooks — Math",     time: "8:15", note: "One lesson", free: true },
    { id: "t-4",  subject: "Reading",                       time: "8:35", note: "20 minutes — Epic or assigned book", free: true },
    { id: "t-5",  subject: "Copywork",                      time: "8:55", note: "Rise & Shine copywork block", free: true },
    { id: "t-6",  subject: "Bible & Memory Work",           time: "9:00", note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "t-7",  subject: "Living Literature",             time: "9:15", note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "t-8",  subject: "Language Arts & Math",          time: "10:30", note: "First subject rotation" },
    { id: "t-9",  subject: "Nature Study",                  time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "t-10", subject: "Lunch",                         time: "12:00", note: "", free: true },
    { id: "t-11", subject: "Historical Fiction",            time: "1:00", note: "Read-aloud historical fiction" },
    { id: "t-12", subject: "Math — Independent Study",      time: "1:45", note: "Independent work for students not in math lesson" },
    { id: "t-13", subject: "Spanish",                       time: "2:30", note: "Spanish with Sophie" },
  ],
  Wednesday: [
    { id: "w-1",  subject: "Wake Up & Morning Chores",      time: "7:30", note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "w-2",  subject: "Piano",                         time: "8:00", note: "15 minutes independent practice", free: true },
    { id: "w-3",  subject: "Teaching Textbooks — Math",     time: "8:15", note: "One lesson", free: true },
    { id: "w-4",  subject: "Reading",                       time: "8:35", note: "20 minutes — Epic or assigned book", free: true },
    { id: "w-5",  subject: "Writing",                       time: "8:55", note: "Rise & Shine writing block", free: true },
    { id: "w-6",  subject: "Bible & Memory Work",           time: "9:00", note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "w-7",  subject: "Living Literature",             time: "9:15", note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "w-8",  subject: "Language Arts & Math",          time: "10:30", note: "First subject rotation" },
    { id: "w-9",  subject: "Nature Study",                  time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "w-10", subject: "Lunch",                         time: "12:00", note: "", free: true },
    { id: "w-11", subject: "History Spine",                 time: "1:00", note: "Story of the World or current history spine" },
    { id: "w-12", subject: "Math — Independent Study",      time: "1:45", note: "Independent work for students not in math lesson" },
  ],
  Thursday: [
    { id: "th-1", subject: "Wake Up & Morning Chores",      time: "7:30", note: "Get dressed, feed animals, pack for co-op", free: true },
    { id: "th-2", subject: "Piano",                         time: "8:00", note: "15 minutes independent practice", free: true },
    { id: "th-3", subject: "Teaching Textbooks — Math",     time: "8:15", note: "One lesson", free: true },
    { id: "th-4", subject: "Reading",                       time: "8:35", note: "20 minutes — Epic or assigned book", free: true },
    { id: "th-5", subject: "Copywork",                      time: "8:55", note: "Rise & Shine copywork block", free: true },
    { id: "th-6", subject: "Bible & Memory Work",           time: "9:00", note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "th-7", subject: "Co-op — BACH",                  time: "10:30", note: "Full co-op day — Living Literature & Language" },
  ],
  Friday: [
    { id: "f-1",  subject: "Wake Up & Morning Chores",      time: "7:30", note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "f-2",  subject: "Piano",                         time: "8:00", note: "15 minutes independent practice", free: true },
    { id: "f-3",  subject: "Teaching Textbooks — Math",     time: "8:15", note: "One lesson", free: true },
    { id: "f-4",  subject: "Reading",                       time: "8:35", note: "20 minutes — Epic or assigned book", free: true },
    { id: "f-5",  subject: "Writing",                       time: "8:55", note: "Rise & Shine writing block", free: true },
    { id: "f-6",  subject: "Bible & Memory Work",           time: "9:00", note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "f-7",  subject: "Living Literature",             time: "9:15", note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "f-8",  subject: "Language Arts & Math",          time: "10:30", note: "First subject rotation" },
    { id: "f-9",  subject: "Nature Study",                  time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "f-10", subject: "Lunch",                         time: "12:00", note: "", free: true },
    { id: "f-11", subject: "Geography",                     time: "1:00", note: "Draw the World — current unit" },
    { id: "f-12", subject: "Math — Independent Study",      time: "1:45", note: "Independent work for students not in math lesson" },
    { id: "f-13", subject: "History Timeline",              time: "1:45", note: "Add to our Book of Centuries or timeline" },
    { id: "f-14", subject: "Spanish",                       time: "2:30", note: "Spanish with Sophie" },
  ],
};

// ─── TERM SETTINGS ────────────────────────────────────────────────────────────
export const TERM_SETTINGS = {
  currentTerm: 2,
  currentWeek: 8,
  totalWeeks:  12,
  startDate:   "2024-08-15",
};

// ─── REST WEEK SUGGESTIONS ────────────────────────────────────────────────────
export const REST_WEEK_SUGGESTIONS = [
  "Tend your home slowly today — a clean, ordered space is its own kind of rest.",
  "Read something just for pleasure. Let the children do the same.",
  "Go outside with no agenda. Let the day be unscheduled and unhurried.",
  "Visit somewhere beautiful — a library, a garden, a trail, a museum.",
  "Cook something together. Let the kitchen be the classroom today.",
  "Write in your journal. Let the children write or draw in theirs.",
  "Pursue a creative project — something with your hands, at your own pace.",
  "Visit somewhere in your community — a farm, a historic site, a nature center.",
  "Rest fully. Do not fill the day with school-adjacent activities. Simply rest.",
  "Let the children lead the day — follow their curiosity wherever it goes.",
];

// ─── HABITS ───────────────────────────────────────────────────────────────────
export const HABITS = [
  { id: 1, name: "Attention",    desc: "Gave full focus to one thing at a time",  emoji: "👁" },
  { id: 2, name: "Narration",    desc: "Told back what was read or heard",         emoji: "🗣" },
  { id: 3, name: "Outdoor Time", desc: "Spent time in nature",                     emoji: "🌿" },
  { id: 4, name: "Stillness",    desc: "A moment of quiet — no screen, no noise",  emoji: "🕊" },
  { id: 5, name: "Orderly Work", desc: "Began and finished a task with care",      emoji: "📖" },
];

export const NARRATION_PROMPTS = [
  "Tell what stayed with you.",
  "Say back what happened, simply and in order.",
  "What image has stayed with you?",
  "Begin anywhere. Follow the thread.",
  "What did you see that you had not noticed before?",
];

export const STUDENTS = [
  { id: 1, name: "Nico",   color: "#7A8F6F", initial: "N", grade: "11th" },
  { id: 2, name: "Emma",   color: "#B8935A", initial: "E", grade: "9th"  },
  { id: 3, name: "Marcos", color: "#8A7A9E", initial: "M", grade: "7th"  },
];

export const STUDENT_NARRATIONS = {
  1: [{ date: "March 14", text: "Macbeth sees the dagger and isn't sure if it's real. He follows it. Shakespeare shows how guilt can make you see things that aren't there.", stage: "Frame It", book: "Macbeth" }],
  2: [{ date: "March 13", text: "The dagger leads him toward Duncan's room. He knows what he's about to do is wrong but he goes anyway.", stage: "Follow It", book: "Macbeth" }],
  3: [{ date: "March 12", text: "Macbeth talks to himself a lot. He seems scared of what he's going to do.", stage: "Find It", book: "Macbeth" }],
};

export const LILY_ENTRIES = [
  { id: 1, date: "March 14", quote: "We do not need to teach children to think; only give them the opportunity.", source: "Charlotte Mason", reflection: "This grounded me when I was overcomplicating things." },
  { id: 2, date: "March 10", quote: "The imagination needs food above all things.", source: "Charlotte Mason, Vol. 1", reflection: "" },
  { id: 3, date: "March 6",  quote: "To be wholly devoted to some intellectual exercise is to have succeeded in life.", source: "Robert Louis Stevenson", reflection: "A worthy ambition." },
];

export const OUTDOOR_SUGGESTIONS = [
  "Look for movement",
  "Notice something small",
  "Follow a pattern",
  "Listen before you look",
  "Find where light falls",
  "Sketch one thing exactly as it is",
];

export const CHAPTERS = [
  { num: "I",   title: "Consider the Lilies", sub: "Commonplace & journal",        screen: "lilies"   },
  { num: "II",  title: "Outdoors",            sub: "Nature study & observation",    screen: "outdoors" },
  { num: "III", title: "Habit Formation",     sub: "The tended life",               screen: "habits"   },
  { num: "IV",  title: "Students",            sub: "Profiles & narration history",  screen: "students" },
];

export const NARRATION_STAGES      = ["find", "follow", "frame"];
export const NARRATION_STAGE_LABELS = { find: "Find It", follow: "Follow It", frame: "Frame It" };
export const NARRATION_STAGE_PROMPTS = {
  find:   "In your own words — tell back what happened. Begin anywhere.",
  follow: "Now go deeper. What detail, image, or moment matters most, and why?",
  frame:  "Step back. What does this passage or chapter mean in the larger story? What is the author doing?",
};
