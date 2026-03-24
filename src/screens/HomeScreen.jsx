import { useState, useRef, useEffect } from "react";
import { DAYS, DAY_SCHEDULE, HABIT_PROMPTS, CM_QUOTES, RISE_SHINE_ITEMS, BEAUTY_LOOP, getSaturdayRhythm, getSundayRhythm } from "../data/seed";

const HABIT_ICONS = {
  attention: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  narration: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>),
  outdoor:   () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-8 4 5 3-3 4 6H3z"/><circle cx="18" cy="6" r="2"/></svg>),
  stillness: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
  orderly:   () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
};

const Icon = {
  Leaf:    () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Feather: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>),
  Sun:     () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Arrow:   () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>),
  Sprout:  () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10C12 10 8 9 7 5c3 0 5 2 5 5z"/><path d="M12 10C12 10 16 9 17 5c-3 0-5 2-5 5z"/></svg>),
  Moon:    () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>),
  X:       () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

const getBlockColor = (subject) => {
  const s = subject.toLowerCase();
  if (s.includes("rise") || s.includes("bible") || s.includes("memory") || s.includes("living literature") || s.includes("hymn")) return "var(--block-morning)";
  if (s.includes("math") || s.includes("language") || s.includes("writing") || s.includes("copywork") || s.includes("history") || s.includes("science") || s.includes("geography") || s.includes("spanish") || s.includes("reading") || s.includes("commonplace")) return "var(--block-academic)";
  if (s.includes("nature") || s.includes("outdoor") || s.includes("artist") || s.includes("composer") || s.includes("beauty") || s.includes("poet") || s.includes("biography")) return "var(--block-nature)";
  if (s.includes("co-op") || s.includes("bach") || s.includes("chispa") || s.includes("tennis")) return "var(--block-coop)";
  if (s.includes("lunch") || s.includes("free") || s.includes("rest") || s.includes("afternoon") || s.includes("break") || s.includes("pursuits") || s.includes("reset")) return "var(--block-free)";
  return "var(--rule)";
};

const MOTHER_CULTURE_DAILY = [
  "Rest fully today. The week ahead needs a rested you.",
  "Step outside alone for 10 minutes before the day begins. Let the morning be yours first.",
  "Make yourself something warm to drink and sit with it before opening any screens.",
  "Take a short walk, even just around the property. Move your body gently.",
  "Rest your eyes from screens for 20 minutes today. Look at something far away.",
  "Go outside and look up. Sky, clouds, light — let it reset something in you.",
  "Linger over breakfast. Let the morning be unhurried.",
];

const REST_WEEK_RHYTHM = [
  [{ label: "Morning Quiet", note: "Sleep in. Linger over breakfast. No agenda." }, { label: "Church or Worship", note: "Let Sunday be what it is meant to be." }, { label: "Afternoon Rest", note: "Nap, read, sit outside. Simply be." }],
  [{ label: "Morning Outside", note: "Begin the rest week outdoors — longer than usual, no nature journal required." }, { label: "Creative Morning", note: "Art, music, handicraft. Let the children follow their own curiosity." }, { label: "Read Aloud", note: "A longer session than usual. Let the story breathe." }, { label: "Free Afternoon", note: "No assignments. No checklist." }],
  [{ label: "Morning Slow Start", note: "Breakfast together, no rush to begin anything." }, { label: "Outing or Errand", note: "Library, farm stand, nature trail, or simply a drive somewhere new." }, { label: "Quiet Afternoon", note: "Independent reading, drawing, rest." }],
  [{ label: "Morning Chores Together", note: "Tend the home slowly. Order as an act of love." }, { label: "Cook Something Together", note: "Let the kitchen be today's classroom." }, { label: "Outside Time", note: "Unstructured. Let them wander." }, { label: "Evening Rest", note: "A good book, early bedtime." }],
  [{ label: "Morning Quiet Time", note: "Bible, journaling, tea. Begin the day gently." }, { label: "Creative Project", note: "Something with hands — building, painting, sewing, baking." }, { label: "Nature Walk", note: "No sketching required today. Just walk and notice." }],
  [{ label: "Morning Outside", note: "End the rest week where you began — in the open air." }, { label: "Read Aloud", note: "Revisit a favourite, or begin something new for next term." }, { label: "Prepare for the Week", note: "Light tidying, gather books, set the table for Monday." }, { label: "Celebrate the Rest", note: "Name one good thing from this week away." }],
  [{ label: "Family Day", note: "No school, no agenda. Just be together." }, { label: "Outdoor Adventure", note: "A longer outing — park, trail, town, or simply the back pasture." }, { label: "Evening Gathering", note: "Good food, good conversation, early rest." }],
];

const FREE_KEYWORDS = ["rise", "chores", "piano", "free", "rest", "independent", "lunch", "outdoor", "nature", "afternoon", "pursuits", "break", "reset"];
const isFreeBlock = (subject) => FREE_KEYWORDS.some(k => subject.toLowerCase().includes(k));

// ─── PREMIUM MODAL ────────────────────────────────────────────────────────────
export function PremiumModal({ onClose }) {
  const FREE_FEATURES = [
    "Daily schedule — one repeating template",
    "Outdoor time tracker toward your weekly goal",
    "Consider the Lilies — up to 3 journal entries",
    "One habit focus (Attention) with today's ideas",
    "5 free narration sessions",
    "One student profile",
    "Daily Mother Culture prompt",
    "CM quote of the day",
  ];
  const PREMIUM_FEATURES = [
    "Full weekly planner — different schedule per day, editable blocks",
    "Week grid view — see your whole week at a glance",
    "Beauty Loop anchored to your daily subjects",
    "Term counter with rest week gentle rhythm",
    "All five Charlotte Mason habits with 12-week reflection",
    "Unlimited Consider the Lilies entries for every family member",
    "Unlimited narration sessions with AI coaching",
    "Unlimited student profiles with narration history",
    "Full rotating Mother Culture prompt bank",
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 52px", maxHeight: "92dvh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>Delight & Savor</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: "var(--ink)" }}>Tend Premium</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", marginTop: 4 }}><Icon.X /></button>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", marginBottom: 24, lineHeight: 1.8 }}>Beauty. Meaning. Connection.</p>
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "16px 18px", marginBottom: 24 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.9 }}>
            Tend Premium is for the family that wants to go deeper — a full weekly planner that breathes with your rhythm, a living nature and commonplace journal, all five habits tended over twelve weeks, and the tools to make Charlotte Mason homeschooling feel as beautiful as it actually is.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, border: "2px solid var(--sage)", borderRadius: 3, padding: "16px", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "var(--sage)", borderRadius: 20, padding: "2px 10px" }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "white" }}>Best value</p>
            </div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 6 }}>Annual</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "var(--ink)", marginBottom: 2, lineHeight: 1 }}>$47</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)", letterSpacing: ".06em" }}>per year</p>
          </div>
          <div style={{ flex: 1, border: "1px solid var(--rule)", borderRadius: 3, padding: "16px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6, marginTop: 6 }}>Monthly</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "var(--ink)", marginBottom: 2, lineHeight: 1 }}>$4.99</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)", letterSpacing: ".06em" }}>per month</p>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Free — always</p>
          {FREE_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, padding: "18px", marginBottom: 28 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 14 }}>Premium — everything above, plus</p>
          {PREMIUM_FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ color: "var(--sage)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✦</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.5 }}>{f}</p>
            </div>
          ))}
        </div>
        <a href="https://delightnsavor.gumroad.com/l/qrxxi" target="_blank" rel="noopener noreferrer"
          style={{ display: "block", background: "var(--sage)", borderRadius: 2, padding: "14px 0", width: "100%", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "white", textAlign: "center", textDecoration: "none", marginBottom: 12 }}>
          Join Tend Premium →
        </a>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
          $47/year or $4.99/month · cancel anytime
        </p>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 20, borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
          <a href="https://www.delightandsavor.com" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
            Explore curriculum & the blog at Delight & Savor →
          </a>
          <a href="https://substack.com/@delightandsavor" target="_blank" rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-faint)", textDecoration: "none", padding: "12px 0" }}>
            Follow along on Substack →
          </a>
        </div>
        <button onClick={onClose}
          style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "11px 0", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── OUTDOOR TRACKER ──────────────────────────────────────────────────────────
const OUTDOOR_GOAL_HOURS = 15;

// ─── NATURE STUDY CURRICULUM ──────────────────────────────────────────────────
const NATURE_TOPICS = [
  { id: 0, season: "spring", title: "The Story of the Tadpole", subtitle: "Frogs, toads, tree frogs, spring peepers", observe: "Go to a pond edge, puddle, or wet ditch and look for eggs, tadpoles, or frogs. Listen quietly for peeping. No pressure to find them — just look and listen with fresh eyes.", action: "Sit quietly near water for 5 minutes and watch for movement. Or sketch a simple frog shape from memory.", next: "When Trees Have Flowers" },
  { id: 1, season: "spring", title: "When Trees Have Flowers", subtitle: "Dogwood, redbud, fruit trees, catkins of willow and oak", observe: "Look for blooming trees on your walk. Notice the shape of the flowers — do they have petals, or are they fuzzy catkins? Smell one if you can reach it.", action: "Collect a fallen petal or catkin and press it into your journal. Sketch the shape of one blooming branch.", next: "The Birds Return" },
  { id: 2, season: "spring", title: "The Birds Return", subtitle: "Woodpeckers, swallows, bluebirds, orioles, blue jays", observe: "Stand still outside for 5 minutes and listen before you look. How many different bird voices can you hear? Then scan the trees for movement or nesting activity.", action: "Draw a bird silhouette on a branch. Write down one sound you heard — describe it in your own words.", next: "Pioneers Among the Flowers" },
  { id: 3, season: "spring", title: "Pioneers Among the Flowers", subtitle: "Skunk cabbage, jack-in-the-pulpit, early spring wildflowers", observe: "Hunt for the first brave blooms in damp, shady spots. Bluebonnets and Indian paintbrush are Texas pioneers. Look low to the ground — early wildflowers are often small.", action: "Press one small wildflower or leaf. Sketch its shape and note where you found it.", next: "The Story of the Caterpillar" },
  { id: 4, season: "summer", title: "The Story of the Caterpillar", subtitle: "Monarch, swallowtail, luna moth — metamorphosis", observe: "Look carefully on the undersides of leaves, especially milkweed, fennel, and parsley. Watch for tiny eggs, caterpillars, or chrysalises. Move slowly.", action: "Sketch a caterpillar's body — count the segments. Write one sentence about where you found it and what it was eating.", next: "Dwellers in the Damp and Shade" },
  { id: 5, season: "summer", title: "Dwellers in the Damp and Shade", subtitle: "Mosses, ferns, lichens", observe: "Find a shady, damp spot and look closely at what grows there. Touch different mosses — are they soft, springy, scratchy? Look for fern fronds unfurling.", action: "Make a rubbing of a fern frond or moss patch by laying paper over it and rubbing gently with a pencil.", next: "Animals Clad in Armor" },
  { id: 6, season: "summer", title: "Animals Clad in Armor", subtitle: "Turtles, snakes, lizards", observe: "Watch for reptiles sunning on rocks, logs, or pavement. Observe from a distance — notice the pattern on the skin, how still they stay, how quickly they move when disturbed.", action: "Sketch the scale pattern on a lizard or turtle shell from memory or a careful look.", next: "The Rear Guard of the Flowers" },
  { id: 7, season: "autumn", title: "The Rear Guard of the Flowers", subtitle: "Asters, goldenrods, late wildflowers", observe: "Look for the last colorful blooms of the season — often purple, yellow, or white. Notice what insects are still visiting them.", action: "Sketch one late wildflower with attention to petal shape and color. Note the date.", next: "When Plants Travel" },
  { id: 8, season: "autumn", title: "When Plants Travel", subtitle: "Seeds on wind, animals, and water — maples, dandelions, burrs", observe: "Look for seeds that are ready to travel. Blow a dandelion if you find one. Check your socks after a walk for hitchhiker seeds.", action: "Collect 3 different seeds and tape them into your journal. Label how each one travels.", next: "What's What Among the Berries" },
  { id: 9, season: "autumn", title: "What's What Among the Berries", subtitle: "Viburnum, dogberry, wintergreen, beautyberry", observe: "Look for colorful berries and seed heads — Texas beautyberry is a vivid purple treat in autumn. Note which birds are eating them.", action: "Sketch a cluster of berries with attention to color and how they attach to the stem.", next: "How the Trees and Animals Prepare for Winter" },
  { id: 10, season: "autumn", title: "How the Trees and Animals Prepare for Winter", subtitle: "Leaf color change, bare twigs, squirrel activity, bird flocks", observe: "Notice what is changing. Are leaves turning? Are squirrels burying acorns? Are birds gathering in flocks?", action: "Press two leaves from the same tree — one still green, one turning. Write what you notice about the differences.", next: "Christmas Trees" },
  { id: 11, season: "winter", title: "Christmas Trees", subtitle: "Pines, spruces, firs, cedars, live oaks", observe: "Find an evergreen tree and look closely. Compare needles — are they long or short, in bundles or single? Find a cone and notice how it opens and closes.", action: "Collect one small branch or needle cluster and sketch it carefully.", next: "The Leafless Trees" },
  { id: 12, season: "winter", title: "The Leafless Trees", subtitle: "Buds, leaf scars, twigs of oaks, maples, pecans", observe: "Look at a bare tree's silhouette against the sky. Notice the branching pattern. Find a twig with buds and look closely at their shape and color.", action: "Sketch the silhouette of one bare tree, or draw a single twig with its buds and leaf scars.", next: "Our Winter Birds" },
  { id: 13, season: "winter", title: "Our Winter Birds", subtitle: "Chickadees, juncos, woodpeckers, ducks, winter residents", observe: "Watch your feeders or a nearby tree for 10 minutes. Count how many different species you see. Notice which birds share space and which chase others away.", action: "Draw one bird you saw today — pay attention to where the colors are, not just what color it is.", next: "What the Earth Is Made Of" },
  { id: 14, season: "winter", title: "What the Earth Is Made Of", subtitle: "Rocks, soil, minerals, frost patterns", observe: "Pick up three rocks and really look at them. Are they smooth or rough? Do they have layers, sparkles, or color variation? Look at soil — notice its texture and smell.", action: "Arrange your three rocks from lightest to darkest. Sketch one with shading to show its texture.", next: "The Story of the Tadpole" },
];

function getNatureStudyTopic() {
  try {
    const manualIdx = localStorage.getItem("tend_nature_manual_idx");
    if (manualIdx !== null) {
      const idx = parseInt(manualIdx, 10);
      if (!isNaN(idx) && idx >= 0 && idx < NATURE_TOPICS.length) {
        return { ...NATURE_TOPICS[idx], index: idx, total: NATURE_TOPICS.length };
      }
    }
    const start = new Date(new Date().getFullYear(), 0, 1);
    const week  = Math.floor((new Date() - start) / (7 * 24 * 60 * 60 * 1000));
    const idx   = Math.floor(week / 2) % NATURE_TOPICS.length;
    return { ...NATURE_TOPICS[idx], index: idx, total: NATURE_TOPICS.length };
  } catch { return { ...NATURE_TOPICS[0], index: 0, total: NATURE_TOPICS.length }; }
}

function advanceNatureTopic(currentIdx) {
  const next = (currentIdx + 1) % NATURE_TOPICS.length;
  try { localStorage.setItem("tend_nature_manual_idx", String(next)); } catch {}
  return next;
}

const getSeason = () => {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
};

const NATURE_DAYS = {
  Monday:    { step: "Read",    label: "Nature Lore Reading",        getInstruction: (t) => `Read aloud from your nature lore book. This week: ${t.title}. ${t.subtitle}.` },
  Tuesday:   { step: "Observe", label: "Nature Walk",               getInstruction: (t) => t.observe },
  Wednesday: { step: "Record",  label: "Consider the Lilies Entry",  getInstruction: () => "Words or sentences, a sketch, and watercolor. Let the page be a living record of what you noticed this week." },
  Thursday:  { step: "Finish",  label: "Continue Nature Lore",      getInstruction: (t) => `Finish any remaining reading on ${t.title}, or revisit Tuesday's walk through narration or quiet conversation.` },
  Friday:    { step: "Watch",   label: "Nature Clip",               getInstruction: (t) => `Find a short video about ${t.title.toLowerCase()}. Let the children see it in motion before the weekend.` },
};

function NatureOutdoorCard({ onNavigate, initialMinutes, saveToMeta, today }) {
  const [minutes, setMinutes]   = useState(initialMinutes || 0);
  const [topicIdx, setTopicIdx] = useState(() => getNatureStudyTopic()?.index || 0);
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState("");

  useEffect(() => { setMinutes(initialMinutes || 0); }, [initialMinutes]);

  const topic     = getNatureStudyTopic ? getNatureStudyTopic() : null;
  const season    = getSeason();
  const natureDay = NATURE_DAYS[today];

  const handleAdvance = () => {
    if (!topic) return;
    const nextIdx = advanceNatureTopic ? advanceNatureTopic(topic.index) : 0;
    setTopicIdx(nextIdx);
  };

  const adjust = async (n) => {
    const next = Math.max(0, minutes + n);
    setMinutes(next);
    if (saveToMeta) await saveToMeta({ outdoor_minutes: next });
  };

  const hours = Math.floor(minutes / 60);
  const mins  = minutes % 60;
  const pct   = Math.min(minutes / (OUTDOOR_GOAL_HOURS * 60), 1);
  const r = 28, circ = 2 * Math.PI * r, dash = circ * pct;

  return (
    <div className="card" style={{ marginBottom: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Leaf />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Nature & Outdoors</p>
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "#9B8EC4", background: "#F3F0F9", border: "1px solid #D8D0EE", borderRadius: 20, padding: "2px 8px" }}>
            {season.charAt(0).toUpperCase() + season.slice(1)}
          </span>
        </div>
        <button onClick={() => onNavigate("outdoors")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Log <Icon.Arrow />
        </button>
      </div>

      {/* Section 1 — This week's subject */}
      {topic && (
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>
                This week
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 2 }}>{topic.title}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)" }}>{topic.subtitle}</p>
            </div>
            <button onClick={handleAdvance}
              style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "4px 8px", cursor: "pointer", fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", flexShrink: 0, marginTop: 16 }}>
              Next →
            </button>
          </div>
          {topic.next && (
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", color: "var(--ink-faint)", marginTop: 6, opacity: 0.7 }}>
              Up next: {topic.next}
            </p>
          )}
        </div>
      )}

      {/* Section 2 — Today's nature study step */}
      {natureDay && topic ? (
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)" }}>
              {natureDay.step}
            </span>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)" }}>{natureDay.label}</p>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6 }}>
            {natureDay.getInstruction(topic)}
          </p>
          {today === "Tuesday" && topic.action && (
            <div style={{ marginTop: 8 }}>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)" }}>Action</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6, marginTop: 2 }}>{topic.action}</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--rule)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6 }}>
            No nature study step today — rest, observe freely, or spend time outside without an agenda.
          </p>
        </div>
      )}

      {/* Section 3 — Outdoor time tracker */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
          <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r={r} fill="none" stroke="var(--rule)" strokeWidth="3.5"/>
            <circle cx="28" cy="28" r={r} fill="none" stroke="var(--sage)" strokeWidth="3.5"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .5s ease" }}/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span className="serif" style={{ fontSize: 12, color: "var(--sage)", lineHeight: 1 }}>
              {hours}<span style={{ fontSize: 8 }}>h</span>
              {mins > 0 && <span>{mins}<span style={{ fontSize: 8 }}>m</span></span>}
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 3 }}>
            {hours >= OUTDOOR_GOAL_HOURS ? "Goal reached ✦" : `${OUTDOOR_GOAL_HOURS - hours}h to go · goal ${OUTDOOR_GOAL_HOURS}h`}
          </p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[15, 30, 45, 60].map(n => (
              <button key={n} onClick={() => adjust(n)}
                style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 2, padding: "3px 5px", fontSize: 9, fontFamily: "'Lato', sans-serif", color: "var(--sage)", cursor: "pointer" }}>
                +{n}m
              </button>
            ))}
            <button onClick={() => adjust(-15)}
              style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "3px 5px", fontSize: 9, fontFamily: "'Lato', sans-serif", color: "var(--ink-faint)", cursor: "pointer" }}>
              -15m
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REST WEEK HOME ───────────────────────────────────────────────────────────
function RestWeekHome() {
  const day = new Date().getDay();
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "12px 16px", background: "var(--gold-bg)", borderRadius: 3, border: "1px solid #E0CBA8" }}>
        <Icon.Moon />
        <div>
          <p style={{ fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 2 }}>Rest Week</p>
          <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.6 }}>The rhythm rests so it can return stronger.</p>
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Icon.Sun />
          <p className="eyebrow" style={{ marginBottom: 0 }}>A Gentle Rhythm for Today</p>
        </div>
        <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 16, lineHeight: 1.7 }}>Not a schedule — just a shape for the day.</p>
        {REST_WEEK_RHYTHM[day].map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", opacity: .5, marginTop: 8, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 16, color: "var(--ink)", fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>{r.label}</p>
              <p className="caption italic" style={{ lineHeight: 1.6 }}>{r.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Icon.Feather />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Mother Culture</p>
        </div>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>{MOTHER_CULTURE_DAILY[new Date().getDay()]}</p>
      </div>
    </div>
  );
}

// ─── WEEKEND RHYTHM HOME ──────────────────────────────────────────────────────
function WeekendRhythmHome({ today, week }) {
  const rhythm = today === "Saturday" ? getSaturdayRhythm(week) : getSundayRhythm(week);
  const isSunday = today === "Sunday";
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ padding: "14px 16px", background: isSunday ? "var(--gold-bg)" : "var(--sage-bg)", borderRadius: 3, border: `1px solid ${isSunday ? "#E0CBA8" : "var(--sage-md)"}`, marginBottom: 20 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: isSunday ? "var(--gold)" : "var(--sage)", marginBottom: 3 }}>
          {today} · {rhythm.theme}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.7 }}>"{rhythm.quote}"</p>
      </div>
      <p className="eyebrow" style={{ marginBottom: 16 }}>A Gentle Shape for the Day</p>
      {rhythm.items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < rhythm.items.length - 1 ? "1px solid var(--rule)" : "none" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: isSunday ? "var(--gold)" : "var(--sage)", opacity: .6, marginTop: 8, flexShrink: 0 }} />
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 3 }}>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)" }}>{item.time}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)" }}>{item.label}</span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.65 }}>{item.note}</p>
          </div>
        </div>
      ))}
      <p className="caption italic" style={{ marginTop: 16, textAlign: "center" }}>Not a schedule — just a gentle shape for the day.</p>
    </div>
  );
}

// ─── TODAY'S SCHEDULE ─────────────────────────────────────────────────────────
function TodaySchedule({ today, blocks, onNavigate }) {
  const [items, setItems]             = useState(blocks.map(b => ({ ...b, status: "pending", motherNote: "", subChecked: {} })));
  const [editingNote, setEditingNote] = useState(null);
  const lpt = useRef(null);
  const riseShineItems = RISE_SHINE_ITEMS[today] || [];

  const toggleDone = (id) => {
    setItems(prev => {
      const t = prev.find(b => b.id === id);
      if (!t) return prev;
      if (t.status === "skipped") {
        // unskip — restore to pending in original order
        return prev.map(b => b.id === id ? { ...b, status: "pending" } : b)
          .sort((a, b) => blocks.findIndex(x => x.id === a.id) - blocks.findIndex(x => x.id === b.id));
      }
      if (t.status === "done") {
        return prev.map(b => b.id === id ? { ...b, status: "pending" } : b)
          .sort((a, b) => blocks.findIndex(x => x.id === a.id) - blocks.findIndex(x => x.id === b.id));
      }
      const u = prev.map(b => b.id === id ? { ...b, status: "done" } : b);
      return [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
    });
  };

  const markSkipped = (id) => {
    setItems(prev => {
      const u = prev.map(b => b.id === id ? { ...b, status: "skipped" } : b);
      return [...u.filter(b => b.status === "pending"), ...u.filter(b => b.status !== "pending")];
    });
  };

  const toggleSub = (blockId, subIdx) => {
    setItems(prev => prev.map(b => b.id === blockId ? { ...b, subChecked: { ...b.subChecked, [subIdx]: !b.subChecked[subIdx] } } : b));
  };

  const saveNote = (id, note) => { setItems(prev => prev.map(b => b.id === id ? { ...b, motherNote: note } : b)); setEditingNote(null); };
  const startLP  = (id) => { lpt.current = setTimeout(() => { clearTimeout(lpt.current); markSkipped(id); }, 600); };
  const cancelLP = () => clearTimeout(lpt.current);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Sun />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Today · {today}</p>
        </div>
        <button onClick={() => onNavigate("planner")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Full week <Icon.Arrow />
        </button>
      </div>
      {items.map(b => {
        const isDone = b.status === "done", isSkipped = b.status === "skipped";
        const showMother = isFreeBlock(b.subject) && !isSkipped;
        const blockColor = getBlockColor(b.subject);
        const isRise = b.riseShine === true;
        return (
          <div key={b.id} style={{ borderBottom: "1px solid var(--rule)" }}>
            <div onClick={() => toggleDone(b.id)}
              onTouchStart={() => { if (b.status === "pending") startLP(b.id); }} onTouchEnd={cancelLP}
              onMouseDown={() => { if (b.status === "pending") startLP(b.id); }} onMouseUp={cancelLP} onMouseLeave={cancelLP}
              style={{ display: "flex", gap: 0, alignItems: "flex-start", padding: "12px 0 6px", cursor: b.status !== "skipped" ? "pointer" : "default", opacity: isDone ? 0.35 : isSkipped ? 0.45 : 1, transition: "opacity .4s ease" }}>
              <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: isDone || isSkipped ? "var(--rule)" : blockColor, marginRight: 12, flexShrink: 0, transition: "background .3s ease", minHeight: 36 }} />
              <span style={{ fontSize: 11, color: "var(--ink-faint)", width: 36, paddingTop: 2, flexShrink: 0, fontFamily: "'Lato', sans-serif" }}>{b.time}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, color: isDone ? "var(--ink-faint)" : "var(--ink)", fontFamily: "'Playfair Display', serif", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--sage-md)", transition: "all .3s ease" }}>{b.subject}</p>
                {isSkipped && <p style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 2 }}>skipped · tap to restore</p>}
                {b.note && !isSkipped && !isDone && <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginTop: 3, lineHeight: 1.5 }}>{b.note}</p>}
                {isDone && <p style={{ fontSize: 10, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>tap to undo</p>}
              </div>
            </div>
            {isRise && !isDone && !isSkipped && riseShineItems.length > 0 && (
              <div style={{ paddingLeft: 53, paddingBottom: 10 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {riseShineItems.map((item, idx) => {
                    const checked = b.subChecked?.[idx];
                    return (
                      <button key={idx} onClick={() => toggleSub(b.id, idx)}
                        style={{ background: checked ? "var(--sage-bg)" : "none", border: `1px solid ${checked ? "var(--sage)" : "var(--rule)"}`, borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: checked ? "var(--sage)" : "var(--ink-faint)", transition: "all .2s", textDecoration: checked ? "line-through" : "none" }}>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {showMother && (
              <div style={{ paddingLeft: 53, paddingBottom: 8 }} onClick={e => e.stopPropagation()}>
                {editingNote === b.id ? (
                  <input autoFocus defaultValue={b.motherNote} placeholder="What will you tend during this time?"
                    onBlur={e => saveNote(b.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveNote(b.id, e.target.value); }}
                    style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", outline: "none", padding: "4px 0" }} />
                ) : (
                  <button onClick={() => setEditingNote(b.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", padding: 0, textAlign: "left", opacity: b.motherNote ? 1 : 0.5 }}>
                    {b.motherNote ? `✦ ${b.motherNote}` : "your time · what will you tend?"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <p className="caption italic" style={{ marginTop: 12, textAlign: "center" }}>Tap to complete · Tap again to undo · Hold to skip</p>
    </div>
  );
}

// ─── BEAUTY LOOP HOME ─────────────────────────────────────────────────────────
function BeautyLoopHome({ today }) {
  const loops = BEAUTY_LOOP[today] || [];
  const [done, setDone] = useState({});
  if (loops.length === 0) return null;
  const allDone = loops.every((l) => done[l.id]);
  return (
    <div style={{ marginBottom: 28, background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, padding: "16px 18px", opacity: allDone ? 0.6 : 1, transition: "opacity .3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon.Leaf />
        <p className="eyebrow" style={{ marginBottom: 0, textDecoration: allDone ? "line-through" : "none", color: allDone ? "var(--ink-faint)" : undefined }}>Beauty Loop · {today}</p>
      </div>
      {loops.map((l, i) => {
        const checked = !!done[l.id];
        return (
          <div key={l.id} onClick={() => setDone(d => ({ ...d, [l.id]: !d[l.id] }))}
            style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < loops.length - 1 ? "1px solid rgba(169,183,134,.25)" : "none", cursor: "pointer", opacity: checked ? 0.45 : 1, transition: "opacity .25s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${checked ? "var(--sage)" : "var(--sage-md)"}`, background: checked ? "var(--sage)" : "none", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
              {checked && <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", textDecoration: checked ? "line-through" : "none", textDecorationColor: "var(--sage-md)", marginBottom: l.note ? 4 : 0 }}>{l.label}</p>
              {l.note && !checked && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.65 }}>{l.note}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MOTHER CULTURE ───────────────────────────────────────────────────────────
function MotherCulture() {
  const [done, setDone] = useState(false);
  return (
    <div onClick={() => setDone(d => !d)}
      style={{ marginBottom: 28, background: "var(--gold-bg)", border: "1px solid #E0CBA8", borderRadius: 4, padding: "16px 18px", cursor: "pointer", opacity: done ? 0.5 : 1, transition: "opacity .3s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Feather />
          <p className="eyebrow" style={{ marginBottom: 0, color: "var(--gold)", textDecoration: done ? "line-through" : "none" }}>Mother Culture</p>
        </div>
        <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${done ? "#B8935A" : "#E0CBA8"}`, background: done ? "#B8935A" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
          {done && <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
        </div>
      </div>
      <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8, textDecoration: done ? "line-through" : "none", textDecorationColor: "#B8935A" }}>{MOTHER_CULTURE_DAILY[new Date().getDay()]}</p>
    </div>
  );
}

// ─── HABIT FOCUS CARD ─────────────────────────────────────────────────────────
function HabitFocusCard({ activeHabit, onNavigate }) {
  const habit   = HABIT_PROMPTS[activeHabit];
  const HIcon   = HABIT_ICONS[activeHabit];
  const day     = new Date().getDay();
  const prompts = habit.daily[day].slice(0, 2);
  const [done, setDone] = useState(false);
  return (
    <div style={{ marginBottom: 32, background: "#f0eff0", border: "1px solid #dddde0", borderRadius: 4, padding: "16px 18px", opacity: done ? 0.5 : 1, transition: "opacity .3s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon.Sprout />
          <p className="eyebrow" style={{ marginBottom: 0, textDecoration: done ? "line-through" : "none", color: done ? "var(--ink-faint)" : undefined }}>Habit in Focus</p>
        </div>
        <button onClick={() => setDone(d => !d)}
          style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${done ? "var(--sage)" : "#dddde0"}`, background: done ? "var(--sage)" : "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .2s" }}>
          {done && <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <HIcon />
        <p className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{habit.name}</p>
      </div>
      {prompts.map((p, i) => (
        <div key={i} style={{ paddingBottom: i < prompts.length - 1 ? 12 : 0, marginBottom: i < prompts.length - 1 ? 12 : 0, borderBottom: i < prompts.length - 1 ? "1px solid rgba(180,180,185,.3)" : "none" }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", lineHeight: 1.8 }}>{p}</p>
        </div>
      ))}
      <button onClick={() => onNavigate("habits")}
        style={{ background: "none", border: "none", cursor: "pointer", marginTop: 14, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)" }}>
        Change habit focus →
      </button>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
export default function HomeScreen({ onNavigate, settings }) {
  const hour       = new Date().getHours();
  const greeting   = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayIdx   = new Date().getDay();
  const today      = todayIdx === 0 ? "Sunday" : todayIdx === 6 ? "Saturday" : DAYS[todayIdx - 1];
  const todayBlocks = DAY_SCHEDULE[today] || [];
  const name       = settings?.name || "Friend";
  const activeHabit = settings?.activeHabit || "attention";
  const isRestWeek  = settings?.isRestWeek || false;
  const dayOfYear  = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const cmQuote    = CM_QUOTES[dayOfYear % CM_QUOTES.length];
  const isWeekend  = today === "Saturday" || today === "Sunday";

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>{greeting},<br />{name}.</h1>
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.85, marginBottom: 4 }}>"{cmQuote.quote}"</p>
        <p className="caption">— Charlotte Mason, {cmQuote.source}</p>
      </div>

      <NatureOutdoorCard
        onNavigate={onNavigate}
        initialMinutes={settings?.outdoorMinutes || 0}
        saveToMeta={settings?.saveToMeta}
        today={today}
      />

      <div style={{ height: 1, background: "var(--rule)", margin: "4px 0 24px" }} />

      {isRestWeek ? (
        <RestWeekHome />
      ) : isWeekend ? (
        <WeekendRhythmHome today={today} week={settings?.week || 1} />
      ) : (
        <>
          <TodaySchedule today={today} blocks={todayBlocks} onNavigate={onNavigate} />
          <BeautyLoopHome today={today} />
          <MotherCulture />
          <HabitFocusCard activeHabit={activeHabit} onNavigate={onNavigate} />
        </>
      )}
    </div>
  );
}
