// ─── SEED DATA ────────────────────────────────────────────────────────────────

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const DAY_SCHEDULE = {
  Monday: [
    { subject: "Morning Time",    time: "8:30",  note: "Hymn, poetry, Scripture" },
    { subject: "Science",         time: "9:15",  note: "Nature Explorers — Botany unit" },
    { subject: "Spanish with Sophie", time: "10:00", note: "Oral lesson, Viviendo en Español" },
    { subject: "Living Literature",   time: "10:45", note: "Macbeth — Act II read-aloud" },
    { subject: "Afternoon Rest",  time: "1:00",  note: "" },
  ],
  Tuesday: [
    { subject: "Morning Time",    time: "8:30",  note: "Hymn, poetry, Scripture" },
    { subject: "Historical Fiction", time: "9:15", note: "Read-aloud: Johnny Tremain" },
    { subject: "Co-op — CHISPA", time: "10:30", note: "Living Literature & Language class" },
    { subject: "Math",            time: "2:00",  note: "" },
  ],
  Wednesday: [
    { subject: "Morning Time",    time: "8:30",  note: "Hymn, poetry, Scripture" },
    { subject: "History Spine",   time: "9:15",  note: "Story of the World Vol. 3" },
    { subject: "Composer Study",  time: "10:30", note: "Handel — listening & narration" },
    { subject: "Free Afternoon",  time: "1:00",  note: "Ranch chores, art, outdoor time" },
  ],
  Thursday: [
    { subject: "Morning Time",    time: "8:30",  note: "Hymn, poetry, Scripture" },
    { subject: "Writing",         time: "9:15",  note: "Find It · Follow It · Frame It draft" },
    { subject: "Co-op — BACH",   time: "10:30", note: "Living Literature & Language" },
    { subject: "Math",            time: "2:00",  note: "" },
  ],
  Friday: [
    { subject: "Morning Time",    time: "8:30",  note: "Hymn, poetry, Scripture" },
    { subject: "Geography",       time: "9:15",  note: "Draw the World — Europe" },
    { subject: "Spanish with Sophie", time: "10:30", note: "" },
    { subject: "Nature Study",    time: "1:00",  note: "Outdoor observation — sketch & narrate" },
    { subject: "Lilies Journal",  time: "2:30",  note: "" },
  ],
};

export const HABITS = [
  { id: 1, name: "Attention",    desc: "Gave full focus to one thing at a time",       emoji: "👁" },
  { id: 2, name: "Narration",    desc: "Told back what was read or heard",              emoji: "🗣" },
  { id: 3, name: "Outdoor Time", desc: "Spent time in nature",                          emoji: "🌿" },
  { id: 4, name: "Stillness",    desc: "A moment of quiet — no screen, no noise",       emoji: "🕊" },
  { id: 5, name: "Orderly Work", desc: "Began and finished a task with care",           emoji: "📖" },
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
  { num: "I",   title: "Consider the Lilies", sub: "Commonplace & journal",         screen: "lilies"   },
  { num: "II",  title: "Outdoors",            sub: "Nature study & observation",     screen: "outdoors" },
  { num: "III", title: "Habit Trainer",       sub: "Five foundational habits",       screen: "habits"   },
  { num: "IV",  title: "Students",            sub: "Profiles & narration history",   screen: "students" },
];

export const NARRATION_STAGES = ["find", "follow", "frame"];

export const NARRATION_STAGE_LABELS = {
  find:   "Find It",
  follow: "Follow It",
  frame:  "Frame It",
};

export const NARRATION_STAGE_PROMPTS = {
  find:   "In your own words — tell back what happened. Begin anywhere.",
  follow: "Now go deeper. What detail, image, or moment matters most, and why?",
  frame:  "Step back. What does this passage or chapter mean in the larger story? What is the author doing?",
};
