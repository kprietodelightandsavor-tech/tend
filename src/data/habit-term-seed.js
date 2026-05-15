// ─── HABIT TERM: STEWARDSHIP OF APPETITE ──────────────────────────────
// A 12-week Charlotte Mason habit term for parents and families.
// Three months, three appetites: body → will → world.
//
// Pacing: Lessons unlock one at a time. The family moves at its own pace.
// No calendar days are imposed. When a lesson is marked complete, the next
// becomes available. The "Practice begins this week" note appears on the
// lesson that introduces the family rhythm shift.

export const HABIT_TERM = {
  id: "stewardship-of-appetite",
  title: "Stewardship of Appetite",
  subtitle: "A Charlotte Mason habit term for parents and families",
  description:
    "Three months. Three appetites. One quiet practice at a time. " +
    "Body, will, world — the three places appetite shows up and asks to be governed.",
  arc: "body → will → world",
  totalMonths: 3,
  totalLessons: 27,
};

export const HABIT_MONTHS = [
  // ─── MONTH ONE: EATING ───────────────────────────────────────────────
  {
    id: "month-1-eating",
    number: 1,
    title: "Eating at the Table",
    subtitle: "Body",
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

  // ─── MONTH TWO: SCREENS ──────────────────────────────────────────────
  {
    id: "month-2-screens",
    number: 2,
    title: "Screens",
    subtitle: "Will",
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

  // ─── MONTH THREE: SHOPPING ───────────────────────────────────────────
  {
    id: "month-3-shopping",
    number: 3,
    title: "Shopping",
    subtitle: "World",
    habit: "Self-Restraint in Indulgences",
    habitDefinition: "Enjoying pleasure in moderation; not being controlled by desire",
    phrase: "Not every desire needs a yes.",
    familyFocus:
      "We pause before buying. We look at what we already have first — and " +
      "ask how it could be used or worn differently, or whether something we " +
      "already own can do what the new item promises. Wanting more is a " +
      "feeling, not an instruction. Gratitude before wanting.",
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
];
