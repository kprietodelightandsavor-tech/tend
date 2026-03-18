// ─── SEED DATA ────────────────────────────────────────────────────────────────
// Plain JS — no JSX. Icons live in src/components/HabitIcons.jsx

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ─── BEAUTY LOOP ──────────────────────────────────────────────────────────────
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
  Thursday: [],
  Friday: [
    { id: "bl-f-1", label: "Hymn Study", note: "Introduce this term's hymn — it will carry through morning alarms." },
    { id: "bl-f-2", label: "Recitation" },
  ],
};

// ─── DAILY SCHEDULE ───────────────────────────────────────────────────────────
export const DAY_SCHEDULE = {
  Monday: [
    { id: "m-1",  subject: "Wake Up & Morning Chores",    time: "7:30",  note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "m-2",  subject: "Piano",                       time: "8:00",  note: "15 minutes independent practice", free: true },
    { id: "m-3",  subject: "Teaching Textbooks — Math",   time: "8:15",  note: "One lesson", free: true },
    { id: "m-4",  subject: "Reading",                     time: "8:35",  note: "20 minutes — Epic or assigned book", free: true },
    { id: "m-5",  subject: "Writing",                     time: "8:55",  note: "Rise & Shine writing block", free: true },
    { id: "m-6",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "m-7",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "m-8",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "m-9",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "m-10", subject: "Lunch",                       time: "12:00", note: "", free: true },
    { id: "m-11", subject: "Science",                     time: "1:00",  note: "Nature Explorers or current science unit" },
    { id: "m-12", subject: "Commonplace Book",            time: "1:45",  note: "Copywork from today's reading + drawing" },
    { id: "m-13", subject: "Spanish",                     time: "2:30",  note: "Spanish with Sophie" },
  ],
  Tuesday: [
    { id: "t-1",  subject: "Wake Up & Morning Chores",    time: "7:30",  note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "t-2",  subject: "Piano",                       time: "8:00",  note: "15 minutes independent practice", free: true },
    { id: "t-3",  subject: "Teaching Textbooks — Math",   time: "8:15",  note: "One lesson", free: true },
    { id: "t-4",  subject: "Reading",                     time: "8:35",  note: "20 minutes — Epic or assigned book", free: true },
    { id: "t-5",  subject: "Copywork",                    time: "8:55",  note: "Rise & Shine copywork block", free: true },
    { id: "t-6",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "t-7",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "t-8",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "t-9",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "t-10", subject: "Lunch",                       time: "12:00", note: "", free: true },
    { id: "t-11", subject: "Historical Fiction",          time: "1:00",  note: "Read-aloud historical fiction" },
    { id: "t-12", subject: "Math — Independent Study",    time: "1:45",  note: "Independent work for students not in math lesson" },
    { id: "t-13", subject: "Spanish",                     time: "2:30",  note: "Spanish with Sophie" },
  ],
  Wednesday: [
    { id: "w-1",  subject: "Wake Up & Morning Chores",    time: "7:30",  note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "w-2",  subject: "Piano",                       time: "8:00",  note: "15 minutes independent practice", free: true },
    { id: "w-3",  subject: "Teaching Textbooks — Math",   time: "8:15",  note: "One lesson", free: true },
    { id: "w-4",  subject: "Reading",                     time: "8:35",  note: "20 minutes — Epic or assigned book", free: true },
    { id: "w-5",  subject: "Writing",                     time: "8:55",  note: "Rise & Shine writing block", free: true },
    { id: "w-6",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "w-7",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "w-8",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "w-9",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "w-10", subject: "Lunch",                       time: "12:00", note: "", free: true },
    { id: "w-11", subject: "History Spine",               time: "1:00",  note: "Story of the World or current history spine" },
    { id: "w-12", subject: "Math — Independent Study",    time: "1:45",  note: "Independent work for students not in math lesson" },
  ],
  Thursday: [
    { id: "th-1", subject: "Wake Up & Morning Chores",    time: "7:30",  note: "Get dressed, feed animals, pack for co-op", free: true },
    { id: "th-2", subject: "Piano",                       time: "8:00",  note: "15 minutes independent practice", free: true },
    { id: "th-3", subject: "Teaching Textbooks — Math",   time: "8:15",  note: "One lesson", free: true },
    { id: "th-4", subject: "Reading",                     time: "8:35",  note: "20 minutes — Epic or assigned book", free: true },
    { id: "th-5", subject: "Copywork",                    time: "8:55",  note: "Rise & Shine copywork block", free: true },
    { id: "th-6", subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "th-7", subject: "Co-op — BACH",                time: "10:30", note: "Full co-op day — Living Literature & Language" },
  ],
  Friday: [
    { id: "f-1",  subject: "Wake Up & Morning Chores",    time: "7:30",  note: "Get dressed, feed animals, tidy spaces", free: true },
    { id: "f-2",  subject: "Piano",                       time: "8:00",  note: "15 minutes independent practice", free: true },
    { id: "f-3",  subject: "Teaching Textbooks — Math",   time: "8:15",  note: "One lesson", free: true },
    { id: "f-4",  subject: "Reading",                     time: "8:35",  note: "20 minutes — Epic or assigned book", free: true },
    { id: "f-5",  subject: "Writing",                     time: "8:55",  note: "Rise & Shine writing block", free: true },
    { id: "f-6",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "f-7",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "f-8",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "f-9",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "f-10", subject: "Lunch",                       time: "12:00", note: "", free: true },
    { id: "f-11", subject: "Geography",                   time: "1:00",  note: "Draw the World — current unit" },
    { id: "f-12", subject: "Math — Independent Study",    time: "1:45",  note: "Independent work for students not in math lesson" },
    { id: "f-13", subject: "History Timeline",            time: "1:45",  note: "Add to our Book of Centuries or timeline" },
    { id: "f-14", subject: "Spanish",                     time: "2:30",  note: "Spanish with Sophie" },
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

// ─── HABIT PROMPTS ────────────────────────────────────────────────────────────
// Icons are string keys — resolved to components in HabitIcons.jsx
export const HABIT_PROMPTS = {
  attention: {
    name: "Attention",
    desc: "The habit of giving full, unhurried focus to one thing at a time.",
    iconKey: "attention",
    daily: [
      ["Ask your child to look at one thing for a full minute before speaking.", "Notice when attention wanders — gently call it back without shame."],
      ["Read aloud slowly. Pause. Let the words settle before moving on.", "After reading, sit quietly for 30 seconds before narrating."],
      ["Go outside and ask: what do you hear that you haven't noticed before?", "Put one thing away before beginning the next subject."],
      ["Choose a piece of music and listen to the whole thing without doing anything else.", "Model attention by setting your phone in another room this morning."],
      ["Read a poem twice — once for sound, once for meaning.", "End the day by asking: what held your attention today?"],
      ["Let Saturday be a day of unhurried noticing.", "Do one thing with your hands — slowly and well."],
      ["Rest is its own form of attention. Give it fully today.", "Sit outside for ten minutes and simply observe."],
    ],
  },
  narration: {
    name: "Narration",
    desc: "Telling back what was heard or read — the backbone of language and memory.",
    iconKey: "narration",
    daily: [
      ["Ask for one oral narration today — no prompts, just: tell me what you remember.", "Don't correct the narration. Receive it as offered."],
      ["After your read-aloud, ask: what image stayed with you?", "Try a written narration of just three sentences today."],
      ["Ask your child to narrate what they noticed outside today.", "Let narration be the only comprehension check you use today."],
      ["Invite a drawn narration — a sketch of a scene from the book.", "Try a narration at dinner — what did you learn or read today?"],
      ["End the week with one full oral narration of something read this week.", "Ask: what surprised you in what we read? Start there."],
      ["Narrate something from your own week — model the habit.", "Read a short poem aloud and ask: what do you see?"],
      ["Recall one thing from this week's reading together at the table.", "Rest. Let what was read and heard become part of you."],
    ],
  },
  outdoor: {
    name: "Outdoor Time",
    desc: "Regular time in nature — for movement, observation, and living study.",
    iconKey: "outdoor",
    daily: [
      ["Go outside before any screens today — even for ten minutes.", "Ask your child to find something living and observe it closely."],
      ["Take the read-aloud outside today.", "Let outdoor time be unstructured — no agenda, no narration required."],
      ["Go out after morning time before moving into subjects.", "Find one thing to sketch in your nature journal today."],
      ["Take a longer outdoor break today — 45 minutes if you can.", "Ask your child to lead the walk. Follow them."],
      ["End the week with an outdoor afternoon — no school, just outside.", "Give your child time to simply play outside without direction."],
      ["Go outside as a family today.", "Let Saturday's outdoor time be slow and unhurried."],
      ["Rest outside today — sit, breathe, let creation speak.", "Give thanks for the outdoor world your children are growing up in."],
    ],
  },
  stillness: {
    name: "Stillness",
    desc: "A moment each day of quiet — no screen, no noise, no agenda.",
    iconKey: "stillness",
    daily: [
      ["Begin Morning Time with 60 seconds of silence before the hymn.", "Ask your child to sit still and close their eyes for two minutes."],
      ["After read-aloud, sit quietly for 30 seconds before discussing.", "Turn off all sound during one subject block today."],
      ["Let outdoor time include five minutes of sitting still and listening.", "Ask: what did you hear in the quiet today?"],
      ["Begin one subject with a moment of stillness and a breath.", "Give your child permission to sit and do nothing for ten minutes."],
      ["End the school week with five minutes of grateful stillness.", "Let Friday afternoon be slower and quieter than the rest."],
      ["Let Saturday morning begin in quiet.", "Sit outside in silence for five minutes."],
      ["Let Sunday be the fullest expression of this habit.", "Rest in the quiet. This is the habit in its fullest form."],
    ],
  },
  orderly: {
    name: "Orderly Work",
    desc: "Beginning and finishing a task with care — order as an act of respect.",
    iconKey: "orderly",
    daily: [
      ["Ask your child to put away one thing before beginning the next.", "End Morning Time by putting the room back to rights together."],
      ["Choose one subject and do it beginning to end without interruption.", "Model orderly work by completing one task fully before starting another."],
      ["Before going outside, tidy the school space together.", "Let chores be done carefully, not just quickly."],
      ["Practice beginning well — a clear space, a settled mind, then begin.", "End the day by putting everything in its place before dinner."],
      ["Celebrate orderly work — notice and name it when you see it.", "Let Friday be a day of finishing — complete what was left undone."],
      ["Tend your home with care today — order as an act of love.", "Notice the peace that comes from an ordered space."],
      ["Rest in an ordered home today.", "Let Sunday be free of unfinished business."],
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
  { quote: "Let the child read and narrate. Let him have time to be idle, to dream, to wonder.", source: "Vol. 6" },
  { quote: "A mother who takes pains to endow her children with good habits secures for herself smooth and easy days.", source: "Vol. 1" },
  { quote: "The question is not how much does the youth know, but how much does he care.", source: "Vol. 6" },
  { quote: "In this time of extraordinary pressure, perhaps a mother's first duty is to secure for her child a quiet growing time.", source: "Vol. 1" },
  { quote: "There is no part of a child's education more important than that he should know that God is always present.", source: "Vol. 1" },
  { quote: "Nature knowledge is the great source of delight for children of every age.", source: "Vol. 1" },
  { quote: "The child who has been brought up to observe, to think, to note, will find food for thought everywhere.", source: "Vol. 1" },
  { quote: "A generous curriculum includes something of everything — history, geography, literature, music, painting, handicraft, mathematics, science.", source: "Vol. 6" },
  { quote: "The whole tendency of modern education is to make children dependent on their teachers.", source: "Vol. 3" },
  { quote: "Atmosphere is what we are, rather than what we say.", source: "Vol. 3" },
  { quote: "Books are the best teachers of the best subjects.", source: "Vol. 6" },
  { quote: "It is not given to every woman to rule wisely, but it is given to every mother to rule lovingly.", source: "Vol. 1" },
  { quote: "Every child has a natural appetite for knowledge which it is our business to satisfy — and not to quench.", source: "Vol. 2" },
  { quote: "Life should be full and free for the child — not cramped by overmuch teaching.", source: "Vol. 1" },
  { quote: "The object of education is to put a child in living touch with as much as possible of the heritage of the human race.", source: "Vol. 3" },
  { quote: "Children should be left long with Nature, for Nature is their best teacher in the early years.", source: "Vol. 1" },
  { quote: "A child gets wisdom from books as he gets it from life — by his own reflection upon what he reads.", source: "Vol. 6" },
  { quote: "We cannot give our children too much time for quiet growth.", source: "Vol. 1" },
  { quote: "The best thing we can do for children is to give them wide interests and the habit of attention.", source: "Vol. 6" },
  { quote: "Children's lessons should be kept short, varied, and always demanding their full attention.", source: "Vol. 1" },
  { quote: "The mother who realizes her calling will not rest until she has made herself a good teacher.", source: "Vol. 1" },
  { quote: "The imagination needs food above all things.", source: "Vol. 2" },
  { quote: "The love of knowledge is a passion not easily killed, but it may be starved by poor food.", source: "Vol. 6" },
  { quote: "It is not enough to teach children to be good; we must help them to love what is good.", source: "Vol. 3" },
  { quote: "A child who narrates well has done the hardest work of education.", source: "Vol. 6" },
  { quote: "Order is not enough, but it is where we begin.", source: "Vol. 3" },
  { quote: "A child must have a living relationship with the subject before he can narrate it truly.", source: "Vol. 6" },
  { quote: "Let the children have long days of unscheduled time to wander, wonder, and grow.", source: "Vol. 1" },
  { quote: "In the education of little children, the mother does well to be slow, tender, and watchful.", source: "Vol. 1" },
  { quote: "There is no royal road to learning; no short cut that a child may travel in safety.", source: "Vol. 3" },
  { quote: "A child's reading should be wide and generous — real books, not watered-down versions.", source: "Vol. 6" },
  { quote: "It is the nature of a child to learn by imitation rather than by instruction.", source: "Vol. 2" },
  { quote: "We all like to read about things we have seen or things we know about; the child is no exception.", source: "Vol. 1" },
  { quote: "The great recognition of the fact that children are born persons is the pivot on which a rational educational system turns.", source: "Vol. 6" },
  { quote: "To be wholly devoted to some intellectual exercise is to have succeeded in life.", source: "Robert Louis Stevenson" },
  { quote: "Self-knowledge, self-reverence, self-control — these three alone lead life to sovereign power.", source: "Alfred Lord Tennyson" },
];

// ─── OTHER DATA ───────────────────────────────────────────────────────────────
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
  { num: "I",   title: "Consider the Lilies", sub: "Commonplace & journal",        screen: "lilies"   },
  { num: "II",  title: "Outdoors",            sub: "Nature study & observation",    screen: "outdoors" },
  { num: "III", title: "Habit Formation",     sub: "The tended life",               screen: "habits"   },
  { num: "IV",  title: "Students",            sub: "Profiles & narration history",  screen: "students" },
];

export const NARRATION_STAGES       = ["find", "follow", "frame"];
export const NARRATION_STAGE_LABELS = { find: "Find It", follow: "Follow It", frame: "Frame It" };
export const NARRATION_STAGE_PROMPTS = {
  find:   "In your own words — tell back what happened. Begin anywhere.",
  follow: "Now go deeper. What detail, image, or moment matters most, and why?",
  frame:  "Step back. What does this passage or chapter mean in the larger story? What is the author doing?",
};
