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

// Family habit-training activities
// One per day, 7 days x 12 weeks x 5 habits
// These are done WITH the children to build the habit

const HABIT_ACTIVITIES = {

  attention: [
    // Week 1 — Introduction: What is attention?
    { reflection: "When did you notice genuine attention this week?",
      days: [
        { prompt: "Ask your child to look at one thing for a full minute before speaking.", activity: "Sit together and look out the window for 60 seconds. After, each person names one thing they noticed that the others might have missed." },
        { prompt: "Read aloud slowly. Pause. Let the words settle before narrating.", activity: "Read one paragraph from your current book. Close the book. Ask: 'What is one image that stayed with you?' Don't narrate the whole thing — just one image." },
        { prompt: "Go outside and find something living. Watch it for two minutes without speaking.", activity: "Nature observation game: each child finds one living thing. Watch it silently for two minutes. Then describe it without naming it — let others guess." },
        { prompt: "Practice beginning a task without needing to be told twice.", activity: "Give one quiet instruction at the start of school. Whisper it. See who hears it and begins without a second reminder. Name it as a win." },
        { prompt: "Read a poem aloud twice — once for sound, once for meaning.", activity: "Read a short poem (Psalm 23, or any favorite). First reading: just listen to the sound. Second reading: close eyes and see the images. Then share one image." },
        { prompt: "Do one thing with your hands today — slowly and deliberately.", activity: "Family craft or handwork time: knitting, drawing, building, folding. The rule is: do it slowly. No rushing. 20 minutes of quiet making." },
        { prompt: "Rest. Attention needs recovery.", activity: "Read aloud from a book purely for pleasure — no narration required. Let the story simply be received." },
      ]
    },
    // Week 2 — Noticing
    { reflection: "What pulled attention away most? What helped it return?",
      days: [
        { prompt: "Begin the day outside before any screens.", activity: "Before school begins, go outside for 5 minutes. Each person names one thing they notice that is different from yesterday." },
        { prompt: "After read-aloud, hold one image in mind before narrating.", activity: "Read a chapter. Pause for 30 seconds of silence. Then ask: 'Without talking about what happened — what did you see? Describe it like a painting.'" },
        { prompt: "Listening walk: identify as many distinct sounds as possible.", activity: "Walk in silence for 5 minutes. Each person keeps a mental tally of every distinct sound. Afterward, share counts and name each one." },
        { prompt: "Do one subject with no background noise today.", activity: "Choose math or copywork. Do it in complete silence for 10 minutes. Afterward ask: was that harder or easier than usual? Why?" },
        { prompt: "At dinner, each person names what held their attention today.", activity: "Dinner question: 'What were you doing today when you forgot to notice time passing?' Each person answers. No phones at the table." },
        { prompt: "Observe one thing, then draw it from memory without looking.", activity: "Each child picks one object. Observes it for 2 minutes. Turns it face down. Draws it from memory. Compare with the real thing." },
        { prompt: "Sit quietly together for 3 minutes. No agenda.", activity: "After Sunday lunch or at day's end: everyone sits. No speaking for 3 minutes. Then each person shares one thought that came to them in the quiet." },
      ]
    },
    // Week 3 — Building focus
    { reflection: "Has the length of focused attention grown, even slightly?",
      days: [
        { prompt: "Read aloud for 15 minutes without stopping.", activity: "Read aloud uninterrupted. Narration only after — not during. Encourage children to hold questions until the reading ends." },
        { prompt: "Copywork done with full attention to the first attempt.", activity: "Copywork practice: each child copies one beautiful sentence. The rule is no erasing. Full attention to the first stroke." },
        { prompt: "Nature study: observe something small for 3 minutes before sketching.", activity: "Nature journal: find something small (a leaf, a stone, a seed pod). Observe it for 3 full minutes. Then sketch in detail — every line, every shadow." },
        { prompt: "Practice attention at meals: no books, no screens.", activity: "Meals this week: table cleared of everything except food and people. One person shares something interesting they read or noticed. Others listen fully." },
        { prompt: "Read a slightly difficult passage. What did you have to work to understand?", activity: "Read a challenging paragraph from history or nature study. After: 'What was one thing that was hard to follow?' Work through it together." },
        { prompt: "Let your child teach you something today.", activity: "Ask a child to teach you something they've learned this week — any subject. You must listen with full attention and ask one genuine question." },
        { prompt: "Do one handwork or craft project together. Let it take as long as it takes.", activity: "Handwork afternoon: sewing, drawing, building with blocks or Lego, baking. No rushing. Work alongside each other in companionable quiet." },
      ]
    },
    // Week 4 — Deepening
    { reflection: "Where is attention strongest in your home? Where does it need more tending?",
      days: [
        { prompt: "Begin the day with 5 minutes of quiet before any instruction.", activity: "Morning quiet ritual: everyone sits at the school table before lessons begin. 5 minutes of quiet — reading, looking out the window, or simply sitting. Then begin." },
        { prompt: "When attention wanders during a lesson, pause and wait.", activity: "Practice this together: during read-aloud, pause mid-sentence and wait silently. Don't prompt. Let the child return to the story. Then continue." },
        { prompt: "Begin memorizing a short poem this week.", activity: "Choose a poem together (a psalm, a nature poem, a folk verse). Read it aloud three times slowly. Ask each child to say one line they remember." },
        { prompt: "Artist study: look at one painting for 3 minutes without talking.", activity: "Show a painting (any artist you're studying or simply one you love). 3 minutes of looking in silence. Cover it. Ask: 'What do you remember? Describe it to me.'" },
        { prompt: "Dictation: read a sentence once, and once only.", activity: "Dictation practice: read one sentence aloud, slowly and clearly, once. Children write it. No repeating. Discuss what was missed and why. No shame — this is practice." },
        { prompt: "Let your child see you read without distraction for 15 minutes.", activity: "Parallel reading time: everyone reads their own book for 15 minutes. In the same room. No talking. Model what undistracted reading looks like." },
        { prompt: "Walk slowly in nature. The goal is noticing.", activity: "Nature walk at a slow pace. The rule: no one may walk faster than the slowest walker. Stop whenever something is noticed. Stay as long as it takes." },
      ]
    },
    // Week 5 — Extending
    { reflection: "Can your child sustain attention longer than at the beginning of term?",
      days: [
        { prompt: "Read aloud for 20 minutes today with no interruptions.", activity: "Extended read-aloud: 20 minutes uninterrupted. Save all questions and narration for after. Practice the discipline of receiving a story whole." },
        { prompt: "When a new topic is introduced, watch how the child attends to novelty.", activity: "Begin a new subject or book today. Ask afterward: 'What caught your attention most in the first few minutes? What made you want to know more?'" },
        { prompt: "Full nature journal entry: observation, sketch, and color.", activity: "Nature journal: full entry — written observation (3-5 sentences), pencil sketch, and watercolor wash. Let it take 20-25 minutes. No rushing the process." },
        { prompt: "Composer study: listen to one full piece without doing anything else.", activity: "Sit together and listen to one piece of music from beginning to end. No drawing, no knitting, no reading. Just listening. Afterward: what did you see?" },
        { prompt: "Timed copywork: 10 minutes, focused and careful.", activity: "Timed copywork: set a gentle timer for 10 minutes. Write as beautifully and carefully as possible. At the end, each child identifies their best letter or word." },
        { prompt: "Ask your child to narrate one chapter from memory.", activity: "Sit in silence for 2 minutes before narrating. Then let the child speak uninterrupted. You listen with full attention — no correcting, no adding. Just receiving." },
        { prompt: "Read something for yourself today — purely for delight.", activity: "Family sustained silent reading: everyone reads independently for 20 minutes. Then share one sentence from what they read — not a summary, just one beautiful sentence." },
      ]
    },
    // Week 6 — Consistency
    { reflection: "What habit-building strategies have worked best in your home?",
      days: [
        { prompt: "Begin every lesson with a 30-second pause. Look at the materials. Then begin.", activity: "Establish the pause ritual: before each lesson, children look at their materials, place hands in their laps, and nod when ready. Then begin together." },
        { prompt: "Written narration today: 4 sentences — quality over quantity.", activity: "Written narration after read-aloud: 4 sentences. Take as long as needed. Read them aloud when done. Ask: 'Which sentence are you most pleased with?'" },
        { prompt: "Go outside at the same time each day this week.", activity: "Outdoor habit: same time, same route, same 15 minutes — every day this week. The predictability trains the attention. Notice what changes each day despite the sameness." },
        { prompt: "Picture study: one painting this week, 5-minute observation, narration from memory.", activity: "Display the same painting all week. Each day: 2 minutes of looking, then turn it over and describe one new detail noticed today that wasn't noticed yesterday." },
        { prompt: "Choose one daily task done carelessly and bring full attention to it.", activity: "Choose one: setting the table, putting on shoes, writing the date. Do it with full attention and care every day this week. Name it, and name it again when it's done well." },
        { prompt: "Read aloud from something challenging: history, biography, science.", activity: "Challenge read: one passage from a demanding book. Afterward, ask: 'What did you understand? What remained unclear?' Work through the unclear part together." },
        { prompt: "Do one craft or handwork project together.", activity: "Handwork: one project, worked on for 30 minutes with full attention. No screens, no music. Let the work and the companionship be enough." },
      ]
    },
    // Week 7 — Transferring
    { reflection: "Is attention becoming a natural part of how your child approaches learning?",
      days: [
        { prompt: "Ask your child to read silently for 10 minutes and narrate without prompting.", activity: "Independent reading narration: child reads silently for 10 minutes, then narrates without being asked. Notice whether they initiate, and how fully they narrate." },
        { prompt: "During math, encourage checking one's own work before showing you.", activity: "Self-check habit: after math, child reviews every answer before showing you. Discuss one they want to change and why. Attention to one's own errors is a skill." },
        { prompt: "Return to the same nature spot from two weeks ago. What has changed?", activity: "Revisit: go to the same spot observed in Week 5. Each person names one thing that is different. Sketch the same subject again. Compare the two drawings." },
        { prompt: "Can the children recite the poem begun in Week 4?", activity: "Poetry recitation: each child recites the poem learned so far. No prompting if possible. Celebrate whatever is held in memory. Practice the missing lines together." },
        { prompt: "Let your child lead a lesson today.", activity: "Child-led lesson: one child chooses the book, sets the pace, asks for narration. You are the student. Attend fully. Ask a genuine question at the end." },
        { prompt: "Visit a place of beauty — a garden, a library, a gallery. Simply be there.", activity: "Beauty outing: visit somewhere beautiful together. The only rule is: no hurrying. Walk slowly, look carefully, speak quietly. No photos required." },
        { prompt: "Rest. Write one thing about attention this week.", activity: "Family reflection: at dinner or before bed, each person completes the sentence: 'This week I noticed that I pay attention best when...'" },
      ]
    },
    // Week 8 — Refinement
    { reflection: "Where do you still see the most struggle? What might help?",
      days: [
        { prompt: "Delayed narration: read on Monday, narrate on Tuesday.", activity: "Memory narration: read something today and ask for narration tomorrow, without re-reading. This strengthens both attention and memory together." },
        { prompt: "Try a silent lesson with written instructions only.", activity: "Silent lesson: write today's instructions on a card. Children read and work without verbal direction. Observe how they manage their own attention." },
        { prompt: "Second week with the same painting. What do you see now that you missed?", activity: "Deepen the picture study: same painting as last week. Three minutes of looking. Ask: 'What is one thing you see this week that you didn't notice before?'" },
        { prompt: "Dramatize a scene from the current book.", activity: "Acting narration: each child takes a role from a scene you've read. Act it out. The attention required to inhabit a character is different from narrating one." },
        { prompt: "Dictation: two sentences, read once each.", activity: "Extended dictation: two sentences, read clearly once each. Afterward, each child identifies where attention drifted — mid-sentence? At a difficult word? No shame — it's data." },
        { prompt: "15 minutes of independent reading. Provide a quiet space.", activity: "Reading nest: set up a comfortable, quiet reading spot for each child. 15 minutes of independent reading. You read nearby. No interruptions." },
        { prompt: "Do something beautiful and slow: bake, press flowers, arrange a nature table.", activity: "Slow making: choose one slow, beautiful task. Do it together with quiet conversation or music. The activity itself is the attention training." },
      ]
    },
    // Week 9 — Integration
    { reflection: "How has attention changed the quality of learning in your home this term?",
      days: [
        { prompt: "Begin the morning with the memorized poem before any lessons.", activity: "Poem morning: recite the term's poem together before any lesson begins. Let it set the tone. Notice how the familiar words settle the mind." },
        { prompt: "Begin a new nature study topic with full Hylander-cycle observation.", activity: "New nature topic: find it outside first. Observe before you read. Sketch before you narrate. Let the living thing precede the book." },
        { prompt: "Written narration of something read independently.", activity: "Independent narration: child writes 4-6 sentences about something they read on their own. Share at dinner. Parents respond with one genuine question." },
        { prompt: "Composer study: return to an earlier composer. Does the child recognize the music?", activity: "Musical memory: play a piece from a composer studied earlier this term. Don't announce who it is. Ask: 'Do you recognize this? Who composed it?'" },
        { prompt: "Meals with full attention — for the whole week.", activity: "Attention meals: this whole week, meals are phone-free, screen-free, book-free. One person shares something from their day. Others listen and ask one question." },
        { prompt: "45-minute nature walk — let the mind settle fully.", activity: "Long walk: walk for 45 minutes with no agenda. The first 10 minutes in silence. The rest in free conversation. Notice how the silence changes what is spoken." },
        { prompt: "Read something together that is beautiful and old.", activity: "Beautiful old text: read a psalm, a Shakespeare speech, or a folk tale from another century. Afterward: 'What word or phrase stayed with you?' Don't explain — just receive." },
      ]
    },
    // Week 10 — Strengthening
    { reflection: "What would you say to another homeschooling mother about building attention?",
      days: [
        { prompt: "Read a chapter of a challenging book and narrate as a family.", activity: "Family narration: each person contributes one thing to the narration — building the retelling together. Practice listening to each other as well as to the book." },
        { prompt: "If the child is genuinely engaged, let a lesson run longer than planned.", activity: "Follow the attention: if a child is absorbed, let it continue past the scheduled time. Name it afterward: 'I let you keep going because your attention was so good.'" },
        { prompt: "Nature journal: focus on one species across multiple entries.", activity: "Species study: observe the same plant or animal all week. Sketch it at different times or from different angles. Watch how attention deepens with return." },
        { prompt: "Read aloud with dramatic pauses. Let silence be part of the story.", activity: "Dramatic reading: read a tense or beautiful passage slowly, pausing at key moments. Silence is not empty — it is part of the text." },
        { prompt: "Ask your child to explain something to a younger sibling.", activity: "Teaching moment: ask one child to explain a concept to a younger sibling or to you. Teaching requires different and deeper attention than receiving." },
        { prompt: "Begin a new memory piece — a psalm, a longer poem.", activity: "New memory work: begin a new piece to memorize. Read it aloud three times. Ask each child to say the line that struck them most." },
        { prompt: "Visit a library or bookshop. Let the children choose freely.", activity: "Book choosing: each child selects one book on their own at the library. No guidance. Observe what draws their attention. Read the first page together before checking out." },
      ]
    },
    // Week 11 — Celebration
    { reflection: "Look back at Week 1. What has genuinely changed?",
      days: [
        { prompt: "Narration feast: each family member narrates something from the term.", activity: "Narration celebration: everyone prepares one narration from the term's reading to share. Parents narrate too. Celebrate each one with applause." },
        { prompt: "Let the child choose their favorite subject. Do it first today.", activity: "Favorite first: each child names their favorite lesson from the term. Do that lesson today, at full attention, with no rush. Linger in what they love." },
        { prompt: "Return to the nature spot from Week 7. Draw it again.", activity: "Third sketch: visit the same spot for the third time. Sketch again. Lay all three sketches side by side. What has changed in the place? What has changed in the drawing?" },
        { prompt: "Recite every memory piece from the term.", activity: "Memory recitation: go through every poem and passage memorized this term. Celebrate what has been kept. This is the fruit of term-long attention." },
        { prompt: "Ask your child: what is the most interesting thing you learned this term?", activity: "Term reflection: each child answers: 'What is one thing from this term you want to remember forever?' Write the answers down in a family journal." },
        { prompt: "Make something beautiful together to mark the term.", activity: "Term celebration: make a nature table display, a commonplace book entry, or a drawing of something from the term's reading. Display it in your home." },
        { prompt: "Rest fully. Well-earned rest is part of the habit.", activity: "Read aloud from a purely delightful book — no narration, no lessons, just pleasure. Let the term end in the sound of a good story." },
      ]
    },
    // Week 12 — Renewal
    { reflection: "Which habit will you choose to tend next term? Why?",
      days: [
        { prompt: "Reflect on attention as a family: what helped, what didn't, what to carry forward.", activity: "Family meeting: 'What helped us pay attention this term? What got in the way? What is one thing we want to do differently next term?' Write the answers down." },
        { prompt: "Write a short note about what you've noticed in your children's attention.", activity: "Letter writing: each parent writes a short note to each child about one growth in attention they've noticed. Read them aloud or tuck them in a journal." },
        { prompt: "20 minutes in nature with no purpose — no sketching, no narrating. Just be.", activity: "Purposeless nature time: go outside with nothing to accomplish. Wander. Rest. Let the children lead. Receive whatever comes." },
        { prompt: "Read something purely for delight — not for school.", activity: "Delight reading: choose a book that has been waiting all term — not for school, just for love. Read the first chapter together. Mark the page for next term." },
        { prompt: "Free afternoon. Watch what the children attend to when nothing is required.", activity: "Free time observation: give a free afternoon with no agenda. Later, ask: 'What did you end up doing? What held your attention when you could choose anything?'" },
        { prompt: "Choose a poem to memorize next term. Read it together for the first time.", activity: "Next term's poem: find the poem you will memorize next term. Read it aloud today — just to hear it. No memorizing yet. Just the first acquaintance." },
        { prompt: "Give thanks for what grew this term.", activity: "Gratitude close: at dinner, each person names one thing about attention that grew this term. In themselves or in someone else. Give thanks for it." },
      ]
    },
  ],

  narration: [
    // Week 1
    { reflection: "When did narration feel natural? When did it feel like a test?",
      days: [
        { prompt: "Ask for one oral narration after read-aloud. No prompts.", activity: "After read-aloud, simply say: 'Tell me what you remember.' Don't prompt, don't guide. Receive whatever comes. Say: 'Thank you. That's exactly right.'" },
        { prompt: "Receive the narration without correcting. Simply listen.", activity: "Listen-only narration: the rule for today is that you may not correct, add to, or redirect the narration. Only listen. Afterward, repeat one phrase you loved." },
        { prompt: "Picture narration: what story do you see in this painting?", activity: "Show a painting or illustration. Ask: 'Tell me the story you see in this picture.' No right answer. Let the imagination narrate." },
        { prompt: "Nature narration: tell me what you saw — not what you learned.", activity: "After outdoor time: 'Tell me what you saw today — not what it was called, what you actually saw with your eyes.' This separates observation from knowledge." },
        { prompt: "Narration as conversation: 'Tell me more. What happened next?'", activity: "Conversational narration: after reading, respond to narration with genuine curiosity — 'Tell me more about that part.' 'What happened after that?' Not a test — a conversation." },
        { prompt: "Let your child narrate to a sibling or stuffed animal.", activity: "Alternative audience: one child narrates to a younger sibling or a stuffed animal placed in a chair. Different audience, different energy. Notice what changes." },
        { prompt: "Rest. Let the week's reading settle.", activity: "No narration today. Read aloud purely for pleasure. Let the stories settle without being processed. Trust that the reading matters even without narration." },
      ]
    },
    // Week 2
    { reflection: "Is narration becoming more natural, or does it still feel like a test?",
      days: [
        { prompt: "Narrate immediately after reading vs. 10 minutes later. Which is richer?", activity: "Narration experiment: narrate immediately after one passage, then wait 10 minutes before narrating another. Compare. Discuss which felt fuller and why." },
        { prompt: "Drawn narration: sketch a scene from the book.", activity: "No words required: after read-aloud, each child draws one scene. No labels, no captions — just the image. Then narrate the drawing: 'Tell me about your picture.'" },
        { prompt: "Narrate in the voice of a character: 'Tell it as if you were there.'", activity: "In-character narration: 'Tell me what happened, but tell it as if you were Ruth. As if you were there.' The shift in perspective deepens comprehension." },
        { prompt: "At dinner, ask: 'Tell me something from your reading today.'", activity: "Dinner narration: make it a family rhythm. Each person at dinner shares one thing from their reading or learning today. Parents share too. No pressure — just sharing." },
        { prompt: "Narrate what you heard in a conversation. Can they tell back accurately?", activity: "Conversation narration: after a phone call or a conversation you had, ask a child: 'What did you hear me talking about?' Narrating real life, not just books." },
        { prompt: "Nature narration: describe what was observed, not what was known.", activity: "Pure observation narration: after outdoor time, each child narrates as a naturalist — only what was actually seen, not what they know from books. 'I saw...' not 'Robins are...'" },
        { prompt: "Narrate this week's reading in one sitting. What is remembered?", activity: "Week's narration: on the last day, ask: 'Tell me everything you remember from this week's reading.' Build it together — each person adds. See how much has been retained." },
      ]
    },
    // Week 3
    { reflection: "What kinds of narration come most naturally to your children?",
      days: [
        { prompt: "Written narration: three sentences. Brevity sharpens thought.", activity: "Written narration: after read-aloud, each child writes exactly three sentences — no more, no fewer. Read them aloud. Ask: 'Which sentence captures the most?'" },
        { prompt: "Narrate yesterday's reading — not today's.", activity: "Delayed narration: begin the day by narrating yesterday's reading before opening any book. See what has stayed. This is memory work disguised as narration." },
        { prompt: "Narrate a poem: 'What did you see?' not 'What did it mean?'", activity: "Poem narration: read a short poem aloud. Ask: 'What did you see? Not what it means — what images came into your mind?' Let the sensory experience be narrated." },
        { prompt: "Narrate beginning with a feeling: 'How did that make you feel — then what happened?'", activity: "Feeling-first narration: 'Start with how the passage made you feel — and then tell what happened.' This opens narration for children who find plot-retelling difficult." },
        { prompt: "Let your child ask you to narrate something. Model the habit.", activity: "Parent narration: let a child ask you a question — 'Mom, what was that book you were reading?' — and narrate it to them. Model narration as a natural part of conversation." },
        { prompt: "Narrate an event from your own week. Show them narration isn't just for school.", activity: "Life narration: narrate something that happened to you this week. A conversation, an errand, something you saw. Show that narrating is how we make sense of all of life." },
        { prompt: "Notice what children talk about without being asked.", activity: "Unasked narration observation: today, simply listen. Notice when children narrate spontaneously — at meals, during play, at bedtime. This is the goal of all the practice." },
      ]
    },
    // Week 4
    { reflection: "Has the quality of narration improved? What does 'quality' mean in narration?",
      days: [
        { prompt: "Dictated narration: write down their words word for word and read them back.", activity: "Scribe narration: you act as scribe. Child narrates orally, you write every word. Read it back to them. They hear their own narration — often a revelation." },
        { prompt: "Biography narration: focus on the person, not just the events.", activity: "Character narration: after biography reading, ask: 'Tell me about this person — not what they did, but what kind of person they were. What made them who they were?'" },
        { prompt: "Timeline narration: in order, from beginning to end.", activity: "Order narration: 'Tell me what happened in order — beginning, middle, end. What came first? What came next?' This builds logical sequencing and structure." },
        { prompt: "Nature narration: describe as if telling someone who wasn't there.", activity: "Absent audience narration: 'Tell me about today's nature study as if I hadn't been there and don't know anything about it.' Full description required — nothing assumed." },
        { prompt: "Comparative narration: 'How is this character like someone from another book?'", activity: "Connection narration: 'Does this character remind you of anyone — from another book, from history, from our family? How are they alike?' Build the web of stories." },
        { prompt: "Playful narration: act it out, draw a map, build something.", activity: "Creative narration: offer a choice — act out a scene, draw a map of where the story happened, or build something from the story with blocks. Narration in the body." },
        { prompt: "Read one thing for delight only — no narration required.", activity: "Trust reading: read a chapter purely for pleasure. No narration. Trust the reading. Let the story simply be received and held." },
      ]
    },
    // Week 5
    { reflection: "Are your children beginning to narrate without being asked — at dinner, in play?",
      days: [
        { prompt: "Loop narration: child A narrates, child B adds what was left out.", activity: "Narration relay: child A narrates until they stop. Child B picks up: 'And also...' or 'You forgot the part where...' Continue until the narration is complete." },
        { prompt: "History narration as a news report: 'This just in from ancient Rome...'", activity: "News report narration: 'Pretend you are a reporter. Tell me what happened today in [wherever the history reading is set] as a news story.' Dramatic and specific." },
        { prompt: "Written narration: 5 sentences, using the author's own language where remembered.", activity: "Language narration: written narration with one rule — include at least one phrase or sentence that came directly from the text. Encourage precision of language." },
        { prompt: "Character narration: 'Tell me about Ruth — only Ruth.'", activity: "Single-character focus: 'Tell me only about one character from today's reading — what they did, said, felt. Leave everyone else out.' Focus sharpens narration." },
        { prompt: "Narrate a psalm: what images stayed?", activity: "Psalm narration: read a psalm slowly. Ask: 'What images do you see? What words stay with you?' Let narration of scripture be unhurried and receptive." },
        { prompt: "Narrate a nature journal entry without showing the drawing.", activity: "Blind narration: one child describes their nature journal entry in words while another listens and tries to draw it. Compare the two drawings. Discuss what details traveled." },
        { prompt: "Notice what the children tell each other this week.", activity: "Observation: simply listen today. When do the children narrate to each other spontaneously? What do they share? Where does narration live outside of school?" },
      ]
    },
    // Week 6
    { reflection: "What is the most surprising thing you've heard a child narrate this term?",
      days: [
        { prompt: "Stop reading and wait. Let the child initiate narration.", activity: "Wait narration: stop reading mid-chapter without announcing a narration time. Simply wait. See who begins. This builds the habit of narrating without being asked." },
        { prompt: "Written narration: one full paragraph.", activity: "Paragraph narration: written narration of one full paragraph — more than a few sentences but not an essay. Let it take as long as needed. Quality over speed." },
        { prompt: "Narration that includes something the child wondered.", activity: "Wonder narration: after narrating what happened, add: 'And one thing I wondered was...' Building curiosity into narration moves it from retelling to thinking." },
        { prompt: "Science narration: explain photosynthesis as if to someone who's never heard of it.", activity: "Teaching narration: 'Explain [concept] to me as if I know nothing about it.' The child must find their own words for something they understand — this reveals real comprehension." },
        { prompt: "Narrate a memory verse: what does this verse mean?", activity: "Verse narration: after reciting a memory verse, ask: 'Tell me what this verse means in your own words.' Not the official explanation — their understanding." },
        { prompt: "Let narration happen in the car, on a walk, at lunch.", activity: "Life narration: today, no formal narration time. Instead, narrate throughout the day — in the car, at lunch, on a walk. Let it be woven into life, not scheduled." },
        { prompt: "Read a poem for the second time this term. What is different in the hearing now?", activity: "Return to a poem read earlier in the term. Read it again. Ask: 'What is different this time? What do you notice now that you didn't notice before?'" },
      ]
    },
    // Week 7
    { reflection: "Is narration becoming a natural way your children process what they learn?",
      days: [
        { prompt: "Written narration the child is proud of. Let them revise one sentence.", activity: "Proud narration: write a narration, then ask: 'Is there one sentence you want to improve?' Allow one revision. Celebrate the intentionality of the revision." },
        { prompt: "Oral essay narration: 'Tell me what you think about this — and why.'", activity: "Opinion narration: 'Tell me what you think about [character's decision, historical event, nature observation] — and give me a reason.' This is the beginning of essay thinking." },
        { prompt: "Nature narration: narrate your sketch as if describing it to someone who can't see it.", activity: "Sketch narration: one child describes their nature sketch in such detail that another can draw it from the description alone. Compare the two sketches." },
        { prompt: "Historical perspective narration: tell it as if you were there.", activity: "Eyewitness narration: 'Tell me what happened, but you are a person living in that time. What did you see? What did you feel? What did you not yet understand?'" },
        { prompt: "Narration relay: each person adds one sentence.", activity: "Sentence relay: build a narration around the table. Person 1 gives a sentence. Person 2 continues. Around and around until the narration is complete. Everyone must listen carefully." },
        { prompt: "Write a letter to a character in the book.", activity: "Letter narration: write a letter to a character — not summarizing the book, but responding to something they said or did. 'Dear Ruth, I wanted to tell you...' Real engagement." },
        { prompt: "Listen for narration that happens in free play today.", activity: "Free play observation: during free play, listen without intervening. Children narrate constantly in play — stories they're telling, games they're building. This is narration in its purest form." },
      ]
    },
    // Week 8
    { reflection: "What form of narration has surprised you with its richness?",
      days: [
        { prompt: "Narrate something from two weeks ago. What has stayed?", activity: "Long memory narration: 'Tell me about something we read two weeks ago.' No re-reading. What has genuinely stuck? This reveals what was truly received." },
        { prompt: "Written narration: let the child choose the passage.", activity: "Child-chosen narration: let the child select a passage from today's reading to narrate in writing. Their choice reveals what mattered to them. Honor that." },
        { prompt: "Comparative narration: 'How is this story like something from the Bible?'", activity: "Biblical connection narration: 'Does this story remind you of anything from the Bible? How are they similar? How are they different?' Build the great web of stories." },
        { prompt: "Music narration: what story did you hear?", activity: "Composer narration: after listening to a piece of music, ask: 'Tell me the story you heard. What happened? Where were you? What did you see?' Music narration is pure imagination." },
        { prompt: "Narration with personal connection: 'This reminds me of...'", activity: "Connection narration: 'Tell me one thing from today's reading that connects to something in your own life — a person you know, something that happened to you, somewhere you've been.'" },
        { prompt: "Silent narration: draw or map what you remember without speaking.", activity: "Wordless narration: after reading, give paper and pencil. No words — draw a map, a diagram, a scene, or a symbol that represents what was read. Then narrate the drawing." },
        { prompt: "Ask for narration of a chapter not re-read in 3 days.", activity: "Three-day memory test: 'Tell me about [chapter read three days ago].' No re-reading. What has genuinely been retained? This is the true measure of narration's power." },
      ]
    },
    // Week 9
    { reflection: "How has narration changed the way your children listen?",
      days: [
        { prompt: "Narration feast: narrate the whole term's reading in one sitting.", activity: "Term narration feast: go through every book read this term and narrate one thing from each. Build the whole term's reading in one conversation. Celebrate what was kept." },
        { prompt: "Written narration from memory, without notes. Let it be imperfect.", activity: "Imperfect narration: written narration with the reminder that imperfect narration is still narration. The goal is honest recall, not a perfect essay." },
        { prompt: "Psalm narration: images, feeling, and movement of thought.", activity: "Deep psalm narration: read a psalm slowly, twice. Ask: 'What images did you see? What feeling did it give you? How did the psalm move — where did it start, where did it end?'" },
        { prompt: "Narration as letter-writing: write to a friend about what you read this week.", activity: "Friend letter narration: 'Write a letter to [a real friend or cousin] telling them about the best thing we've read this week. Make them want to read it too.'" },
        { prompt: "Narrate a nature observation made months ago.", activity: "Old observation narration: find a nature journal entry from early in the term. Narrate it without looking — what do you remember? Compare with the written entry." },
        { prompt: "Prepare a narration to share at dinner.", activity: "Prepared narration: each child prepares something to share at dinner — a narration of something read, learned, or observed. A real audience, a real offering." },
        { prompt: "Rest. Write your own narration of the term.", activity: "Parent narration: write your own narration of what the term has been — not an evaluation, a narration. What have you noticed? What has surprised you? What has stayed with you?" },
      ]
    },
    // Week 10
    { reflection: "What do you want narration to look like next term?",
      days: [
        { prompt: "Narrate something difficult or confusing today.", activity: "Confusion narration: 'Tell me about the part that confused you most — what did you understand? What didn't make sense? What questions do you have?' Confusion is data." },
        { prompt: "Stand-up narration: deliver it as a short talk.", activity: "Oral presentation: child stands and delivers their narration as a brief talk — standing still, speaking clearly, beginning and ending deliberately. Practice the form." },
        { prompt: "Written narration with an illustration.", activity: "Illustrated narration: written narration plus one drawing. The picture is part of the narration — it shows something words couldn't capture. Both matter." },
        { prompt: "Narrate an abstract concept, not a story.", activity: "Concept narration: 'Explain [gravity / democracy / photosynthesis / forgiveness] in your own words.' No story, no plot — pure idea narration. The hardest kind." },
        { prompt: "Narrate a historical conversation: what might Moses have said to Pharaoh?", activity: "Dialogue narration: 'What do you think Moses said to Pharaoh? Write or speak the conversation as you imagine it.' Narration meets imagination meets history." },
        { prompt: "Narrate a book being read independently.", activity: "Independent book check-in: 'Tell me about the book you're reading on your own — where are you in the story? Who is there? What is happening?' Independent narration." },
        { prompt: "Listen to your child narrate to someone outside the family.", activity: "External narration: create an opportunity for your child to narrate to a grandparent, a friend, or a neighbor — something they've read or learned. Real audience, real language." },
      ]
    },
    // Week 11
    { reflection: "What is the most beautiful narration you've heard this term?",
      days: [
        { prompt: "Narration celebration: each child shares their favorite narration from the term.", activity: "Best narration sharing: each child shares their best narration from the term — written, oral, or drawn. Read or display them. Celebrate each one genuinely." },
        { prompt: "Backward narration: begin with the end and work back.", activity: "Reverse narration: 'Tell me what happened, but start at the end and work backward. What happened just before that? And before that?' A different way of knowing." },
        { prompt: "Best narration from this term, copied out neatly.", activity: "Fair copy: each child selects their favorite written narration from the term and copies it out neatly — their best handwriting, a title, perhaps an illustration. Keep it." },
        { prompt: "Narrate a habit you've been building — not a book, a practice.", activity: "Habit narration: 'Tell me about the habit of [attention / narration] — what has changed for you this term? What is different about how you read or listen?' Meta-narration." },
        { prompt: "Narrate to grandparents or a friend — a real audience.", activity: "Public narration: find a real audience — a phone call, a visit, a letter. Let your child narrate something from the term's learning to someone outside the family." },
        { prompt: "Family narration round: one voice adds, another continues.", activity: "Round narration: begin the narration and go around the table, each person adding the next part. The final person gives the ending. A communal narration of the term." },
        { prompt: "Give thanks for the words that have grown this term.", activity: "Words of gratitude: at the term's end, each person shares one word that they are grateful grew in them this term — a word they use now that they didn't use before." },
      ]
    },
    // Week 12
    { reflection: "How will you carry narration forward — not just in school, but in your family's life?",
      days: [
        { prompt: "Ask your child: what is narration for? Listen to how they understand it now.", activity: "Understanding narration: ask each child: 'What do you think narration is for? Why do we do it?' Listen to their answers without correcting. This reveals genuine understanding." },
        { prompt: "Write down one narration from this term worth keeping.", activity: "Keeper narration: write down one narration — oral or written — from this term that you want to keep. In a journal, on a card, in a scrapbook. A record of growth." },
        { prompt: "Let the children choose what to narrate on the last day.", activity: "Free choice narration: each child narrates anything they choose from the whole year — any book, any subject, any memory. This is narration in its fullest freedom." },
        { prompt: "Read something beautiful and simply receive it. No narration.", activity: "Receiving without narrating: read a beautiful passage and simply let it be. No narration required. Trust that the reading and the listening matter even in the silence." },
        { prompt: "Narrate a moment from this term that stands out.", activity: "Memory narration: 'Tell me your favorite memory from this term — not from a book, but from our actual life together.' Narration of lived experience." },
        { prompt: "Begin a commonplace book: write one narrated passage, copied and beautiful.", activity: "Commonplace beginning: each family member copies one beautiful sentence from this term's reading into a special notebook. Date it. This is the beginning of a commonplace book." },
        { prompt: "Rest and give thanks. Words given, words received.", activity: "Closing blessing: at the end of the last day, read a blessing or a psalm together. Give thanks for what has been read, narrated, and received this term." },
      ]
    },
  ],

  outdoor: [
    // Weeks 1-12 outdoor activities
    { reflection: "Did we get outside every day? What prevented us when we didn't?",
      days: [
        { prompt: "Go outside before any screens or lessons today.", activity: "Pre-school outdoor time: everyone goes outside for 10 minutes before school begins. No agenda. Run, walk, sit. Then come in and begin. Notice how school goes afterward." },
        { prompt: "Find one living thing and watch it for two minutes.", activity: "Living observation: each person finds something living. Watch in silence for 2 minutes. Then describe it without naming it — let others guess what it is." },
        { prompt: "Take the read-aloud outside today.", activity: "Outdoor read-aloud: bring today's book outside. Read on the ground, on a blanket, on the porch. Let the outside be the classroom." },
        { prompt: "Unstructured outdoor time: no agenda, no narration.", activity: "Free outdoor time: 30 minutes of no agenda outside. No direction from parents. No nature journals required. Let the children lead entirely." },
        { prompt: "Find something you've never noticed in your yard or neighborhood.", activity: "New noticing: each person must find one thing they've genuinely never noticed before in a familiar place. Share at the end." },
        { prompt: "Walk slowly. The goal is seeing, not distance.", activity: "Slow walk: walk at half your normal pace. The rule is: anyone can stop at any moment and everyone must stop with them. No rushing past anything." },
        { prompt: "Rest outside today.", activity: "Outdoor rest: find a comfortable outdoor spot — a blanket on the grass, a porch chair, a garden bench. Read, nap, or simply sit. The outdoors as a place of rest, not just activity." },
      ]
    },
    { reflection: "What do the children notice outdoors that they wouldn't notice indoors?",
      days: [
        { prompt: "Go out in less-than-ideal weather today.", activity: "Weather walk: go outside in whatever the weather is. If cold, dress well. If drizzling, bring an umbrella. Notice what is different about the world in this weather." },
        { prompt: "Find one small thing and bring it inside to sketch.", activity: "Small thing study: each person finds the smallest interesting thing they can — a seed, a feather, an insect wing, a piece of bark. Bring it in. Sketch it large." },
        { prompt: "Listening exercise: list every distinct sound.", activity: "Sound inventory: go outside and stand still for 3 minutes. Each person keeps a mental list of every distinct sound. Afterward, share and compile a family sound inventory." },
        { prompt: "Walk to a new place: a different street, a park, a trail.", activity: "New ground: walk somewhere none of you has been before — or hasn't been in a long time. Let novelty heighten observation. Name what is new." },
        { prompt: "Observe the sky for 5 minutes. What does it tell you about today?", activity: "Sky reading: lie on your backs and look at the sky for 5 minutes. No talking. Then: 'What is the sky telling us today? What kind of day is this going to be?'" },
        { prompt: "Find evidence of an animal. Tell its story.", activity: "Animal detective: find any evidence that an animal has been here — tracks, droppings, a feather, a chewed branch. Narrate: 'What happened here? Tell me the story.'" },
        { prompt: "Sit outside at a different time of day than usual.", activity: "Time-shift observation: if you usually go out in the morning, go in the late afternoon. Notice what is different — light, sounds, animals, temperature. The same place, a different world." },
      ]
    },
    { reflection: "Has outdoor time become a natural rhythm, or does it still feel scheduled?",
      days: [
        { prompt: "Begin nature study outdoors — observe before you read.", activity: "Observe first: this week, the rule is observe before you read about it. Go outside, find the thing, observe it. Then come inside and read. Let the living precede the text." },
        { prompt: "Let the children dig in the dirt with no agenda.", activity: "Digging time: find a patch of earth. Bring a trowel or a stick. Dig. No goal. Discover what is there — worms, roots, stones, insects. Let the earth be interesting." },
        { prompt: "Walk to collect: leaves, seeds, stones, feathers. Build a nature table.", activity: "Collection walk: bring a basket or bag. Walk with the purpose of collecting natural things. At home, arrange them into a nature table — a seasonal display of what was found." },
        { prompt: "Find water and observe what lives near it.", activity: "Water habitat: find any source of water — a puddle, a stream, a birdbath, a ditch. Observe what is living in or near it. Sketch one thing. Narrate what you saw." },
        { prompt: "Sketch something outside without looking at it first.", activity: "Blind observation sketch: choose something in nature. Sketch it from life — looking at it, not at the paper, as much as possible. The hand follows the eye." },
        { prompt: "Take a 30-minute walk. Let the mind settle.", activity: "Long walk: 30 minutes minimum. No destination required. Walk until the mind quiets — notice when that happens. What changes when the mind is quiet?" },
        { prompt: "Rest in a favorite outdoor spot. Bring a book or simply sit.", activity: "Outdoor rest: find a spot each person loves outside. Sit in it. Read if desired. Let outdoor time be a place of rest and restoration, not only activity." },
      ]
    },
    { reflection: "What living thing have the children learned most about through observation?",
      days: [
        { prompt: "Go out at dawn or dusk — a different kind of light.", activity: "Twilight observation: go outside at dawn or dusk specifically. Light at the edges of the day is different. What do you see that you don't see at noon?" },
        { prompt: "Track one tree or plant each week for the rest of the term.", activity: "Seasonal tracking: choose one tree, plant, or outdoor spot. Visit it every week. Sketch it in your nature journal. Watch it change through the weeks." },
        { prompt: "Find an insect and follow it. Where does it go? What does it do?", activity: "Insect following: each person finds an insect. Follow it for as long as possible without disturbing it. Narrate afterward: 'Tell me where your insect went and what it did.'" },
        { prompt: "Collect soil from two different places and compare them.", activity: "Soil science: collect soil from two places — a garden bed and a lawn, a forest floor and a field. Compare color, texture, smell, what lives in each. Sketch both." },
        { prompt: "Let your child lead the outdoor time entirely.", activity: "Child-led outdoor: one child is in charge of outdoor time today — where you go, what you do, how long you stay. Follow their lead completely. Observe what they choose." },
        { prompt: "Go out without shoes if safe and weather permits.", activity: "Barefoot observation: walk barefoot on grass, dirt, or sand. Notice what you feel beneath your feet that you never notice with shoes. How does the world feel from the ground up?" },
        { prompt: "Count every living thing in one square meter.", activity: "Square meter census: mark off one square meter with sticks or string. Count every living thing inside it — insects, worms, seeds, grass blades, moss patches. Record the count." },
      ]
    },
    { reflection: "Are the children beginning to notice things outdoors without being prompted?",
      days: [
        { prompt: "Begin a weather journal: temperature, sky, wind, what is blooming.", activity: "Weather record: each day this week, before outdoor time, note the weather — temperature (estimate), sky condition, wind strength, what is blooming or notable. Keep a running record." },
        { prompt: "Look for signs of the season changing. What tells you?", activity: "Season signs: 'Find three things outside that tell you the season is changing.' Birds, temperature, light, plants, insects, animal behavior. Each person shares their three." },
        { prompt: "Find something decaying — a log, fallen leaves, old fruit — and observe it.", activity: "Decay observation: find something that is decomposing. Observe it carefully. What is living in it? What is happening to it? Sketch it. Narrate: 'Describe what you see without saying 'rotting' or 'dead.'" },
        { prompt: "Go out after rain. What is different? What has the rain revealed?", activity: "Post-rain observation: go outside immediately after rain. What has changed? What has been revealed — tracks in mud, worms on pavement, puddles, smell of earth? Document it all." },
        { prompt: "Let the children build something outside from natural materials.", activity: "Natural building: give free time to build something using only what is found outside — a dam, a shelter, a bird feeder, a sculpture, a fairy house. No bought materials." },
        { prompt: "Walk somewhere you have never walked before.", activity: "New territory: drive or walk to somewhere none of you has explored. Walk for 20 minutes. Let the newness heighten observation. Name five things you wouldn't see near home." },
        { prompt: "Rest as a family outside together. Under the sky.", activity: "Family sky rest: bring blankets outside. Lie on your backs and look at the sky. No agenda. Simply be together under the open sky. Rest as an outdoor practice." },
      ]
    },
    { reflection: "What would outdoor time look like if it were fully a habit — as natural as eating?",
      days: [
        { prompt: "Full outdoor morning before lunch.", activity: "Outdoor school morning: take the first half of the school day entirely outside. Books, paper, pencils. Read outside, narrate outside, sketch outside. Everything outside until lunch." },
        { prompt: "Study one bird this week. Find it, watch it, sketch it, learn its call.", activity: "Bird week: choose one bird. Observe it for at least 10 minutes across multiple days. Sketch it. Find its call online and learn to recognize it. Know this one bird well." },
        { prompt: "Observe the same spot at the same time each day this week.", activity: "Fixed observation: choose one spot outside. Visit it at the same time every day this week. Record what changes and what stays the same. The discipline of return deepens observation." },
        { prompt: "Forage for something edible if safe — berries, herbs, greens.", activity: "Foraging walk: with proper identification, find and harvest something edible nearby — dandelion greens, wild berries, mint, rosehips. Use it at dinner. Know what grows here." },
        { prompt: "Build a fire if possible. Let the children tend it.", activity: "Fire observation: build a small fire safely and let the children tend it — adding wood, watching it breathe, observing what burns and how. Fire is one of the oldest outdoor teachers." },
        { prompt: "Walk in silence for the first 5 minutes, then talk freely.", activity: "Silent-then-free walk: the first 5 minutes of the walk are completely silent. Then talk freely. Notice what the silence opens up — what is said in the first moments of speech?" },
        { prompt: "Bring school subjects outside: math, reading, drawing.", activity: "Outside school: take what would have been a desk lesson outside. Do math on a blanket, read under a tree, sketch what is around you. Let the outdoor be the classroom for a whole morning." },
      ]
    },
    { reflection: "How has outdoor time changed the children's relationship with the natural world?",
      days: [
        { prompt: "Spend the whole morning outside. Take books and paper.", activity: "Full outdoor morning: pack up school materials and go outside until noon. Read, sketch, narrate, explore. Come inside only for lunch. Let the outdoors lead the morning's learning." },
        { prompt: "Study the moon this week — its phase, its rise, its light.", activity: "Moon observation: check the moon phase. Go outside at night to observe it if possible. Draw the moon each night this week. Notice the change in its shape and its rising time." },
        { prompt: "Find and observe an animal home: burrow, hive, nest, web.", activity: "Animal architecture: find a place where an animal lives — a nest, a burrow, a web, a hole in a tree. Observe without disturbing. Sketch it. Narrate the animal's engineering." },
        { prompt: "Plant something — a seed, a bulb, a cutting.", activity: "Planting: plant something together today — any size. A seed in a pot, a bulb in the garden. Mark it. Watch it. This one act of planting creates a relationship with the ground." },
        { prompt: "Walk at night if safe. What is different?", activity: "Night walk: after dark, walk outside — even just to the end of the driveway and back. Listen. Look. What sounds emerge at night that are hidden during the day? What can you see?" },
        { prompt: "Sketch the same outdoor scene two weeks apart.", activity: "Two-week comparison: find the sketch made two weeks ago. Return to the same spot. Sketch it again. Compare the two. What has changed in the scene? What has changed in the drawing?" },
        { prompt: "Rest outside as a family after a long week.", activity: "Weekend outdoor rest: go to a favorite outdoor place and simply be there — no hiking, no activities, just being outside together. Restore what the week has cost." },
      ]
    },
    { reflection: "What would you tell a family who thinks outdoor time is a luxury?",
      days: [
        { prompt: "Go out in every kind of weather this week.", activity: "All-weather week: commit to going outside every day this week regardless of weather. Dress for what comes. Notice how different weather changes the world — and how it changes you." },
        { prompt: "Observe the soil and what lives in it.", activity: "Soil life: dig a small hole (6 inches) in garden soil. Carefully examine what is living in the soil — earthworms, beetle grubs, roots, mycelium. Sketch what you find. Put it back." },
        { prompt: "Find something that has been damaged and observe how nature repairs itself.", activity: "Repair observation: find evidence of damage and repair — a broken branch with new growth, a burnt area with green shoots, a flood-damaged bank stabilizing. Life's resilience." },
        { prompt: "Study clouds today. Name what you see. Watch how they move.", activity: "Cloud study: lie on your backs and name every cloud you see — cumulus, stratus, cirrus. Watch one cloud for 5 minutes and track its movement and change. Sketch three types." },
        { prompt: "Let outdoor time be the very first thing today.", activity: "Outside first: before breakfast if possible, go outside. Even for 10 minutes. Let the outdoor world be the first thing the day offers. Notice how this changes the morning." },
        { prompt: "Find a source of running water and spend time near it.", activity: "Water time: find moving water — a creek, a river, a drainage ditch, a fountain. Spend 20 minutes near it. Listen. Watch. Skip stones. Let the water do what water does." },
        { prompt: "Rest. Sit in your favorite outdoor spot and give thanks.", activity: "Outdoor gratitude: sit in a favorite outdoor spot. Each person names one thing they are grateful for that the outdoor world has given them this week. Receive the week." },
      ]
    },
    { reflection: "How has regular outdoor time changed behavior and mood?",
      days: [
        { prompt: "Nature walk focused only on smell today.", activity: "Smell walk: walk with closed eyes for part of the time. Follow your nose. Name every scent — earth, flowers, rain, grass, exhaust, animals. Map the smells of your neighborhood." },
        { prompt: "Find evidence of last night — animal tracks, dew, fallen leaves.", activity: "Morning evidence: go out first thing in the morning and look for what happened last night — dew patterns, tracks in soft earth, fallen things, spider webs revealed. Night has left its record." },
        { prompt: "Observe a flower from bud to bloom this week.", activity: "Bloom watch: find a flower bud. Visit it every day this week and sketch it at the same stage. Watch it open. Note the exact moment it fully blooms. Daily attention to one small miracle." },
        { prompt: "Let the children make something from entirely natural materials.", activity: "Natural making: give free time to make something using only natural materials — a wreath, a sculpture, a miniature garden, a weaving from grasses. No manufactured materials allowed." },
        { prompt: "Walk to the same spot visited in Week 4. What has changed?", activity: "Fourth visit: return to the same outdoor spot visited in Week 4. Sketch it again if you sketched it then. What has changed in the weeks since? What has grown or fallen or moved?" },
        { prompt: "Study one tree today: bark, roots, leaves, what lives in it.", activity: "Tree portrait: choose one tree and spend 30 minutes getting to know it — feel the bark, look at the roots, identify the leaves, find what lives in and on it. Sketch the whole tree." },
        { prompt: "Rest in shade if summer, sun if winter.", activity: "Seasonal rest: find the comfortable outdoor spot for this time of year — shade in warmth, sun in cold. Rest there for 20 minutes. Let the season hold you." },
      ]
    },
    { reflection: "What has nature taught your family this term that no book could have taught?",
      days: [
        { prompt: "Spend the morning at a nature preserve, farm, or wild place.", activity: "Wild place morning: drive to somewhere wilder than your usual outdoor space — a nature preserve, a farm, a state park. Spend the whole morning. No agenda. Just be in a bigger wildness." },
        { prompt: "Find something in nature that is perfectly adapted to its purpose.", activity: "Adaptation study: find one thing whose form follows its function perfectly — a spider web, a heron's neck, a seed with wings, a cactus spine. Narrate: 'What is this perfectly designed to do?'" },
        { prompt: "Observe the relationship between two living things.", activity: "Relationship observation: find two living things that depend on each other — a flower and a bee, a tree and a bird, an aphid and an ant. Watch the relationship in action." },
        { prompt: "Let the children lead a nature walk.", activity: "Child-led expedition: one child leads today. They set the route, the pace, the stopping points. Adults follow. The leader chooses what to observe and how long to stay. Rotate leaders." },
        { prompt: "Find something invisible and make it visible through observation.", activity: "Invisible made visible: find something that can't be directly seen — wind (by watching what it moves), temperature (by breathing visible breath), sound waves (by feeling bark when a bird sings). Document it." },
        { prompt: "End the day with 10 minutes of stargazing if skies are clear.", activity: "Stargazing: go outside after dark, lie on your backs, and look at the stars for 10 minutes. Name any constellation you can. Find one star each person will remember. Give thanks." },
        { prompt: "Rest fully. Let the whole week outside be received with gratitude.", activity: "Week's end rest: review this week's outdoor time together. Where did you go? What did you see? What surprised you? What will you remember? Give thanks for the world outside your door." },
      ]
    },
    { reflection: "What single outdoor experience this term has stayed most vividly?",
      days: [
        { prompt: "Go to a place of water and spend an hour.", activity: "Water immersion: spend an hour near water — ocean, river, lake, pond, or stream. No agenda except to be near water. Watch it. Listen to it. Let it do what water does." },
        { prompt: "Study migration: what is moving through your area right now?", activity: "Migration observation: research what species are migrating through your region right now. Go outside and look for them — birds, butterflies, dragonflies, whales if you're coastal. Document what you find." },
        { prompt: "Find the oldest living thing you can access and stand in its presence.", activity: "Ancient life: find the oldest living thing accessible to you — a very old tree, a lichen-covered rock, a moss-covered wall. Stand with it. How old is it? What has it witnessed?" },
        { prompt: "Let the children dig and explore freely. No direction.", activity: "Free digging: find a place where digging is welcome — a beach, a garden, a sandbox. Give tools and complete freedom. No direction. Let the underground world be discovered." },
        { prompt: "Observe a sunrise or sunset in full.", activity: "Full light observation: watch a sunrise or sunset from beginning to end — not just a glance. Note the sequence of colors. Sketch the changing sky at three moments during the transition." },
        { prompt: "Walk your neighborhood as a naturalist.", activity: "Urban naturalist walk: walk your usual neighborhood, but as a scientist observing nature. What grows between the cracks? What lives on walls? What birds nest in gutters? Nature is everywhere." },
        { prompt: "Rest outside. Let this term's outdoor time be received as a gift.", activity: "Term outdoor close: go to the outdoor place that has meant most to you this term. Sit there together. Each person names one thing the outdoors has given them. Give thanks." },
      ]
    },
    { reflection: "How will you protect outdoor time next term, even when the schedule fills?",
      days: [
        { prompt: "Declare outdoor time non-negotiable this term.", activity: "Outdoor commitment: as a family, name the time outdoor time happens each day next term. Write it in the schedule. Treat it as unmovable as meals. Name why it matters." },
        { prompt: "Walk somewhere new today. Let discovery happen.", activity: "Final new ground: on the last week of term, walk somewhere none of you has explored. Let the term end in discovery, not familiarity. The outdoors always has more to show." },
        { prompt: "Sketch the natural world around your home as a seasonal record.", activity: "Seasonal sketch: make one final drawing of the outdoor world closest to you — your yard, your street, your view from the window. Date it. This is what it looked like now." },
        { prompt: "Let nature lead your studies this week.", activity: "Nature-led week: this final week, let what the children find outside lead your studies. Follow the rabbit they caught sight of into a study of rabbits. Follow the interest." },
        { prompt: "Go out and do nothing. No sketching, no narrating. Just be in the world.", activity: "Pure being outside: no nature journals, no narration, no sketching. Just go outside and be there. Let the world be received without being studied. Receive it as a gift." },
        { prompt: "Find something in nature you don't know the name of. Learn it.", activity: "Unknown thing: each person finds one natural thing they cannot name. Look it up. Learn its name and one fact about it. Let not-knowing lead to knowing." },
        { prompt: "Give thanks for the outdoor world that has taught you so much this term.", activity: "Gratitude for the world: at the end of the last day of term, go outside together and give thanks — for the sky, for the trees, for the living things that have been your teachers." },
      ]
    },
  ],

  stillness: [
    { reflection: "What does stillness look like in your home right now?",
      days: [
        { prompt: "Begin today with 2 minutes of silence before any lessons.", activity: "Morning silence ritual: set a gentle timer for 2 minutes. Everyone sits at the table in silence — no talking, no fidgeting. Then begin the day. Do this every morning this week." },
        { prompt: "Notice when your home is loudest. What would help?", activity: "Volume audit: at different times today, notice the noise level. Name what is creating it. After dinner, ask the children: 'When was our home quietest today? Did we like it?'" },
        { prompt: "Ask the children to sit quietly for 3 minutes and listen. What did you hear?", activity: "Listening silence: sit together for 3 minutes with no talking. Each person listens and counts the distinct sounds they hear. Afterward, share. How many were there?" },
        { prompt: "Let your children see you sit quietly and read for 15 minutes.", activity: "Parallel quiet reading: everyone reads independently in the same room for 15 minutes. No talking. Let the children see what unhurried quiet reading looks like." },
        { prompt: "Before bed, 5 minutes of quiet — no devices, just evening sounds.", activity: "Evening quiet: for the last 5 minutes before bedtime routine begins, sit quietly together. No screens, no books. Just the sounds of the house and the night." },
        { prompt: "Let the weekend morning begin slowly. No rushing until 9 AM.", activity: "Slow morning: this weekend, nothing scheduled before 9 AM. No rushing anyone. Let the morning arrive without agenda. Notice what the children do with unhurried time." },
        { prompt: "Rest fully and quietly today.", activity: "Full quiet rest: a day with no mandatory activities. Rest can look like reading, napping, drawing, or simply being. Honor whatever form quiet rest takes for each person." },
      ]
    },
    { reflection: "Is stillness a relief or an effort in your home right now?",
      days: [
        { prompt: "Begin each lesson with a seated pause. Hands in lap. Eyes forward.", activity: "Settling pose: before each lesson, everyone sits with hands in laps, feet on the floor, eyes forward. Hold for 30 seconds. Then begin. Practice this for every transition today." },
        { prompt: "Practice waiting without complaint today.", activity: "Waiting practice: when something requires waiting — a meal not ready, a sibling not done, a download not finished — receive it quietly. Name it when it is done well: 'That was beautiful waiting.'" },
        { prompt: "Read a psalm aloud slowly. Sit in silence for one minute after.", activity: "Psalm reception: read a psalm slowly, as slowly as you can. Then sit in silence for exactly one minute after. Don't explain or discuss. Just receive what settled." },
        { prompt: "Complete a task in silence — copywork, math, or drawing.", activity: "Silent work: choose one lesson — copywork, math, or drawing — and complete it entirely in silence. No music, no talking. Let the work be done in quiet." },
        { prompt: "One hour with no background noise — no music, no podcasts, no TV.", activity: "Silence hour: for one hour, no ambient noise. No music, no podcasts, no TV in the background. Notice how the house sounds when it is only itself." },
        { prompt: "Walk in silence for the first 5 minutes. Let the world speak.", activity: "Silent walk opening: the first 5 minutes of the outdoor walk are completely silent. No talking, no pointing, no questions. Just walking and receiving what is there." },
        { prompt: "Rest outside in silence. Notice what fills the quiet.", activity: "Outdoor silence: sit outside for 15 minutes in silence. Not meditation — just sitting outside without speaking. Notice what sounds arise when speech is absent." },
      ]
    },
    { reflection: "What helps your children settle? What makes stillness harder?",
      days: [
        { prompt: "A settling ritual: same song, candle, posture — every morning.", activity: "Morning ritual: create a settling ritual for the start of school — a candle lit, a short piece of music, a specific posture. Practice it every morning this week." },
        { prompt: "Rest your eyes for 3 minutes during read-aloud. Then narrate.", activity: "Eyes-closed listening: ask the children to close their eyes during read-aloud for one passage. No peeking. Then narrate. Does listening with eyes closed change what is retained?" },
        { prompt: "Practice composure at the table: sitting well, eating quietly.", activity: "Table stillness: practice sitting well at the table — back straight, elbows off the table, speaking one at a time, eating without rushing. Not as a rule but as a practice of self-possession." },
        { prompt: "After outdoor time, sit quietly inside for 5 minutes before school.", activity: "Transition stillness: when coming inside from outdoor time, sit quietly for 5 minutes before beginning school. Let the energy of outside settle before the work of inside begins." },
        { prompt: "End the school day with quiet reading. No discussion, just reading.", activity: "Close-of-school quiet: the last 15 minutes of the school day is silent reading — everyone in their own book, in the same room. No discussion. A quiet close." },
        { prompt: "Introduce a daily quiet time: each child alone for 30 minutes after lunch.", activity: "Afternoon quiet time: after lunch every day this week, each child goes to their own space for 30 minutes of quiet — reading, drawing, building, or resting. Alone, not together." },
        { prompt: "Rest well. Stillness is preparation, not laziness.", activity: "Active rest: let rest be its own activity today — purposeful and received. Read, nap, draw, sit in the sun. Let the children see that rest is honorable and necessary." },
      ]
    },
    { reflection: "What time of day is stillness most possible? How can you protect it?",
      days: [
        { prompt: "Begin each lesson without speaking. Write the first instruction.", activity: "Written instruction: begin each lesson by writing the instruction on a card and handing it silently to the child. Let them read and begin without a verbal prompt." },
        { prompt: "Do something that usually creates noise — and do it quietly.", activity: "Quiet version: choose a task that usually generates noise — setting the table, tidying a room — and do it as quietly as possible. Notice the difference it creates in the atmosphere." },
        { prompt: "Read poetry aloud slowly, with pauses. Don't explain. Let it settle.", activity: "Poetry settling: read a poem with long pauses between stanzas. No explanation, no questions. Simply pause and let the words rest in the room before moving on." },
        { prompt: "Five minutes of stillness before prayer or before sacred practice.", activity: "Sacred stillness: before prayer or Bible reading, sit in silence for 5 minutes. Let the quiet prepare the heart. Don't explain the purpose — just do it." },
        { prompt: "Ask: what happens in your mind when you are still?", activity: "Inner attention: ask each child to sit quietly for 3 minutes and notice what happens in their thoughts. Afterward: 'What came into your mind in the quiet? Where did your thoughts go?'" },
        { prompt: "Let the afternoon be quieter than the morning. Protect the slow hours.", activity: "Afternoon protection: this week, protect the post-lunch hours from scheduling. Let them be slower than the morning. No errands, no activities. Just slow afternoon time at home." },
        { prompt: "Rest. Read, sleep, or sit. Choose stillness freely.", activity: "Free stillness: give each person a free hour to choose their own form of rest. No requirements. Simply be still in whatever form stillness takes for them. Receive without directing." },
      ]
    },
    { reflection: "What has changed in the children since you began attending to stillness?",
      days: [
        { prompt: "Practice stillness in a noisy place. Can they find it internally?", activity: "External noise, internal stillness: sit in a busy place — a café, a waiting room, a car — and practice stillness within the noise. Internal composure despite external noise." },
        { prompt: "Do something slowly that is usually rushed: dress, eat, begin.", activity: "Slow practice: choose one morning routine task and do it at half speed. Dress slowly. Eat slowly. Begin slowly. Let slowness itself be the practice of stillness." },
        { prompt: "Read a nature passage then go outside and find what was described — slowly.", activity: "Slow finding: read a descriptive passage about one thing in nature. Go outside slowly and look for it. Not a race — a slow, attentive search." },
        { prompt: "Practice composure when something goes wrong. Breathe first.", activity: "Composure practice: before the day begins, talk about what composure looks like when something goes wrong. Then, when it happens today, name it: 'Let's breathe first.'" },
        { prompt: "One hour of no entertainment — no music, no stories, no screens. What do they do?", activity: "Quiet hour: for one full hour, no entertainment of any kind. No music, no books, no screens, no storytelling. Observe how the children fill the silence with their own resources." },
        { prompt: "15-minute outdoor walk in silence.", activity: "Long silent walk: walk for 15 minutes without speaking. The rule is absolute silence. At the end, each person shares one thing they noticed that they might not have noticed if speaking." },
        { prompt: "Rest in the fullest sense: sleep, lie still, or sit in the sun.", activity: "Complete rest: let the body stop. Sleep, or lie still, or sit in sunlight without doing anything. Let physical stillness teach internal stillness." },
      ]
    },
    { reflection: "What is the relationship between stillness and attention in your children?",
      days: [
        { prompt: "Begin the day with: 'Today we will be still before we are busy.'", activity: "Named intention: begin the day by naming stillness as today's intention. 'Before we are busy, let us be still.' Then be still together for 3 minutes before anything else begins." },
        { prompt: "Practice stillness in transitions between lessons.", activity: "Transition stillness: between every lesson today, pause for 30 seconds of stillness. Put down what was, pick up nothing yet. Let the transition itself be still." },
        { prompt: "Read a long poem aloud without stopping to explain. Let stillness carry it.", activity: "Unexplained poem: read a longer poem — all of it — without stopping to explain or define. Let the words be received in whatever way they are received. Trust the poem." },
        { prompt: "Sit with a question — not answer it, just sit with it.", activity: "Question sitting: give a question: 'What does justice mean?' or 'Why does beauty matter?' Ask the children to sit with it for 5 minutes without answering. Then discuss freely." },
        { prompt: "Dinner quiet and slow today. No hurry. Let the meal be a rest.", activity: "Slow dinner: cook something that requires time and care. Eat it slowly. Set the table beautifully. Speak quietly. Let dinner be a restful act, not a rushed one." },
        { prompt: "Go somewhere still — a library, a church, a garden — and simply be there.", activity: "Place of stillness: visit a place designed for quiet — a library reading room, a church sanctuary, an empty garden. Sit there for 20 minutes. Let the place teach what words cannot." },
        { prompt: "Rest. Let this week's stillness become a memory of peace.", activity: "Peace memory: at the end of the week, ask each person: 'What is one moment of stillness or peace from this week that you want to remember?' Write them down." },
      ]
    },
    { reflection: "Does stillness feel more natural now than it did in Week 1?",
      days: [
        { prompt: "Receive excitement quietly first — then respond.", activity: "Excitement composure: when something exciting happens today, practice receiving it quietly first — a breath, a pause — before responding with energy. Notice how this changes the response." },
        { prompt: "Read a challenging passage slowly. Let the difficulty be still, not anxious.", activity: "Difficult text stillness: read a passage that is genuinely hard. Read it slowly. Don't rush to understand or explain. Sit with the difficulty without anxiety. Ask: 'What did you catch?'" },
        { prompt: "Ten minutes of complete silence as a family. No fidgeting, no whispering.", activity: "Full family silence: set a timer for 10 minutes. Complete silence — no fidgeting, no whispering, no leaving the room. Sit together in real silence. This is harder than it sounds." },
        { prompt: "Ask: what does it feel like when you are not still — what is happening inside?", activity: "Inner noise inventory: ask children to notice internal restlessness. 'When you're not still, what is happening inside you? What does it feel like?' Name what makes stillness hard." },
        { prompt: "Composure when corrected: receiving feedback without tears or argument.", activity: "Correction composure: talk about what it looks like to receive correction with composure. Then practice it today — deliberately. When correction comes, breathe, listen, nod." },
        { prompt: "Let the evening be long and slow. No rushing to bed.", activity: "Long evening: don't rush bedtime tonight. Let the evening stretch. Read aloud longer than usual. Let the transition to sleep be slow and gentle, not hurried." },
        { prompt: "Rest. Write one sentence about what stillness gave you this week.", activity: "One sentence rest: each person writes one sentence about what stillness gave them this week. No more than one sentence. Read them aloud. Receive them in stillness." },
      ]
    },
    { reflection: "How is stillness changing the emotional climate of your home?",
      days: [
        { prompt: "Begin with a blessing or a prayer of stillness before any work.", activity: "Opening blessing: begin the school day with a spoken blessing or a prayer — not formal, just a few words of intention. Then 2 minutes of silence. Then begin." },
        { prompt: "Practice sitting without doing for 5 minutes.", activity: "Pure sitting: set a timer for 5 minutes. Sit without doing anything — not meditating, not praying, not thinking about anything in particular. Simply sitting. This is harder than it sounds." },
        { prompt: "Read a heavy history or biography passage. Sit with its weight.", activity: "Weight reception: read a passage from history that carries moral or emotional weight — a battle, a sacrifice, an injustice. Sit in silence for one minute after. Let it be received." },
        { prompt: "Let an upset child sit quietly before speaking.", activity: "Pre-speech quiet: when a child is upset, before they speak or before you respond, invite them to sit quietly for 2 minutes. Then speak. Let the quiet do its work first." },
        { prompt: "Practice stillness at the table: no rising until the meal is finished.", activity: "Table composure: practice remaining seated through the entire meal — no one rises until everyone has finished and thanks has been given. Simple bodily composure practiced daily." },
        { prompt: "Late afternoon walk as the light changes. Notice when stillness enters the hour.", activity: "Golden hour walk: go outside in the hour before sunset. Walk slowly. Notice how the quality of light and sound changes in the late afternoon. Stillness often enters naturally here." },
        { prompt: "Rest deeply today. Protect the rest.", activity: "Protected rest: actively protect today's rest. Turn off the phone, say no to interruptions, close the laptop. Let rest be a complete and unhurried gift given to your family." },
      ]
    },
    { reflection: "What would it look like for stillness to be fully woven into daily life?",
      days: [
        { prompt: "Begin each day this week without speaking for the first 10 minutes.", activity: "Morning silence practice: for 10 minutes after waking, no one speaks — not parents, not children. Move through the morning routine in silence. Let the day wake slowly." },
        { prompt: "Let there be no hurrying today. Adjust the schedule to match stillness.", activity: "Unhurried day: plan to accomplish less than usual. Give everything extra time. When you feel the urge to hurry, slow down instead. Let the day teach what unhurrying feels like." },
        { prompt: "Read something beautiful and old — a prayer, a psalm, a poem from another century.", activity: "Old beauty: read something that has been beautiful for centuries — a psalm, a collect from the Book of Common Prayer, a poem by George Herbert or John Keats. Let old beauty teach." },
        { prompt: "Ask children to find stillness in their bodies: where is tension? Can they release it?", activity: "Body stillness: ask children to close their eyes and scan their bodies — where are they holding tension? Shoulders? Hands? Jaw? Can they breathe and let it go? Physical stillness teaches inner stillness." },
        { prompt: "Practice composure in public: shop, library, church — no running, no demanding.", activity: "Public composure: talk before you go about what composure looks like in a public place. Practice it. Afterward, name what was done well: 'I noticed how quietly you waited.'" },
        { prompt: "Go to a field, a chapel, an empty beach — a place of genuine stillness.", activity: "Stillness pilgrimage: visit a place that holds real quiet — a chapel, an empty meadow, an early morning beach. Sit for 20 minutes. Let the place do the teaching." },
        { prompt: "Rest. Give the week over to quiet.", activity: "Week's surrender: at the end of the week, let everything that was not finished or not perfect be released. Give the week over. Rest in what was done and let go of what wasn't." },
      ]
    },
    { reflection: "What does your family's practice of stillness say about what you value?",
      days: [
        { prompt: "Let stillness open the week: Monday begins in quiet before noise.", activity: "Monday quiet: the very first thing on Monday morning is 5 minutes of stillness together. No announcements, no plans, no rushing. Begin the week in quiet." },
        { prompt: "Practice receiving bad news with composure. Talk about it before it's needed.", activity: "Composure preparation: talk together about how to receive hard news or disappointment with composure. Give examples. Practice the posture — sitting still, breathing slowly — before it's needed." },
        { prompt: "Read Psalms slowly: one or two each day this week.", activity: "Psalm week: read one psalm each morning and evening this week. No commentary, no explanation. Just the psalm, slowly, and then silence. Let the whole week be held in Psalms." },
        { prompt: "Ask: what do you hear in the silence? Let each child answer in their own time.", activity: "Silence question: sit in silence for 3 minutes. Afterward: 'What did you hear in the silence? Not with your ears — inside. What came to you?' Let each answer without rushing." },
        { prompt: "Speak to your children quietly today. Notice how they listen.", activity: "Quiet speech: speak in a deliberately quiet, calm voice all day. No raised voices. When you need attention, whisper. Notice how quiet speech from a parent creates quiet in the children." },
        { prompt: "Unstructured quiet: reading, drawing, being. Long stretches of it.", activity: "Long quiet stretches: protect 2 hours this weekend with no structure — no activities, no devices, no organized fun. Let the children find what quiet time offers them." },
        { prompt: "Rest as a form of trust: the week is done. Let it be.", activity: "Trusting rest: end the week by trusting that what was done was enough. Rest not as a reward but as an act of trust — the work was real, the rest is real. Let the week be complete." },
      ]
    },
    { reflection: "What is one gift stillness has given your family this term?",
      days: [
        { prompt: "Begin with a celebration of quiet: candles at breakfast, a psalm, gentle music.", activity: "Celebratory quiet: begin the last week of term with something beautiful and still — candles at the breakfast table, a psalm read aloud, soft music. Let beauty and quiet open the week." },
        { prompt: "Ask each child: what does stillness feel like now compared to Week 1?", activity: "Stillness comparison: each child answers: 'What does stillness feel like to you now? Is it different from how it felt at the beginning of term? What changed?' Listen fully." },
        { prompt: "Read something that required stillness to receive this term. Read it again.", activity: "Return reading: find a passage from this term's reading that you remember received in stillness. Read it again. Notice what is different in the second receiving." },
        { prompt: "Let narration happen quietly: written, from a still place.", activity: "Still narration: written narration today, but with a 3-minute silent pause before beginning. Let the writing come from a still place, not a rushed one." },
        { prompt: "Slow down before the break. Don't fill the last week.", activity: "Pre-break slowing: resist the urge to fill the last week of term with finishing and wrapping up. Let it slow down instead. Less is more in the final week." },
        { prompt: "Go to a favorite outdoor place and sit for 20 minutes. Nothing else.", activity: "Final outdoor stillness: go to the outdoor place that has offered the most stillness this term. Sit there for 20 minutes. Simply receive it one more time before the term ends." },
        { prompt: "Rest and give thanks. Stillness is a gift the term has given.", activity: "Stillness gratitude close: each person names one gift that stillness gave them this term. Write them down. Read them aloud. Receive them in — stillness." },
      ]
    },
    { reflection: "How will you protect stillness next term, even when life becomes full?",
      days: [
        { prompt: "Choose one daily ritual of stillness you will keep next term.", activity: "Stillness commitment: as a family, name one daily stillness ritual that will continue into next term. Name the time, the form, the duration. Write it as a family commitment." },
        { prompt: "Begin the last week slowly. Let it breathe.", activity: "Final week pace: set the intention to do the last week slowly. No extra projects. No final push. Let the term end the way the term was meant to be — in an unhurried rhythm." },
        { prompt: "Read something beautiful aloud and let it stand without comment.", activity: "Uncommented beauty: read a poem, a passage, or a psalm and let it stand without explanation, discussion, or narration. Just beauty, received and released." },
        { prompt: "Let the children have an unstructured day. Observe what they do.", activity: "Free day observation: give one full free day. Observe what the children do with complete unstructured time. What do they reach for? What stillness do they find on their own?" },
        { prompt: "Name the quiet moments of this term — give thanks for each one.", activity: "Quiet moments naming: sit together and name the moments of stillness from this term that you want to remember — a quiet morning, a still evening, a moment of composure. Give thanks." },
        { prompt: "Rest fully. Let the term end in peace, not exhaustion.", activity: "Peace ending: protect the last day of term from busyness. Let it be gentle. End with something beautiful — a poem, a meal, a walk. Let the term end in peace." },
        { prompt: "Begin something new in stillness: a new notebook, a new plan, a new hope.", activity: "New beginning in quiet: in the quiet of the term's end, begin something new — a new notebook, the first line of next term's plan, a seed planted for what comes next. Begin in stillness." },
      ]
    },
  ],

  orderly: [
    { reflection: "What does order look like in your home? Where does it break down?",
      days: [
        { prompt: "Before school, spend 5 minutes making the space ready.", activity: "School space preparation: together, spend 5 minutes preparing the school space before beginning — books in place, pencils sharpened, surfaces clear. Let preparation be part of the lesson." },
        { prompt: "Begin well: pause and prepare materials before beginning any task.", activity: "Beginning practice: before each lesson begins, children lay out their materials — pencil, book, paper — before anything else happens. Practice the orderly beginning as a ritual." },
        { prompt: "Finish one thing completely before moving to the next.", activity: "Completion habit: the rule today is that nothing new begins until what is current is fully finished. Books closed, materials away, attention shifted. Practice this across every transition." },
        { prompt: "Put school materials completely away before leaving the table.", activity: "Complete put-away: nothing left on the table at the end of school. Every book shelved, every pencil returned, every paper filed or stored. Complete, not approximate, order." },
        { prompt: "Tidy one space together — slowly and with care, not quickly.", activity: "Care tidy: choose one cluttered space — a shelf, a drawer, a corner. Tidy it together with full attention and care. Not a quick shove-and-shut but a slow, considered ordering." },
        { prompt: "Let Saturday include gentle home-tending — order as love.", activity: "Loving order: Saturday home-care as an act of love for the family. Name it that way: 'We're tending our home because we love each other.' Give each person a task done with care." },
        { prompt: "Rest in an ordered home. Notice how it feels.", activity: "Ordered rest: after a week of tending the home, rest in it. Notice how a well-ordered home feels different for rest. Let the order serve the rest." },
      ]
    },
    { reflection: "Where does disorder cost your family the most time and energy?",
      days: [
        { prompt: "Name what order means: 'We take care of our things because they matter.'", activity: "Order conversation: gather the family and talk about why order matters. Not as a rule, but as a value: 'Our things matter. Our spaces matter. We show that by how we care for them.'" },
        { prompt: "Practice a morning routine until it becomes automatic.", activity: "Routine practice: this week, the morning routine is the same every day — same order, same tasks. Practice it until the sequence feels natural. Predictability builds order." },
        { prompt: "Each child names their most disordered habit. Address one together.", activity: "Honest naming: each child (and parent) names one habit of disorder they have — losing things, leaving tasks half-done, rushing through. Choose one and address it together this week." },
        { prompt: "Before bed, set tomorrow's school space in order.", activity: "Evening preparation: before bed, each child prepares their school space for tomorrow — books ready, pencils sharpened, any special materials gathered. Begin tomorrow from order." },
        { prompt: "Let one child lead the tidy. They assign tasks and check the work.", activity: "Child-led order: one child is in charge of the tidying session — they decide who does what, they check whether it is done well, they call it complete. Responsibility for order." },
        { prompt: "Do one task beautifully — set the table with care, arrange books with intention.", activity: "Beautiful doing: choose one ordinary task and do it with extraordinary care — the table set beautifully, the bookshelf arranged by color or size, the meal plated with intention. Beauty and order." },
        { prompt: "Rest. A well-ordered week deserves a well-rested weekend.", activity: "Rest earned: when the week has been orderly, name it. 'We tended our home and our work well this week. Now we rest.' Let the rest feel connected to the order that preceded it." },
      ]
    },
    { reflection: "Is order becoming a rhythm, or does it still require constant effort?",
      days: [
        { prompt: "Practice beginning without being told: when it is time, begin.", activity: "Self-starting practice: this week, no verbal reminders to begin. When the time for school arrives, children begin without being told. Practice the internal prompt that replaces the external one." },
        { prompt: "Finish a project that has been left undone. Completion is a form of order.", activity: "Completion project: identify one unfinished thing — a craft, a school project, a book not returned, a task half-done. Complete it today. Let completion feel satisfying." },
        { prompt: "Tidy the school space in the middle of the day — not just at the end.", activity: "Mid-day order: at the halfway point of the school day, pause for a 3-minute tidy. Clear surfaces, put away what is done, prepare for what is next. Order as a rhythm, not just an ending." },
        { prompt: "Ask: what would our home look like if we all treated our things with great care?", activity: "Vision conversation: 'Close your eyes and imagine our home where everyone cares for everything with great care. What does it look like? Feel like? What are we doing differently?' Discuss." },
        { prompt: "Slow, thorough tidy of one room versus the usual quick tidy. Notice the difference.", activity: "Thorough vs. quick: tidy one room thoroughly — moving things, dusting, returning each item to exactly the right place. Compare with the usual quick tidy. Which serves the home more?" },
        { prompt: "Orderly work as service: 'I am tidying this for our family.'", activity: "Service reframe: today, reframe all tidying as an act of service. 'I'm doing this for our family.' 'I'm caring for something that belongs to all of us.' Let the motive transform the task." },
        { prompt: "Rest in the knowledge that the week was finished well.", activity: "Finished-well rest: at the end of the week, take stock together. 'Did we finish what we began this week? Did we tend our things with care?' Name what was done well. Rest in it." },
      ]
    },
    { reflection: "What role does order play in learning? How does disorder interrupt attention?",
      days: [
        { prompt: "Practice orderly transitions: tidy before moving from one lesson to another.", activity: "Transition order: between every lesson today, there is a 2-minute tidy before the next begins. Close what is done, prepare what is next. The transition itself becomes orderly." },
        { prompt: "Ask children to check their own work before showing you.", activity: "Self-checking habit: after completing any work, children review their own work before showing you — checking for errors, missing items, quality. Self-ordering of one's own output." },
        { prompt: "Let one child be fully in charge of the school space this week.", activity: "School space stewardship: one child is responsible for the school space all week — preparing it, maintaining it, tidying it at day's end. Give real responsibility for real order." },
        { prompt: "Practice beginning at the appointed time — not late, not reluctantly, but well.", activity: "On-time beginning: this week, school begins exactly when scheduled. No late starts, no five-more-minutes. Practice the orderly beginning as a form of respect for the day." },
        { prompt: "Full book tidy: every book on a shelf, spine out, in order.", activity: "Library tidy: go through every book together. Every book returned to a shelf, spine facing out, arranged by some order the children help create. A library they made together." },
        { prompt: "Let the rhythm of the school day itself be an act of order and care.", activity: "Day as order: the schedule itself is an ordered thing. Walk through it together: 'This is our day, and this order serves our learning. Each part makes space for the next.'" },
        { prompt: "Rest. The work is done. Put it away.", activity: "Complete rest: at the week's end, put away everything work-related — books, plans, papers. Clear the space completely. Then rest in the cleared space. Order makes rest possible." },
      ]
    },
    { reflection: "Has the quality of the children's work changed since attending to order?",
      days: [
        { prompt: "Introduce a checklist for the morning routine. Each child checks their own.", activity: "Morning checklist: create a simple morning routine checklist with the children. Each child has their own. They check off their own tasks — no parent reminders. Independence through order." },
        { prompt: "Practice finishing completely: a lesson is not over until materials are put away.", activity: "Full completion: define 'done' clearly: the lesson is complete only when materials are put away, the surface is clear, and the child is ready for the next thing. Not before." },
        { prompt: "Ask: what does it mean to take care of something? Give examples.", activity: "Care conversation: 'What does it mean to take care of something? Give me an example of something you take really good care of. Why do you care for it so well?' Let this expand to all things." },
        { prompt: "Tidy one drawer or shelf together — one small space, done with care.", activity: "Small space deep tidy: one drawer, one shelf. Take everything out. Clean the surface. Return only what belongs, in the right place. Small, complete, excellent order." },
        { prompt: "Copywork with full attention to neatness and care — order on the page.", activity: "Page order: copywork today with the explicit goal of beautiful order on the page — margins respected, letters formed carefully, spacing even. The page as an ordered space." },
        { prompt: "Go outside and tidy the outdoor space — a garden corner, a porch, a path.", activity: "Outdoor order: spend 15 minutes tending the outdoor space — clearing a garden bed, sweeping a path, picking up what has been left outside. Order extends beyond the house." },
        { prompt: "Rest in a home that has been tended this week.", activity: "Tended home rest: at the week's end, notice what has been tended. Name it. 'We tended our home this week.' Then rest in the home that was cared for." },
      ]
    },
    { reflection: "Is orderly work becoming satisfying rather than burdensome?",
      days: [
        { prompt: "First things first: most important task done before the pleasurable ones.", activity: "Priority practice: begin the day by naming what is most important. Do that first, completely, before anything easier or more enjoyable. Practice the order of priority." },
        { prompt: "Practice waiting in order: turns, one at a time, without rushing.", activity: "Orderly waiting: practice taking turns — in speaking, in serving food, in using shared materials. One at a time, without rushing or crowding. Order in the common life." },
        { prompt: "Let a child organize a section of the library or book collection.", activity: "Child library ordering: give one child authority over a section of the family books — they decide the order, create the categories, arrange the shelf. Ownership of order." },
        { prompt: "Do one creative project from beginning to end without stopping.", activity: "Beginning-to-end project: choose a project — baking, a craft, a drawing — and do it from setup to cleanup without stopping or leaving it half-done. The whole arc, completed." },
        { prompt: "Tidy together after dinner — kitchen, table, school space — as a family act.", activity: "Evening family tidy: after dinner, everyone tidies together — one does dishes, one sweeps, one clears the table, one tidies the school space. Order as a family act, not a chore assigned." },
        { prompt: "Saturday morning home-tending: each person with a task, done well.", activity: "Saturday stewardship: assign each person one home-care task for the morning. It must be done well — not quickly. No moving on until it is genuinely done. Then rest together." },
        { prompt: "Rest. Order is not control — it is love made visible.", activity: "Rest in ordered love: take time to notice, before you rest, how order has served your family this week. It is love — love for the people who live here. Rest in that." },
      ]
    },
    { reflection: "Where does order still break down? What would help?",
      days: [
        { prompt: "Begin each lesson by naming what you will do and how long it will take.", activity: "Ordered mind first: before beginning any lesson, the child names aloud: 'I will do [task] for [time].' Order in the mind before order in the materials. Mental preparation." },
        { prompt: "Practice returning things to exactly where they belong — not close, exactly.", activity: "Exact return: practice exact return this week. Not near the shelf — on the shelf. Not near the hook — on the hook. Exactness in order is a form of care and attention." },
        { prompt: "Ask: what does it feel like when things are in order? When they are not?", activity: "Order feelings: name feelings connected to order and disorder. 'When my room is tidy I feel... When it is messy I feel...' Let the children connect order to their own inner life." },
        { prompt: "Let one child choose how to arrange the school space today.", activity: "Child-ordered space: one child arranges the school space according to their own sense of order. Adults use it that way for the day. Respect their ordering. Discuss afterward." },
        { prompt: "Sort art and craft supplies: what is used, what isn't, what needs replacing.", activity: "Craft sort: go through the art and craft supplies together. Sort into: use regularly, use sometimes, never use, needs replacing. Order the supplies by actual use." },
        { prompt: "Begin and end each day the same way — a ritual of order.", activity: "Daily ritual: establish a beginning ritual (settle, prepare, begin) and an ending ritual (complete, tidy, close) that frames every school day. Ritual creates predictable order." },
        { prompt: "Rest. Order is not control — it is love made visible.", activity: "Loving rest: at the week's end, let the order of the week be seen as love — for each person who lives here. Rest in a loved space. Give thanks for the love that order expresses." },
      ]
    },
    { reflection: "What does order as a form of love look like in your home?",
      days: [
        { prompt: "Practice orderly speech: say what you mean, clearly, once.", activity: "Speech order: practice saying what you mean clearly and once — not circling, not repeating, not trailing off. Let language itself be ordered. Model this as a parent." },
        { prompt: "Finish the term's unfinished projects — one at a time, completely.", activity: "Project completion: identify every unfinished project from the term. Choose the most important. Finish it completely before beginning anything new this week." },
        { prompt: "Each child tidies their own room with full care — genuine order, not surface order.", activity: "Personal space deep tidy: each child tidies their own room fully — not just the visible surfaces, but drawers, under the bed, the closet. Genuine order, not performed order." },
        { prompt: "One lesson done with extraordinary care: slow, beautiful, complete.", activity: "Beautiful lesson: choose one lesson and do it with extraordinary care — slow pace, beautiful execution, full attention. Let one thing be done excellently. Name it when it is." },
        { prompt: "A family project requiring sustained order: cooking, planting, building.", activity: "Ordered project: a project that requires order to succeed — cooking a complex meal, planting a garden bed, building something from a plan. Let the project teach why order serves." },
        { prompt: "Let the weekend be an ordering of the week — physical, mental, relational.", activity: "Full-life order: on Saturday, tend three things — the physical home, one unfinished thought or decision, and one relationship that needs attention. Order in the whole of life." },
        { prompt: "Rest. A well-ordered life has room for rest.", activity: "Room-for-rest order: an ordered life is not a crammed life. It has margins. Rest in the margin that order creates. Give thanks that good order makes rest possible." },
      ]
    },
    { reflection: "How has orderly work changed the children's relationship to their things and space?",
      days: [
        { prompt: "Practice the habit of finishing: every sentence complete, every task done before the next.", activity: "Finishing habit: the rule for today: nothing begins until what came before is completely finished. Sentence finished. Pencil put down. Task fully done. Then the next." },
        { prompt: "Ask: what does our home need from us today? Let the children answer and respond.", activity: "Responsive order: ask the children to look at the home and tell you what it needs today. Let them identify and respond. Teach them to see the home as something that has needs." },
        { prompt: "Let tidying be joyful today — music, working together, making it beautiful.", activity: "Joyful tidy: put on favorite music, work together, add something beautiful to the space as you tidy it — a candle, a flower, a rearranged shelf. Let the work be glad." },
        { prompt: "Deep tidy of the school space: wipe surfaces, sharpen pencils, replace worn items.", activity: "School space restoration: give the school space a full, deep tidy — every surface wiped, every supply sorted and sharpened, worn items replaced. Leave it better than you found it." },
        { prompt: "Practice orderly transitions between home and away — leaving and returning with care.", activity: "Threshold order: practice how you leave the house — shoes put on, door properly closed, nothing left running — and how you return — shoes off, bags put away, what was brought in, put away." },
        { prompt: "Free but tidy: unscheduled afternoon, with orderly beginning and end.", activity: "Free time with order: give a free afternoon, but with one orderly frame — the space is tidy before free time begins and tidy again before dinner. Order as the container for freedom." },
        { prompt: "Rest in an ordered home. Give thanks for the beauty of things in their places.", activity: "Beauty of order rest: before resting, take one quiet walk through your home and notice what is in order. Give thanks for it. Beauty of things in their places is a real beauty." },
      ]
    },
    { reflection: "What does 'orderly work' mean to you now that it has become a habit?",
      days: [
        { prompt: "Let orderly work be a meditation: one household task, slowly, with full attention.", activity: "Task meditation: choose one ordinary task — sweeping, washing dishes, folding laundry — and do it as slowly and attentively as possible. Let it be a meditation. Nothing else." },
        { prompt: "Practice the orderly expression of feelings: 'I feel frustrated because...'", activity: "Ordered emotion: practice finishing the sentence 'I feel [feeling] because [reason].' Not 'I feel frustrated!' but 'I feel frustrated because I couldn't find my pencil.' Order in emotion." },
        { prompt: "Final sort of the year's school materials: keep, archive, recycle.", activity: "End-of-year sort: go through this year's school materials together. Three piles: keep (for next year), archive (save but put away), recycle (let go). Order at the end." },
        { prompt: "Ask: what would we like to do better next term with our work habits?", activity: "Forward-looking order: 'What would we like to do differently next term — one habit of work we want to build or improve?' Name it. Write it down. Make it a plan." },
        { prompt: "Let children arrange and display some of the term's work — a small exhibition.", activity: "Work exhibition: select some of the best work from the term — narrations, sketches, projects. Arrange them in a small display. Let the children see their ordered work honored." },
        { prompt: "Walk through the home with fresh eyes: what needs attention that has been ignored?", activity: "Fresh-eyes walk: walk slowly through your home as if seeing it for the first time. What has been overlooked? What needs attention? Make a short list and address one thing today." },
        { prompt: "Rest. Let the week's order be received as a gift to the family.", activity: "Gift of order rest: at the week's end, see the week's order as a gift you gave to your family. Rest in having given that gift. Let the giving and the resting belong together." },
      ]
    },
    { reflection: "What is the most beautiful example of orderly work you've seen this term?",
      days: [
        { prompt: "Celebrate orderly work: notice and name it when you see it.", activity: "Noticing celebration: today, every time you see orderly work — a task completed, a space tended, a beginning begun well — name it with genuine appreciation. 'I see what you did there. Beautiful.'" },
        { prompt: "Ask each child to name one area of orderly work they are proud of from this term.", activity: "Pride naming: each child names one area of order they grew in this term — not where they're perfect, where they grew. Parents share too. Celebrate growth, not perfection." },
        { prompt: "Final thorough school space tidy — prepare it for next term.", activity: "Term-end school tidy: a full and thorough tidy of the school space — preparing it for next term. Every supply sorted, surface clean, everything ready. Leave it better than the term found it." },
        { prompt: "Write a note to each child about one area of orderly growth you have noticed.", activity: "Growth letter: write a short note to each child naming one specific thing you've seen grow in them this term in terms of order and care. Read it to them or tuck it in their notebook." },
        { prompt: "Let the final week slow down. Finish well, not quickly.", activity: "Finishing well: the last week of term is not a sprint to finish everything. It is a slow, careful closing. Finish what matters. Let what doesn't matter wait. Finish well." },
        { prompt: "Take everything off one shelf and put it back with intention. That is enough.", activity: "One shelf, done fully: one shelf. Everything off. Clean the shelf. Return everything in its exact right place. One small, complete act of order. That is enough for today." },
        { prompt: "Rest. The term is nearly done. Let it end in quiet order.", activity: "Quiet order close: let the last day of term be a quiet, orderly closing — not a party, not a rush, but a gentle, ordered end. Everything in its place. Everyone at rest." },
      ]
    },
    { reflection: "How will you carry orderly work forward as a value, not just a habit?",
      days: [
        { prompt: "Begin the last week with an act of order: tidy, prepare, set things right.", activity: "Ordered beginning of end: begin the final week of term with a full tidy of the home and school space. Start the ending as you would start a beginning — in order." },
        { prompt: "Ask: what is the connection between orderly work and kindness to others?", activity: "Order as kindness: 'How is tidying your things an act of kindness to the people who live here? How does your disorder affect others? How does your order serve them?' Discuss." },
        { prompt: "Do a final project together that requires sustained orderly effort.", activity: "Final project: one last project that requires sustained order — bake something complex, build something, plant something. Let the term end with a project completed from beginning to end." },
        { prompt: "Each child names one area of order they want to grow in next term.", activity: "Next term's order goal: each child (and parent) names one specific area of orderly living they want to tend next term. Write it down. Put it somewhere visible. Begin from intention." },
        { prompt: "Tidy the home together on the last day of term. Leave it ready for rest.", activity: "Final tidy together: on the very last day of term, tidy the whole home together — every room, every space. Leave it ready for the break. Begin the rest in order." },
        { prompt: "Rest fully in the fullness of a well-tended term.", activity: "Well-tended rest: rest in the knowledge that the term was tended — the home, the work, the habits, the people. Well-tended things deserve well-earned rest. Receive it." },
        { prompt: "Give thanks for the order that made space for learning, beauty, and love.", activity: "Order gratitude close: at the very end, give thanks for order — not as a rule, but as a gift. 'Order made space for learning. Order made space for beauty. Order made space for love.' Give thanks." },
      ]
    },
  ],

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
  const [view, setView]         = useState("today");

  const day    = new Date().getDay();
  const habit  = HABIT_PROMPTS[selected];
  const acts   = HABIT_ACTIVITIES[selected];
  const HIcon  = HABIT_ICONS[selected];
  const colors = HABIT_COLORS[selected];

  const weekIdx      = Math.min(Math.max((currentWeek - 1), 0), 11);
  const weekData     = habit.weeks[weekIdx];
  const actWeekData  = acts[weekIdx];
  const todayData    = actWeekData?.days[day] || acts[0].days[day];
  const reflection   = weekData?.reflection || "";

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
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: colors.text }}>
              Week {weekIdx + 1} of 12
            </p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)" }}>
              {habit.name}
            </p>
          </div>

          {/* Family activity for today */}
          <div style={{ background: colors.bg, border: "1px solid " + colors.border, borderRadius: 4, padding: "20px", marginBottom: 14 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: colors.text, marginBottom: 12 }}>
              Today with Your Children
            </p>
            <p className="corm italic" style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1.85 }}>
              {todayData?.activity || todayData?.prompt}
            </p>
          </div>

          {/* Parent prompt */}
          <div style={{ padding: "14px 16px", background: "none", border: "1px solid var(--rule)", borderRadius: 4, marginBottom: 14 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>
              To Notice Today
            </p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.75 }}>
              {todayData?.prompt}
            </p>
          </div>

          {/* Hard day tip */}
          <div style={{ padding: "14px 16px", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, marginBottom: 14 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>
              On Hard Days
            </p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.7 }}>
              {habit.hardDay}
            </p>
          </div>

          {/* Weekly reflection */}
          <div style={{ padding: "14px 16px", background: "none", border: "1px solid var(--rule)", borderRadius: 4, marginBottom: 20 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>
              This Week's Reflection
            </p>
            <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.7 }}>
              {reflection}
            </p>
          </div>

          {/* Age notes */}
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
            <h2 style={{ fontFamily: "'Playfair Display\'", serif", fontSize: 22, color: "var(--ink)" }}>{habit.name}</h2>
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
            <p className="caption">Charlotte Mason, Home Education</p>
          </div>
        </div>
      )}

      {/* 12-WEEK ARC view */}
      {view === "arc" && (
        <div>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 20 }}>
            Each week builds on the last. The habit deepens gradually from introduction to integration.
          </p>
          {habit.weeks.map((w, i) => {
            const isCurrent = i === weekIdx;
            return (
              <div key={i} style={{ marginBottom: 10, padding: "14px 16px", borderRadius: 4, border: "1px solid " + (isCurrent ? colors.border : "var(--rule)"), background: isCurrent ? colors.bg : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: isCurrent ? colors.text : "var(--ink-faint)", minWidth: 58, flexShrink: 0, paddingTop: 2 }}>
                    Week {i + 1}{isCurrent ? " ←" : ""}
                  </span>
                  <p className="corm italic" style={{ fontSize: 14, color: isCurrent ? "var(--ink)" : "var(--ink-faint)", lineHeight: 1.6 }}>
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
