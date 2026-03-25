import { useState } from "react";

const Icon = {
  Home: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Refresh: () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>),
  Sparkle: () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>),
  Copy: () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>),
};

const SUBJECTS = [
  { id: "literature",  label: "Literature",       emoji: "📖", color: "#7B9BB5" },
  { id: "history",     label: "History",           emoji: "🏛️", color: "#B8935A" },
  { id: "bible",       label: "Bible",             emoji: "✝️", color: "#9B8EC4" },
  { id: "nature",      label: "Nature Study",      emoji: "🌿", color: "#A9B786" },
  { id: "science",     label: "Science",           emoji: "🔭", color: "#6AABB5" },
  { id: "geography",   label: "Geography",         emoji: "🗺️", color: "#C4956A" },
  { id: "artist",      label: "Artist / Composer", emoji: "🎨", color: "#C48A8A" },
  { id: "math",        label: "Math",              emoji: "📐", color: "#8A9EC4" },
];

const STAGES = [
  { id: "beginner",   label: "Beginner",   note: "Just starting to narrate — keep it simple and encouraging" },
  { id: "developing", label: "Developing", note: "Can narrate but needs prompting to go deeper" },
  { id: "confident",  label: "Confident",  note: "Ready for analysis, connection, and wonder" },
];

const PROMPTS = {
  literature: {
    beginner: [
      "First, tell me everything you remember from what we just read.",
      "Who was in this part of the story? What were they doing?",
      "What happened at the beginning? What happened at the end?",
      "Was there anything you didn't understand? Let's talk about it.",
      "If you could draw one picture from this passage, what would it be?",
    ],
    developing: [
      "Who was the most important person in this passage? Why do you think so?",
      "What problem did the character face? How did they respond to it?",
      "What surprised you in this reading?",
      "Tell me about the setting — where and when does this take place?",
      "What do you think will happen next, and why?",
      "Was the character's choice a good one? What would you have done?",
    ],
    confident: [
      "What question does this passage open in you?",
      "Does this remind you of anything else we've read? How are they connected?",
      "What does this story seem to be saying about human nature?",
      "Is there a line or moment that stood out to you? Why that one?",
      "How has the character changed — or failed to change — and why does it matter?",
    ],
  },
  history: {
    beginner: [
      "First, tell me everything you remember.",
      "Who were the people in this part of history? What were they doing?",
      "When did this happen? Where did it happen?",
      "What was the problem or challenge people were facing?",
      "If you could ask one of these people a question, what would it be?",
    ],
    developing: [
      "Who was the most important person in this passage? Why?",
      "What caused this event to happen?",
      "How did people respond — and do you think that was wise?",
      "What changed because of what happened here?",
      "Does this remind you of anything else in history we've studied?",
      "What surprised you about this?",
    ],
    confident: [
      "What patterns do you notice in how people respond to power, fear, or hardship?",
      "What question does this chapter of history raise for you?",
      "Where do you see human nature at work here — its goodness and its failure?",
      "How might things have been different? What would have had to change?",
      "What does this event teach us that still matters today?",
    ],
  },
  bible: {
    beginner: [
      "First, tell me everything you remember from this passage.",
      "Who was in this story? What happened?",
      "What did God do in this passage?",
      "Was there anything that confused you or that you want to know more about?",
      "What is one thing you want to remember from this reading?",
    ],
    developing: [
      "Who was the most important person in this passage? Why do you think so?",
      "What did this person believe about God — and how did that show in what they did?",
      "What was the character's choice? Was it faithful or unfaithful?",
      "What does this passage show us about who God is?",
      "Is there a verse or moment that stood out to you? Why?",
      "What do you think this passage is asking of us?",
    ],
    confident: [
      "What question does this passage open in you?",
      "Where do you see grace in this text?",
      "Does this connect to another passage or story in Scripture? How?",
      "What does this reveal about the human heart — including your own?",
      "If you had to name the one thing this passage is really about, what would it be?",
    ],
  },
  nature: {
    beginner: [
      "First, tell me everything you remember from our nature reading today.",
      "What creature or plant did we learn about? What did it look like?",
      "What does this creature eat? Where does it live?",
      "What surprised you about it?",
      "If you could go find this creature right now, where would you look?",
    ],
    developing: [
      "How does this creature or plant fit into its habitat — what does it need, and what does it give?",
      "What was the most important idea in this reading? What did it teach you about how nature works?",
      "Did this remind you of something else we've observed or studied?",
      "What question does this open for you — something you want to know more about?",
      "Describe it to me as if I've never seen it before.",
    ],
    confident: [
      "What pattern do you notice in how this creature lives — and does it remind you of anything in the created world?",
      "Where do you see design or order in what we studied today?",
      "What question does this raise about how living things relate to each other?",
      "If you were to sketch this and add a field note, what would you write?",
      "What does noticing this creature or place teach you about attention itself?",
    ],
  },
  science: {
    beginner: [
      "First, tell me everything you remember.",
      "What did we learn about today? Can you describe it in your own words?",
      "What happens first? Then what?",
      "Was there anything that confused you?",
      "Can you think of a place you've seen this in real life?",
    ],
    developing: [
      "Explain the process to me as if I didn't know anything about it.",
      "What causes this to happen — what are the conditions needed?",
      "How does this connect to something else in science we've learned?",
      "What surprised you about how this works?",
      "What question does this raise for you — something you'd want to investigate?",
    ],
    confident: [
      "What are the underlying principles at work here?",
      "Where do you see this concept operating in the world around us?",
      "What would happen if one of the conditions changed? Think it through.",
      "What does this reveal about the order and design of the physical world?",
      "If you had to teach this concept to a younger student, how would you explain it?",
    ],
  },
  geography: {
    beginner: [
      "First, tell me everything you remember about this place.",
      "Where is it? Can you describe where it is in relation to something we know?",
      "What is the land like — mountains, rivers, flat, cold, hot?",
      "Who lives there? What do they do?",
      "Would you want to visit? Why or why not?",
    ],
    developing: [
      "How does the geography — the land, climate, and location — shape how people live there?",
      "What is this region known for, and why do you think that is?",
      "Does this place connect to anything in history or literature we've studied?",
      "What surprised you about this place?",
      "Compare it to where we live — what's similar? What's very different?",
    ],
    confident: [
      "How has geography shaped the history of this place?",
      "What tensions or challenges does this region face — and where do they come from?",
      "What patterns do you notice across regions with similar geography?",
      "If you were to write a narration of this place as a living book would describe it, how would you begin?",
      "What question does the study of this place raise for you?",
    ],
  },
  artist: {
    beginner: [
      "First, tell me everything you remember about this artist or composer.",
      "When and where did they live? What was the world like for them?",
      "What did you notice about their work — what stood out to you?",
      "Did you like it? What did you feel when you heard or saw it?",
      "What is one thing you want to remember about them?",
    ],
    developing: [
      "What is this artist or composer most known for — and why do you think people remember them?",
      "What was happening in their life or in history that shaped their work?",
      "Describe a specific piece of their work to me — what do you notice in it?",
      "Does their work remind you of anything else we've studied?",
      "What question does their life or work open for you?",
    ],
    confident: [
      "What does this artist's or composer's work say about the time and place they lived in?",
      "What endures in their work — why does it still matter?",
      "Does their work connect to a theme we've seen in literature or history this term?",
      "What is one thing about their technique or style you found genuinely interesting?",
      "If you could ask them one question, what would it be — and what do you think they'd say?",
    ],
  },
  math: {
    beginner: [
      "Can you walk me through the problem step by step?",
      "What did you do first? Why did you do that?",
      "Where did you get stuck? Let's look at that part together.",
      "Can you show me a different way to think about this?",
      "Does this remind you of a problem we've done before?",
    ],
    developing: [
      "Explain the concept to me as if I'm learning it for the first time.",
      "Why does this method work — what's the logic behind it?",
      "Where might you use this in real life?",
      "What happens if you change one of the numbers — does the same approach still work?",
      "What was the hardest part? How did you figure it out?",
    ],
    confident: [
      "Can you prove to me that this answer is correct — not just show me, but convince me?",
      "Is there a more elegant or efficient way to solve this?",
      "What principle is at work here — could you write it as a rule?",
      "How does this connect to something else in math you've learned?",
      "If you had to teach this to a younger student, how would you structure the explanation?",
    ],
  },
};

const FOLLOW_UPS = [
  "Say more about that — what do you mean exactly?",
  "What makes you think so?",
  "Can you give me an example?",
  "What happened right before that?",
  "Is there anything else you remember?",
  "That's interesting — what else does that make you think of?",
  "How did that make you feel — or how do you think they felt?",
];

const CLOSES = [
  "That was a beautiful narration. You held the details and made them your own.",
  "I could hear that you were really paying attention. Well done.",
  "You found something I hadn't noticed — that's what good narration does.",
  "The way you told that shows it's living in you now. That's the whole point.",
  "That's the work. You remembered, you thought, and you made it yours.",
];

export default function NarrationScreen({ settings, onNavigate }) {
  const [subject, setSubject]         = useState(null);
  const [stage, setStage]             = useState(null);
  const [promptSet, setPromptSet]     = useState([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUp, setFollowUp]       = useState("");
  const [close, setClose]             = useState("");
  const [view, setView]               = useState("subject");
  const [aiTopic, setAiTopic]         = useState("");
  const [aiPrompts, setAiPrompts]     = useState([]);
  const [aiLoading, setAiLoading]     = useState(false);
  const [copied, setCopied]           = useState(false);

  const startSession = (subjectId, stageId) => {
    const pool = PROMPTS[subjectId]?.[stageId] || [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setPromptSet(shuffled);
    setCurrentIdx(0);
    setShowFollowUp(false);
    setFollowUp(FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)]);
    setClose(CLOSES[Math.floor(Math.random() * CLOSES.length)]);
    setView("coach");
  };

  const nextPrompt = () => {
    if (currentIdx < promptSet.length - 1) {
      setCurrentIdx(i => i + 1);
      setShowFollowUp(false);
      setFollowUp(FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)]);
    }
  };

  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const generateAiPrompts = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setAiPrompts([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a Charlotte Mason narration coach helping a homeschool parent. Generate 6 narration prompts for a parent to ask their child after reading or studying: "${aiTopic}".

The child's narration stage is: ${stage || "developing"}.
- beginner: simple recall, encouraging, concrete questions
- developing: needs prompting to go deeper, some light analysis
- confident: ready for synthesis, connection, wonder

Return ONLY a JSON array of 6 strings. No preamble, no markdown fences, no explanation. Raw JSON only.

The prompts should:
- Sound like a warm Charlotte Mason teacher, not a quiz
- Begin with "First, tell me everything you remember" as prompt 1
- Move from recall → observation → connection → wonder
- Be specific to this topic`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setAiPrompts(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("AI prompt error:", e);
      setAiPrompts(["Could not generate prompts — please check your connection and try again."]);
    }
    setAiLoading(false);
  };

  const subjectObj  = SUBJECTS.find(s => s.id === subject);
  const stageObj    = STAGES.find(s => s.id === stage);
  const isLastPrompt = currentIdx === promptSet.length - 1;

  // ── SUBJECT PICKER ──────────────────────────────────────────────────────────
  if (view === "subject") return (
    <div className="screen">
      <button onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", padding: 0, marginBottom: 20 }}>
        <Icon.Home /> Home
      </button>
      <p className="eyebrow" style={{ marginBottom: 6 }}>Narration Coach</p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>What did you<br />just read?</h1>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>
        Choose a subject and I'll give you prompts to draw out what they truly know — not a quiz, but a conversation.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {SUBJECTS.map(s => (
          <button key={s.id}
            onClick={() => { setSubject(s.id); setView("stage"); }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "none", border: "1px solid var(--rule)", borderRadius: 3, cursor: "pointer", textAlign: "left", transition: "border-color .2s, background .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}10`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.background = "none"; }}>
            <span style={{ fontSize: 20 }}>{s.emoji}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)" }}>{s.label}</span>
          </button>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 20 }}>
        <button onClick={() => setView("ai")}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 0", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)" }}>
          <Icon.Sparkle /> AI prompts for a custom topic
        </button>
      </div>
    </div>
  );

  // ── STAGE PICKER ────────────────────────────────────────────────────────────
  if (view === "stage") return (
    <div className="screen">
      <button onClick={() => setView("subject")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Subjects</button>
      <p className="eyebrow" style={{ marginBottom: 6 }}>Narration Coach · {subjectObj?.emoji} {subjectObj?.label}</p>
      <h2 className="serif" style={{ fontSize: 22, marginBottom: 4 }}>Where is this child<br />in their narration?</h2>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>The prompts will adjust to meet them where they are.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STAGES.map(s => (
          <button key={s.id}
            onClick={() => { setStage(s.id); startSession(subject, s.id); }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "18px 20px", background: "none", border: "1px solid var(--rule)", borderRadius: 3, cursor: "pointer", textAlign: "left", transition: "border-color .2s, background .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--sage)"; e.currentTarget.style.background = "var(--sage-bg)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.background = "none"; }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "var(--ink)", marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.6 }}>{s.note}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // ── AI CUSTOM TOPIC ─────────────────────────────────────────────────────────
  if (view === "ai") return (
    <div className="screen">
      <button onClick={() => setView("subject")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
      <p className="eyebrow" style={{ marginBottom: 6 }}>Narration Coach · Custom Topic</p>
      <h2 className="serif" style={{ fontSize: 22, marginBottom: 4 }}>What are you<br />studying?</h2>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 24 }}>
        Be as specific as you like — the more detail you give, the more useful the prompts.
      </p>
      <input className="input-line"
        placeholder="e.g. Ch. 4 of The Hobbit · The Battle of Lexington · Van Gogh's Starry Night…"
        value={aiTopic} onChange={e => setAiTopic(e.target.value)}
        onKeyDown={e => e.key === "Enter" && generateAiPrompts()}
        style={{ marginBottom: 16, fontSize: 15 }} />
      <p className="eyebrow" style={{ marginBottom: 10 }}>Child's narration stage</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {STAGES.map(s => (
          <button key={s.id} onClick={() => setStage(s.id)}
            style={{ flex: 1, padding: "8px 4px", border: `1px solid ${stage === s.id ? "var(--sage)" : "var(--rule)"}`, background: stage === s.id ? "var(--sage-bg)" : "none", borderRadius: 2, cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: stage === s.id ? "var(--sage)" : "var(--ink-faint)", transition: "all .2s" }}>
            {s.label}
          </button>
        ))}
      </div>
      <button className="btn-sage" style={{ width: "100%", opacity: aiLoading || !aiTopic.trim() ? 0.6 : 1, marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        onClick={generateAiPrompts} disabled={aiLoading || !aiTopic.trim()}>
        {aiLoading ? "Generating prompts…" : <><Icon.Sparkle /> Generate Narration Prompts</>}
      </button>
      {aiPrompts.length > 0 && (
        <>
          <div style={{ height: 1, background: "var(--rule)", marginBottom: 20 }} />
          <p className="eyebrow" style={{ marginBottom: 4 }}>Prompts for</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 16 }}>{aiTopic}</p>
          {aiPrompts.map((p, i) => (
            <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid var(--rule)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.7, flex: 1 }}>{p}</p>
                <button onClick={() => copyPrompt(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", flexShrink: 0, marginTop: 4 }}><Icon.Copy /></button>
              </div>
            </div>
          ))}
          <button onClick={generateAiPrompts}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginTop: 20 }}>
            <Icon.Refresh /> Regenerate
          </button>
        </>
      )}
    </div>
  );

  // ── COACH VIEW ──────────────────────────────────────────────────────────────
  if (view === "coach") return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <button onClick={() => setView("stage")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        <button onClick={() => { setView("subject"); setSubject(null); setStage(null); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          New Session
        </button>
      </div>

      {/* Subject + stage badges */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: subjectObj?.color || "var(--sage)", background: `${subjectObj?.color || "#A9B786"}15`, border: `1px solid ${subjectObj?.color || "var(--sage-md)"}40`, borderRadius: 20, padding: "3px 10px" }}>
          {subjectObj?.emoji} {subjectObj?.label}
        </span>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", border: "1px solid var(--rule)", borderRadius: 20, padding: "3px 10px" }}>
          {stageObj?.label}
        </span>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {promptSet.map((_, i) => (
          <div key={i} style={{ height: 5, borderRadius: 3, background: i <= currentIdx ? (subjectObj?.color || "var(--sage)") : "var(--rule)", opacity: i < currentIdx ? 0.35 : 1, flex: i === currentIdx ? 2 : 1, transition: "all .3s ease" }} />
        ))}
      </div>

      {/* Main prompt card */}
      <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, padding: "24px 20px", marginBottom: 16, position: "relative", minHeight: 120 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.75, paddingRight: 28 }}>
          {promptSet[currentIdx]}
        </p>
        <button onClick={() => copyPrompt(promptSet[currentIdx])}
          style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: copied ? "var(--sage)" : "var(--ink-faint)", fontSize: copied ? 13 : undefined }}>
          {copied ? "✓" : <Icon.Copy />}
        </button>
      </div>

      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 16, textAlign: "center" }}>
        Prompt {currentIdx + 1} of {promptSet.length}
      </p>

      {/* Follow-up */}
      {!showFollowUp ? (
        <button onClick={() => setShowFollowUp(true)}
          style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 3, padding: "10px 0", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>
          + Follow-up prompt
        </button>
      ) : (
        <div style={{ background: "#f7f4ef", border: "1px solid var(--rule)", borderRadius: 3, padding: "16px 18px", marginBottom: 12 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 8 }}>If they need a nudge</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.7 }}>{followUp}</p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => { if (currentIdx > 0) { setCurrentIdx(i => i - 1); setShowFollowUp(false); } }}
          disabled={currentIdx === 0}
          style={{ flex: 1, padding: "12px 0", background: "none", border: "1px solid var(--rule)", borderRadius: 2, cursor: currentIdx === 0 ? "default" : "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", opacity: currentIdx === 0 ? 0.3 : 1 }}>
          ← Prev
        </button>
        <button onClick={nextPrompt} disabled={isLastPrompt}
          style={{ flex: 2, padding: "12px 0", background: isLastPrompt ? "none" : "var(--sage)", border: `1px solid ${isLastPrompt ? "var(--rule)" : "var(--sage)"}`, borderRadius: 2, cursor: isLastPrompt ? "default" : "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: isLastPrompt ? "var(--ink-faint)" : "white", opacity: isLastPrompt ? 0.4 : 1 }}>
          Next →
        </button>
      </div>

      {/* Gentle close on last prompt */}
      {isLastPrompt && (
        <div style={{ background: "var(--gold-bg)", border: "1px solid #E0CBA8", borderRadius: 3, padding: "18px 20px", marginBottom: 20 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>A word to close</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.8 }}>{close}</p>
        </div>
      )}

      {/* New set */}
      <button onClick={() => startSession(subject, stage)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", margin: "0 auto" }}>
        <Icon.Refresh /> New set of prompts
      </button>
    </div>
  );

  return null;
}
