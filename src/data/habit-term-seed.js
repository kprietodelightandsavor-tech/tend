// ─── HABIT TERMS · CHARLOTTE MASON COMPANION ────────────────────────
// A Charlotte Mason habit-term system for parents and families.
// Each term is three months. Each month carries one habit, trimmed to
// roughly 8 lessons drawn from Simply Charlotte Mason's
// Laying Down the Rails for Children.
//
// Pacing: Lessons unlock one at a time. The family moves at its own
// pace. When a lesson is marked complete, the next becomes available.
// The "Practice begins this week" note appears on the lesson that
// introduces the family rhythm shift.
//
// Weekly practice check-in: every month carries a weeklyPractice block.
// Four small check-ins (Week 1, Week 2, Week 3, Week 4) sit alongside
// the lessons — not gated by them, freely available throughout the
// month. They are the gentle reminder that the habit is practiced
// between lessons, not after them.

// ─── TERM-LEVEL METADATA ─────────────────────────────────────────────
export const TERMS = [
  {
    id: "term-1-temperance",
    number: 1,
    title: "The Habit of Temperance",
    subtitle: "A Charlotte Mason habit term for parents and families",
    description:
      "Three months. One habit, three faces. " +
      "Temperance at the table, of the will, and in the world — " +
      "Mason's broad virtue of moderation in all our appetites.",
    phrase: null,
    arc: "table → will → world",
    monthIds: ["month-1-eating", "month-2-screens", "month-3-shopping"],
  },
  {
    id: "term-2-integrity",
    number: 2,
    title: "The Habit of Integrity",
    subtitle: "A Charlotte Mason habit term for parents and families",
    description:
      "Three months. One habit, three faces. " +
      "Firm adherence to a code of values; being a good steward of all that we possess.",
    phrase: "We finish what we start.",
    arc: "priorities → finishing → use of time",
    monthIds: ["month-1-priorities", "month-2-finishing", "month-3-use-of-time"],
  },
];

// ─── SPINE ATTRIBUTION (shared across terms) ─────────────────────────
export const SPINE = {
  title: "Laying Down the Rails",
  author: "Simply Charlotte Mason",
  note: "Each month's habit lessons follow the spine of Laying Down the Rails. This term is the companion structure that walks beside it.",
};

// ─── BACKWARD COMPATIBILITY ──────────────────────────────────────────
// Earlier components reference HABIT_TERM directly. Keep that export
// so nothing breaks; it points to the first term.
export const HABIT_TERM = {
  id: TERMS[0].id,
  title: TERMS[0].title,
  subtitle: TERMS[0].subtitle,
  description: TERMS[0].description,
  spine: SPINE,
  arc: TERMS[0].arc,
  totalMonths: 3,
  totalLessons: 27,
};

// ─── ALL MONTHS · BOTH TERMS ─────────────────────────────────────────
export const HABIT_MONTHS = [
  // ═══════════════════════════════════════════════════════════════════
  // TERM ONE · THE HABIT OF TEMPERANCE
  // ═══════════════════════════════════════════════════════════════════

  // ─── MONTH ONE: EATING ─────────────────────────────────────────────
  {
    termId: "term-1-temperance",
    id: "month-1-eating",
    number: 1,
    title: "Eating at the Table",
    subtitle: "at the table",
    habit: "Temperance",
    habitDefinition: "Moderation in action, thought, or feeling; restraint",
    phrase: "Appetite is a good servant.",
    familyFocus:
      "Meals and snacks happen at the table, at set times. Grazing — " +
      "the all-day open kitchen — is the habit we're gently retiring. " +
      "Hunger between eating times is survivable, and it makes real food matter again.",
    parentAnchor: {
      title: "Self-Restraint in Indulgences",
      source: "Laying Down the Rails (adult)",
      pages: "p. 144",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 128.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Meals and snacks at the table, at set times. Water between. No grazing.",
    midMonthQuestion: "What's the difference between hungry and wanting?",
    midMonthQuestionAtLesson: 6,
    weeklyPractice: {
      enabled: true,
      weeks: 4,
      prompt: "We practiced this week.",
      reminderPhrase: "Appetite is a good servant.",
      reminderPractice:
        "Meals and snacks at the table, at set times. Water between. No grazing.",
      affirmation: "Steady on.",
    },
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Temperance together. Discuss what it means to let appetite serve us instead of rule us. " +
          'Identify the family goal: "We will eat our meals and snacks at the table, at set times — and let our bodies feel real hunger between, instead of grazing all day." ' +
          "Get the kids' input on what changes feel doable.",
        teen: {
          reading: 'Ourselves, Book I, Part III, Ch. 1 — "The Appetites" (opening 2 pages)',
          source: "Ourselves by Charlotte Mason",
          question:
            "Mason calls appetite a servant. When in your life has it felt like the master?",
          note: "Leave the reading where they'll find it. Ask the question one-on-one when you're alone with them.",
        },
      },
      {
        number: 2,
        title: "Self-control brings joy",
        family:
          "Read 2 Peter 1:5–10. Discuss how temperance is also translated self-control. " +
          'Read "The Vulture" by Hilaire Belloc — "The Vulture eats between his meals, and that\'s the reason why he very, very, rarely feels as well as you and I."',
        teen: {
          quote: "We become temperate by doing temperate acts. — Aristotle",
          question:
            "Do you think that's true? What have you become by repetition without meaning to?",
          note: "Leave the quote on a card. Ask the question whenever you're alone together.",
        },
      },
      {
        number: 3,
        title: "Passing pleasure",
        family:
          "Read the Aristotle quote on moral excellence. " +
          'Read "The Flies and the Honey" from The Aesop for Children. ' +
          'Discuss greed for "a little passing pleasure" and how it can cost more than it gives.',
        teen: {
          reading: "Short passage from Ourselves on Gluttony",
          source: "Ourselves by Charlotte Mason",
          question: "What's the modern version of the flies in the honey?",
          note: "Mason names gluttony plainly, which teens respect. Let them answer without correcting.",
        },
      },
      {
        number: 4,
        title: "Parent share",
        family:
          "Tell a story from your own life — or about someone you've known — that shows temperance (or its absence). Read Titus 2:1–8.",
        teen: {
          question:
            "I'm not telling you this to teach you. I'm telling you because I'm still figuring it out.",
          note: "Tell them the story first, alone, before the family circle. Make it real — a time you couldn't stop, a time you wished you had. No moral attached.",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "Balance",
        family:
          'Serve a "feast" — a mix of healthful and less-healthful foods (desserts, fruit, vegetables, chips, cheese, etc.). ' +
          'Practice moderation in real time. "It\'s okay to eat some sugary foods and much healthful food. Don\'t take more than you can eat. Start small, add more if you\'re still hungry."',
        teen: {
          question: "What would you put on a table that would test you?",
          note: "Invite them to plan the feast with you. Authority shift. Ask while you're prepping together.",
        },
      },
      {
        number: 6,
        title: "Greed and the reflection",
        family:
          "Talk together about ways to overcome greed and selfish desire. " +
          'Read "The Dog and His Reflection" — the dog loses his real bone reaching for the bigger one in the water.',
        teen: {
          experiment:
            "Try going one day without your usual treat/drink/snack and write three sentences about what you noticed.",
          note: "Skip the fable. Offer the small self-experiment. No follow-up unless they bring it up.",
        },
        midMonth: true,
      },
      {
        number: 7,
        title: "The Proverbs",
        family:
          "Discuss the Proverbs list together: 10:19, 11:12–13, 15:1, 17:14, 17:28, 20:3, 20:19, 23:4–5, 23:20–21 (on drunkards and gluttons).",
        teen: {
          question: "Pick the one that hits hardest. Tell me why — or don't.",
          note: "Hand them the list privately. Leave it.",
        },
      },
      {
        number: 8,
        title: "Obsession",
        family:
          'Play "Continue the Story." Choose a character and pass the story around the circle. ' +
          "Play out a day where the character is obsessed with one activity and can't do anything else — including the consequences (hungry, bored, tired, ignoring family and friends). " +
          "Serious or silly.",
        teen: {
          note: "Optional join. If they decline, ask them to narrate the consequence chain aloud for the younger kids' story — they become the wise voice, not the student.",
        },
      },
      {
        number: 9,
        title: "Celebration",
        family:
          "Parent Share moment — share a story or person who exemplifies Temperance. " +
          "Hold your family celebration (the one you chose in Parent Prep). " +
          "End-of-month reflection: Where did appetite rule us? Where did we strengthen?",
        teen: {
          note: "Let them pick the celebration food, or opt out of the reflection circle and write one private line in a notebook only they see. The reflection doesn't have to be shared to count.",
        },
      },
    ],
  },

  // ─── MONTH TWO: SCREENS ────────────────────────────────────────────
  {
    termId: "term-1-temperance",
    id: "month-2-screens",
    number: 2,
    title: "Screens",
    subtitle: "of the will",
    habit: "Self-Control",
    habitDefinition: "Keeping back the expression of our passions and emotions",
    phrase: "I am the master of this, not the other way around.",
    familyFocus:
      "Screens 2–4 only. Intentional, not default. The pull to pick up, " +
      "the irritation when it's time to stop, the 'one more' — these are " +
      "passions to govern, not enemies to fear.",
    parentAnchor: {
      title: "Self-Control",
      source: "Laying Down the Rails (adult)",
      pages: "pp. 105–108",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 280.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Screens 2–4 only. Phones on the counter outside that window — parents' phones too.",
    midMonthQuestion: "What did boredom open up this week?",
    midMonthQuestionAtLesson: 6,
    weeklyPractice: {
      enabled: true,
      weeks: 4,
      prompt: "We practiced this week.",
      reminderPhrase: "I am the master of this, not the other way around.",
      reminderPractice:
        "Screens 2–4 only. Phones on the counter outside that window — parents' phones too.",
      affirmation: "Steady on.",
    },
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Self-Control together. Discuss what it means to keep back the expression of our passions and emotions. " +
          'Identify the family goal: "We will pause and breathe when we feel the pull to pick up a screen outside our 2–4 window." ' +
          "Read James 1:19–20 — quick to hear, slow to speak, slow to anger. " +
          "Get the kids' input on what changes feel doable.",
        teen: {
          reading: "Ourselves, Book I, Part III — the opening section on the Will and self-government",
          source: "Ourselves by Charlotte Mason",
          question: "Mason says the will is what makes us free. What does your will feel like when it loses?",
          note: "One-on-one. Don't push for a long answer.",
        },
      },
      {
        number: 2,
        title: "Self-control brings joy",
        family:
          'Read the Tennyson quote: "The happiness of a man in this life does not consist in the absence but in the mastery of his passions." ' +
          'Read "Anger" by Charles Lamb — anger that lasts a minute may have grace; anger that lingers grows into poison. ' +
          "Apply it to the screen-pull: the urge passes if we don't feed it.",
        teen: {
          quote:
            "The happiness of a man in this life does not consist in the absence but in the mastery of his passions. — Tennyson",
          question:
            "Mastery, not absence. What's the difference between someone who doesn't want the thing and someone who wants it and chooses not to take it?",
          note: "Leave the quote on a card.",
        },
      },
      {
        number: 3,
        title: "Obedience as stepping-stone",
        family:
          "Talk about the restraint it takes to obey a command that doesn't seem pleasant. " +
          'Play the marshmallow-on-a-spoon relay — children carry a small object on a spoon to a finish line and back without dropping it. ' +
          'They must wait for the real "Go!" and not start on "Gomer" or "low." ' +
          "The pause before action is the same muscle as putting the phone down.",
        teen: {
          experiment:
            "When you feel the pull to check your phone, count to ten before you pick it up. Do it for one day. Tell me what you noticed, or don't.",
          note: "Skip the relay. Offer the small self-experiment.",
        },
      },
      {
        number: 4,
        title: "Conquest over the weak will",
        family:
          'Read the Seneca quote: "Most powerful is he who has himself in his own power." ' +
          'Read James 3:1–12 on taming the tongue — "if you can control your tongue, you\'ll be able to control yourself in other ways also." ' +
          "Discuss: the thumb on the screen is the same muscle as the tongue.",
        teen: {
          reading: "A short passage from Ourselves on the Will's daily training",
          source: "Ourselves by Charlotte Mason",
          question:
            "Mason says the will gets stronger or weaker every single day. Which direction did yours go this week?",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "What we persist in becomes easier",
        family:
          'Read the Emerson quote: "That which we persist in doing becomes easier — not that the task itself has become easier, but that our ability to perform it has improved." ' +
          "Play the stillness game — child stands or sits perfectly still for a set number of minutes while you try to make them laugh with jokes or funny faces. " +
          "Changing thoughts to stay focused is the same skill as not picking up the phone.",
        teen: {
          question: "Was it harder to stay still or to try to break them? Which one is the screen-pull?",
          note: "Invite them to run the stillness game for the younger kids — they pick the time, they make the faces. Authority shift. Ask afterward, alone.",
        },
      },
      {
        number: 6,
        title: "Outbursts bring heartache",
        family:
          'Read "The King and His Hawk" — Genghis Khan kills his hawk in a rage, then discovers the hawk had been knocking the cup away because the spring water was poisoned. ' +
          "Discuss: what do we destroy in haste when we can't pause?",
        teen: {
          question:
            "Name one thing you've damaged — a relationship, a chance, a project — because you couldn't pause. What would the pause have cost you?",
          note: "Skip the story. Offer the question alone, in writing or in passing.",
        },
        midMonth: true,
      },
      {
        number: 7,
        title: "The Scriptures",
        family:
          "Discuss together — Proverbs 14:29 (quick-tempered equals folly), Proverbs 18:13 (listen before answering), " +
          "Galatians 5:22–25 (self-control is a fruit of the Spirit), Ephesians 4:26–27 (in anger do not sin), " +
          "1 Thessalonians 5:6–8 (be alert and self-controlled).",
        teen: {
          question: "Pick one. Live with it for a few days. We don't have to talk about it.",
          note: "Hand them the list privately.",
        },
      },
      {
        number: 8,
        title: "Celebration",
        family:
          'Read the F.D.R. quote: "We cannot always build the future for our youth, but we can build our youth for the future." ' +
          "Hold your family celebration (the one you chose in Parent Prep). " +
          "End-of-month reflection: Who are we when the screens are off? Where did we strengthen?",
        teen: {
          note: "Let them pick the celebration, or opt out of the reflection circle and write one private line in their own notebook. The reflection doesn't have to be shared to count.",
        },
      },
    ],
  },

  // ─── MONTH THREE: SHOPPING ─────────────────────────────────────────
  {
    termId: "term-1-temperance",
    id: "month-3-shopping",
    number: 3,
    title: "Shopping",
    subtitle: "in the world",
    habit: "Self-Restraint in Indulgences",
    habitDefinition: "Enjoying pleasure in moderation; not being controlled by desire",
    phrase: "Not every desire needs a yes.",
    familyFocus:
      "We pause before buying. We look at what we already have first — and " +
      "ask how it could be used or worn differently, or whether something we " +
      "already own can do what the new item promises. Gratitude before wanting.",
    parentAnchor: {
      title: "Self-Restraint in Indulgences",
      source: "Laying Down the Rails (adult)",
      pages: "pp. 144–145",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 379.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Pause Before Yes. Before buying anything non-essential, wait 24 hours. " +
      "First look at what you already own — could something be used or worn differently? " +
      "Could something you have do what the new item promises?",
    midMonthQuestion:
      "What did we want this week that we didn't need? What did we already have that turned out to be enough?",
    midMonthQuestionAtLesson: 7,
    weeklyPractice: {
      enabled: true,
      weeks: 4,
      prompt: "We practiced this week.",
      reminderPhrase: "Not every desire needs a yes.",
      reminderPractice:
        "Pause Before Yes. Look at what you already own first.",
      affirmation: "Steady on.",
    },
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Self-Restraint in Indulgences together. Discuss what it means to enjoy pleasure in moderation without being controlled by desire. " +
          'Identify the family goal: "Before we buy something new, we will first look at what we already have. Can something be used or worn differently? Can something we own do what the new item promises?" ' +
          "Read Proverbs 23:29–35. Get the kids' input on what changes feel doable.",
        teen: {
          reading: "Ourselves, passages on Avarice and the desire for possessions (Vol. 4, Bk 1, pp. 191–203)",
          source: "Ourselves by Charlotte Mason",
          question:
            "Mason says wanting can become its own kind of master. When has wanting something stolen the enjoyment of what you already had?",
        },
      },
      {
        number: 2,
        title: "Industrious in free time",
        family:
          "Discuss point two together — how free time can either feed restlessness or feed real life. " +
          "As a family, compose a Top Ten (or Top Twenty) list of ways to use free time wisely that don't involve buying or scrolling. " +
          "Post it where everyone can see.",
        teen: {
          experiment: "Make your own list — private, just for you. No sharing required.",
          question: "Which of these would actually fill you, and which would just kill time?",
        },
      },
      {
        number: 3,
        title: "The Cup-bearer",
        family:
          'Read "The Cup-bearer" from Fifty Famous People — young Cyrus refuses to throw a feast because in Persia, ' +
          '"if anyone is hungry, he eats some bread and meat. We never go to all this trouble and expense of making a fine dinner in order that our friends may eat what is not good for them." ' +
          "Discuss self-restraint in food, drink, sleep, and entertainment.",
        teen: {
          reading: "Same story, or the Ourselves passage on the discipline of contentment",
          source: "Ourselves by Charlotte Mason",
          question: "Cyrus had access to everything and chose less. What's the modern version of refusing the feast?",
        },
      },
      {
        number: 4,
        title: "The Scriptures",
        family:
          "Discuss together how these relate to Self-Restraint — Proverbs 6:9–11 (too much sleep brings poverty), " +
          "Ecclesiastes 2:1–11 (too many possessions and entertainment is chasing the wind), " +
          "Ecclesiastes 5:10–20 (love of money is meaningless).",
        teen: {
          reading: "Ecclesiastes 2 and 5",
          source: "The Bible",
          question:
            "Solomon had everything. Read what he said about it. Tell me what you think — or don't.",
          note: "Hand them the passages privately.",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "Town Mouse and Country Mouse",
        family:
          'Read "The Town Mouse and the Country Mouse." ' +
          'Discuss the trade — luxuries and dainties versus "plain food and simple life with the peace and security that go with it." ' +
          "Sometimes people chase prestige, fine things, status — and lose tranquility in the chase.",
        teen: {
          question:
            "Look at your most-used apps or the places you scroll most. What are they selling you that you didn't know you wanted before you saw it? Tell me, or just sit with it.",
          note: "Skip the fable.",
        },
      },
      {
        number: 6,
        title: "Re-imagining what you have",
        family:
          "Family activity: Each person picks one item from their closet, room, or kitchen and finds three new ways to use or wear it. " +
          "Style a shirt differently. Use a pan for something it wasn't bought for. Rearrange a corner of a room with only what's already there. " +
          "Discuss together: what did we discover that we already had?",
        teen: {
          experiment:
            "Before you add anything to a cart this week — clothes, gear, app, anything — pause and find one thing you already own that could meet the same need. Take a picture of the swap if you want, just for you.",
          note: "This one is theirs. No reporting back required.",
        },
      },
      {
        number: 7,
        title: "The Scriptures and role play",
        family:
          "Discuss Ecclesiastes 7:3–4 (the heart of fools desires constant fun), Ephesians 5:18 (do not get drunk on wine), " +
          "Hebrews 11:24–27 (Moses chose to endure rather than enjoy the pleasures of sin). " +
          'Read the Thomas Jefferson quote: "We never repent of having eaten too little." ' +
          "Role play: what do you do if a friend or sibling is urging you to overindulge in something — buying, eating, scrolling?",
        teen: {
          quote: "We never repent of having eaten too little. — Thomas Jefferson",
          question: "What's something you've never regretted having less of?",
        },
        midMonth: true,
      },
      {
        number: 8,
        title: "The Dog and His Master's Dinner",
        family:
          'Read "The Dog and His Master\'s Dinner" — the faithful dog who guards his master\'s dinner from every other dog, until one day a pack overwhelms him and he gives up and grabs a piece for himself. ' +
          "Do not stop to argue with temptation. " +
          'Discuss the saying: "You can\'t stop a bird from flying over your head, but you can keep it from making a nest in your hair."',
        teen: {
          quote:
            "It is the great curse of Gluttony that it ends by destroying all sense of the precious, the unique, the irreplaceable. — Dorothy Sayers",
          question:
            "When too-much makes everything ordinary — what have you stopped being able to enjoy because you have too much of it?",
        },
      },
      {
        number: 9,
        title: "The Fisherman and His Wife",
        family:
          'Read "The Fisherman and His Wife." The wife asks for a cottage, then a castle, then to be king, then to be master of the sun — and ends back in the dirty hut by the sea. ' +
          "Discuss: discontentment leads to over-indulgence, which still does not satisfy. Wanting more, more, more leaves us with less than we started.",
        teen: {
          reading: "Same story, or a related Ourselves passage on contentment",
          source: "Ourselves by Charlotte Mason",
          question:
            "The fisherman's wife had each thing for a moment before she wanted the next. When have you had something for a moment before you wanted the next thing?",
        },
      },
      {
        number: 10,
        title: "Celebration and term reflection",
        family:
          "Parent Share moment — tell a story from your own life about someone who lived with real contentment, or about a time you bought something you regretted. " +
          "Hold your family celebration (the one you chose in Parent Prep). " +
          "End-of-term reflection: Where did appetite rule us across these three months — at the table, on the screen, in the store? " +
          "Where did we strengthen? What stays with us going forward?",
        teen: {
          note: "Let them pick the celebration, or opt out of the reflection circle entirely and write a private term reflection in their own notebook — three lines, just for them. The growth doesn't have to be witnessed to be real.",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TERM TWO · THE HABIT OF INTEGRITY
  // ═══════════════════════════════════════════════════════════════════

  // ─── MONTH ONE: PRIORITIES ─────────────────────────────────────────
  {
    termId: "term-2-integrity",
    id: "month-1-priorities",
    number: 1,
    title: "Priorities",
    subtitle: "first things first",
    habit: "Integrity in Priorities",
    habitDefinition: "Firm adherence to a code of values; being a good steward of all that we possess",
    phrase: "First things first.",
    familyFocus:
      "We finish schoolwork and chores and enjoy the outdoors before any screen time. " +
      "What we give our time to first says what we actually value.",
    parentAnchor: {
      title: "Integrity",
      source: "Laying Down the Rails (adult)",
      pages: "pp. 92–96",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 227.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Schoolwork and chores first. Outdoors before screens. Screens come last, not first.",
    midMonthQuestion: "What did we put first this week — and what got pushed?",
    midMonthQuestionAtLesson: 6,
    weeklyPractice: {
      enabled: true,
      weeks: 4,
      prompt: "We practiced this week.",
      reminderPhrase: "First things first.",
      reminderPractice:
        "Schoolwork and chores first. Outdoors before screens. Screens come last.",
      affirmation: "Steady on.",
    },
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Integrity together: firm adherence to a code of values; being a good steward of all that we possess. " +
          "Discuss how priorities are the first place integrity shows up — what we give our time to first says what we actually value. " +
          'Identify the family goal: "We will finish schoolwork and chores and enjoy the outdoors before any screen time." ' +
          "Read 1 Timothy 5:3–10, 16 — families who order their priorities rightly become known for their good deeds. " +
          "Get the kids' input on what changes feel doable.",
        teen: {
          quote:
            "Seek first the kingdom of God and his righteousness, and all these things will be added to you. — Matthew 6:33",
          question:
            "What's the difference between what you say is important and what actually gets the first hour of your day?",
          note: "Hand them the verse on a card. Ask one-on-one when you're alone.",
        },
      },
      {
        number: 2,
        title: "The Ant and the Cricket",
        family:
          'Read "The Ant and the Cricket" from Fairy Stories and Fables by James Baldwin. ' +
          "The cricket sings through the warm months and starves in winter; the ant prioritizes the work that future-self will need. " +
          "Discuss point one: Learn how to set priorities and practice prioritizing your work. " +
          "Talk over how children can begin prioritizing for themselves even when they are young.",
        teen: {
          question:
            "Name one thing you'll be glad you did six months from now. What would you have to deprioritize this week to actually do it?",
          note: "Skip the fable.",
        },
      },
      {
        number: 3,
        title: "The greatest commandment",
        family:
          "Read Mark 12:28–31 — Love God. Love your neighbor. This is the essence of all priorities. " +
          "Read Matthew 15:1–20 — Jesus removed heavy burdens when he taught that added-on rules and traditions had become more important than actually keeping one's heart and mind pure. " +
          "He declared the heart of the matter.",
        teen: {
          reading: "Matthew 15:1–20",
          source: "The Bible",
          question:
            "What's a rule you follow that has stopped meaning anything? What's the heart of the matter underneath it?",
        },
      },
      {
        number: 4,
        title: "A Time to Talk",
        family:
          'Read "A Time to Talk" by Robert Frost — the speaker is hoeing in the field, but when a friend calls from the road, ' +
          "he thrusts his hoe into the mellow ground, blade-end up, and goes for a friendly visit. " +
          "Work must be completed, but use wisdom to know when to take a break for a more important situation that comes up in the midst of chores.",
        teen: {
          reading: '"A Time to Talk" by Robert Frost',
          source: "Robert Frost",
          question:
            "When did you last interrupt your work for a person — and was it the right call? How do you know?",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "The Milne quote",
        family:
          'Read the A. A. Milne quotation: "Organizing is what you do before you do something, so that when you do it, it\'s not all mixed up." ' +
          "Make sure the children know who Milne was (author of Winnie the Pooh). " +
          "Activity: Have the children make a list of activities in their life — both have-to and want-to. " +
          "Then help them prioritize the list by putting them in order of importance. " +
          "You can focus on a week, month, or year. Or do this as a family, focusing on field trips, service projects, sports, or special time with individual children.",
        teen: {
          experiment: "Make your own private list — no sharing required.",
          question: "Did anything surprise you about what's near the top?",
        },
      },
      {
        number: 6,
        title: "Socrates and His House",
        family:
          'Read "Socrates and His House" from Fifty Famous Stories Retold by James Baldwin. ' +
          'Socrates built himself a house so small the neighbors wondered why. He said: "Small as the place is, I shall think myself happy if I can fill even it with true friends." ' +
          "Possessions often become a measure of value, but there are far more important priorities in life than the coolness of your bicycle or the number of tech gadgets you own.",
        teen: {
          quote:
            "There are more important priorities than the coolness of your bicycle or the number of tech gadgets you own.",
          question: "What would it cost you to actually live like that's true?",
          note: "Skip the story. Offer the line itself.",
        },
        midMonth: true,
      },
      {
        number: 7,
        title: "Following God / Parent Share",
        family:
          "Discuss together — Ecclesiastes 11:7–12:14 (remember your Creator while you are young; every action counts and is seen by God) and Matthew 6:33 (seek God's kingdom first, and the rest will follow). " +
          "Have a Parent Share moment: tell a story from your life about a time you got your priorities right, or a time you didn't, and what it cost.",
        teen: {
          note: "Tell them the Parent Share story alone first, before the family circle. Make it real. No moral attached.",
        },
      },
      {
        number: 8,
        title: "Mr. Vinegar and celebration",
        family:
          'Read "Mr. Vinegar and His Fortune" from Another Fairy Reader by James Baldwin. ' +
          "Mr. Vinegar finds fifty gold pieces, trades them for a cow, the cow for bagpipes, the bagpipes for gloves, the gloves for a stick — and ends with nothing, talked into each trade by whoever happened by. " +
          "Prioritizing involves wisdom and forethought about the future. Don't let others persuade you to think only of the moment, especially if they have much to gain by their persuasion. " +
          "Hold your family celebration. End-of-month reflection: Where did we put first things first? Where did we let the next shiny thing win?",
        teen: {
          question:
            "Name one trade you've made — time, money, attention — that you'd take back now. What were you talked into?",
          note: "The Mr. Vinegar story holds up for teens too — let them join. Or ask the question separately.",
        },
      },
    ],
  },

  // ─── MONTH TWO: FINISHING ──────────────────────────────────────────
  // Lessons to be added in the next turn.
  {
    termId: "term-2-integrity",
    id: "month-2-finishing",
    number: 2,
    title: "Finishing",
    subtitle: "we don't leave it half-done",
    habit: "Integrity in Finishing",
    habitDefinition: "Firm adherence to a code of values; being a good steward of all that we possess",
    phrase: "We don't leave it half-done.",
    familyFocus:
      "We finish one thing before beginning another. We put away before we move on. " +
      "Half-finished tasks become the shape of a life if we let them.",
    parentAnchor: {
      title: "Integrity",
      source: "Laying Down the Rails (adult)",
      pages: "pp. 92–96",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 234.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Finish one thing before beginning another. Put away before moving on.",
    midMonthQuestion: "What did we finish this week that we'd usually leave half-done?",
    midMonthQuestionAtLesson: 6,
    weeklyPractice: {
      enabled: true,
      weeks: 4,
      prompt: "We practiced this week.",
      reminderPhrase: "We don't leave it half-done.",
      reminderPractice:
        "Finish one thing before beginning another. Put away before moving on.",
      affirmation: "Steady on.",
    },
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Integrity together and relate it to Finishing: firm adherence to a code of values; being a good steward of all that we possess. " +
          'Identify the family goal: "We will not make promises to complete something within a timeframe that we cannot keep." ' +
          "Read 2 Timothy 4:6–8 — Paul's reminiscence of keeping the faith until the very end. Finishing our race of faith well is the most important thing in life we could finish. " +
          "Get the kids' input on what changes feel doable.",
        teen: {
          quote:
            "I have fought the good fight, I have finished the race, I have kept the faith. — 2 Timothy 4:7",
          question:
            "What's something you started with real intention and then quietly let drop? What happened in the middle?",
          note: "Ask one-on-one when you're alone.",
        },
      },
      {
        number: 2,
        title: "Finish before you begin",
        family:
          "Discuss point two together: finish one project before beginning something new. " +
          "Young children can begin practicing this habit by putting away toys before moving to another area of play. " +
          'Read the quotation: "There is nothing so fatal to character as half-finished tasks." — David Lloyd George.',
        teen: {
          quote:
            "There is nothing so fatal to character as half-finished tasks. — David Lloyd George",
          question:
            "Is that overstated, or true? What does a pile of half-finished things do to a person over time?",
          note: "Leave the quote on a card.",
        },
      },
      {
        number: 3,
        title: "Faithful till death",
        family:
          'Read "Faithful Till Death," adapted from A Book of Golden Deeds by Charlotte M. Yonge — Gertrude stays beside her condemned husband through his last night, faithful to the very end. ' +
          "A most essential quality of Finishing is being faithful unto death. " +
          "Parental discretion advisory: this story is intense. Use your judgment on whether it fits your younger family members; you may read it only with older children.",
        teen: {
          reading: '"Faithful Till Death" from A Book of Golden Deeds by Charlotte M. Yonge',
          source: "Charlotte M. Yonge",
          question:
            "Gertrude finished what loyalty asked of her, at great cost. Where is finishing easy for you, and where would it actually cost something?",
        },
      },
      {
        number: 4,
        title: "The Oak",
        family:
          'Read and discuss the poem "The Oak" by Alfred, Lord Tennyson — "Live thy Life, young and old, like yon oak..." ' +
          "Completing tasks and school assignments and keeping promises helps one stand tall and strong, trunk and bough, naked strength.",
        teen: {
          reading: '"The Oak" by Alfred, Lord Tennyson',
          source: "Alfred, Lord Tennyson",
          question:
            "The oak stands strong in winter because of every season it finished. What are you building strength for by finishing now?",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "Genius and labor",
        family:
          'Read and discuss the quotation: "Genius begins great works; labor alone finishes them." — Joseph Joubert. ' +
          "Read Nehemiah 6:15–7:3 — amidst trials and after much hard work, the men completed the rebuilding of the walls around Jerusalem.",
        teen: {
          quote:
            "Genius begins great works; labor alone finishes them. — Joseph Joubert",
          question:
            "Starting is exciting; finishing is just work. What's one thing where you need to trade excitement for labor right now?",
        },
      },
      {
        number: 6,
        title: "Make butter",
        family:
          'Read and discuss the quotation: "Do not plan for ventures before finishing what\'s at hand." — Euripides. ' +
          "Activity: Make butter together. Fill a jar about half full with room-temperature heavy cream, add a pinch or two of salt, and take turns shaking it — about 30 minutes. " +
          "Make it fun with music or jumping activities, but encourage everyone to finish the job. Once a good lump forms, rinse it with cold water. Spread it on bread, toast, or muffins together.",
        teen: {
          note: "Invite them to run the butter-making for the younger kids — they keep the rhythm, they call the finish. Authority shift.",
          question: "Was the hardest part the start, the middle, or the end? It usually tells you something.",
        },
        midMonth: true,
      },
      {
        number: 7,
        title: "About Dogs",
        family:
          'Discuss how fulfilling one\'s duty relates to Integrity and Finishing. Read "About Dogs" from Harper\'s Third Reader, edited by James Baldwin — ' +
          "the shepherd dog Fanny, wet and exhausted, will not rest until she has gone back into the storm and brought home the three missing lambs. " +
          'Read and discuss the quotation: "Promises must be kept, deadlines met, commitments honored, not for the sake of morality, but because we become what we do or fail to do. Character is the sum of all that." — Howard Sparks.',
        teen: {
          quote:
            "We become what we do or fail to do. Character is the sum of all that. — Howard Sparks",
          question:
            "If character really is the sum of what we finish and fail to finish — what has yours been adding up to lately?",
        },
      },
      {
        number: 8,
        title: "The missing piece and celebration",
        family:
          'Share and enjoy the quotation: "There are two kinds of people: those who finish what they start, and so on." — Robert Byrne. ' +
          "Activity: Play a game where the children must retrieve a missing piece in order to finish. Freeze 10 pennies in ice cubes; have them toss 15 into a can from a distance — they will get the first 10, then notice some are missing, and must thaw the rest to finish. " +
          "(Or freeze one puzzle piece, let them assemble the puzzle, discover the gap, and thaw the last piece to complete it.) " +
          "Hold your family celebration. End-of-month reflection: Where did we finish what we started? Where did we leave it half-done?",
        teen: {
          note: "Let them join the game or run it. Or, separately: ask them to name one thing they will finish before this month closes — and then let them do it without reminders.",
        },
      },
    ],
  },

  // ─── MONTH THREE: USE OF TIME ──────────────────────────────────────
  {
    termId: "term-2-integrity",
    id: "month-3-use-of-time",
    number: 3,
    title: "Use of Time",
    subtitle: "today counts",
    habit: "Integrity in Use of Time",
    habitDefinition: "Firm adherence to a code of values; being a good steward of all that we possess",
    phrase: "Today counts.",
    familyFocus:
      "At the end of each day, we will name at least one accomplishment with which we can be satisfied as we lay our heads down to rest.",
    parentAnchor: {
      title: "Integrity",
      source: "Laying Down the Rails (adult)",
      pages: "pp. 92–96",
      note: "Read once before Lesson 1. Fill in Parent Prep, LDtR for Children p. 240.",
    },
    practiceBeginsAtLesson: 4,
    practiceText:
      "Name one accomplishment from the day before bed. One thing the day was actually for.",
    midMonthQuestion: "What did today actually count for?",
    midMonthQuestionAtLesson: 6,
    weeklyPractice: {
      enabled: true,
      weeks: 4,
      prompt: "We practiced this week.",
      reminderPhrase: "Today counts.",
      reminderPractice:
        "Name one accomplishment from the day before bed.",
      affirmation: "Steady on.",
    },
    lessons: [
      {
        number: 1,
        title: "Name it",
        family:
          "Read the definition of Integrity together and discuss how it relates to Use of Time: firm adherence to a code of values; being a good steward of all that we possess. " +
          'Identify the family goal: "At the end of each day, we will name at least one accomplishment with which we can be satisfied as we lay our heads down to rest." ' +
          "Read Titus 3:14 — a productive life consists of providing for daily necessities and doing what is good. " +
          "Get the kids' input on what changes feel doable.",
        teen: {
          quote:
            "Those who make the worst use of their time are the first to complain of its shortness. — Jean de La Bruyère",
          question:
            "Be honest — where does your time actually go? Not where you'd like it to go. Where does it go?",
          note: "Ask one-on-one when you're alone. No lecture after the answer.",
        },
      },
      {
        number: 2,
        title: "Against Idleness and Mischief",
        family:
          "Discuss point three: make good use of your time every day. " +
          'Read and discuss the poem "Against Idleness and Mischief" by Isaac Watts — "How doth the little busy bee improve each shining hour..." ' +
          "Evaluate together how your family does with this principle.",
        teen: {
          reading: '"Against Idleness and Mischief" by Isaac Watts',
          source: "Isaac Watts",
          question:
            "The bee 'improves each shining hour.' What's one shining hour you keep letting slip past unimproved?",
        },
      },
      {
        number: 3,
        title: "Working smart",
        family:
          "Working smart is as important as working hard. " +
          "Read Exodus 18:13–26 — on Jethro's advice, Moses lightened his daily workload while accomplishing more. " +
          "Read Acts 6:1–7 — the apostles delegated some tasks to capable men in order to free up time for the work only they could do.",
        teen: {
          question:
            "Moses learned to give work away. What are you carrying that someone else could carry — and what would you do with the time it freed?",
        },
      },
      {
        number: 4,
        title: "A full day's work",
        family:
          "Read and discuss two quotations together. Make sure the children know that Margaret Thatcher was Prime Minister of England and can appreciate how many things she had to do in a day. " +
          'First: "Those who make the worst use of their time are the first to complain of its shortness." — Jean de La Bruyère. ' +
          'Second: "Look at a day when you are supremely satisfied at the end. It\'s not a day when you lounge around doing nothing. It\'s when you\'ve had everything to do, and you\'ve done it." — Margaret Thatcher. ' +
          "Talk about the satisfaction that comes from a full day's work.",
        teen: {
          quote:
            "A day you are satisfied with is not a day you lounged — it's a day you had everything to do, and did it. — Margaret Thatcher (paraphrased)",
          question:
            "When did you last end a day genuinely satisfied? What made that day different?",
        },
        practiceBegins: true,
      },
      {
        number: 5,
        title: "Grown-up Land",
        family:
          'Read and discuss the poem "Grown-up Land" from Harper\'s Third Reader, edited by James Baldwin — a child asks the way to Grown-up Land and is told every road leads there, hour by hour, little by little. ' +
          "Ecclesiastes 11:9 reminds us that the way we choose to use our young years shapes the persons we will become as adults. Every action counts and is seen by God.",
        teen: {
          reading: '"Grown-up Land" from Harper\'s Third Reader',
          source: "edited by James Baldwin",
          question:
            "The poem says you reach Grown-up Land hour by hour, little by little. What are this year's hours quietly making you into?",
        },
      },
      {
        number: 6,
        title: "A balanced day",
        family:
          'Read and discuss the poem "I Meant to Do My Work Today" by Richard Le Gallienne — the speaker is called away from work by a brown bird, a butterfly, a beckoning wind. ' +
          "In a world that can have us running from one thing to the next without ever stopping to enjoy the journey, remember that a balanced schedule — with time for rest as well as work — is essential.",
        teen: {
          reading: '"I Meant to Do My Work Today" by Richard Le Gallienne',
          source: "Richard Le Gallienne",
          question:
            "There's wise rest and there's avoidance. How do you tell the difference in your own day?",
        },
        midMonth: true,
      },
      {
        number: 7,
        title: "$1440 a day",
        family:
          'Read and discuss the quotation: "If a man has any greatness in him, it comes to light — not in one flamboyant hour, but in the ledger of his daily work." — Beryl Markham. ' +
          "Activity: Do a little exercise. Pretend each child is given $1440 every day — and explain that we are each given 1440 minutes every day. " +
          "Discuss good ways to use it. Include restful, fun ideas for the end of the day when chores and have-to's are done.",
        teen: {
          quote:
            "Greatness comes to light not in one flamboyant hour, but in the ledger of daily work. — Beryl Markham",
          question:
            "You get 1440 minutes today, same as everyone. If you wrote down where they went, what would the ledger say?",
        },
      },
      {
        number: 8,
        title: "The Water Mill and term reflection",
        family:
          'Read and discuss the poem "The Water Mill" from Harper\'s Third Reader, edited by James Baldwin — "The mill will never, never grind with the water that has passed." ' +
          "We cannot get back the moments that have passed, so wisdom should be used in how we spend each one. " +
          "Have a Parent Share moment — tell a story from your life about a season you used well, or one you wish back. " +
          "Hold your family celebration. End-of-term reflection: Across these three months — priorities, finishing, use of time — where did we grow in integrity? What stays with us going forward?",
        teen: {
          reading: '"The Water Mill" from Harper\'s Third Reader',
          source: "edited by James Baldwin",
          note: "Let them pick the celebration, or write a private term reflection in their own notebook — three lines, just for them. The growth doesn't have to be witnessed to be real.",
        },
      },
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────
export const getTermById = (id) => TERMS.find((t) => t.id === id);
export const getMonthById = (id) => HABIT_MONTHS.find((m) => m.id === id);
export const getMonthsForTerm = (termId) =>
  HABIT_MONTHS.filter((m) => m.termId === termId);
