import { useState, useRef } from "react";
import { STUDENTS } from "../data/seed";

const FREE_ENTRY_LIMIT = 3;

const Icon = {
  Plus: () => (<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  X: () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Camera: () => (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>),
  Print: () => (<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>),
  Leaf: () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>),
  Book: () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>),
  ExternalLink: () => (<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>),
  Home: () => (<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Lock: () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>),
};

const LAYER_ONE_CRUMBS = ["Where are you? Describe it in plain, honest words.", "What is the light doing? Morning, afternoon, golden, sharp?", "What can you hear right now?", "What season is it? What is the weather doing?", "What one living thing can you observe right now? What is it doing?"];
const LAYER_TWO_CRUMBS = ["What is the one thing from today you keep returning to?", "When did something make you stop — even for a breath?", "Zoom in. What specific detail made it real?", "Was there a word someone said that should be written down exactly as they said it?"];
const LAYER_THREE_CRUMBS = ["What question does this moment open in you? You don't have to answer it.", "Does this connect to anything you've been reading? A line from Scripture?", "Where do you see grace in this moment?", "What do you want to say thank you for?"];

const buildOwners = () => {
  const mother = { id: "mother", name: "Kim", color: "#8A9E89", initial: "K" };
  const students = STUDENTS.map(s => ({ id: `student-${s.id}`, name: s.name, color: s.color, initial: s.initial }));
  return [mother, ...students];
};

function TypeBadge({ type }) {
  const isDaily = type === "daily";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", color: isDaily ? "var(--sage)" : "var(--gold)", border: `1px solid ${isDaily ? "var(--sage-md)" : "#D4B07A"}`, borderRadius: 2, padding: "2px 7px" }}>
      {isDaily ? <Icon.Leaf /> : <Icon.Book />}
      {isDaily ? "Daily" : "Commonplace"}
    </span>
  );
}

function LiliesPaywallBanner() {
  return (
    <div style={{ borderTop: "1px solid rgba(169,183,134,.2)", paddingTop: 20, marginTop: 8, textAlign: "center" }}>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>✦ You've kept {FREE_ENTRY_LIMIT} free entries</p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.7, maxWidth: 260, margin: "0 auto 18px" }}>
        Upgrade to keep writing — unlimited entries for every family member, plus all five habits, narration coaching, and more.
      </p>
      <a href="https://payhip.com/b/NMQ4D" target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-block", background: "var(--sage)", color: "white", fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", textDecoration: "none", padding: "12px 28px", borderRadius: 2, marginBottom: 10 }}>
        Unlock Premium · $47/year
      </a>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", color: "var(--ink-faint)" }}>Beauty. Meaning. Connection.</p>
    </div>
  );
}

function SketchBox({ image, onUpload, subject }) {
  const fileRef = useRef();
  const handleFile = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => onUpload(ev.target.result); reader.readAsDataURL(file); };
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(subject ? `How do I sketch and watercolor ${subject}? Simple step-by-step for a beginner nature journaler.` : "How do I sketch and watercolor a nature observation for a beginner?")}`;
  return (
    <div style={{ marginTop: 24, marginBottom: 8 }}>
      <p className="eyebrow" style={{ marginBottom: 12 }}>Sketch · Watercolor · Notation</p>
      {image ? (
        <div style={{ position: "relative" }}>
          <img src={image} alt="sketch" style={{ width: "100%", borderRadius: 3, border: "1px solid var(--rule)", maxHeight: 280, objectFit: "cover" }} />
          <button onClick={() => onUpload(null)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(247,244,239,.9)", border: "1px solid var(--rule)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-faint)" }}><Icon.X /></button>
        </div>
      ) : (
        <div onClick={() => fileRef.current.click()} style={{ border: "1.5px dashed var(--rule)", borderRadius: 3, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: "var(--parchment)" }}>
          <div style={{ color: "var(--ink-faint)", marginBottom: 8, display: "flex", justifyContent: "center" }}><Icon.Camera /></div>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 4 }}>Sketch here on paper, then photograph and upload.</p>
          <p className="caption">Or draw digitally and upload an image.</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <a href={chatGptUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)", textDecoration: "none" }}>
        <Icon.ExternalLink /> Get sketching & watercolor guidance in ChatGPT
      </a>
    </div>
  );
}

function printEntry(entry, ownerName) {
  const win = window.open("", "_blank");
  const layerHtml = entry.type === "daily" ? `<div class="layer"><h3>Layer One</h3><p>${(entry.layer1||"").replace(/\n/g,"<br/>")}</p></div><div class="layer"><h3>Layer Two</h3><p>${(entry.layer2||"").replace(/\n/g,"<br/>")}</p></div><div class="layer"><h3>Layer Three</h3><p>${(entry.layer3||"").replace(/\n/g,"<br/>")}</p></div>` : `<div class="quote-block"><p class="quote">"${entry.quote||""}"</p><p class="source">— ${entry.source||""}</p></div><div class="layer"><h3>Response</h3><p>${(entry.response||"").replace(/\n/g,"<br/>")}</p></div>`;
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Consider the Lilies</title><style>body{font-family:Georgia,serif;max-width:580px;margin:60px auto;color:#2C2A27;padding:0 24px;}h1{font-size:28px;font-weight:400;}p{font-size:17px;line-height:1.85;color:#6B6760;font-style:italic;}.quote{font-size:20px;}.source{font-size:13px;color:#A8A49E;font-style:normal;}hr{border:none;border-top:1px solid #DDD8CF;margin:40px 0;}</style></head><body><p style="font-size:12px;color:#A8A49E;letter-spacing:.1em;text-transform:uppercase;">Consider the Lilies · ${ownerName} · ${entry.date}</p><h1>${entry.type==="daily"?"Daily Entry":"Commonplace"}</h1><hr/>${layerHtml}<hr/><p style="font-size:11px;color:#A8A49E;text-align:center;font-style:normal;">Delight & Savor · Consider the Lilies</p></body></html>`);
  win.document.close(); win.print();
}

function NewDailyEntry({ onSave, onClose }) {
  const [layer1, setLayer1] = useState(""); const [layer2, setLayer2] = useState(""); const [layer3, setLayer3] = useState("");
  const [subject, setSubject] = useState(""); const [image, setImage] = useState(null);
  const save = () => {
    if (!layer1.trim() && !layer2.trim() && !layer3.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    onSave({ id: Date.now(), type: "daily", date: today, layer1, layer2, layer3, subject, image, preview: layer1 || layer2 || layer3 });
  };
  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div><p className="eyebrow" style={{ marginBottom: 4 }}>Daily Entry</p><h2 className="serif" style={{ fontSize: 22 }}>Three Layers of Noticing</h2></div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)" }}><Icon.X /></button>
      </div>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>Follow only the breadcrumbs that open something in you. They are lanterns, not a checklist.</p>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Icon.Leaf /><p className="eyebrow" style={{ marginBottom: 0, color: "var(--sage)" }}>Layer One · The Place</p></div>
        {LAYER_ONE_CRUMBS.map((q, i) => (<p key={i} className="caption italic" style={{ marginBottom: 4, lineHeight: 1.6 }}>{q}</p>))}
        <textarea className="textarea" style={{ marginTop: 12 }} placeholder="Begin here — where are you?" value={layer1} onChange={e => setLayer1(e.target.value)} rows={4} />
        <input className="input-line" placeholder="What are you observing? (for sketch guidance)" value={subject} onChange={e => setSubject(e.target.value)} style={{ fontSize: 13, marginTop: 8 }} />
      </div>
      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 10, color: "var(--sage)" }}>Layer Two · The Moment</p>
        {LAYER_TWO_CRUMBS.map((q, i) => (<p key={i} className="caption italic" style={{ marginBottom: 4, lineHeight: 1.6 }}>{q}</p>))}
        <textarea className="textarea" style={{ marginTop: 12 }} placeholder="What keeps returning to you?" value={layer2} onChange={e => setLayer2(e.target.value)} rows={4} />
      </div>
      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 10, color: "var(--sage)" }}>Layer Three · The Thought or Wonder</p>
        {LAYER_THREE_CRUMBS.map((q, i) => (<p key={i} className="caption italic" style={{ marginBottom: 4, lineHeight: 1.6 }}>{q}</p>))}
        <textarea className="textarea" style={{ marginTop: 12 }} placeholder="What question does this open in you?" value={layer3} onChange={e => setLayer3(e.target.value)} rows={4} />
      </div>
      <SketchBox image={image} onUpload={setImage} subject={subject} />
      <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
        <button className="btn-sage" style={{ flex: 1 }} onClick={save}>Keep This Entry</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function NewCommonplaceEntry({ onSave, onClose }) {
  const [quote, setQuote] = useState(""); const [source, setSource] = useState(""); const [response, setResponse] = useState("");
  const save = () => {
    if (!quote.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    onSave({ id: Date.now(), type: "commonplace", date: today, quote, source, response, preview: quote });
  };
  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div><p className="eyebrow" style={{ marginBottom: 4 }}>Commonplace Entry</p><h2 className="serif" style={{ fontSize: 22 }}>A Passage That Found You</h2></div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)" }}><Icon.X /></button>
      </div>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>Copy the passage that stopped you. Then follow the thread wherever it leads.</p>
      <textarea className="textarea" style={{ fontSize: 19, minHeight: 100 }} placeholder="The passage, line, or thought…" value={quote} onChange={e => setQuote(e.target.value)} rows={4} />
      <input className="input-line" placeholder="— Author, Book, Chapter…" value={source} onChange={e => setSource(e.target.value)} style={{ marginTop: 12, marginBottom: 28 }} />
      <p className="eyebrow" style={{ marginBottom: 10 }}>Response · Connection · Wonder</p>
      {["What stopped you when you read it?", "Does it connect to Scripture, to something you observed, to a question you carry?", "Where does it lead you?"].map((q, i) => (
        <p key={i} className="caption italic" style={{ marginBottom: 4, lineHeight: 1.6 }}>{q}</p>
      ))}
      <textarea className="textarea" style={{ marginTop: 12 }} placeholder="Write what comes…" value={response} onChange={e => setResponse(e.target.value)} rows={5} />
      <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
        <button className="btn-sage" style={{ flex: 1 }} onClick={save}>Keep This Entry</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function EntryDetail({ entry, ownerName, onBack }) {
  return (
    <div className="screen">
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Journal</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><TypeBadge type={entry.type} /></div>
      <p className="caption" style={{ marginBottom: 28 }}>{entry.date}</p>
      {entry.type === "daily" ? (
        <>
          {entry.layer1 && <div style={{ marginBottom: 28 }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Icon.Leaf /><p className="eyebrow" style={{ marginBottom: 0, color: "var(--sage)" }}>Layer One · The Place</p></div><p className="corm italic" style={{ fontSize: 17, color: "var(--ink-lt)", lineHeight: 1.85 }}>{entry.layer1}</p></div>}
          {entry.layer2 && <div style={{ marginBottom: 28 }}><p className="eyebrow" style={{ marginBottom: 10, color: "var(--sage)" }}>Layer Two · The Moment</p><p className="corm italic" style={{ fontSize: 17, color: "var(--ink-lt)", lineHeight: 1.85 }}>{entry.layer2}</p></div>}
          {entry.layer3 && <div style={{ marginBottom: 28 }}><p className="eyebrow" style={{ marginBottom: 10, color: "var(--sage)" }}>Layer Three · The Thought or Wonder</p><p className="corm italic" style={{ fontSize: 17, color: "var(--ink-lt)", lineHeight: 1.85 }}>{entry.layer3}</p></div>}
          {entry.image && <div style={{ marginBottom: 28 }}><p className="eyebrow" style={{ marginBottom: 10 }}>Sketch</p><img src={entry.image} alt="sketch" style={{ width: "100%", borderRadius: 3, border: "1px solid var(--rule)" }} /></div>}
        </>
      ) : (
        <>
          <p className="corm italic" style={{ fontSize: 20, color: "var(--ink)", lineHeight: 1.8, marginBottom: 12 }}>"{entry.quote}"</p>
          {entry.source && <p className="caption" style={{ marginBottom: 28 }}>— {entry.source}</p>}
          {entry.response && <div style={{ marginBottom: 28 }}><p className="eyebrow" style={{ marginBottom: 10 }}>Response · Connection · Wonder</p><p className="corm italic" style={{ fontSize: 17, color: "var(--ink-lt)", lineHeight: 1.85 }}>{entry.response}</p></div>}
        </>
      )}
      <div style={{ height: 1, background: "var(--rule)", margin: "8px 0 20px" }} />
      <button onClick={() => printEntry(entry, ownerName)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "10px 18px", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
        <Icon.Print /> Print this entry
      </button>
    </div>
  );
}

const SEED_ENTRIES = {
  mother: [
    { id: 1, type: "daily", date: "March 14, 2026", layer1: "On the back porch, just after 7am. The light is coming in low and gold from the east, catching the horses' backs. Cold enough to need a jacket.", layer2: "Marcos came out barefoot and stood beside me without saying anything. We watched a red-tailed hawk cross the pasture. He put his hand in mine.", layer3: "I keep thinking about how these mornings are numbered. Not in a sad way — in a holy way.", subject: "red-tailed hawk", image: null, preview: "On the back porch, just after 7am." },
    { id: 2, type: "commonplace", date: "March 10, 2026", quote: "The imagination needs food above all things.", source: "Charlotte Mason, Vol. 2", response: "I keep coming back to this when I feel the pull to over-schedule.", preview: "The imagination needs food above all things." },
  ],
  "student-1": [{ id: 3, type: "commonplace", date: "March 13, 2026", quote: "To be wholly devoted to some intellectual exercise is to have succeeded in life.", source: "Robert Louis Stevenson", response: "I want this to be true of me.", preview: "To be wholly devoted to some intellectual exercise..." }],
  "student-2": [],
  "student-3": [],
};

export default function LiliesScreen({ settings, onNavigate }) {
  const isPaid = settings?.isPaid || false;
  const owners = buildOwners();
  const [activeOwner, setActiveOwner] = useState(owners[0]);
  const [entries, setEntries] = useState(SEED_ENTRIES);
  const [view, setView] = useState("journal");
  const [activeEntry, setActiveEntry] = useState(null);

  const ownerEntries = entries[activeOwner.id] || [];
  const isAtLimit = !isPaid && ownerEntries.length >= FREE_ENTRY_LIMIT;

  const addEntry = (entry) => {
    setEntries(prev => ({ ...prev, [activeOwner.id]: [entry, ...(prev[activeOwner.id] || [])] }));
    setView("journal");
  };

  if (view === "detail" && activeEntry) return <EntryDetail entry={activeEntry} ownerName={activeOwner.name} onBack={() => setView("journal")} />;
  if (view === "new-daily") return <NewDailyEntry onSave={addEntry} onClose={() => setView("journal")} />;
  if (view === "new-commonplace") return <NewCommonplaceEntry onSave={addEntry} onClose={() => setView("journal")} />;

  return (
    <div className="screen">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", padding: 0 }}>
          <Icon.Home /> Home
        </button>
      </div>
      <p className="eyebrow" style={{ marginBottom: 6 }}>Commonplace & Nature Journal</p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>Consider the<br />Lilies</h1>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 24, lineHeight: 1.7 }}>"Consider the lilies of the field, how they grow."</p>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 24 }}>
        {owners.map(o => (
          <button key={o.id} onClick={() => setActiveOwner(o)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 20, cursor: "pointer", border: `1px solid ${activeOwner.id === o.id ? o.color : "var(--rule)"}`, background: activeOwner.id === o.id ? `${o.color}18` : "none", fontFamily: "'Lato', sans-serif", fontSize: 12, color: activeOwner.id === o.id ? o.color : "var(--ink-faint)", whiteSpace: "nowrap", transition: "all .2s" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: o.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: "white", fontFamily: "'Playfair Display', serif" }}>{o.initial}</span>
            </div>
            {o.name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: isAtLimit ? 12 : 24 }}>
        <button onClick={() => isAtLimit ? null : setView("new-daily")} disabled={isAtLimit}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: isAtLimit ? "rgba(0,0,0,.03)" : "var(--sage-bg)", border: `1px solid ${isAtLimit ? "var(--rule)" : "var(--sage-md)"}`, borderRadius: 2, padding: "11px 0", cursor: isAtLimit ? "default" : "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: isAtLimit ? "var(--ink-faint)" : "var(--sage)", opacity: isAtLimit ? 0.6 : 1 }}>
          {isAtLimit ? <Icon.Lock /> : <Icon.Plus />} Daily Entry
        </button>
        <button onClick={() => isAtLimit ? null : setView("new-commonplace")} disabled={isAtLimit}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: isAtLimit ? "rgba(0,0,0,.03)" : "var(--gold-bg)", border: `1px solid ${isAtLimit ? "var(--rule)" : "#D4B07A"}`, borderRadius: 2, padding: "11px 0", cursor: isAtLimit ? "default" : "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: isAtLimit ? "var(--ink-faint)" : "var(--gold)", opacity: isAtLimit ? 0.6 : 1 }}>
          {isAtLimit ? <Icon.Lock /> : <Icon.Plus />} Commonplace
        </button>
      </div>

      {!isPaid && !isAtLimit && (
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)", textAlign: "center", marginBottom: 20 }}>
          {FREE_ENTRY_LIMIT - ownerEntries.length} free {FREE_ENTRY_LIMIT - ownerEntries.length === 1 ? "entry" : "entries"} remaining for {activeOwner.name}
        </p>
      )}

      <div style={{ height: 1, background: "var(--rule)", marginBottom: 4 }} />

      {ownerEntries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <p className="ornament" style={{ fontSize: 36, marginBottom: 16 }}>✦</p>
          <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-faint)", lineHeight: 1.8 }}>No entries yet for {activeOwner.name}.<br />Begin with what is in front of you.</p>
        </div>
      ) : (
        ownerEntries.map(e => (
          <button key={e.id} onClick={() => { setActiveEntry(e); setView("detail"); }}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "16px 0", borderBottom: "1px solid var(--rule)", display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <TypeBadge type={e.type} />
              <span className="caption">{e.date}</span>
            </div>
            <p className="corm italic" style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.6, marginBottom: 0 }}>
              {e.preview?.slice(0, 80)}{e.preview?.length > 80 ? "…" : ""}
            </p>
          </button>
        ))
      )}

      {isAtLimit && <LiliesPaywallBanner />}

      <p className="caption" style={{ textAlign: "center", marginTop: 32, fontStyle: "italic" }}>
        {ownerEntries.length} {ownerEntries.length === 1 ? "entry" : "entries"} · {activeOwner.name}
      </p>
      <div style={{ marginTop: 28, padding: "16px 0", borderTop: "1px solid var(--rule)" }}>
        <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.8, textAlign: "center" }}>
          The minimum faithful entry: where you were,<br />one thing you noticed, one sentence about where it led.
        </p>
      </div>
    </div>
  );
}
