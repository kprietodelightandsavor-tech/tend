// src/screens/GuideScreen.jsx
//
// The Lantern — a small light for whichever stretch of the day needs it.
// Three doors:
//   • Change gears  — help stopping one thing and starting the next
//                     (for the mother or a child; ADHD-aware, body-first)
//   • Something's not working — troubleshooting the ordinary hard days,
//                     in Charlotte Mason's spirit
// Speak or type — the mic uses the browser's speech recognition where
// available (on iPhone, the keyboard's dictation key always works too).
//
// Free tier: 5 exchanges a day. Premium: unhurried.

import { useState, useRef, useEffect } from "react";

const MODES = {
  transition: {
    title: "Transitions",
    sub: "Stopping one thing, starting the next — for you or a child",
    placeholder: "What are you (or they) in the middle of, and what needs to happen next?",
    starters: [
      "He won't stop building Legos and it's time for math",
      "I can't seem to start the read-aloud — help me land",
      "She melts down every time we end screen time",
      "I'm deep in my own work and school starts in 10 minutes",
    ],
  },
  troubleshoot: {
    title: "Ideas & Untangling",
    sub: "The ordinary hard things of a homeschool day — or a fresh idea when the well runs dry",
    placeholder: "Tell the Lantern what's happening — plainly is fine.",
    starters: [
      "My child fights narration every single time",
      "Math ends in tears more days than not",
      "We're so behind and I'm starting to panic",
      "Give me a fresh idea for our poetry tea time",
    ],
  },
};

const FREE_DAILY_LIMIT = 5;
const COUNT_KEY = "tend_guide_count";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function readCount() {
  try {
    const saved = JSON.parse(localStorage.getItem(COUNT_KEY)) || {};
    return saved.date === todayKey() ? saved.n || 0 : 0;
  } catch { return 0; }
}
function bumpCount() {
  try {
    const n = readCount() + 1;
    localStorage.setItem(COUNT_KEY, JSON.stringify({ date: todayKey(), n }));
    return n;
  } catch { return 0; }
}

// ── voice input (Web Speech API, graceful when absent) ──
function getRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = "en-US";
  r.interimResults = true;
  r.continuous = false;
  return r;
}

function MicButton({ onText, disabled }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => () => { try { recRef.current?.abort(); } catch {} }, []);

  if (!supported) return null; // iPhone keyboards still offer dictation in the textarea

  const toggle = () => {
    if (disabled) return;
    if (listening) {
      try { recRef.current?.stop(); } catch {}
      setListening(false);
      return;
    }
    const rec = getRecognition();
    if (!rec) return;
    recRef.current = rec;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      onText((finalText + interim).trim(), false);
    };
    rec.onend = () => {
      setListening(false);
      if (finalText.trim()) onText(finalText.trim(), true);
    };
    rec.onerror = () => setListening(false);
    try { rec.start(); setListening(true); } catch { setListening(false); }
  };

  return (
    <button onClick={toggle} disabled={disabled} aria-label={listening ? "stop listening" : "speak your question"}
      style={{
        background: listening ? "var(--gold-bg)" : "none",
        border: `1px solid ${listening ? "var(--gold)" : "var(--sage-md)"}`,
        borderRadius: "50%", width: 40, height: 40, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "default" : "pointer", transition: "all .2s",
      }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={listening ? "var(--gold)" : "var(--sage)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 18v3" />
      </svg>
    </button>
  );
}

export default function GuideScreen({ onNavigate, settings }) {
  const isPaid = settings?.isPaid || false;
  const [mode, setMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [used, setUsed] = useState(readCount);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  const atLimit = !isPaid && used >= FREE_DAILY_LIMIT;

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || busy || atLimit) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setUsed(bumpCount());
    try {
      const res = await fetch("/.netlify/functions/tend-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: next }),
      });
      const data = await res.json();
      setMessages(m => [...m, {
        role: "assistant",
        content: data.reply || data.error || "The Lantern flickered — try again in a moment.",
      }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "The Lantern flickered — try again in a moment." }]);
    }
    setBusy(false);
  };

  // ── mode picker ──
  if (!mode) {
    return (
      <div className="screen">
        <p className="eyebrow" style={{ marginBottom: 6 }}>A small light, when you need one</p>
        <h1 className="display serif" style={{ marginBottom: 8 }}>The Lantern</h1>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 28 }}>
          Guide, muse, and troubleshooter. Speak or type — bring it whatever the day has brought you.
        </p>

        {Object.entries(MODES).map(([id, m]) => (
          <div key={id} onClick={() => setMode(id)} className="chapter-row" style={{ cursor: "pointer" }}>
            <div style={{ flex: 1 }}>
              <p className="chapter-title">{m.title}</p>
              <p className="chapter-sub">{m.sub}</p>
            </div>
            <span className="chapter-arrow">→</span>
          </div>
        ))}

        <p className="caption italic" style={{ marginTop: 28, lineHeight: 1.7 }}>
          The Lantern is a thoughtful companion, not an expert on your child.
          You know them best — take what serves, leave the rest.
          {!isPaid && ` Free: ${FREE_DAILY_LIMIT} exchanges a day.`}
        </p>
      </div>
    );
  }

  const m = MODES[mode];

  // ── conversation ──
  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column", minHeight: "70vh" }}>
      <button onClick={() => { setMode(null); setMessages([]); }}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", marginBottom: 4, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
        ← the lantern
      </button>
      <h1 className="display serif" style={{ fontSize: 26, marginBottom: 4 }}>{m.title}</h1>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 20 }}>{m.sub}</p>

      {/* starters — only before the first message */}
      {messages.length === 0 && (
        <div style={{ marginBottom: 20 }}>
          {m.starters.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: "0.5px solid var(--rule)", padding: "10px 0", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14.5, color: "var(--ink-lt)", lineHeight: 1.5 }}>
              “{s}”
            </button>
          ))}
        </div>
      )}

      {/* messages */}
      <div style={{ flex: 1, marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {msg.role === "user" ? (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.6, margin: 0, paddingLeft: 24 }}>
                {msg.content}
              </p>
            ) : (
              <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: 14 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15.5, color: "var(--ink)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </p>
              </div>
            )}
          </div>
        ))}
        {busy && (
          <p className="corm italic" style={{ fontSize: 13, color: "var(--ink-faint)" }}>the Lantern is thinking…</p>
        )}
        <div ref={endRef} />
      </div>

      {/* limit note */}
      {atLimit && (
        <div style={{ padding: "14px 16px", marginBottom: 14, background: "var(--gold-bg)", border: "1px solid var(--rule)", borderRadius: 3, textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink-lt)", lineHeight: 1.6, margin: "0 0 4px" }}>
            The Lantern has given its five for today. With Premium, it stays lit as long as you need.
          </p>
          <a href="https://delightnsavor.gumroad.com/l/qrxxi" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", textDecoration: "none" }}>
            Join Tend Premium →
          </a>
        </div>
      )}

      {/* input — type, or speak */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <MicButton disabled={busy || atLimit} onText={(t) => setInput(t)} />
        <textarea
          className="textarea"
          rows={2}
          placeholder={m.placeholder}
          value={input}
          disabled={atLimit}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          style={{ flex: 1 }}
        />
        <button onClick={() => send()} disabled={busy || atLimit || !input.trim()}
          style={{ background: "var(--sage)", color: "white", border: "none", borderRadius: 3, padding: "10px 16px", cursor: busy || atLimit ? "default" : "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", opacity: busy || atLimit || !input.trim() ? 0.5 : 1 }}>
          Ask
        </button>
      </div>
      <p className="caption italic" style={{ marginTop: 10, textAlign: "center" }}>
        A companion, not an authority — you know your family best.
      </p>
    </div>
  );
}
