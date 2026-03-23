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
export const DAY_SCHEDULE = {
  Monday: [
    { id: "m-1",  subject: "Rise & Shine",                   time: "8:30",  note: "Wake up, morning chores, independent morning work", free: true, riseShine: true },
    { id: "m-2",  subject: "Hymn, Bible & Scripture Memory", time: "10:15", note: "A Gentle Feast · hymn, scripture memory, family Bible reading" },
    { id: "m-3",  subject: "Living Literature",              time: "10:45", note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "m-4",  subject: "Outdoor Break",                  time: "11:00", note: "Play outside or finish morning animal chores", free: true },
    { id: "m-5",  subject: "Using Language Well",            time: "11:45", note: "Grammar and language arts together before math" },
    { id: "m-6",  subject: "Math + Independent Rotation",    time: "12:00", note: "Math lesson with one child · others rotate: Spanish/Rosetta Stone, nature journal, literature, history reader, science reader, commonplace book" },
    { id: "m-7",  subject: "Lunch",                          time: "12:30", note: "", free: true },
    { id: "m-8",  subject: "Artist Study & Science",         time: "1:15",  note: "Artist Study / Poet Study · anchor to science reading and narration" },
    { id: "m-9",  subject: "Math + Independent Rotation",    time: "2:00",  note: "Math lesson with second child · others rotate independently" },
    { id: "m-10", subject: "Spanish",                        time: "2:30",  note: "Spanish with Sophie" },
    { id: "m-11", subject: "Afternoon Pursuits",             time: "3:00",  note: "Handicrafts, art, free reading, outdoor time, creative work", free: true },
    { id: "m-12", subject: "House Reset & Animal Chores",    time: "5:30",  note: "Evening chores together — tend the home and animals", free: true },
  ],
  Tuesday: [
    { id: "t-1",  subject: "Rise & Shine",                   time: "8:30",  note: "Wake up, morning chores, independent morning work", free: true, riseShine: true },
    { id: "t-2",  subject: "Tuesday Rhythm",                 time: "9:30",  note: "CHISPA co-op · volunteer at rehab center · nature walk · field trip · or errand day — this day breathes", free: true },
    { id: "t-3",  subject: "Afternoon Pursuits",             time: "3:00",  note: "Handicrafts, free reading, outdoor time, creative work", free: true },
    { id: "t-4",  subject: "House Reset & Animal Chores",    time: "5:30",  note: "Evening chores together", free: true },
  ],
  Wednesday: [
    { id: "w-1",  subject: "Rise & Shine",                   time: "8:30",  note: "Wake up, morning chores, independent morning work", free: true, riseShine: true },
    { id: "w-2",  subject: "Hymn, Bible & Scripture Memory", time: "10:15", note: "A Gentle Feast · hymn, scripture memory, family Bible reading" },
    { id: "w-3",  subject: "Living Literature",              time: "10:45", note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "w-4",  subject: "Outdoor Break",                  time: "11:00", note: "Play outside or finish morning animal chores", free: true },
    { id: "w-5",  subject: "Using Language Well",            time: "11:45", note: "Grammar and language arts together before math" },
    { id: "w-6",  subject: "Math + Independent Rotation",    time: "12:00", note: "Math lesson with one child · others rotate: history reader, science reader, nature journal, commonplace book" },
    { id: "w-7",  subject: "Lunch",                         time: "12:30", note: "", free: true },
    { id: "w-8",  subject: "Biography & History",            time: "1:15",  note: "Biography/Citizenship · anchor to history spine reading and narration" },
    { id: "w-9",  subject: "Math + Independent Rotation",    time: "2:00",  note: "Math lesson with second child · others rotate independently" },
    { id: "w-10", subject: "Tennis",                         time: "2:30",  note: "Tennis · 2:30–4:00" },
    { id: "w-11", subject: "Afternoon Pursuits",             time: "4:00",  note: "Handicrafts, free reading, creative work", free: true },
    { id: "w-12", subject: "House Reset & Animal Chores",    time: "5:30",  note: "Evening chores together", free: true },
  ],
  Thursday: [
    { id: "th-1", subject: "Rise & Shine",                   time: "8:30",  note: "Wake up, morning chores, pack for co-op", free: true, riseShine: true },
    { id: "th-2", subject: "Hymn, Bible & Scripture Memory", time: "10:00", note: "A Gentle Feast · brief morning time before co-op" },
    { id: "th-3", subject: "Co-op — BACH",                   time: "10:30", note: "Full co-op day — Living Literature & Language" },
    { id: "th-4", subject: "Afternoon Pursuits",             time: "3:30",  note: "Rest, free time, outdoor play after co-op", free: true },
    { id: "th-5", subject: "House Reset & Animal Chores",    time: "5:30",  note: "Evening chores together", free: true },
  ],
  Friday: [
    { id: "f-1",  subject: "Rise & Shine",                   time: "8:30",  note: "Wake up, morning chores, independent morning work", free: true, riseShine: true },
    { id: "f-2",  subject: "Hymn, Bible & Scripture Memory", time: "10:15", note: "A Gentle Feast · hymn, scripture memory, family Bible reading" },
    { id: "f-3",  subject: "Living Literature",              time: "10:45", note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "f-4",  subject: "Outdoor Break",                  time: "11:00", note: "Play outside or finish morning animal chores", free: true },
    { id: "f-5",  subject: "Using Language Well",            time: "11:45", note: "Grammar and language arts together before math" },
    { id: "f-6",  subject: "Math + Independent Rotation",    time: "12:00", note: "Math lesson with one child · others rotate: history reader, geography, nature journal, commonplace book" },
    { id: "f-7",  subject: "Lunch",                          time: "12:30", note: "", free: true },
    { id: "f-8",  subject: "Composer Study & Geography",     time: "1:15",  note: "Composer Study / Hymn Study · anchor to geography — Draw the World or current unit" },
    { id: "f-9",  subject: "Math + Independent Rotation",    time: "2:00",  note: "Math lesson with second child · others rotate independently" },
    { id: "f-10", subject: "Spanish",                        time: "2:30",  note: "Spanish with Sophie" },
    { id: "f-11", subject: "Afternoon Pursuits",             time: "3:00",  note: "Handicrafts, art, free reading, outdoor time, creative work", free: true },
    { id: "f-12", subject: "House Reset & Animal Chores",    time: "5:30",  note: "Evening chores together", free: true },
  ],
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
export const DAY_SCHEDULE = {
  Monday: [
    { id: "m-1",  subject: "Rise & Shine",               time: "7:30",  note: "Wake up, chores, independent morning work", free: true, riseShine: true },
    { id: "m-2",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "m-3",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "m-4",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "m-5",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "m-6",  subject: "Lunch",                       time: "12:30", note: "", free: true },
    { id: "m-7",  subject: "Science",                     time: "1:00",  note: "Nature Explorers or current science unit" },
    { id: "m-8",  subject: "Commonplace Book",            time: "1:45",  note: "Copywork from today's reading + drawing" },
    { id: "m-9",  subject: "Spanish",                     time: "2:30",  note: "Spanish with Sophie" },
  ],
  Tuesday: [
    { id: "t-1",  subject: "Rise & Shine",               time: "7:30",  note: "Wake up, chores, independent morning work", free: true, riseShine: true },
    { id: "t-2",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "t-3",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "t-4",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "t-5",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "t-6",  subject: "Lunch",                       time: "12:30", note: "", free: true },
    { id: "t-7",  subject: "Historical Fiction",          time: "1:00",  note: "Read-aloud historical fiction" },
    { id: "t-8",  subject: "Math — Independent Study",    time: "1:45",  note: "Independent work for students not in math lesson" },
    { id: "t-9",  subject: "Spanish",                     time: "2:30",  note: "Spanish with Sophie" },
  ],
  Wednesday: [
    { id: "w-1",  subject: "Rise & Shine",               time: "7:30",  note: "Wake up, chores, independent morning work", free: true, riseShine: true },
    { id: "w-2",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "w-3",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "w-4",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "w-5",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "w-6",  subject: "Lunch",                       time: "12:30", note: "", free: true },
    { id: "w-7",  subject: "History Spine",               time: "1:00",  note: "Story of the World or current history spine" },
    { id: "w-8",  subject: "Math — Independent Study",    time: "1:45",  note: "Independent work for students not in math lesson" },
  ],
  Thursday: [
    { id: "th-1", subject: "Rise & Shine",               time: "7:30",  note: "Wake up, chores, pack for co-op", free: true, riseShine: true },
    { id: "th-2", subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "th-3", subject: "Co-op — BACH",                time: "10:30", note: "Full co-op day — Living Literature & Language" },
  ],
  Friday: [
    { id: "f-1",  subject: "Rise & Shine",               time: "7:30",  note: "Wake up, chores, independent morning work", free: true, riseShine: true },
    { id: "f-2",  subject: "Bible & Memory Work",         time: "9:00",  note: "A Gentle Feast · Simply Charlotte Mason verses" },
    { id: "f-3",  subject: "Living Literature",           time: "9:15",  note: "Read-aloud — Read Aloud Revival or A Gentle Feast list" },
    { id: "f-4",  subject: "Language Arts & Math",        time: "10:30", note: "First subject rotation" },
    { id: "f-5",  subject: "Nature Study",                time: "11:45", note: "Outdoor observation — sketch & narrate" },
    { id: "f-6",  subject: "Lunch",                       time: "12:30", note: "", free: true },
    { id: "f-7",  subject: "Geography",                   time: "1:00",  note: "Draw the World — current unit" },
    { id: "f-8",  subject: "Math — Independent Study",    time: "1:45",  note: "Independent work for students not in math lesson" },
    { id: "f-9",  subject: "History Timeline",            time: "1:45",  note: "Add to our Book of Centuries or timeline" },
    { id: "f-10", subject: "Spanish",                     time: "2:30",  note: "Spanish with Sophie" },
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
