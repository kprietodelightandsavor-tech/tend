import { useState } from "react";

const HABIT_ICONS = {
  attention: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  narration: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  outdoor: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-8 4 5 3-3 4 6H3z"/><circle cx="18" cy="6" r="2"/>
    </svg>
  ),
  stillness: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  orderly: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
};

const HABIT_KEYS = ["attention", "narration", "outdoor", "stillness", "orderly"];

const HABIT_COLORS = {
  attention: { bg: "var(--sage-bg)",  border: "var(--sage-md)", text: "var(--sage)"  },
  narration: { bg: "var(--sage-bg)",  border: "var(--sage-md)", text: "var(--sage)"  },
  outdoor:   { bg: "var(--sage-bg)",  border: "var(--sage-md)", text: "var(--sage)"  },
  stillness: { bg: "var(--gold-bg)",  border: "#E0CBA8",        text: "var(--gold)"  },
  orderly:   { bg: "var(--gold-bg)",  border: "#E0CBA8",        text: "var(--gold)"  },
};


// 5 habits x 12 weeks x 7 days = 420 daily prompts
// Each week builds on the last — Week 1 is introduction, Week 12 is deep practice
// Each day[0] = Sunday through day[6] = Saturday

const HABIT_PROMPTS = {

  attention: {
    name: "Attention",
    desc: "The habit of giving full, unhurried focus to one thing at a time.",
    why: "Charlotte Mason believed attention was the mother of all habits — without it, no real learning takes place. A child who can attend fully to one thing is a child who can think, remember, and grow.",
    hardDay: "On hard days, just do one minute. Set a timer. Look at one thing — a leaf, a page, a face — for one full minute. That is enough.",
    weeks: [
      // Week 1 — Introduction
      {
        reflection: "When did you notice genuine attention this week — in yourself or your children?",
        days: [
          "Today, notice when attention wanders. Simply name it without shame: 'I got distracted.' Then come back.",
          "Read one short passage aloud today. Before narrating, sit in silence for 30 seconds. Let it settle.",
          "Ask your child to look out the window for two minutes and tell you one thing they noticed that surprised them.",
          "Put your phone in another room for one hour this morning. Notice what changes.",
          "Read a poem aloud twice — once for sound, once for meaning. Ask: what did you hear the second time that you missed the first?",
          "Do one task with full attention today — make tea, fold laundry, sweep a floor. Do it slowly and well.",
          "Rest fully today. Attention needs recovery.",
        ],
      },
      // Week 2 — Noticing
      {
        reflection: "What pulled attention away most this week? What helped it return?",
        days: [
          "Before beginning school today, spend 2 minutes outside. Look at one living thing. Name what you see.",
          "During read-aloud, ask your child to hold an image in their mind as you read. Narrate the image, not just the plot.",
          "Try a listening walk — go outside and count how many distinct sounds you can identify without speaking.",
          "Choose one subject today and do it without any background noise. Notice the difference in quality.",
          "At dinner, ask each person: what held your attention today? What pulled it away?",
          "Let your child choose one thing to observe for 5 minutes and then draw it from memory.",
          "Sit quietly as a family for 3 minutes today. No agenda — just be still together.",
        ],
      },
      // Week 3 — Building focus
      {
        reflection: "Has the length of focused attention grown this week, even slightly?",
        days: [
          "Read aloud for 15 minutes without stopping. Ask for narration only after — not during.",
          "Ask your child to complete one copywork passage without erasing. Attention to the first attempt matters.",
          "Nature study: find something small — an insect, a seed, a stone — and observe it for 3 minutes before sketching.",
          "Practice attention at meals: no books, no screens. Simply eat and talk.",
          "Read a passage that is slightly difficult. Discuss it. Ask: what did you have to work to understand?",
          "Let your child teach you something today — watch how they hold your attention. What do they do well?",
          "Rest. Do one quiet thing with your hands — knitting, drawing, building. Just one thing.",
        ],
      },
      // Week 4 — Deepening
      {
        reflection: "Where is the habit strongest in your home? Where does it still need tending?",
        days: [
          "Begin the day with 5 minutes of quiet before any instruction. Let minds wake slowly.",
          "During a lesson, when attention wanders, don't repeat — pause and wait. Let the child return on their own.",
          "Ask your child to memorize one short poem this week. Begin today — read it aloud three times slowly.",
          "Artist study: look at one painting for 3 minutes without talking. Then cover it and narrate what you remember.",
          "Try dictation — read a sentence once, and once only. No repeating. The child must attend fully the first time.",
          "Model attention: let your child see you read without distraction for 15 minutes.",
          "Take a nature walk. The goal is not exercise — it is noticing. Walk slowly.",
        ],
      },
      // Week 5 — Extending
      {
        reflection: "Can your child now sustain attention for longer than when you began? What is different?",
        days: [
          "Extend read-aloud to 20 minutes today. No interruptions — save questions for after.",
          "Introduce a new subject or topic today. Watch how the child attends to novelty. Discuss afterward.",
          "Do a full nature journal entry — observation, sketch, and watercolor. Let it take 20 minutes.",
          "Practice composer study: listen to one full piece of music without doing anything else. Narrate afterward.",
          "Try a timed copywork session — 10 minutes, focused and careful. Check quality, not quantity.",
          "Ask your child to narrate a chapter from memory — not the whole book, just one chapter. Sit with them in silence as they gather thoughts.",
          "Attend to your own soul today. Read something for yourself — not a parenting book, just something beautiful.",
        ],
      },
      // Week 6 — Consistency
      {
        reflection: "What habit-building strategies have worked best in your home?",
        days: [
          "Begin every lesson with a 30-second pause. Look at the materials. Then begin. Make it a ritual.",
          "Today's narration should be written. Ask for 4 sentences minimum — not more. Quality over length.",
          "Go outside at the same time each day this week. Predictability builds the habit.",
          "Introduce picture study — one painting per week, 5-minute observation, then narration from memory.",
          "Choose one daily task that is done carelessly and bring full attention to it for one week. Notice the difference.",
          "Read aloud from a challenging book — history, biography, science. Let the difficulty build attention.",
          "Do one craft or handwork project together. Let it take as long as it takes.",
        ],
      },
      // Week 7 — Transferring
      {
        reflection: "Is attention becoming a natural part of how your child approaches learning?",
        days: [
          "Ask your child to read silently for 10 minutes and then narrate without prompting. How did they do?",
          "During math, encourage your child to check their own work before showing you. Attention to one's own errors is a skill.",
          "Nature study: return to the same spot you visited two weeks ago. What has changed?",
          "Read a poem by heart together — the poem you began memorizing in Week 4. Can they recite it?",
          "Let your child lead a lesson today — choose the book, set the pace, direct the narration. Watch how they attend.",
          "Visit a place of beauty — a garden, a river, a library, a church. Simply be there. No agenda.",
          "Rest. Write one thing in your own journal about attention this week.",
        ],
      },
      // Week 8 — Refinement
      {
        reflection: "Where do you still see the most struggle with attention? What might help?",
        days: [
          "Practice delayed narration: read on Monday, narrate on Tuesday. Memory and attention are partners.",
          "Try a silent lesson — copywork, math, or drawing — with no verbal instructions. Just written notes.",
          "Artist study: second week with the same painting. What do you notice now that you didn't see before?",
          "Introduce a new form of narration: dramatize a scene from the book. Use the body to attend.",
          "Dictation: two sentences today, read once each. The child must carry the words in their mind to the page.",
          "Let your child choose one book to read independently for 15 minutes. Provide a quiet space and no interruptions.",
          "Do something beautiful and slow today: bake bread, press flowers, arrange a nature table.",
        ],
      },
      // Week 9 — Integration
      {
        reflection: "How has attention changed the quality of learning in your home this term?",
        days: [
          "Begin the morning with the poem from Week 4. Recite together before any lessons begin.",
          "Nature study: begin a new topic. Observe, sketch, read, narrate — the full Hylander cycle in one week.",
          "Ask your child to write a narration of something they read independently — not a book you chose.",
          "Composer study: return to a composer from earlier in the year. Does the child recognize the music?",
          "Practice attention at meals for an entire week — no books, no screens, just conversation.",
          "Take a longer nature walk today — 45 minutes if possible. Let the mind settle fully.",
          "Read something together that is beautiful and old — a psalm, a Shakespeare sonnet, a folk tale.",
        ],
      },
      // Week 10 — Strengthening
      {
        reflection: "What would you say to another homeschooling mother about building attention in her home?",
        days: [
          "Read a chapter of a challenging book — biography, natural history — and narrate as a family.",
          "Let a lesson run longer than planned today if the child is genuinely engaged. Follow the attention.",
          "Nature journal: this week focus on one species — draw it across multiple pages as it grows or changes.",
          "Practice reading aloud with dramatic pauses. Let silence be part of the story.",
          "Ask your child to explain something to a younger sibling or stuffed animal. Teaching requires deep attention.",
          "Begin a new memory piece — a psalm, a longer poem, a passage from a favorite book.",
          "Spend time in a library or bookshop today. Let the children choose freely. Trust their attention.",
        ],
      },
      // Week 11 — Celebration
      {
        reflection: "Look back at Week 1. What has genuinely changed?",
        days: [
          "Hold a narration 'feast' — each family member narrates something from the term's reading.",
          "Let the child choose their favorite subject from this term. Do it first, at full attention.",
          "Go back to the nature spot you visited in Week 7. Draw it again. Compare the two sketches.",
          "Recite every memory piece from this term together. Celebrate what has been kept.",
          "Ask your child: what is the most interesting thing you learned this term? Listen fully.",
          "Make something beautiful together to mark the term: a nature table, a commonplace entry, a drawing.",
          "Rest fully. Well-earned rest is part of the habit.",
        ],
      },
      // Week 12 — Renewal
      {
        reflection: "Which habit will you choose to tend next term? Why?",
        days: [
          "Reflect on attention as a family: what helped, what didn't, what you want to carry forward.",
          "Write a short note to yourself about what you've noticed in your children's attention this term.",
          "Spend 20 minutes in nature with no purpose — no sketching, no narration. Just be.",
          "Read something purely for delight today — not for school, just for love of reading.",
          "Let the children have a free afternoon. Watch what they attend to when nothing is required.",
          "Choose a poem to memorize next term and read it together for the first time today.",
          "Give thanks for what grew this term. Attention — even imperfect — is a gift worth tending.",
        ],
      },
    ],
  },

  narration: {
    name: "Narration",
    desc: "Telling back what was heard or read — the backbone of language and memory.",
    why: "Charlotte Mason called narration 'the act of knowing.' When a child tells back what they have read or heard, they make it their own. It builds memory, language, comprehension, and the ability to think clearly.",
    hardDay: "On hard days, narrate just one sentence. 'Tell me one thing you remember.' That is narration. It is enough.",
    weeks: [
      // Week 1
      {
        reflection: "When did narration feel natural this week? When did it feel forced?",
        days: [
          "Ask for one oral narration today after read-aloud. No prompts — just: 'Tell me what you remember.'",
          "Receive the narration without correcting it. Simply listen. Repeat back one phrase you loved.",
          "Try a picture narration: show your child a painting and ask them to tell you the story they see.",
          "After a nature walk, ask for narration of what was noticed — not what was learned, what was seen.",
          "Let narration be a conversation today: 'Tell me more.' 'What happened next?' 'What did you think of that?'",
          "Ask your child to narrate to a sibling — or to a stuffed animal — what was read this week.",
          "Rest. Let the week's reading settle without narration today.",
        ],
      },
      // Week 2
      {
        reflection: "Is narration becoming more natural, or does it still feel like a test?",
        days: [
          "Read aloud and ask for narration immediately. Compare with asking 10 minutes later — which is richer?",
          "Try a drawn narration: sketch a scene from the book. No words required.",
          "Ask for narration in the voice of a character — 'Tell me what happened, but as if you were there.'",
          "At dinner, ask: 'Tell me something from your reading today.' Make it a family rhythm.",
          "Practice narrating what you heard in a conversation — not a book. Can they tell back accurately?",
          "Ask for a narration of a nature study observation — not what the book said, what they saw.",
          "Let your child narrate a week's worth of reading in one sitting. What do they remember?",
        ],
      },
      // Week 3
      {
        reflection: "What kinds of narration come most naturally to your children?",
        days: [
          "Try written narration today — three sentences. Not more. Let brevity sharpen thought.",
          "Ask for narration of yesterday's reading — not today's. Memory and narration are partners.",
          "Read a poem and ask: 'What did you see?' Not 'What did it mean?' — 'What did you see?'",
          "Ask for a narration that begins with a feeling: 'How did that make you feel — and then what happened?'",
          "Let your child ask you to narrate something today. Model the habit by being a narrator yourself.",
          "Narrate an event from your week to your child — show them that narration is not just for school.",
          "Rest from formal narration. Notice what the children talk about without being asked.",
        ],
      },
      // Week 4
      {
        reflection: "Has the quality of narration improved? What does 'quality' mean to you in narration?",
        days: [
          "Try dictated narration: ask for narration orally, then write down what they say word for word. Read it back.",
          "Ask for narration of a biography — focus on the person, not just the events. What was this person like?",
          "Introduce timeline narration: 'Tell me what happened, in order, from beginning to end.'",
          "Nature study narration: describe what you saw as if telling someone who wasn't there.",
          "Ask for a comparative narration: 'How is this character like someone we know from another book?'",
          "Let narration be playful today — act it out, draw a map, build something that represents the story.",
          "Read one thing just for delight today — no narration required. Trust the reading.",
        ],
      },
      // Week 5
      {
        reflection: "Are your children beginning to narrate without being asked — retelling things at dinner, in play?",
        days: [
          "Try a 'loop' narration: ask child A to narrate, then child B to add what was left out.",
          "Narrate a history reading as a news report: 'This just in from ancient Rome...'",
          "Written narration: 5 sentences. Focus on using the author's own language where remembered.",
          "Ask for a narration that focuses only on one character: 'Tell me about Ruth — just Ruth.'",
          "Narrate a psalm together after reading it aloud. What images stayed?",
          "Ask for narration of a nature journal entry — describe what was drawn without showing the drawing.",
          "Rest. Notice what the children tell each other about what they've read or seen this week.",
        ],
      },
      // Week 6
      {
        reflection: "What is the most surprising thing you've heard a child narrate this term?",
        days: [
          "Try narration without prompting — simply stop reading and wait. Let the child initiate.",
          "Written narration today: one paragraph. Let them take as long as they need.",
          "Ask for a narration that includes something the child wondered — a question they have.",
          "Narrate a science or nature concept: 'Explain to me how photosynthesis works as if I'd never heard of it.'",
          "Ask for narration of a memory verse — not recitation, narration. What does this verse mean?",
          "Let narration happen in the car, on a walk, at lunch — not just during school time.",
          "Read a poem for the second time this term. Narrate what is different in the hearing now.",
        ],
      },
      // Week 7
      {
        reflection: "Is narration becoming a natural way your children process what they learn?",
        days: [
          "Ask for a written narration that the child is proud of. Let them revise one sentence if they want.",
          "Introduce 'oral essay' narration: 'Tell me what you think about this — and why.'",
          "Nature narration: sketch, then narrate the sketch as if describing it to someone who can't see it.",
          "Ask for narration of a history event from the perspective of someone who was there.",
          "Try a narration relay: each person adds one sentence. Build the story together.",
          "Narrate a letter: write what you would say to a character in the book.",
          "Rest. Let the children play freely — and listen for narration that happens naturally.",
        ],
      },
      // Week 8
      {
        reflection: "What form of narration has surprised you with its richness?",
        days: [
          "Ask for narration of something from two weeks ago. What has stayed?",
          "Written narration: let the child choose the passage they want to narrate.",
          "Ask for a comparative narration: 'How is this story like something from the Bible?'",
          "Narrate a piece of music — what story did you hear? What did you see?",
          "Ask for narration that includes a personal connection: 'This reminds me of...'",
          "Try silent narration: the child draws or maps what they remember, without speaking.",
          "Read aloud without announcing narration afterward. Ask three days later what they remember.",
        ],
      },
      // Week 9
      {
        reflection: "How has narration changed the way your children listen?",
        days: [
          "Ask for narration of the whole term's reading in one sitting — a 'feast of narration.'",
          "Written narration: one paragraph, from memory, without notes. Let it be imperfect.",
          "Ask for narration of a psalm — the images, the feeling, the movement of thought.",
          "Try narration as letter-writing: write to a friend about what you read this week.",
          "Ask for narration of a nature observation made months ago. Memory is a form of narration.",
          "Let narration be a gift: ask your child to prepare a narration to share at dinner.",
          "Rest. Write your own narration today — of the term, of what you've noticed, of what you're grateful for.",
        ],
      },
      // Week 10
      {
        reflection: "What do you want narration to look like in your home next term?",
        days: [
          "Ask for narration that includes something the child found difficult or confusing.",
          "Introduce speech-form narration: stand up and deliver the narration as a short talk.",
          "Written narration: let the child illustrate it. The picture is part of the narration.",
          "Ask for narration of a concept — not a story — something abstract they've been learning.",
          "Narrate a conversation from history: what might Moses have said to Pharaoh?",
          "Ask for narration from a book the child is reading independently. What is happening?",
          "Listen to your child narrate to someone outside the family. How do they do?",
        ],
      },
      // Week 11
      {
        reflection: "What is the most beautiful narration you've heard this term?",
        days: [
          "Hold a narration celebration: each child shares their favorite narration from the term.",
          "Ask for a narration that begins with the end and works backward.",
          "Written narration: their best work from this term, copied out neatly.",
          "Ask for narration of a habit they've been building — not a book, but a practice.",
          "Let the children narrate something to grandparents or a friend — real audience, real stakes.",
          "Narrate together as a family: one voice adds, another continues. Build it together.",
          "Rest. Give thanks for the words that have grown this term.",
        ],
      },
      // Week 12
      {
        reflection: "How will you carry narration forward — not just in school, but in your family's life?",
        days: [
          "Ask your child: what is narration for? Listen to how they understand it now.",
          "Write down one narration from this term in your own journal — something worth keeping.",
          "Let the children choose what to narrate on the last day — anything from the whole year.",
          "Read something beautiful together and simply receive it. No narration today.",
          "Ask for a narration of a memory — not a book, but a moment from this term that stands out.",
          "Begin a commonplace book together: write one narrated passage, copied and beautiful.",
          "Rest and give thanks. Words given, words received. That is narration.",
        ],
      },
    ],
  },

  outdoor: {
    name: "Outdoor Time",
    desc: "Regular time in nature — for movement, observation, and living study.",
    why: "Charlotte Mason prescribed six hours of outdoor time daily for young children, and daily outdoor time for all ages. Nature is not a backdrop for learning — it is a primary teacher. The child who knows the outdoors knows the world.",
    hardDay: "On hard days, just open the door. Stand outside for two minutes. Breathe. Let the air do what it does.",
    weeks: [
      { reflection: "Did we get outside every day this week? What prevented us when we didn't?", days: ["Go outside before any screens or lessons today. Even ten minutes.", "Find one living thing outside today and simply watch it for two minutes.", "Take your read-aloud outside. Sit on the ground if you can.", "Let outdoor time be completely unstructured today — no agenda, no narration.", "Ask your child to find something they've never noticed before in your yard or neighborhood.", "Walk slowly. The goal is not distance — it is seeing.", "Rest outside today. Sit in the sun, the shade, or under the sky."] },
      { reflection: "What do the children notice outdoors that they wouldn't notice indoors?", days: ["Go out in weather that is not ideal. Let the children experience cold, wind, or rain.", "Find one small thing — a seed, a feather, an insect — and bring it inside to sketch.", "Ask: what sounds do you hear? List them all before anyone speaks.", "Take a nature walk to a new place — a different street, a park, a trail.", "Observe the sky for five minutes. What does it tell you about the day?", "Find evidence of an animal. What story does it tell?", "Sit outside at a different time of day than usual. What is different?"] },
      { reflection: "Has outdoor time become a natural rhythm, or does it still feel like a scheduled activity?", days: ["Begin today's nature study outdoors — observe before you read.", "Let the children dig in the dirt today. No agenda. Just dirt.", "Walk to collect something: leaves, seeds, stones, feathers. Build a nature table.", "Find water — a puddle, a stream, a birdbath — and observe what lives near it.", "Sketch something outside today. It doesn't need to be beautiful. It needs to be honest.", "Take a longer walk — 30 minutes if possible. Let the mind settle.", "Rest in a favorite outdoor spot. Bring a book or simply sit."] },
      { reflection: "What living thing have the children learned the most about through outdoor observation?", days: ["Go out at dawn or dusk — a different kind of light, a different kind of world.", "Track the same tree or plant each week for the rest of the term. Notice what changes.", "Find an insect and follow it. Where does it go? What does it do?", "Collect soil from two different places. Compare them. What is different?", "Ask your child to lead the outdoor time today — they choose where to go and what to do.", "Go out without shoes if safe and weather permits. Notice what changes.", "Sit in one spot for ten minutes and count every living thing you can find."] },
      { reflection: "Are the children beginning to notice things outdoors without being prompted?", days: ["Begin a weather journal: temperature, sky, wind, what is growing or blooming.", "Look for signs of the season changing. What tells you?", "Find something that is decaying — a log, fallen leaves, old fruit — and observe it closely.", "Go out after rain. What is different? What has the rain revealed?", "Let the children build something outside: a dam, a shelter, a bird feeder.", "Walk somewhere you have never walked before. Observe what changes.", "Rest outside as a family. No agenda — just be together under the sky."] },
      { reflection: "What would outdoor time look like in your home if it were fully a habit — as natural as eating?", days: ["Take a full outdoor morning: no school inside until after lunch.", "Study one bird this week. Find it, watch it, sketch it, learn its call.", "Observe the same spot at the same time each day this week. Record what changes.", "Let the children forage for something edible if safe — berries, herbs, greens.", "Build a fire if possible. Let the children tend it. Observe how fire works.", "Walk in silence for the first five minutes. Then talk freely.", "Let outdoor time bleed into school: bring math problems outside, read under a tree."] },
      { reflection: "How has outdoor time changed the children's relationship with the natural world?", days: ["Spend the whole morning outside. Take books, paper, pencils.", "Study the moon this week — its phase, its rise, its light.", "Find and observe an animal home: a burrow, a hive, a nest, a web.", "Let the children plant something — a seed, a bulb, a cutting.", "Walk at night if safe. What is different? What do you hear?", "Sketch the same outdoor scene two weeks apart. What has changed?", "Rest outside as a family after a long week. Let the outdoors restore."] },
      { reflection: "What would you tell a family who thinks outdoor time is a luxury rather than a necessity?", days: ["Go out in every kind of weather this week — embrace what each day offers.", "Observe the soil and what lives in it. Earthworms, beetles, roots.", "Find something that has been damaged — a broken branch, storm debris — and observe how nature repairs itself.", "Study clouds today. Name what you see. Watch how they move.", "Let outdoor time be the first thing today — before breakfast if possible.", "Find a source of running water and spend time near it.", "Rest. Sit in your favorite outdoor spot and give thanks for this world."] },
      { reflection: "How has regular outdoor time changed the children's behavior and mood?", days: ["Take a nature study walk focused only on smell today. What do you smell? Where does it lead?", "Find evidence of last night — animal tracks, dew, fallen leaves.", "Observe a flower from bud to bloom over the course of the week.", "Let the children make something from entirely natural materials.", "Walk to the same spot you visited in Week 4. What has changed since then?", "Study one tree today: its bark, its roots, its leaves, what lives in it.", "Rest in the shade if summer, in the sun if winter."] },
      { reflection: "What has nature taught your family this term that no book could have taught?", days: ["Spend the morning at a nature preserve, farm, or wild place.", "Find something in nature that is perfectly adapted to its purpose. Discuss how.", "Observe the relationship between two living things — predator and prey, flower and bee.", "Let the children lead a nature walk. They choose the route, the pace, the focus.", "Find something invisible — wind, sound, temperature — and make it visible through observation.", "End the day with 10 minutes of stargazing if skies are clear.", "Rest fully. Let the whole week outside be received with gratitude."] },
      { reflection: "What single outdoor experience from this term has stayed with you most vividly?", days: ["Go to a place of water — ocean, river, lake, or stream — and spend an hour.", "Study migration: what birds or animals are moving through your area right now?", "Find the oldest living thing you can access — a tree, a rock formation, a coral — and stand in its presence.", "Let the children dig and explore freely. No direction.", "Observe a sunrise or sunset in full.", "Walk your neighborhood as a naturalist: what grows between the cracks? What lives on the walls?", "Rest outside. Let this term's outdoor time be received as a gift."] },
      { reflection: "How will you protect outdoor time next term, even when the schedule fills up?", days: ["Declare outdoor time non-negotiable this term — it happens before any screen, any errand, any lesson.", "Walk somewhere new today. Let discovery happen.", "Sketch the natural world around your home in a seasonal record — this is what it looked like today.", "Let nature lead your studies this week — follow what the children find outside into books and learning.", "Go out and do nothing. No sketching, no narrating. Just be in the world.", "Find something in nature that you do not know the name of. Learn it.", "Give thanks for the outdoor world that has taught you so much this term."] },
    ],
  },

  stillness: {
    name: "Stillness",
    desc: "The practice of quiet — rest, composure, and unhurried presence.",
    why: "Charlotte Mason understood that a child who cannot be still cannot truly attend. Stillness is not passive — it is an active practice of composure, self-possession, and readiness to receive. It is the ground from which all other habits grow.",
    hardDay: "On hard days, sit down. Just sit. Don't try to make the stillness perfect — just let yourself stop moving for two minutes.",
    weeks: [
      { reflection: "What does stillness look like in your home right now? What does it feel like when it's present?", days: ["Begin today with 2 minutes of silence before any lessons. No explanation — just silence.", "Notice when your home is loudest today. What is causing it? What would help?", "Ask the children to sit quietly for 3 minutes and listen. Then ask: what did you hear?", "Model stillness: let your children see you sit quietly and read for 15 minutes.", "Before bed, spend 5 minutes in quiet — no devices, just the sounds of evening.", "Let the weekend morning begin slowly. No rushing. No schedules until 9 AM.", "Rest fully and quietly today. No agenda."] },
      { reflection: "Is stillness a relief or an effort in your home right now?", days: ["Begin each lesson with a seated pause. Hands in lap. Eyes forward. Ready.", "Practice waiting without complaint today. When something takes time, receive it quietly.", "Read a psalm aloud slowly. Sit in silence for one minute after. Don't explain — just receive.", "Ask your child to complete a task in silence — copywork, math, or drawing.", "Let one hour today have no background noise — no music, no podcasts, no TV.", "Take a walk in silence for the first five minutes. Let the world speak.", "Rest outside in silence. Notice what fills the quiet."] },
      { reflection: "What helps your children settle? What makes stillness harder to find?", days: ["Practice a settling ritual: same song, same candle, same posture — every morning.", "Ask the children to rest their eyes for 3 minutes while you read aloud. Then narrate.", "Practice composure at the table: sitting well, eating quietly, speaking one at a time.", "After outdoor time, come inside and sit quietly for 5 minutes before school. Let outside settle.", "End the school day with quiet reading — no discussion, just reading.", "Introduce a daily quiet time: every child in their room for 30 minutes after lunch.", "Rest well today. Stillness is not laziness — it is preparation."] },
      { reflection: "Is there a particular time of day when stillness is most possible? How can you protect it?", days: ["Begin each lesson without speaking. Write the first instruction. Let them read it.", "Practice stillness during a task that usually creates noise — let them feel the difference.", "Read poetry aloud slowly, with pauses. Don't explain. Let the images settle.", "Take five minutes of stillness before prayer or before any sacred practice.", "Ask: what happens in your mind when you are still? Let them answer honestly.", "Let the afternoon be quieter than the morning. Protect the slow hours.", "Rest. Read or sleep or sit. Choose stillness freely today."] },
      { reflection: "What has changed in the children since you began attending to stillness?", days: ["Practice stillness in a noisy place — a café, a waiting room, a busy street. Can they find it internally?", "Ask the children to do something slowly that they usually rush: dress slowly, eat slowly, begin slowly.", "Read a nature passage aloud. Then go outside and try to find what was described — slowly.", "Practice composure when something goes wrong: spilled milk, a wrong answer, a frustration. Breathe first.", "Let there be an hour with no entertainment — no music, no stories, no screens. What do they do?", "Take a longer outdoor walk in silence. 15 minutes without speaking.", "Rest in the fullest sense: sleep, or lie still, or sit in the sun. Let the body stop."] },
      { reflection: "What is the relationship between stillness and attention in your children?", days: ["Begin the day with a spoken intention: 'Today we will be still before we are busy.'", "Practice stillness in transitions: moving from one lesson to another with a brief pause.", "Read a long poem aloud — not stopping to explain. Let stillness carry it.", "Ask the children to sit with a question — not answer it, just sit with it: 'What does justice mean?'", "Let dinner be quiet and slow today. No hurry. Let the meal be a rest.", "Go somewhere still — a library, a church, a garden — and simply be there.", "Rest. Let this week's stillness become a memory of peace."] },
      { reflection: "Does stillness feel more natural now than it did in Week 1? What is different?", days: ["Practice stillness in response to excitement: when something wonderful happens, receive it quietly first.", "Read a challenging passage slowly. Let the difficulty be still, not anxious.", "Spend 10 minutes in complete silence as a family. No fidgeting, no whispering.", "Ask: what does it feel like when you are not still — what is happening inside? Let them describe it.", "Practice composure when corrected: receiving feedback without tears or argument.", "Let the evening be long and slow. No rushing to bed. Just quiet winding down.", "Rest. Write one sentence about what stillness has given you this week."] },
      { reflection: "How is stillness changing the emotional climate of your home?", days: ["Begin with a blessing or a prayer of stillness before any work begins.", "Practice sitting without doing — for 5 minutes. Not meditation, just being.", "Read a difficult history or biography passage. Sit with its weight before moving on.", "Let a child who is upset simply sit quietly for a few minutes before speaking.", "Practice stillness at the table: no rising until the meal is finished and thanks is given.", "Take a late afternoon walk as the light changes. Notice how stillness enters the hour.", "Rest deeply today. Protect the rest."] },
      { reflection: "What would it look like for stillness to be fully woven into your family's daily life?", days: ["Begin each day this week without speaking for the first 10 minutes.", "Let there be no hurrying today. Adjust the schedule to match the pace of stillness.", "Read something beautiful and old — a prayer, a psalm, a poem from another century.", "Ask the children to find stillness in their own bodies: where does tension live? Can they release it?", "Practice composure in public: in a shop, at a library, at church — no running, no shouting, no demanding.", "Go to a place of stillness: a field, a chapel, an empty beach. Sit in it.", "Rest. Give the week over to quiet."] },
      { reflection: "What does your family's practice of stillness say about what you value?", days: ["Let stillness open the week: Monday begins in quiet before it begins in noise.", "Practice receiving bad news with composure. Talk about it before it's needed.", "Read a book of Psalms in its entirety over the week — one or two each day, slowly.", "Ask: what do you hear in the silence? Let each child answer in their own time.", "Practice the still small voice: speak to your children quietly today. Notice how they listen.", "Let the weekend include long stretches of unstructured quiet — reading, drawing, being.", "Rest as a form of trust: the week is done. Let it be."] },
      { reflection: "What is one gift stillness has given your family this term?", days: ["Let this week begin with a celebration of quiet: candles at breakfast, a psalm, gentle music.", "Ask each child: what does stillness feel like now compared to the beginning of term?", "Read something from this term's reading that required stillness to receive. Read it again.", "Let narration happen quietly: written, not spoken. Let the words come from a still place.", "Practice stillness in the last week of term: slow down before the break begins.", "Go to a favorite outdoor place and simply sit for 20 minutes. Nothing else.", "Rest and give thanks. Stillness is a gift this term has given."] },
      { reflection: "How will you protect stillness in the next term, even when life becomes full?", days: ["Choose one daily ritual of stillness you will keep next term. Name it.", "Begin the last week slowly — don't fill it with finishing and wrapping up. Let it breathe.", "Read something beautiful aloud and let it stand without comment.", "Let the children have an unstructured day. Observe what stillness they find on their own.", "Give thanks for the quiet moments of this term — name them, one by one.", "Rest fully. Let the term end in peace, not exhaustion.", "Begin something new in stillness: a new notebook, a new plan, a new hope."] },
    ],
  },

  orderly: {
    name: "Orderly Work",
    desc: "Beginning and finishing a task with care — order as an act of love.",
    why: "Charlotte Mason understood that orderly habits are not about control — they are about freedom. A child who begins and finishes well, who tends their space and their work with care, is a child who can pursue beauty and learning without friction.",
    hardDay: "On hard days, just finish one thing. One task, completed and put away. That is order. That is enough.",
    weeks: [
      { reflection: "What does order look like in your home right now? Where does it break down?", days: ["Today, before beginning school, spend 5 minutes making the school space ready. Books in place, pencils sharpened.", "Practice beginning well: before any task, pause and prepare the materials before you begin.", "Finish one thing completely today before moving to the next.", "Ask the children to put their school materials away completely before leaving the table.", "Tidy one space in your home together — slowly and with care, not just quickly.", "Let Saturday include a gentle home tidy — order as an act of loving the space.", "Rest in an ordered home. Notice how it feels different."] },
      { reflection: "Where does disorder cost your family the most time and energy?", days: ["Begin by naming what order means: 'We take care of our things because they matter.'", "Practice a morning routine until it becomes automatic: same order, every day.", "Ask each child to name their most disordered habit. Address one together.", "Before bed, spend 5 minutes setting tomorrow's school space in order.", "Let one child lead the tidy today — they assign tasks, they check the work.", "Do one task beautifully today: set the table with care, arrange the books with intention.", "Rest. A well-ordered week deserves a well-rested weekend."] },
      { reflection: "Is order becoming a rhythm, or does it still require constant effort?", days: ["Practice beginning without being told: when it is time, begin.", "Finish a project that has been left undone. Completion is a form of order.", "Tidy the school space in the middle of the day — not just at the end.", "Ask: what would our home look like if we all treated our things with great care?", "Do a slow, thorough tidy of one room together. Notice the difference between fast tidy and careful tidy.", "Let orderly work be a form of service: 'I am tidying this for our family.'", "Rest well in the knowledge that the week was finished well."] },
      { reflection: "What role does order play in learning? How does disorder interrupt attention?", days: ["Practice orderly transitions: from one lesson to another, tidy before you move.", "Ask the children to check their own work before showing you. Order begins with self-checking.", "Let one child be in charge of the school space this week. Give them the responsibility fully.", "Practice beginning at the appointed time — not late, not reluctantly, but well.", "Do a full book tidy: every book on a shelf, spine facing out, in some kind of order.", "Let the order of the school day itself be an act of care: a gentle rhythm that the family can trust.", "Rest. The work is done. Put it away."] },
      { reflection: "What has changed in the quality of the children's work since you began attending to order?", days: ["Introduce a checklist for morning routine. Let each child check off their own tasks.", "Practice finishing completely: a lesson is not over until the materials are put away.", "Ask: what does it mean to take care of something? Let them answer with examples.", "Tidy a drawer or shelf together — one small space, done with care.", "Let copywork be done with full attention to neatness and care — order on the page.", "Go outside and tidy the outdoor space — a garden corner, a porch, a path.", "Rest in a home that has been tended this week."] },
      { reflection: "Is orderly work becoming a source of satisfaction rather than a burden?", days: ["Introduce the idea of 'first things first': most important task done before the pleasurable ones.", "Practice waiting in order: taking turns, speaking one at a time, moving through the house without rushing.", "Let a child organize a section of the library or book collection. Give them authority over it.", "Do one creative project from beginning to end without stopping in the middle.", "Tidy together after dinner — the kitchen, the table, the school space — as a family act.", "Let Saturday morning be a thorough home-tending: each person with a task, done well.", "Rest. Give thanks for the order the week has held."] },
      { reflection: "Where does order still break down? What would help?", days: ["Begin each lesson by naming what you will do and how long it will take. Order of mind before order of space.", "Practice returning things to exactly where they belong — not close, exactly.", "Ask: what does it feel like when things are in order? When they are not?", "Let one child choose how to arrange the school space today. Receive their order.", "Do a full sort of the craft or art supplies: what is used, what is not, what needs replacing.", "Practice beginning and ending the day in the same way — a ritual of order at morning and evening.", "Rest. Order is not control. It is love made visible."] },
      { reflection: "What does order as a form of love look like in your home?", days: ["Practice orderly speech: saying what you mean, saying it clearly, saying it once.", "Finish the term's unfinished projects — one at a time, completely.", "Ask each child to tidy their own room with full care — not just surface order, but genuine order.", "Let one lesson today be done with extraordinary care: slow, beautiful, complete.", "Do a family project that requires order: cooking a full meal, planting a garden bed, building something.", "Let the weekend be an ordering of the week — physical, mental, and relational.", "Rest. A well-ordered life has room for rest."] },
      { reflection: "How has orderly work changed the children's relationship to their own things and space?", days: ["Practice the habit of finishing: every sentence complete, every task done before the next begins.", "Ask: what does our home need from us today? Let the children answer and respond.", "Let tidying be joyful today — put on music, work together, make it beautiful.", "Do a deep tidy of the school space: wipe surfaces, sharpen pencils, replace what is worn.", "Practice orderly transitions between home and away — leaving and returning with care.", "Let one afternoon be fully unscheduled but ordered: free time with tidiness before and after.", "Rest in an ordered home. Give thanks for the beauty of things in their places."] },
      { reflection: "What does 'orderly work' mean to you now that it has become a habit?", days: ["Let orderly work be a meditation today: do one household task slowly, with full attention.", "Practice the orderly expression of feelings: 'I feel frustrated because...' — even in children.", "Do a final sort of the year's school materials: keep, archive, recycle.", "Ask: what would we like to do better next term with our work habits?", "Let the children arrange and display some of the term's work — a small exhibition of orderly effort.", "Go through the home together with fresh eyes: what needs attention that has been ignored?", "Rest. Let the week's order be received as a gift to the family."] },
      { reflection: "What is the most beautiful example of orderly work you've seen in your family this term?", days: ["Celebrate orderly work today: notice and name it when you see it. 'You finished that beautifully.'", "Ask each child to name one area of orderly work they are proud of from this term.", "Do a final thorough school space tidy — prepare it for next term.", "Write a note to each child about one area of orderly growth you have noticed.", "Let the final week slow down — don't rush to finish everything. Finish well.", "Take everything off one shelf and put it back with intention. That is enough.", "Rest. The term is nearly done. Let it end in quiet order."] },
      { reflection: "How will you carry orderly work forward as a value — not just a habit?", days: ["Begin the last week with an act of order: tidy, prepare, set things right.", "Ask: what is the connection between orderly work and kindness to others?", "Do a final project together — something that requires sustained orderly effort.", "Let each child choose one area of order they want to grow in next term. Write it down.", "Tidy the home together on the last day of term. Leave it ready for rest.", "Rest in the fullness of a well-tended term.", "Give thanks for the order that has made space for learning, beauty, and love."] },
    ],
  },

};;

const HABIT_AGES = {
  attention: [
    { age: "Ages 4-7",   note: "One minute of focused looking. A picture, a bug, a candle flame. That is enough." },
    { age: "Ages 8-11",  note: "Five minutes of sustained work without interruption. Build slowly over the term." },
    { age: "Ages 12+",   note: "Twenty minutes of focused, independent work. Silent reading, writing, or study." },
  ],
  narration: [
    { age: "Ages 4-7",   note: "One sentence is a narration. 'The man went up the mountain.' Receive it fully." },
    { age: "Ages 8-11",  note: "Oral narration of a full paragraph or scene. Written narration of 3-5 sentences." },
    { age: "Ages 12+",   note: "Written narration of a full passage. Essay-form narration with a beginning, middle, and end." },
  ],
  outdoor: [
    { age: "Ages 4-7",   note: "Daily outdoor time, unstructured. Dig, run, collect, explore. No agenda." },
    { age: "Ages 8-11",  note: "Nature journal entries, nature walks with observation and sketching." },
    { age: "Ages 12+",   note: "Independent nature study, field guides, sustained observation of one species or system." },
  ],
  stillness: [
    { age: "Ages 4-7",   note: "Two minutes of quiet sitting. Listening. Watching. No talking." },
    { age: "Ages 8-11",  note: "Five minutes of stillness. A quiet transition between lessons. A settled posture." },
    { age: "Ages 12+",   note: "Ten minutes of purposeful quiet — meditation, prayer, or simply being. Self-directed." },
  ],
  orderly: [
    { age: "Ages 4-7",   note: "One thing at a time. Put it away before taking out the next. That is orderly work." },
    { age: "Ages 8-11",  note: "Begin and finish a task completely. School materials put away before leaving the table." },
    { age: "Ages 12+",   note: "Self-directed orderly work. Managing a schedule, a project, or a space independently." },
  ],
};


export default function HabitScreen({ onNavigate, settings }) {
  const activeHabit  = settings?.activeHabit || "attention";
  const currentWeek  = settings?.week || 1;
  const [selected, setSelected] = useState(activeHabit);
  const [view, setView]         = useState("today"); // today | why | arc

  const day    = new Date().getDay();
  const habit  = HABIT_PROMPTS[selected];
  const HIcon  = HABIT_ICONS[selected];
  const colors = HABIT_COLORS[selected];

  // Get the week index (0-11) clamped to available weeks
  const weekIdx    = Math.min(Math.max((currentWeek - 1), 0), 11);
  const weekData   = habit.weeks[weekIdx];
  const todayPrompt = weekData?.days[day] || habit.weeks[0].days[day];
  const reflection  = weekData?.reflection || "";

  const handleSetFocus = async () => {
    if (settings?.saveToMeta) {
      await settings.saveToMeta({ active_habit: selected });
    }
  };

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Charlotte Mason</p>
      <h1 className="display serif" style={{ marginBottom: 24 }}>Habits</h1>

      {/* Habit selector tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {HABIT_KEYS.map(key => {
          const h  = HABIT_PROMPTS[key];
          const c  = HABIT_COLORS[key];
          const isActive = key === selected;
          const HI = HABIT_ICONS[key];
          return (
            <button key={key} onClick={() => setSelected(key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, border: "1px solid " + (isActive ? c.border : "var(--rule)"), background: isActive ? c.bg : "none", cursor: "pointer", transition: "all .2s" }}>
              <span style={{ color: isActive ? c.text : "var(--ink-faint)", display: "flex" }}><HI /></span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: isActive ? c.text : "var(--ink-faint)" }}>{h.name}</span>
            </button>
          );
        })}
      </div>

      {/* View tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--rule)", marginBottom: 20 }}>
        {[["today", "Today"], ["why", "Why It Matters"], ["arc", "12-Week Arc"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: "8px 12px", background: "none", border: "none", borderBottom: "2px solid " + (view === v ? colors.text : "transparent"), cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: view === v ? colors.text : "var(--ink-faint)", transition: "all .2s", marginRight: 4 }}>
            {label}
          </button>
        ))}
      </div>

      {/* TODAY view */}
      {view === "today" && (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: colors.text }}>
              Week {weekIdx + 1} of 12
            </p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)" }}>
              {habit.name}
            </p>
          </div>

          {/* Today's prompt */}
          <div style={{ background: colors.bg, border: "1px solid " + colors.border, borderRadius: 4, padding: "20px", marginBottom: 16 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: colors.text, marginBottom: 12 }}>
              Today's Practice
            </p>
            <p className="corm italic" style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1.85 }}>
              {todayPrompt}
            </p>
          </div>

          {/* Hard day tip */}
          <div style={{ padding: "14px 16px", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, marginBottom: 16 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>
              On Hard Days
            </p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.7 }}>
              {habit.hardDay}
            </p>
          </div>

          {/* Weekly reflection */}
          <div style={{ padding: "14px 16px", background: "none", border: "1px solid var(--rule)", borderRadius: 4, marginBottom: 24 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>
              This Week's Reflection
            </p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.7 }}>
              {reflection}
            </p>
          </div>

          {/* Age-specific note */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 10 }}>
              By Age
            </p>
            {HABIT_AGES[selected].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontWeight: 700, color: colors.text, minWidth: 60, paddingTop: 2 }}>{a.age}</span>
                <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.6 }}>{a.note}</p>
              </div>
            ))}
          </div>

          {selected !== activeHabit && (
            <button className="btn-sage" style={{ width: "100%", marginBottom: 16 }} onClick={handleSetFocus}>
              Set {habit.name} as My Focus Habit
            </button>
          )}
        </div>
      )}

      {/* WHY view */}
      {view === "why" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ color: colors.text }}><HIcon /></span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--ink)" }}>{habit.name}</h2>
          </div>
          <p className="corm italic" style={{ fontSize: 17, color: "var(--ink)", lineHeight: 1.85, marginBottom: 20 }}>
            {habit.desc}
          </p>
          <div style={{ background: colors.bg, border: "1px solid " + colors.border, borderRadius: 4, padding: "20px", marginBottom: 20 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: colors.text, marginBottom: 12 }}>
              Charlotte Mason on {habit.name}
            </p>
            <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.85 }}>
              {habit.why}
            </p>
          </div>
          <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, padding: "16px 18px" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 10 }}>
              A Foundational Thought
            </p>
            <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8, marginBottom: 8 }}>
              "The mother who takes pains to endow her children with good habits secures for herself smooth and easy days; while she who lets their habits take care of themselves has a weary life of endless friction."
            </p>
            <p className="caption">— Charlotte Mason, Home Education</p>
          </div>
        </div>
      )}

      {/* 12-WEEK ARC view */}
      {view === "arc" && (
        <div>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 20 }}>
            Each week builds on the last. The habit deepens gradually — from introduction to integration.
          </p>
          {habit.weeks.map((w, i) => {
            const isCurrent = i === weekIdx;
            return (
              <div key={i} style={{ marginBottom: 12, padding: "14px 16px", borderRadius: 4, border: "1px solid " + (isCurrent ? colors.border : "var(--rule)"), background: isCurrent ? colors.bg : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isCurrent ? 10 : 0 }}>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: isCurrent ? colors.text : "var(--ink-faint)", minWidth: 60 }}>
                    Week {i + 1}{isCurrent ? " \u2190 now" : ""}
                  </span>
                  <p className="corm italic" style={{ fontSize: 14, color: isCurrent ? "var(--ink)" : "var(--ink-faint)", lineHeight: 1.5 }}>
                    {w.reflection}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={() => onNavigate("home")}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", marginTop: 8, fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", padding: "10px 0" }}>
        Back to Home
      </button>
    </div>
  );
}
