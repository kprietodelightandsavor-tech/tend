// ─── WEEKEND RHYTHMS ──────────────────────────────────────────────────────────
// Add these exports to your existing src/data/seed.js file
// (paste at the bottom, before the last line)

// Update DAYS to include weekend:
// export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// 6 rotating Saturday rhythms — cycles by week number
export const SATURDAY_RHYTHMS = [
  {
    theme: "Tend the Land",
    quote: "There is no part of a child's education more important than that she should know how things grow.",
    items: [
      { time: "Morning",   label: "Chores done slowly and well",    note: "Order as an act of love — tend the home together before the day opens." },
      { time: "Mid-morning", label: "Outdoor time",                 note: "Go outside with no agenda. Let the children wander and notice." },
      { time: "Afternoon", label: "Nature journaling",              note: "Sketch one thing from today's walk. Date it. That is enough." },
      { time: "Evening",   label: "Free unstructured time",         note: "Linger. There is nowhere to be." },
    ],
  },
  {
    theme: "Make Something",
    quote: "Let the children have long days of unscheduled time to wander, wonder, and create.",
    items: [
      { time: "Morning",   label: "Chores done slowly and well",    note: "Begin the day in order. Tend the home gently." },
      { time: "Mid-morning", label: "Handicrafts or creative work", note: "Knitting, painting, building, sewing — follow what calls to you." },
      { time: "Afternoon", label: "Cooking together",               note: "Make something from scratch. Let the kitchen be the classroom." },
      { time: "Evening",   label: "Screen time",                    note: "A good film or show — chosen with care, watched together." },
    ],
  },
  {
    theme: "Go Outside",
    quote: "Never be within doors when you can rightly be without.",
    items: [
      { time: "Morning",   label: "Outdoor time",                   note: "Begin outside — even for twenty minutes before anything else." },
      { time: "Mid-morning", label: "Nature journaling",            note: "One observation, one sketch. The habit is the thing." },
      { time: "Afternoon", label: "Free unstructured time",         note: "Unscheduled afternoon. Let them be bored. Let them find their way." },
      { time: "Evening",   label: "Cooking together",               note: "Simple supper made by many hands." },
    ],
  },
  {
    theme: "Slow Saturday",
    quote: "We cannot give our children too much time for quiet growth.",
    items: [
      { time: "Morning",   label: "Free unstructured time",         note: "Sleep in. Linger over breakfast. Begin nothing in a hurry." },
      { time: "Mid-morning", label: "Chores done slowly and well",  note: "Tend what needs tending — without rushing." },
      { time: "Afternoon", label: "Handicrafts or creative work",   note: "Something with hands. Something quiet and focused." },
      { time: "Evening",   label: "Screen time",                    note: "An evening film — something beautiful, something worth watching." },
    ],
  },
  {
    theme: "Kitchen & Garden",
    quote: "The imagination needs food above all things — and so does the body.",
    items: [
      { time: "Morning",   label: "Outdoor time",                   note: "Garden, yard, pasture — time outside before the heat of the day." },
      { time: "Mid-morning", label: "Cooking together",             note: "Bake bread, make soup, preserve something. Let them learn by doing." },
      { time: "Afternoon", label: "Free unstructured time",         note: "Books, play, rest — whatever they choose." },
      { time: "Evening",   label: "Nature journaling",              note: "Sketch what is blooming or growing near you this week." },
    ],
  },
  {
    theme: "Make & Wander",
    quote: "To be wholly devoted to some intellectual exercise is to have succeeded in life.",
    items: [
      { time: "Morning",   label: "Handicrafts or creative work",   note: "A morning project — art, building, music, writing for pleasure." },
      { time: "Mid-morning", label: "Outdoor time",                 note: "Go somewhere new if you can. A different trail, a different park." },
      { time: "Afternoon", label: "Cooking together",               note: "An afternoon in the kitchen — something special for Sunday." },
      { time: "Evening",   label: "Screen time",                    note: "Rest. A film, a show, an evening of ease." },
    ],
  },
];

// Sunday is always Sabbath-anchored — 4 gentle rotating variations
export const SUNDAY_RHYTHMS = [
  {
    theme: "The Lord's Day",
    quote: "Rest is its own form of attention — give it fully today.",
    items: [
      { time: "Morning",   label: "Church / worship",               note: "Let Sunday be what it is meant to be." },
      { time: "Midday",    label: "Slow Sunday lunch",              note: "Linger at the table. No hurry. Good food, good conversation." },
      { time: "Afternoon", label: "Outdoor time",                   note: "A walk after lunch — unhurried, with no destination." },
      { time: "Evening",   label: "Free unstructured time",         note: "Books, rest, music. Let the day close gently." },
    ],
  },
  {
    theme: "Sabbath Rest",
    quote: "The rhythm rests so it can return stronger.",
    items: [
      { time: "Morning",   label: "Church / worship",               note: "Gathered worship — the anchor of the week." },
      { time: "Midday",    label: "Cooking together",               note: "Sunday lunch made with love and unhurried hands." },
      { time: "Afternoon", label: "Free unstructured time",         note: "Nap, read, sit outside. Simply be." },
      { time: "Evening",   label: "Prepare for Monday",             note: "Light preparation — gather books, set the table for morning. A gentle close." },
    ],
  },
  {
    theme: "A Day Apart",
    quote: "In returning and rest you shall be saved; in quietness and trust is your strength.",
    items: [
      { time: "Morning",   label: "Church / worship",               note: "Corporate worship — receive what you cannot give yourself." },
      { time: "Midday",    label: "Outdoor time",                   note: "A long walk or time outside after church. Fresh air before rest." },
      { time: "Afternoon", label: "Free unstructured time",         note: "Afternoon rest — truly rest. Do not fill it with productivity." },
      { time: "Evening",   label: "Screen time",                    note: "A gentle film or music to close the Sabbath." },
    ],
  },
  {
    theme: "Rest & Restore",
    quote: "Give thanks for the week completed and the week ahead not yet begun.",
    items: [
      { time: "Morning",   label: "Church / worship",               note: "Begin the day gathered." },
      { time: "Midday",    label: "Slow Sunday lunch",              note: "Your best meal of the week. Made together. Eaten slowly." },
      { time: "Afternoon", label: "Nature journaling",              note: "A quiet Sunday sketch — something from the week just past." },
      { time: "Evening",   label: "Free unstructured time",         note: "The week ends here. Let it be still." },
    ],
  },
];

// Helper — get this week's Saturday rhythm based on week number
// Usage: getSaturdayRhythm(userData.week) 
export const getSaturdayRhythm = (week = 1) =>
  SATURDAY_RHYTHMS[(week - 1) % SATURDAY_RHYTHMS.length];

export const getSundayRhythm = (week = 1) =>
  SUNDAY_RHYTHMS[(week - 1) % SUNDAY_RHYTHMS.length];
