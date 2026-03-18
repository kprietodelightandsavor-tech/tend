import { CHAPTERS } from "../data/seed";

// ─── TEND ICON ────────────────────────────────────────────────────────────────
function TendMark() {
  return (
    <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      {/* Footer */}
      <div style={{ marginTop: 28, textAlign: "center" }}>
        <p className="caption">Delight & Savor · Tend</p>
        <a href="https://delightandsavor.com" target="_blank" rel="noopener noreferrer"
          style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".06em", textDecoration: "none" }}>
          delightandsavor.com
        </a>
      </div>
    </div>
  );
}
