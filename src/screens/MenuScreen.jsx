import SproutMark from "../components/SproutMark";
import { CHAPTERS } from "../data/seed";

export default function MenuScreen({ onNavigate }) {
  return (
    <div className="screen">

      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <SproutMark size={64} />
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
            {/* Placeholder icon — replace with In the Margin icon once shared */}
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "var(--sage)", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* In the Margin icon will go here */}
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                <line x1="9" y1="7" x2="15" y2="7"/>
                <line x1="9" y1="11" x2="15" y2="11"/>
              </svg>
            </div>

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
