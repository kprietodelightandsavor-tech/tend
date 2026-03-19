import { useState, useEffect } from "react";

// ─── TEND BOTANICAL TREE LOGO (from AuthScreen) ───────────────────────────────
function TendLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
      style={{ display: "block", margin: "0 auto" }}>
      <circle cx="32" cy="32" r="30" stroke="#A9B786" strokeWidth="1" fill="#F7F4EF"/>
      <line x1="32" y1="52" x2="32" y2="14" stroke="#A9B786" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="32" y1="44" x2="24" y2="40" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="44" x2="40" y2="40" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="23" y2="33" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="41" y2="33" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="24" y2="27" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="40" y2="27" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="26" x2="25" y2="21" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <line x1="32" y1="26" x2="39" y2="21" stroke="#A9B786" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="32" cy="14" r="2" fill="#A9B786"/>
      <circle cx="24" cy="40" r="1.2" fill="#A9B786"/>
      <circle cx="40" cy="40" r="1.2" fill="#A9B786"/>
      <circle cx="23" cy="33" r="1.2" fill="#A9B786"/>
      <circle cx="41" cy="33" r="1.2" fill="#A9B786"/>
      <circle cx="24" cy="27" r="1.2" fill="#A9B786"/>
      <circle cx="40" cy="27" r="1.2" fill="#A9B786"/>
      <circle cx="25" cy="21" r="1.2" fill="#A9B786"/>
      <circle cx="39" cy="21" r="1.2" fill="#A9B786"/>
      <text x="32" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontSize="5"
        fill="#A9B786" fontStyle="italic" letterSpacing="0.08em">tend</text>
    </svg>
  );
}

// ─── ACCURATE APP PREVIEW ─────────────────────────────────────────────────────
function AppPreview() {
  const blocks = [
    { time: "8:00",  subject: "Rise & Shine",   color: "#C29B61", done: true },
    { time: "9:00",  subject: "Morning Basket", color: "#C29B61", done: true },
    { time: "9:45",  subject: "Narration",       color: "#A9B786", done: false },
    { time: "10:30", subject: "Mathematics",     color: "#7a8f9e", done: false },
    { time: "11:15", subject: "Nature Study",    color: "#A9B786", done: false },
  ];

  const r = 22, circ = 2 * Math.PI * r, dash = circ * 0.37;

  return (
    <div style={{
      width: "100%", maxWidth: 272, margin: "0 auto",
      background: "#F7F4EF", borderRadius: 28,
      boxShadow: "0 28px 72px rgba(44,54,40,.15), 0 6px 20px rgba(44,54,40,.07)",
      overflow: "hidden",
      border: "1px solid rgba(169,183,134,.18)",
    }}>
      <div style={{ padding: "10px 18px 0", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, color: "#b8b0a5", fontFamily: "'Lato', sans-serif" }}>9:41</span>
        <span style={{ fontSize: 8, color: "#b8b0a5", fontFamily: "'Lato', sans-serif" }}>●●●</span>
      </div>

      <div style={{ padding: "12px 16px 0", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        <p style={{ fontSize: 8.5, color: "#b8b0a5", letterSpacing: ".1em", fontFamily: "'Lato', sans-serif", textTransform: "uppercase", marginBottom: 3 }}>
          Wednesday, March 19
        </p>
        <h3 style={{ fontSize: 18, color: "#2C2C2C", fontFamily: "'Playfair Display', serif", fontWeight: 400, margin: "0 0 2px", lineHeight: 1.15 }}>
          Good Morning,<br />Kim.
        </h3>
        <p style={{ fontSize: 11, color: "#A9B786", fontStyle: "italic", margin: "0 0 14px" }}>
          Begin with what is in front of you.
        </p>

        <div style={{ background: "white", borderRadius: 8, padding: "10px 11px", marginBottom: 11, border: "1px solid rgba(169,183,134,.13)", display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ position: "relative", width: 50, height: 50, flexShrink: 0 }}>
            <svg width="50" height="50" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="25" cy="25" r={r} fill="none" stroke="#ede9e1" strokeWidth="4"/>
              <circle cx="25" cy="25" r={r} fill="none" stroke="#A9B786" strokeWidth="4"
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "#A9B786", fontFamily: "'Playfair Display', serif" }}>5h</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 8.5, color: "#b8b0a5", fontFamily: "'Lato', sans-serif", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>Outside This Week</p>
            <p style={{ fontSize: 12, color: "#2C2C2C", fontStyle: "italic", marginBottom: 5 }}>10 hrs to go</p>
            <div style={{ display: "flex", gap: 4 }}>
              {["+15m", "+30m", "+45m"].map(l => (
                <span key={l} style={{ fontSize: 7.5, background: "rgba(169,183,134,.1)", border: "1px solid rgba(169,183,134,.28)", borderRadius: 2, padding: "2px 5px", color: "#A9B786", fontFamily: "'Lato', sans-serif" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(169,183,134,.13)", margin: "0 0 11px" }}/>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
          <p style={{ fontSize: 8.5, color: "#b8b0a5", letterSpacing: ".1em", fontFamily: "'Lato', sans-serif", textTransform: "uppercase" }}>Today · Wednesday</p>
          <p style={{ fontSize: 8, color: "#A9B786", fontFamily: "'Lato', sans-serif" }}>Full week →</p>
        </div>

        {blocks.map((b, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center",
            paddingBottom: 8,
            marginBottom: i < blocks.length - 1 ? 8 : 4,
            borderBottom: i < blocks.length - 1 ? "1px solid rgba(169,183,134,.1)" : "none",
            opacity: b.done ? 0.36 : 1,
          }}>
            <div style={{ width: 3, alignSelf: "stretch", minHeight: 22, background: b.done ? "#ddd8ce" : b.color, borderRadius: 2, marginRight: 8, flexShrink: 0 }}/>
            <span style={{ fontSize: 8.5, color: "#b8b0a5", fontFamily: "'Lato', sans-serif", width: 26, flexShrink: 0 }}>{b.time}</span>
            <span style={{ fontSize: 13, color: b.done ? "#b8b0a5" : "#2C2C2C", fontFamily: "'Playfair Display', serif", flex: 1, textDecoration: b.done ? "line-through" : "none", textDecorationColor: "#A9B786" }}>{b.subject}</span>
            {b.done && <span style={{ fontSize: 8, color: b.color }}>✓</span>}
          </div>
        ))}

        <p style={{ fontSize: 8, color: "#c5bfb6", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", textAlign: "center", padding: "4px 0 12px" }}>
          Tap to complete · Hold to skip
        </p>
      </div>

      <div style={{ borderTop: "1px solid rgba(169,183,134,.13)", display: "flex", background: "white", paddingBottom: 8 }}>
        {[
          { label: "Home",    active: true,  path: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22v-10h6v10" },
          { label: "Planner", active: false, path: "M3 4h18v16H3z M8 2v4 M16 2v4 M3 10h18" },
          { label: "Narrate", active: false, path: "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2" },
          { label: "Menu",    active: false, path: "M3 6h18 M3 12h18 M3 18h18" },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, paddingTop: 8, textAlign: "center", color: item.active ? "#A9B786" : "#ccc5bb" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 2px" }}>
              <path d={item.path}/>
            </svg>
            <div style={{ fontSize: 7.5, fontFamily: "'Lato', sans-serif" }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    svg: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    title: "Your daily rhythm, held",
    body: "A time-blocked planner built around Charlotte Mason's gentle pace — morning basket, lessons, outdoor time, and rest.",
  },
  {
    svg: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/></svg>,
    title: "Narration, guided",
    body: "An AI coach walking students through Find It · Follow It · Frame It — turning living books into living words.",
  },
  {
    svg: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/></svg>,
    title: "120 hours outdoors",
    body: "Track your family's time outside toward Charlotte Mason's 6-hours-a-day vision — a weekly rhythm, not a burden.",
  },
  {
    svg: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/></svg>,
    title: "Consider the Lilies",
    body: "A commonplace journal for beauty, wonder, and the things worth writing down — woven into your everyday.",
  },
];

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
export default function WelcomeScreen({ onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(10px)",
    transition: `opacity .65s ${delay}s ease, transform .65s ${delay}s ease`,
  });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--cream)", overflowY: "auto", display: "flex", flexDirection: "column" }}>

      {/* ── Hero ── */}
      <div style={{ padding: "52px 32px 36px", textAlign: "center", ...fade(0) }}>
        <TendLogo size={64} />
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 40, fontWeight: 400, letterSpacing: "-.01em",
          color: "var(--ink)", margin: "18px 0 10px", lineHeight: 1,
        }}>
          Tend
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 17, fontStyle: "italic",
          color: "var(--ink-faint)", lineHeight: 1.6,
          margin: "0 auto", maxWidth: 240,
        }}>
          A daily rhythm app for<br />Charlotte Mason families
        </p>
      </div>

      {/* ── App Preview ── */}
      <div style={{ padding: "0 24px 44px", ...fade(.15) }}>
        <AppPreview />
      </div>

      {/* ── Features ── */}
      <div style={{ padding: "0 28px 40px", ...fade(.25) }}>
        <p style={{
          fontFamily: "'Lato', sans-serif", fontSize: 9.5,
          letterSpacing: ".14em", textTransform: "uppercase",
          color: "var(--ink-faint)", textAlign: "center", marginBottom: 24,
        }}>What's inside</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", ...fade(.3 + i * .07) }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(169,183,134,.1)", border: "1px solid rgba(169,183,134,.2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {f.svg}
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 400, color: "var(--ink)", margin: "0 0 3px" }}>{f.title}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.6, margin: 0 }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quote ── */}
      <div style={{ padding: "0 36px 40px", textAlign: "center", ...fade(.55) }}>
        <div style={{ height: 1, background: "rgba(169,183,134,.2)", marginBottom: 22 }}/>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.85, margin: 0 }}>
          "The question is not how much does the youth know,<br />but how much does he care?"
        </p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(169,183,134,.6)", marginTop: 10 }}>
          Charlotte Mason
        </p>
      </div>

      {/* ── CTAs ── */}
      <div style={{ padding: "0 28px 44px", display: "flex", flexDirection: "column", gap: 11, ...fade(.5) }}>
        <button
          className="btn-sage"
          style={{ width: "100%", fontSize: 13, padding: "14px 0", letterSpacing: ".08em" }}
          onClick={() => onContinue("signup")}
        >
          Start Free Trial
        </button>
        <button
          onClick={() => onContinue("signin")}
          style={{
            width: "100%", background: "none",
            border: "1px solid rgba(169,183,134,.35)",
            borderRadius: 2, padding: "13px 0",
            fontFamily: "'Lato', sans-serif", fontSize: 12,
            letterSpacing: ".1em", textTransform: "uppercase",
            color: "var(--ink-faint)", cursor: "pointer",
          }}
        >
          Sign In
        </button>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".05em", color: "var(--ink-faint)", textAlign: "center", margin: "2px 0 0" }}>
          Free to try · No credit card required
        </p>
      </div>

      {/* ── Footer — D&S logo sage-tinted ── */}
      <div style={{ textAlign: "center", padding: "0 0 52px", ...fade(.6) }}>
        <div style={{ height: 1, background: "rgba(169,183,134,.15)", margin: "0 36px 28px" }}/>

        {/* Full D&S circular logo, sage-tinted — upload PNG to /public first */}
        <img
          src="/D_S_Primary_Logo-_Transparent.png"
          alt="Delight & Savor"
          style={{
            width: 52, height: 52, objectFit: "contain",
            display: "block", margin: "0 auto",
            filter: "invert(67%) sepia(18%) saturate(480%) hue-rotate(57deg) brightness(85%) contrast(82%)",
            opacity: 0.72,
          }}
        />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13, fontStyle: "italic",
          color: "rgba(169,183,134,.8)",
          margin: "10px 0 4px", lineHeight: 1.6,
        }}>
          Beauty. Meaning. Connection.
        </p>

        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9.5, letterSpacing: ".07em", color: "rgba(169,183,134,.5)" }}>
          An app by{" "}
          <a href="https://www.delightandsavor.com" target="_blank" rel="noopener noreferrer"
            style={{ color: "rgba(169,183,134,.75)", textDecoration: "none" }}>
            Delight & Savor
          </a>
        </p>
      </div>

    </div>
  );
}
