import { CHAPTERS } from "../data/seed";

// Inline Tend logo — no external component dependency
function TendMark() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ display: "block", margin: "0 auto" }}>
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
      <circle cx="24" cy="40" r="1.2" fill="#A9B786"/><circle cx="40" cy="40" r="1.2" fill="#A9B786"/>
      <circle cx="23" cy="33" r="1.2" fill="#A9B786"/><circle cx="41" cy="33" r="1.2" fill="#A9B786"/>
      <circle cx="24" cy="27" r="1.2" fill="#A9B786"/><circle cx="40" cy="27" r="1.2" fill="#A9B786"/>
      <circle cx="25" cy="21" r="1.2" fill="#A9B786"/><circle cx="39" cy="21" r="1.2" fill="#A9B786"/>
      <text x="32" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontSize="5" fill="#A9B786" fontStyle="italic" letterSpacing="0.08em">tend</text>
    </svg>
  );
}

export default function MenuScreen({ onNavigate }) {
  return (
    <div className="screen">

      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <TendMark />
        </div>
        <h1 className="display serif" style={{ fontSize: 36, marginBottom: 4 }}>Tend</h1>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)" }}>
          A daily rhythm for Charlotte Mason families
        </p>
      </div>

      <div className="rule-gold" />

      {/* Contents */}
      <p className="eyebrow" style={{ marginBottom: 4, textAlign: "center" }}>Contents</p>
      <div style={{ marginTop: 8 }}>
        {CHAPTERS.map((c, i) => (
          <div key={i} className="chapter-row" onClick={() => onNavigate(c.screen)}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span className="chapter-num">{c.num}</span>
              <div>
                <p className="chapter-title">{c.title}</p>
                <p className="chapter-sub">{c.sub}</p>
              </div>
            </div>
            <span className="chapter-arrow">→</span>
          </div>
        ))}

        {/* Settings row */}
        <div className="chapter-row" onClick={() => onNavigate("settings")}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span className="chapter-num" style={{ fontStyle: "normal", fontSize: 11 }}>⚙</span>
            <div>
              <p className="chapter-title">Settings</p>
              <p className="chapter-sub">Name, outdoor goal, term & week</p>
            </div>
          </div>
          <span className="chapter-arrow">→</span>
        </div>
      </div>

      <div className="rule" style={{ marginTop: 8 }} />

      {/* Philosophy */}
      <div className="card-gold" style={{ marginTop: 4 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Philosophy</p>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>
          "Education is an atmosphere, a discipline, a life."
        </p>
        <p className="caption" style={{ marginTop: 8 }}>— Charlotte Mason</p>
      </div>

      {/* ─── Also from Delight & Savor ─────────────────────────────────── */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
        <p className="eyebrow" style={{ marginBottom: 16, textAlign: "center" }}>
          Also from Delight & Savor
        </p>

        {/* In the Margin */}
        <a
          href="https://in-the-margin.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block" }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px",
            background: "var(--sage-bg)",
            border: "1px solid var(--sage-md)",
            borderRadius: 3,
            transition: "opacity .2s",
          }}
            onMouseOver={e => e.currentTarget.style.opacity = ".8"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            {/* In the Margin real icon */}
            <img
              src="/margin_icon.png"
              alt="In the Margin"
              style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, objectFit: "cover" }}
            />

            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 16, color: "var(--ink)", marginBottom: 3,
              }}>
                In the Margin
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13, fontStyle: "italic",
                color: "var(--ink-faint)", lineHeight: 1.5,
              }}>
                A reading companion for parents — notes, quotes, and reflections alongside great books.
              </p>
            </div>

            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </a>
      </div>

      {/* Footer — D&S website link with real icon */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <a
          href="https://www.delightandsavor.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}
            onMouseOver={e => e.currentTarget.style.opacity = ".75"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            <img
              src="/ds_icon.png"
              alt="Delight & Savor"
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>
                Delight & Savor
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", color: "var(--sage)" }}>
                delightandsavor.com
              </p>
            </div>
          </div>
        </a>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)", marginTop: 12 }}>
          Literature · Writing · Living Books
        </p>
      </div>

    </div>
  );
}
