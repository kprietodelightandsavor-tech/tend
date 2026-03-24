import { useState } from "react";

// ─── NATURE STUDY CURRICULUM ──────────────────────────────────────────────────
const NATURE_STORAGE_KEY = "tend_nature_current";

const SEASONS = ["spring", "summer", "autumn", "winter"];
const SEASON_LABELS = { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" };
const SEASON_COLORS = {
  spring: { bg: "#F3F9F0", border: "#C5DDB8", text: "#5A8A4A" },
  summer: { bg: "#FFF9F0", border: "#F0D8A0", text: "#A07820" },
  autumn: { bg: "#FBF4EE", border: "#E8C8A0", text: "#9A5A20" },
  winter: { bg: "#F0F4F9", border: "#B8C8DC", text: "#3A5878" },
};

const CURRICULUM = {
  year1: {
    spring: [
      { id: "y1-s1", subject: "The Story of the Tadpole", texasNote: "Listen for spring peepers or look for toad eggs in temporary puddles after rain.", observe: "Go outside and look near ponds, puddles, or damp ground for frogs, tadpoles, or signs of water life. Listen for peeping with fresh ears. No pressure — just notice.", action: "Sit quietly by water for 5 minutes watching for movement, or draw a simple tadpole or frog shape.", read: "The Year Round by C.J. Hylander – The Story of the Tadpole" },
      { id: "y1-s2", subject: "When Trees Have Flowers", texasNote: "Look for redbud blooms, fruit tree blossoms, or catkins on oaks and willows.", observe: "Look up at trees for blossoms or hanging catkins. Notice colors, shapes, and where they appear.", action: "Choose one flowering twig and make a quick sketch of its petals or catkins.", read: "The Year Round by C.J. Hylander – When Trees Have Flowers" },
      { id: "y1-s3", subject: "The Birds Return", texasNote: "Watch for returning swallows, bluebirds, or mockingbirds — very active in Texas springs.", observe: "Listen for new songs and watch birds perching, flying, or gathering nesting materials.", action: "Count different bird calls you hear, or sit still and watch one bird go about its day.", read: "The Year Round by C.J. Hylander – The Birds Return" },
      { id: "y1-s4", subject: "Pioneers Among the Flowers", texasNote: "Early bluebonnets, Indian paintbrush, or winecup — the brave first blooms in Texas fields.", observe: "Hunt for the first spring flowers in damp or open spots. Notice their shapes and bold locations.", action: "Sketch one early flower or gently notice its scent.", read: "The Year Round by C.J. Hylander – Pioneers Among the Flowers" },
    ],
    summer: [
      { id: "y1-su1", subject: "The Story of the Caterpillar", texasNote: "Monarchs on milkweed or swallowtails on citrus — common in Texas gardens.", observe: "Search host plants for caterpillars, eggs, or chrysalises. Watch how they crawl and eat.", action: "Observe one quietly for 5 minutes, or sketch its body shape.", read: "The Year Round by C.J. Hylander – The Story of the Caterpillar" },
      { id: "y1-su2", subject: "Dwellers in the Damp and Shade", texasNote: "Mosses and lichens on live oaks or in shady yards after rain.", observe: "Explore shady damp areas and feel the textures and colors of mosses, ferns, or lichens.", action: "Touch or collect a fallen piece of moss or lichen and draw its pattern.", read: "The Year Round by C.J. Hylander – Dwellers in the Damp and Shade" },
      { id: "y1-su3", subject: "Animals Clad in Armor", texasNote: "Texas lizards (anoles, skinks) or box turtles — very common in San Antonio.", observe: "Look for sunning lizards or turtles from a safe distance. Notice patterns and movement.", action: "Sketch the shape or pattern of one you see or imagine.", read: "The Year Round by C.J. Hylander – Animals Clad in Armor" },
    ],
    autumn: [
      { id: "y1-a1", subject: "The Rear Guard of the Flowers", texasNote: "Late asters, goldenrod, or frostweed — lingering color in Texas fields.", observe: "Find the last colorful flowers along paths or fields. Compare to spring pioneers.", action: "Sketch one late bloom or watch pollinators visiting it.", read: "The Year Round by C.J. Hylander – The Rear Guard of the Flowers" },
      { id: "y1-a2", subject: "When Plants Travel", texasNote: "Maple samaras, burrs, or milkweed fluff — easy to find in Texas neighborhoods.", observe: "Look for seeds flying, sticking, or floating. Watch how they move in the wind.", action: "Blow dandelion puffs or spin a samara; sketch one seed type.", read: "The Year Round by C.J. Hylander – When Plants Travel" },
      { id: "y1-a3", subject: "What's What Among the Berries", texasNote: "Yaupon holly berries or possumhaw — bright red in Texas winter prep.", observe: "Spot colorful berries and dried seed heads on shrubs.", action: "Draw a berry cluster or notice which creatures might enjoy them.", read: "The Year Round by C.J. Hylander – What's What Among the Berries" },
      { id: "y1-a4", subject: "How Trees & Animals Prepare for Winter", texasNote: "Live oaks dropping leaves slowly; squirrels busy with acorns.", observe: "Notice changing leaf colors, falling leaves, busy squirrels, or bird flocks.", action: "Pick one tree or animal sign and sketch changes over your 1–2 weeks.", read: "The Year Round by C.J. Hylander – How Trees & Animals Prepare for Winter" },
    ],
    winter: [
      { id: "y1-w1", subject: "Evergreen Trees", texasNote: "Live oaks, Ashe juniper, or yaupon holly — Texas natives that stay green all winter.", observe: "Compare leaves and shapes of evergreens to bare trees. Feel the texture.", action: "Sketch leaves or bark of one local evergreen.", read: "The Year Round by C.J. Hylander – Christmas Trees / Evergreen Trees" },
      { id: "y1-w2", subject: "The Leafless Trees", texasNote: "Bare branches of pecan, oak, or mesquite against the Texas sky.", observe: "Study bare branches and look for buds or leaf scars.", action: "Sketch the branch pattern or leaf scars of one tree.", read: "The Year Round by C.J. Hylander – The Leafless Trees" },
      { id: "y1-w3", subject: "Our Winter Birds", texasNote: "Northern cardinals, titmice, or cedar waxwings visiting feeders in San Antonio.", observe: "Watch feeders or flocks; listen to winter calls.", action: "Count different birds or sit quietly at a feeder.", read: "The Year Round by C.J. Hylander – Our Winter Birds" },
      { id: "y1-w4", subject: "What the Earth Is Made Of", texasNote: "Limestone rocks, caliche soil, or river pebbles common around San Antonio.", observe: "Pick up stones or examine soil and frost or dew patterns.", action: "Sort a few rocks by feel or draw one interesting stone.", read: "The Year Round by C.J. Hylander – What the Earth Is Made Of" },
    ],
  },
  year2: {
    spring: [
      { id: "y2-s1", subject: "Fish & Pond Life", texasNote: "Look for minnows or sunfish in local creeks and ponds after spring rains.", observe: "Visit a pond or stream and watch for fish movement, fins, or bubbles.", action: "Watch one fish quietly for 5 minutes and sketch its shape.", read: "The Year Round by C.J. Hylander – Fish lessons" },
      { id: "y2-s2", subject: "Earthworms & Soil Life", texasNote: "Very active in Texas gardens after spring rains.", observe: "Gently dig in garden soil or under leaves to find worms and tiny creatures.", action: "Watch a worm move and draw what you see.", read: "The Year Round by C.J. Hylander – Earthworm study" },
      { id: "y2-s3", subject: "Early Garden & Cultivated Flowers", texasNote: "Daffodils, roses, or early Texas wildflowers in yards.", observe: "Look at planted flowers. Compare wild vs. cultivated.", action: "Sketch one garden flower or plant something small and watch it.", read: "The Year Round by C.J. Hylander – Cultivated plants" },
      { id: "y2-s4", subject: "Bird Nests & Behaviors", texasNote: "Mockingbirds and doves often nest early in Texas.", observe: "Search for nests and watch bird feeding or flight.", action: "Draw a nest shape or observe one bird's busy activity.", read: "The Year Round by C.J. Hylander – Bird behavior sections" },
    ],
    summer: [
      { id: "y2-su1", subject: "Insects in General", texasNote: "Bees on Texas mountain laurel, dragonflies near water, or grasshoppers in grass.", observe: "Watch insects on flowers or in grass — notice wings, legs, and work.", action: "Observe one insect for 5 minutes and sketch it.", read: "The Year Round by C.J. Hylander – Insect lessons" },
      { id: "y2-su2", subject: "Weeds, Edibles & Flowerless Plants", texasNote: "Purslane, lambsquarters, or dandelions in Texas yards.", observe: "Find common weeds or mosses and lichens.", action: "Draw a common weed up close or notice a known edible.", read: "The Year Round by C.J. Hylander – Weeds & flowerless plants" },
      { id: "y2-su3", subject: "Garden Vegetables & Crops", texasNote: "Tomatoes, okra, or peppers thriving in Texas heat.", observe: "Examine growing vegetables — leaves, flowers, and developing fruit.", action: "Sketch a vegetable or check daily growth on one plant.", read: "The Year Round by C.J. Hylander – Cultivated crops" },
      { id: "y2-su4", subject: "Spiders & Other Crawlers", texasNote: "Orb weavers or wolf spiders common in Texas gardens.", observe: "Look for webs or spiders from a safe distance.", action: "Watch a spider move or draw its web pattern.", read: "The Year Round by C.J. Hylander – Spider and invertebrate sections" },
    ],
    autumn: [
      { id: "y2-a1", subject: "Furry Friends & Mammals", texasNote: "Squirrels, rabbits, or armadillos — active in Texas fall.", observe: "Watch squirrels gathering or look for tracks and signs.", action: "Observe one busy mammal or sketch its tracks.", read: "The Year Round by C.J. Hylander – Mammals / Furry Friends" },
      { id: "y2-a2", subject: "More Wildflowers & Seed Heads", texasNote: "Late goldenrod or dried bluebonnet pods.", observe: "Find late blooms or dried seed heads.", action: "Collect a few fallen seeds gently or draw one seed head.", read: "The Year Round by C.J. Hylander – Wildflower and seed sections" },
      { id: "y2-a3", subject: "Soil & Rocks Deeper", texasNote: "Limestone, flint, or caliche — abundant in the San Antonio area.", observe: "Examine different soils or interesting rocks.", action: "Sort or rub rocks together and draw one by texture or color.", read: "The Year Round by C.J. Hylander – Earth and rocks deeper" },
      { id: "y2-a4", subject: "Animal Signs in Fall", texasNote: "Acorn caching by squirrels or bird migration overhead.", observe: "Look for nests, burrows, or animals preparing for winter.", action: "Note one animal's autumn behavior and sketch a sign.", read: "The Year Round by C.J. Hylander – Animals prepare" },
    ],
    winter: [
      { id: "y2-w1", subject: "Stars, Moon & Winter Sky", texasNote: "Clear Texas winter nights offer excellent views of Orion, the Pleiades, and bright planets.", observe: "Go outside after dark and look up. Find one constellation or watch the moon's shape over several nights.", action: "Draw the moon's shape tonight or sketch one constellation pattern.", read: "The Year Round by C.J. Hylander – Sky and astronomy introduction" },
      { id: "y2-w2", subject: "Weather & Water", texasNote: "Texas winters bring fog, frost, and dramatic cold fronts — excellent for weather observation.", observe: "Watch clouds, fog, or frost closely. Notice how dew forms on cold mornings.", action: "Record temperature and sky conditions for three days in a row.", read: "The Year Round by C.J. Hylander – Weather and water sections" },
      { id: "y2-w3", subject: "Seeds & Winter Dormancy", texasNote: "Pecans, acorns, and cedar berries — winter seeds in abundance across Texas.", observe: "Find seeds that have fallen and look at how they are shaped for survival.", action: "Collect three different seeds and sketch how each one is designed to travel or wait.", read: "The Year Round by C.J. Hylander – Seeds and dormancy" },
      { id: "y2-w4", subject: "Tracks, Trails & Animal Signs", texasNote: "Deer tracks, bird prints in mud, or armadillo diggings near San Antonio.", observe: "Walk slowly and look down as well as up. Find evidence of animals you cannot see.", action: "Draw one track or sign you found. Write where you found it and what made it.", read: "The Year Round by C.J. Hylander – Tracks and animal signs" },
    ],
  },
};

function getCurrentTopic() {
  try {
    const saved = JSON.parse(localStorage.getItem(NATURE_STORAGE_KEY) || "null");
    if (saved?.id) return saved;
  } catch {}
  return CURRICULUM.year1.spring[0];
}

function setCurrentTopic(topic) {
  try { localStorage.setItem(NATURE_STORAGE_KEY, JSON.stringify(topic)); } catch {}
}

const WEEKLY_STEPS = [
  { day: "Monday",    step: "Read",    label: "Nature Lore Reading",       getNote: (t) => `Read aloud from ${t.read}. Introduce this week's subject: ${t.subject}.` },
  { day: "Tuesday",   step: "Observe", label: "Nature Walk",              getNote: (t) => t.observe },
  { day: "Wednesday", step: "Record",  label: "Consider the Lilies Entry", getNote: ()  => "Words or sentences, a sketch, and watercolor. Let the page be a living record of what you noticed." },
  { day: "Thursday",  step: "Finish",  label: "Continue Reading",         getNote: (t) => `Finish any remaining reading on ${t.subject}, or revisit Tuesday's walk through narration.` },
  { day: "Friday",    step: "Watch",   label: "Nature Clip",              getNote: (t) => `Find a short video about ${t.subject.toLowerCase()}. Let the children see it moving.` },
];

export default function NatureStudyScreen({ onNavigate, settings }) {
  const isPaid = settings?.isPaid || false;
  const [current, setCurrent]     = useState(getCurrentTopic);
  const [activeYear, setActiveYear] = useState("year1");
  const [expanded, setExpanded]   = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  const todayIdx = new Date().getDay();
  const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][todayIdx];
  const todayStep = WEEKLY_STEPS.find(s => s.day === todayName);

  const selectTopic = (topic) => {
    setCurrent(topic);
    setCurrentTopic(topic);
    setExpanded(null);
  };

  // Free tier — only first topic of each season in year 1
  const FREE_IDS = ["y1-s1", "y1-su1", "y1-a1", "y1-w1"];
  const isLocked = (topic) => !isPaid && !FREE_IDS.includes(topic.id);

  const seasonOfCurrent = Object.entries(CURRICULUM[activeYear]).find(([, topics]) =>
    topics.find(t => t.id === current.id)
  )?.[0];

  return (
    <div className="screen">
      {/* Header */}
      <button onClick={() => onNavigate("home")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Home
      </button>
      <p className="eyebrow" style={{ marginBottom: 6 }}>The Year Round · C.J. Hylander</p>
      <h1 className="display serif" style={{ marginBottom: 6 }}>Nature Study</h1>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 24 }}>
        Nature study is a beautiful entry point into science — through simple outdoor walks and quiet noticing, children build the habit of attention and develop a deep love for the created world.
      </p>

      {/* Current topic card */}
      <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, padding: "16px 18px", marginBottom: 24 }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 6 }}>
          Currently studying
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--ink)", marginBottom: 4 }}>{current.subject}</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", marginBottom: 12 }}>{current.read}</p>

        {/* Today's step */}
        {todayStep && (
          <div style={{ paddingTop: 12, borderTop: "1px solid var(--sage-md)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)" }}>{todayStep.step}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)" }}>{todayStep.label}</span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6 }}>
              {todayStep.getNote(current)}
            </p>
          </div>
        )}

        {/* Texas note */}
        {current.texasNote && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--sage-md)" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B8EC4", marginBottom: 3 }}>Texas / Local</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6 }}>{current.texasNote}</p>
          </div>
        )}

        {/* Weekly steps toggle */}
        <button onClick={() => setShowSteps(s => !s)}
          style={{ marginTop: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>
          {showSteps ? "Hide weekly rhythm ↑" : "Show weekly rhythm ↓"}
        </button>
        {showSteps && (
          <div style={{ marginTop: 10 }}>
            {WEEKLY_STEPS.map((s, i) => (
              <div key={s.day} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < WEEKLY_STEPS.length - 1 ? "1px solid rgba(169,183,134,.2)" : "none" }}>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sage)", width: 56, flexShrink: 0, paddingTop: 2 }}>{s.day.slice(0,3)}</span>
                <div>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginRight: 6 }}>{s.step}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "var(--ink)" }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Year toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["year1", "year2"].map(y => (
          <button key={y} onClick={() => setActiveYear(y)}
            style={{ flex: 1, padding: "10px 0", borderRadius: 2, border: `1px solid ${activeYear === y ? "var(--sage)" : "var(--rule)"}`, background: activeYear === y ? "var(--sage-bg)" : "none", cursor: "pointer", fontFamily: "'Playfair Display', serif", fontSize: 15, color: activeYear === y ? "var(--sage)" : "var(--ink)" }}>
            {y === "year1" ? "Year One" : "Year Two"}
          </button>
        ))}
      </div>

      {/* Usagee note */}
      <p className="corm italic" style={{ fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 20 }}>
        Spend 1–2 weeks on each focus. Tap any topic to set it as your current study. Gentle pacing — no requirements, just wonder.
      </p>

      {/* Season sections */}
      {SEASONS.map(season => {
        const topics = CURRICULUM[activeYear][season] || [];
        const colors = SEASON_COLORS[season];
        return (
          <div key={season} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ height: 1, flex: 1, background: "var(--rule)" }} />
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: colors.text, background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: "3px 10px" }}>
                {SEASON_LABELS[season]}
              </span>
              <div style={{ height: 1, flex: 1, background: "var(--rule)" }} />
            </div>

            {topics.map((topic, i) => {
              const isCurrent = topic.id === current.id;
              const locked    = isLocked(topic);
              const open      = expanded === topic.id;
              return (
                <div key={topic.id} style={{ marginBottom: 8, border: `1px solid ${isCurrent ? "var(--sage)" : "var(--rule)"}`, borderRadius: 3, background: isCurrent ? "var(--sage-bg)" : "white", transition: "all .2s" }}>
                  <button onClick={() => !locked && setExpanded(open ? null : topic.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "none", border: "none", cursor: locked ? "default" : "pointer", textAlign: "left" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: isCurrent ? "var(--sage)" : "var(--rule)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: locked ? "var(--ink-faint)" : "var(--ink)", textDecoration: locked ? "none" : "none" }}>{topic.subject}</p>
                      {isCurrent && <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginTop: 2 }}>current study</p>}
                    </div>
                    {locked ? (
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    ) : (
                      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)" }}>{open ? "↑" : "↓"}</span>
                    )}
                  </button>

                  {open && !locked && (
                    <div style={{ padding: "0 14px 14px" }}>
                      <div style={{ height: 1, background: "var(--rule)", marginBottom: 12 }} />

                      {topic.texasNote && (
                        <div style={{ marginBottom: 10 }}>
                          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#9B8EC4", marginBottom: 3 }}>Texas / Local</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.6 }}>{topic.texasNote}</p>
                        </div>
                      )}

                      <div style={{ marginBottom: 10 }}>
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 3 }}>Observe</p>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.6 }}>{topic.observe}</p>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 3 }}>Action</p>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.6 }}>{topic.action}</p>
                      </div>

                      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", color: "var(--ink-faint)", marginBottom: 12 }}>📖 {topic.read}</p>

                      {!isCurrent && (
                        <button onClick={() => selectTopic(topic)} className="btn-sage" style={{ width: "100%" }}>
                          Study This Topic
                        </button>
                      )}
                    </div>
                  )}

                  {locked && (
                    <div style={{ padding: "0 14px 12px" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--gold)", lineHeight: 1.6 }}>
                        ✦ Unlock all nature study topics with Tend Premium.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
