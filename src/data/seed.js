// ─── SEED DATA ────────────────────────────────────────────────────────────────

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── BEAUTY LOOP (per day) ────────────────────────────────────────────────────
// ─── UPDATED DAY_SCHEDULE and BEAUTY_LOOP for seed.js ────────────────────────
// Replace the existing DAY_SCHEDULE and BEAUTY_LOOP exports in src/data/seed.js
// with these. Everything else in seed.js stays the same.

// ─── BEAUTY LOOP (per day) ────────────────────────────────────────────────────
export const BEAUTY_LOOP = {
  Monday: [
    { id: "bl-m-1", label: "Artist Study", note: "Picture study — observe, narrate, sketch from memory." },
    { id: "bl-m-2", label: "Poet & Poetry Study", note: "Read the poem aloud twice. What image stayed?" },
  ],
  Tuesday: [
    { id: "bl-t-1", label: "Nature Walk", note: "Observe together — no agenda, just noticing." },
  ],
  Wednesday: [
    { id: "bl-w-1", label: "Biography & Citizenship", note: "A life worth knowing. What made this person who they were?" },
    { id: "bl-w-2", label: "Folk Song & Recitation", note: "Sing the folk song together. Practice current recitation piece." },
  ],
  Thursday: [],
  Friday: [
    { id: "bl-f-1", label: "Composer Study", note: "Listen to one piece all the way through without doing anything else." },
    { id: "bl-f-2", label: "Hymn Study", note: "This term's hymn — sing it slowly. Let the words land." },
  ],
  Saturday: [],
  Sunday: [],
};

// ─── RISE & SHINE SUB-ITEMS (per day) ────────────────────────────────────────
export const RISE_SHINE_ITEMS = {
  Monday:    ["Piano", "Math", "Reading", "Writing"],
Tuesday:   ["Piano", "Math", "Reading", "Copywork"],
Wednesday: ["Piano", "Math", "Reading", "Writing"],
Thursday:  ["Piano", "Math", "Reading", "Copywork"],
Friday:    ["Piano", "Math", "Reading", "Writing"],
};


// ─── DAILY SCHEDULE ───────────────────────────────────────────────────────────
// UPDATE YOUR seed.js DAY_SCHEDULE with this

// Replace the existing DAY_SCHEDULE export with this:

export const DAY_SCHEDULE = {
  Monday: [
    { id: "m-1", time: "8:00", subject: "Rise & Shine", note: "Independent work: chores, piano, math, writing", riseShine: true },
    { id: "m-2", time: "9:00", subject: "Mother Culture & Break", note: "If work complete", free: true },
    { id: "m-3", time: "9:45", subject: "Morning Time", note: "Bible, hymn, memory verses, living literature" },
    { id: "m-4", time: "10:30", subject: "Beauty Loop", note: "Artist Study — 6-week rotation" },
    { id: "m-5", time: "10:40", subject: "Break, Snacks & Outdoors", note: "", free: true },
    { id: "m-6", time: "11:15", subject: "Language Arts & Math", note: "Cursive, using language well" },
    { id: "m-7", time: "12:15", subject: "Lunch & Nature Pause", note: "", free: true },
    { id: "m-8", time: "1:00", subject: "Science Loop", note: "Living science through observation" },
    { id: "m-9", time: "1:30", subject: "Notebooking", note: "Record observations and learning" },
  ],
  Tuesday: [
    { id: "t-1", time: "8:00", subject: "Rise & Shine", note: "Independent work: chores, piano, math, writing", riseShine: true },
    { id: "t-2", time: "9:00", subject: "Mother Culture & Break", note: "If work complete (or skip on volunteer weeks)", free: true },
    { id: "t-3", time: "9:45", subject: "Morning Time", note: "Bible, hymn, memory verses, living literature (or skip on volunteer weeks)" },
    { id: "t-4", time: "10:30", subject: "Beauty Loop OR Volunteer", note: "Odd weeks: Poetry beauty loop · Even weeks: Cibolo Rehab Center 10:30–12:00" },
    { id: "t-5", time: "10:40", subject: "Break, Snacks & Outdoors", note: "(skip on volunteer weeks)", free: true },
    { id: "t-6", time: "11:15", subject: "Language Arts & Math", note: "Cursive, using language well (skip on volunteer weeks)" },
    { id: "t-7", time: "12:15", subject: "Lunch & Nature Pause", note: "", free: true },
    { id: "t-8", time: "1:00", subject: "Medieval History Loop", note: "Stories of the medieval world (skip on volunteer weeks)" },
    { id: "t-9", time: "1:30", subject: "Spanish", note: "Language and culture (skip on volunteer weeks)" },
  ],
  Wednesday: [
    { id: "w-1", time: "8:00", subject: "Rise & Shine", note: "Independent work: chores, piano, math, writing", riseShine: true },
    { id: "w-2", time: "9:00", subject: "Mother Culture & Break", note: "If work complete", free: true },
    { id: "w-3", time: "9:45", subject: "Morning Time", note: "Bible, hymn, memory verses, living literature" },
    { id: "w-4", time: "10:30", subject: "Beauty Loop", note: "Composer/Hymn Study — listen while drawing or sipping tea" },
    { id: "w-5", time: "10:40", subject: "Break, Snacks & Outdoors", note: "", free: true },
    { id: "w-6", time: "11:15", subject: "Language Arts & Math", note: "Cursive, using language well" },
    { id: "w-7", time: "12:15", subject: "Lunch & Nature Pause", note: "", free: true },
    { id: "w-8", time: "1:00", subject: "American History Loop", note: "Stories that shaped a nation" },
    { id: "w-9", time: "1:30", subject: "Spanish", note: "Language and culture" },
  ],
  Thursday: [
    { id: "th-1", time: "All Day", subject: "Co-op Day at BACH", note: "Chispa or BACH co-op — off campus" },
  ],
  Friday: [
    { id: "f-1", time: "8:00", subject: "Rise & Shine", note: "Independent work: chores, piano, math, writing", riseShine: true },
    { id: "f-2", time: "9:00", subject: "Mother Culture & Break", note: "If work complete", free: true },
    { id: "f-3", time: "9:45", subject: "Morning Time", note: "Bible, hymn, memory verses, living literature" },
    { id: "f-4", time: "10:30", subject: "Beauty Loop", note: "Citizenship/Biography OR Folk Song — alternate weeks" },
    { id: "f-5", time: "10:40", subject: "Break, Snacks & Outdoors", note: "", free: true },
    { id: "f-6", time: "11:15", subject: "Language Arts & Math", note: "Cursive, using language well" },
    { id: "f-7", time: "12:15", subject: "Lunch & Nature Pause", note: "", free: true },
    { id: "f-8", time: "1:00", subject: "Geography Loop", note: "Places, peoples, and lands" },
    { id: "f-9", time: "1:30", subject: "Notebooking", note: "Record observations and learning" },
  ],
  Saturday: [
    { id: "sat-1", time: "Family Day", subject: "Rest, outdoor adventure, or project time", note: "No formal school" },
  ],
  Sunday: [
    { id: "sun-1", time: "Family Day", subject: "Sabbath — worship and rest", note: "No school work" },
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

// ─── HABIT DATA ───────────────────────────────────────────────────────────────
export const HABIT_PROMPTS = {
  attention: {
    name: "Attention",
    desc: "The habit of giving full, unhurried focus to one thing at a time.",
    daily: [
      ["Ask your child to look at one thing for a full minute before speaking.", "Notice when attention wanders — gently call it back without shame."],
      ["Read aloud slowly. Pause. Let the words settle before moving on.", "After reading, sit quietly for 30 seconds before narrating."],
      ["Go outside and ask: what do you hear that you haven't noticed before?", "Narrate back what you noticed on your walk — in detail."],
      ["Choose a piece of music and listen to the whole thing without doing anything else.", "Model attention by setting your phone in another room this morning."],
      ["Read a poem twice — once for sound, once for meaning.", "End the day by asking: what held your attention today?"],
      ["Let Saturday be a day of unhurried noticing.", "Do one thing with your hands — slowly and well."],
      ["Rest is its own form of attention. Give it fully today.", "Sit outside for ten minutes and simply observe."],
    ],
  },
  narration: {
    name: "Narration",
    desc: "Telling back what was heard or read — the backbone of language and memory.",
    daily: [
      ["Ask for one oral narration today — no prompts, just: tell me what you remember.", "Don't correct the narration. Receive it as offered."],
      ["After your read-aloud, ask: what image stayed with you?", "Try a written narration of just three sentences today."],
      ["Ask your child to narrate what they noticed outside today.", "Read one passage twice, then ask for a narration. Notice the difference."],
      ["Invite a drawn narration — a sketch of a scene from the book.", "Try a narration at dinner — what did you learn or read today?"],
      ["End the week with one full oral narration of something read this week.", "Write down one narration word-for-word. Read it back to your child."],
      ["Narrate something from your own week — model the habit.", "Read a short poem aloud and ask: what do you see?"],
      ["Recall one thing from this week's reading together at the table.", "Rest. Let what was read and heard become part of you."],
    ],
  },
  outdoor: {
    name: "Outdoor Time",
    desc: "Regular time in nature — for movement, observation, and living study.",
    daily: [
      ["Go outside before any screens today — even for ten minutes.", "Ask your child to find something living and observe it closely."],
      ["Take the read-aloud outside today.", "Let outdoor time be unstructured — no agenda, no narration required."],
      ["Go out after morning time before moving into subjects.", "Find one thing to sketch in your nature journal today."],
      ["Take a longer outdoor break today — 45 minutes if you can.", "Record the weather and one observation in your nature journal."],
      ["End the week with an outdoor afternoon — no school, just outside.", "Give your child time to simply play outside without direction."],
      ["Go outside as a family today.", "Find one living thing and look at it until you notice something new."],
      ["Rest outside today — sit, breathe, let creation speak.", "Give thanks for the outdoor world your children are growing up in."],
    ],
  },
  stillness: {
    name: "Stillness",
    desc: "A moment each day of quiet — no screen, no noise, no agenda.",
    daily: [
      ["Begin Morning Time with 60 seconds of silence before the hymn.", "Let there be one moment today with no background sound."],
      ["After read-aloud, sit quietly for 30 seconds before discussing.", "Practice stillness yourself — model what it looks like."],
      ["Let outdoor time include five minutes of sitting still and listening.", "After lunch, try a five-minute rest before afternoon work."],
      ["Begin one subject with a moment of stillness and a breath.", "Give your child permission to sit and do nothing for ten minutes."],
      ["End the school week with five minutes of grateful stillness.", "Let Friday afternoon be slower and quieter than the rest."],
      ["Let Saturday morning begin in quiet.", "Sit outside in silence for five minutes."],
      ["Let Sunday be the fullest expression of this habit.", "Rest in the quiet. This is the habit in its fullest form."],
    ],
  },
  orderly: {
    name: "Orderly Work",
    desc: "Beginning and finishing a task with care — order as an act of respect.",
    daily: [
      ["Ask your child to put away one thing before beginning the next.", "End Morning Time by putting the room back to rights together."],
      ["Choose one subject and do it beginning to end without interruption.", "Ask your child to finish what they started before moving on."],
      ["Before going outside, tidy the school space together.", "Let chores be done carefully, not just quickly."],
      ["Practice beginning well — a clear space, a settled mind, then begin.", "End the day by putting everything in its place before dinner."],
      ["Celebrate orderly work — notice and name it when you see it.", "Let Friday be a day of finishing — complete what was left undone."],
      ["Tend your home with care today — order as an act of love.", "Let Saturday chores be done slowly and well."],
      ["Rest in an ordered home today.", "Give thanks for the work of the week — completed and set aside."],
    ],
  },
};

export const HABIT_KEYS = ["attention", "narration", "outdoor", "stillness", "orderly"];

// ─── CM QUOTE BANK ────────────────────────────────────────────────────────────
export const CM_QUOTES = [
  { quote: "Education is an atmosphere, a discipline, a life.", source: "Vol. 3" },
  { quote: "The child is a person with all the possibilities and powers included in personality.", source: "Vol. 1" },
  { quote: "Habit is ten natures.", source: "Vol. 1" },
  { quote: "Never be within doors when you can rightly be without.", source: "Vol. 1" },
  { quote: "The mother is qualified, and is called to be the educator of her children.", source: "Vol. 1" },
  { quote: "A child is not a vessel to be filled, but a fire to be kindled.", source: "Vol. 2" },
  { quote: "The highest function of the teacher is not to impart knowledge, but to awaken a love of learning.", source: "Vol. 6" },
  { quote: "There is no more fatal mistake than that of separating education from life.", source: "Vol. 3" },
  { quote: "Self-education is the only possible education; the rest is mere veneer laid on the surface.", source: "Vol. 6" },
  { quote: "Children are born persons.", source: "Vol. 1" },
  { quote: "The mind feeds on ideas, and therefore children should have a generous curriculum.", source: "Vol. 6" },
  { quote: "Narration is an art, and children who are called upon to narrate do it with zest and freshness.", source: "Vol. 1" },
  { quote: "A mother who takes pains to endow her children with good habits secures for herself smooth and easy days.", source: "Vol. 1" },
  { quote: "The question is not how much does the youth know, but how much does he care.", source: "Vol. 6" },
  { quote: "In this time of extraordinary pressure, perhaps a mother's first duty is to secure for her child a quiet growing time.", source: "Vol. 1" },
  { quote: "Nature knowledge is the great source of delight for children of every age.", source: "Vol. 1" },
  { quote: "The child who has been brought up to observe, to think, to note, will find food for thought everywhere.", source: "Vol. 1" },
  { quote: "Atmosphere is what we are, rather than what we say.", source: "Vol. 3" },
  { quote: "Books are the best teachers of the best subjects.", source: "Vol. 6" },
  { quote: "Every child has a natural appetite for knowledge which it is our business to satisfy — and not to quench.", source: "Vol. 2" },
  { quote: "Life should be full and free for the child — not cramped by overmuch teaching.", source: "Vol. 1" },
  { quote: "The object of education is to put a child in living touch with as much as possible of the heritage of the human race.", source: "Vol. 3" },
  { quote: "Children should be left long with Nature, for Nature is their best teacher in the early years.", source: "Vol. 1" },
  { quote: "We cannot give our children too much time for quiet growth.", source: "Vol. 1" },
  { quote: "The best thing we can do for children is to give them wide interests and the habit of attention.", source: "Vol. 6" },
  { quote: "Children's lessons should be kept short, varied, and always demanding their full attention.", source: "Vol. 1" },
  { quote: "The imagination needs food above all things.", source: "Vol. 2" },
  { quote: "A child must have a living relationship with the subject before he can narrate it truly.", source: "Vol. 6" },
  { quote: "The love of knowledge is a passion not easily killed, but it may be starved by poor food.", source: "Vol. 6" },
  { quote: "It is not enough to teach children to be good; we must help them to love what is good.", source: "Vol. 3" },
  { quote: "Order is not enough, but it is where we begin.", source: "Vol. 3" },
  { quote: "A child who narrates well has done the hardest work of education.", source: "Vol. 6" },
  { quote: "Let the children have long days of unscheduled time to wander, wonder, and grow.", source: "Vol. 1" },
  { quote: "There is no royal road to learning; no short cut that a child may travel in safety.", source: "Vol. 3" },
  { quote: "A child's reading should be wide and generous — real books, not watered-down versions.", source: "Vol. 6" },
  { quote: "The whole tendency of modern education is to make children dependent on their teachers.", source: "Vol. 3" },
  { quote: "We all like to read about things we have seen or things we know about; the child is no exception.", source: "Vol. 1" },
  { quote: "There is no part of a child's education more important than that he should know that God is always present.", source: "Vol. 1" },
  { quote: "It is the nature of a child to learn by imitation rather than by instruction.", source: "Vol. 2" },
  { quote: "In the education of little children, the mother does well to be slow, tender, and watchful.", source: "Vol. 1" },
  { quote: "The mother who realizes her calling will not rest until she has made herself a good teacher.", source: "Vol. 1" },
  { quote: "A generous curriculum includes something of everything — history, geography, literature, music, painting, handicraft, mathematics, science.", source: "Vol. 6" },
  { quote: "It is not given to every woman to rule wisely, but it is given to every mother to rule lovingly.", source: "Vol. 1" },
  { quote: "The great recognition of the fact that children are born persons is the pivot on which a rational educational system turns.", source: "Vol. 6" },
  { quote: "Self-education is the only possible education; the rest is mere veneer laid on the surface.", source: "Vol. 6" },
  { quote: "A child gets wisdom from books as he gets it from life — by his own reflection upon what he reads.", source: "Vol. 6" },
  { quote: "Let the child read and narrate. Let him have time to be idle, to dream, to wonder.", source: "Vol. 6" },
  { quote: "To be wholly devoted to some intellectual exercise is to have succeeded in life.", source: "Robert Louis Stevenson" },
];

// ─── OTHER EXPORTS ────────────────────────────────────────────────────────────
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
  "Look for movement", "Notice something small", "Follow a pattern",
  "Listen before you look", "Find where light falls", "Sketch one thing exactly as it is",
];

export const CHAPTERS = [
  { num: "I",   title: "Consider the Lilies", sub: "Commonplace & nature journal",  screen: "lilies"   },
  { num: "II",  title: "Outdoors",            sub: "Nature study & observation",     screen: "outdoors" },
  { num: "III", title: "Habit Formation",     sub: "The tended life",                screen: "habits"   },
  { num: "IV",  title: "Students",            sub: "Profiles & narration history",   screen: "students" },
];

export const NARRATION_STAGES       = ["find", "follow", "frame"];
export const NARRATION_STAGE_LABELS = { find: "Find It", follow: "Follow It", frame: "Frame It" };
export const NARRATION_STAGE_PROMPTS = {
  find:   "In your own words — tell back what happened. Begin anywhere.",
  follow: "Now go deeper. What detail, image, or moment matters most, and why?",
  frame:  "Step back. What does this passage or chapter mean in the larger story? What is the author doing?",
};
// ─── WEEKEND RHYTHMS ──────────────────────────────────────────────────────────
// Add these exports to your existing src/data/seed.js file
// (paste at the bottom, before the last line)


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

// ─── NATURE STUDY ─────────────────────────────────────────────────────────────
export const NATURE_DAYS = {
  Monday:  true,
  Friday:  true,
};

export const NATURE_LOOP_STEPS = [
  { step: "Read",    label: "Nature Lore Reading",   icon: "📖", getInstruction: (t) => t ? `Read aloud from ${t.read}. This week: ${t.subject}.` : "Read aloud from The Year Round by C.J. Hylander." },
  { step: "Walk",    label: "Nature Walk",            icon: "🌿", getInstruction: (t) => t?.observe || "Go outside and observe nature with fresh eyes. No agenda — just notice." },
  { step: "Journal", label: "Nature Journal",         icon: "✏️", getInstruction: ()  => "Sketch, paint, or write. A pressed leaf, a careful drawing, a sentence about what you noticed. Let the page be a living record." },
];

export function getNatureLoopStep() {
  try { return parseInt(localStorage.getItem("tend_nature_loop_step") || "0", 10) % 3; } catch { return 0; }
}

export function advanceNatureLoop() {
  const next = (getNatureLoopStep() + 1) % 3;
  try { localStorage.setItem("tend_nature_loop_step", String(next)); } catch {}
  return next;
}

export const BEAUTY_ROTATION = {
  Monday: {
    morning: {
      anchors: ["language", "using language", "math"],
      items: [
        { id: "bl-m-bio",  label: "Biography Study",   note: "A life worth knowing. Read a chapter and narrate — what made this person who they were?" },
        { id: "bl-m-cit",  label: "Citizenship Study", note: "Stories of virtue and civic life. What does it mean to be a good neighbor, citizen, steward?" },
      ],
    },
    afternoon: {
      anchors: ["science", "artist", "beauty"],
      items: [
        { id: "bl-m-art",  label: "Artist Study",          note: "Picture study — observe quietly, narrate, then sketch from memory." },
        { id: "bl-m-poet", label: "Poet & Poetry Study",   note: "Read the poem aloud twice. What image stayed with you?" },
      ],
    },
  },
};

export function getBeautyForBlock(subject, today, week) {
  const dayRotations = BEAUTY_ROTATION[today];
  if (!dayRotations) return null;
  const s = subject.toLowerCase();
  for (const slot of Object.values(dayRotations)) {
    if (slot.anchors.some(a => s.includes(a))) {
      const items = slot.items;
      if (!items.length) return null;
      if (items.length === 1) return items[0];
      return items[week % 2 === 1 ? 0 : 1];
    }
  }
  return null;
}
