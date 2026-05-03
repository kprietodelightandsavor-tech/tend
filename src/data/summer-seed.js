// src/data/summer-seed.js
// Summer rhythm data — separate from school-year seed.js so summer mode
// can be toggled cleanly without affecting your built-out school year data.

export const SUMMER_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─────────────────────────────────────────────────────────────────────
// DAILY ANCHORS — every day, no times attached
// Rendered as a checklist card at the top of HomeScreen
// ─────────────────────────────────────────────────────────────────────
export const SUMMER_DAILY_ANCHORS = [
  { id: "anchor-phones", label: "Phones on the counter (until 2pm)", note: "Yours included, after 8:30am." },
  { id: "anchor-breakfast", label: "Breakfast" },
  { id: "anchor-beds", label: "Beds made" },
  { id: "anchor-chores", label: "Animal chores · 10 minutes outside before breakfast", note: "Outdoor light first sets your circadian rhythm — you'll feel tired ~16 hours from now." },
  { id: "anchor-outside", label: "Outside before it gets hot" },
];

// ─────────────────────────────────────────────────────────────────────
// PERSONAL MORNING SEQUENCE — yours, every day
// Rendered as a small eyebrow strip at top of HomeScreen
// ─────────────────────────────────────────────────────────────────────
export const SUMMER_PERSONAL_MORNING = [
  { time: "6:30 – 8:00", label: "Coffee & creative work" },
  { time: "8:00 – 9:00", label: "Fitness" },
  { time: "By dressed", label: "Available to the kids" },
];

// ─────────────────────────────────────────────────────────────────────
// SCHEDULE BY DAY — Monday through Friday
// ─────────────────────────────────────────────────────────────────────
export const SUMMER_DAY_SCHEDULE = {
  Monday: [
    { id: "mon-tennis", time: "Morning", subject: "Tennis or Flex", note: "Tennis if it's a tennis morning, otherwise flex." },
    { id: "mon-afternoon", time: "Afternoon", subject: "Free Afternoon", free: true, note: "Phones return at 2pm." },
  ],

  // Tuesday is dynamic — chosen at runtime by getTuesdayMode()
  Tuesday_school: [
    { id: "tue-readaloud", time: "10:00", subject: "Read-Aloud" },
    { id: "tue-bible", time: "", subject: "Bible" },
    { id: "tue-poetry", time: "", subject: "Poetry", beauty: true },
    { id: "tue-math", time: "", subject: "Math" },
    { id: "tue-rotation", time: "", subject: "History · Science · Geography", note: "Pick one." },
    { id: "tue-lunch", time: "", subject: "Lunch", free: true },
    { id: "tue-free", time: "Until 2:00", subject: "Free", free: true, note: "Phones return at 2pm." },
  ],

  Tuesday_volunteer: [
    { id: "tue-volunteer", time: "Morning", subject: "Volunteer" },
    { id: "tue-vlunch", time: "", subject: "Lunch", free: true },
    { id: "tue-vfree", time: "Until 2:00", subject: "Free", free: true, note: "Phones return at 2pm." },
  ],

  Wednesday: [
    { id: "wed-readaloud", time: "10:00", subject: "Read-Aloud" },
    { id: "wed-bible", time: "", subject: "Bible" },
    { id: "wed-nature", time: "", subject: "Nature Study", beauty: true, note: "Outdoor chores before indoor work — sunlight in your eyes early sets your sleep tonight." },
    { id: "wed-math", time: "", subject: "Math" },
    { id: "wed-rotation", time: "", subject: "History · Science · Geography", note: "Pick one." },
    { id: "wed-lunch", time: "", subject: "Lunch", free: true },
    { id: "wed-free", time: "Until 2:00", subject: "Free", free: true, note: "Phones return at 2pm." },
  ],

  Thursday: [
    { id: "thu-flex", time: "All day", subject: "Co-op · Swim · River", note: "No morning anchors needed today." },
  ],

  Friday: [
    { id: "fri-readaloud", time: "10:00", subject: "Read-Aloud" },
    { id: "fri-bible", time: "", subject: "Bible" },
    { id: "fri-folksong", time: "", subject: "Folk Song or Hymn", beauty: true },
    { id: "fri-math", time: "", subject: "Math" },
    { id: "fri-rotation", time: "", subject: "History · Science · Geography", note: "Pick one." },
    { id: "fri-lunch", time: "", subject: "Lunch", free: true },
    { id: "fri-free", time: "Until 2:00", subject: "Free", free: true, note: "Phones return at 2pm." },
  ],
};

// ─────────────────────────────────────────────────────────────────────
// TUESDAY ALTERNATION
// Volunteer Tuesdays start May 26, 2026, then every other Tuesday.
// ─────────────────────────────────────────────────────────────────────
const VOLUNTEER_BASELINE = new Date("2026-05-26T00:00:00");

export function getTuesdayMode(date = new Date()) {
  // Number of weeks since baseline
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSince = Math.floor((date - VOLUNTEER_BASELINE) / msPerWeek);
  // Even weeks = volunteer, odd = school
  return weeksSince % 2 === 0 ? "volunteer" : "school";
}

export function getTuesdayBlocks(date = new Date()) {
  const mode = getTuesdayMode(date);
  return mode === "volunteer" ? SUMMER_DAY_SCHEDULE.Tuesday_volunteer : SUMMER_DAY_SCHEDULE.Tuesday_school;
}

// ─────────────────────────────────────────────────────────────────────
// WEEKEND CATEGORIES — same five both Saturday and Sunday
// User picks 1 or 2 to do; rest are gracefully ignored.
// ─────────────────────────────────────────────────────────────────────
export const SUMMER_WEEKEND_CATEGORIES = [
  {
    id: "family",
    label: "Family",
    note: "Something together — table, trail, story, song.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "creativity",
    label: "Creativity",
    note: "Hands making something — paint, paper, dough, dirt.",
    icon: "🎨",
  },
  {
    id: "body",
    label: "Body",
    note: "Movement that feels good — ride, swim, walk, stretch.",
    icon: "🧘",
  },
  {
    id: "horses",
    label: "Horses",
    note: "Time with the herd — groom, ride, watch, feed.",
    icon: "🐴",
  },
  {
    id: "ranch",
    label: "Ranch",
    note: "Tending the place — fence, garden, fix, plant.",
    icon: "🌾",
  },
];

// ─────────────────────────────────────────────────────────────────────
// MORNING ACTIVITY RESERVOIR — 25 simple, screen-free ideas
// 1980s summer + Charlotte Mason handicrafts + Waldorf nature + plain fun
// "Setup tonight" notes are intentionally low-effort.
// ─────────────────────────────────────────────────────────────────────
export const SUMMER_MORNING_ACTIVITIES = [
  {
    id: "act-fairy",
    label: "Fairy house in the yard",
    setup: "Put a basket on the porch with bark, moss, twigs, acorns.",
    kidsNeed: "A shady spot at the base of a tree.",
  },
  {
    id: "act-chalk",
    label: "Sidewalk chalk world",
    setup: "Set chalk + a cup of water (for blending) by the back door.",
    kidsNeed: "Driveway or patio.",
  },
  {
    id: "act-mud",
    label: "Mud kitchen",
    setup: "Old pots and wooden spoons in a tub outside, hose nearby.",
    kidsNeed: "Permission to get muddy.",
  },
  {
    id: "act-scavenger",
    label: "Nature scavenger hunt",
    setup: "Egg carton labeled with colors or shapes — they fill it.",
    kidsNeed: "Yard or trail.",
  },
  {
    id: "act-water",
    label: "Water painting the fence",
    setup: "Bucket of water + house-paintbrushes by the porch.",
    kidsNeed: "Anything dry to 'paint.'",
  },
  {
    id: "act-flowers",
    label: "Flower pressing",
    setup: "Heavy book + sheets of plain paper open on the table.",
    kidsNeed: "A flower walk first.",
  },
  {
    id: "act-fort",
    label: "Blanket fort under the trees",
    setup: "Pile a stack of old sheets and clothespins outside.",
    kidsNeed: "Trees, fence, or chairs to drape over.",
  },
  {
    id: "act-rocks",
    label: "Rock painting",
    setup: "Bowl of smooth rocks + acrylic paints + brushes on porch.",
    kidsNeed: "Time to dry in the sun.",
  },
  {
    id: "act-stickforts",
    label: "Stick fort building",
    setup: "Nothing — just point at a corner of the yard.",
    kidsNeed: "Fallen branches.",
  },
  {
    id: "act-lemonade",
    label: "Lemonade stand prep",
    setup: "Set out lemons, sugar, pitcher, paper for a sign.",
    kidsNeed: "An audience (siblings, you, a dog).",
  },
  {
    id: "act-bugs",
    label: "Bug observation",
    setup: "Magnifying glass + small jar with holes in lid on counter.",
    kidsNeed: "Patience and a clover patch.",
  },
  {
    id: "act-knitting",
    label: "Finger knitting",
    setup: "Skein of yarn looped on the chair where they sit.",
    kidsNeed: "10 minutes of you showing them once.",
  },
  {
    id: "act-bird",
    label: "Bird-watching from the porch",
    setup: "Binoculars + bird book on the porch railing.",
    kidsNeed: "Quiet voices, a snack.",
  },
  {
    id: "act-collage",
    label: "Nature collage",
    setup: "Glue stick + cardboard piece + bowl on the table.",
    kidsNeed: "A morning walk to fill the bowl.",
  },
  {
    id: "act-fishing",
    label: "Pretend fishing",
    setup: "Stick + string + paper-clip hook tied tonight.",
    kidsNeed: "A bucket as the 'pond.'",
  },
  {
    id: "act-wash",
    label: "Wash the bikes (or the dog)",
    setup: "Bucket + sponge + bottle of soap by the hose.",
    kidsNeed: "A bike, a dog, or a fence to scrub.",
  },
  {
    id: "act-bake",
    label: "Make biscuits or banana bread",
    setup: "Recipe card + dry ingredients pre-measured in a bowl.",
    kidsNeed: "An apron and your patience.",
  },
  {
    id: "act-letters",
    label: "Letter to a grandparent",
    setup: "Stationery + stamp + pen on the table.",
    kidsNeed: "An address.",
  },
  {
    id: "act-skip",
    label: "Jump rope or hopscotch",
    setup: "Rope coiled by the door + chalk for grid.",
    kidsNeed: "A flat surface.",
  },
  {
    id: "act-leaf",
    label: "Leaf rubbings",
    setup: "Crayons (peeled) + paper on a clipboard outside.",
    kidsNeed: "Different leaves to collect.",
  },
  {
    id: "act-kite",
    label: "Make and fly a paper bag kite",
    setup: "Paper grocery bag + string + markers on the table.",
    kidsNeed: "A breezy spot.",
  },
  {
    id: "act-stones",
    label: "Build a fairy stone tower",
    setup: "Bowl of small stones from a creek walk.",
    kidsNeed: "A flat rock as the base.",
  },
  {
    id: "act-puddle",
    label: "Boat racing in a puddle (or kiddie pool)",
    setup: "A few corks, bark scraps, and toothpick masts in a jar.",
    kidsNeed: "Water and breath to blow.",
  },
  {
    id: "act-shadow",
    label: "Shadow tracing on the driveway",
    setup: "Chalk + a stuffed animal placed in morning sun.",
    kidsNeed: "Sun and a willing friend.",
  },
  {
    id: "act-tea",
    label: "Garden tea party",
    setup: "Old teacups + small pitcher of water on a tray outside.",
    kidsNeed: "Picked herbs or flowers as 'tea.'",
  },
];

// Pick today's activity deterministically based on the date
// (so it doesn't change every time the screen renders)
export function getTodayActivity(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return SUMMER_MORNING_ACTIVITIES[dayOfYear % SUMMER_MORNING_ACTIVITIES.length];
}

// Get tomorrow's activity (used for evening "set up tonight" prompts)
export function getTomorrowActivity(date = new Date()) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getTodayActivity(tomorrow);
}

// Returns three options shuffled deterministically by date,
// so the parent has choice without overwhelm
export function getActivityChoices(date = new Date(), count = 3) {
  const startIdx = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const choices = [];
  for (let i = 0; i < count; i++) {
    choices.push(SUMMER_MORNING_ACTIVITIES[(startIdx + i * 7) % SUMMER_MORNING_ACTIVITIES.length]);
  }
  return choices;
}

// ─────────────────────────────────────────────────────────────────────
// HELPER: get blocks for any summer day
// ─────────────────────────────────────────────────────────────────────
export function getSummerDayBlocks(dayName, date = new Date()) {
  if (dayName === "Tuesday") return getTuesdayBlocks(date);
  return SUMMER_DAY_SCHEDULE[dayName] || [];
}

// ─────────────────────────────────────────────────────────────────────
// EVENING TRIGGER: is it time to show "set up for tomorrow"?
// True from 7pm onwards
// ─────────────────────────────────────────────────────────────────────
export function isEveningSetupTime(date = new Date()) {
  return date.getHours() >= 19;
}
