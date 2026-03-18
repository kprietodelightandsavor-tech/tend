import { CHAPTERS } from "../data/seed";

export default function MenuScreen({ onNavigate }) {
  return (
    <div className="screen">
      {/* Monogram / brand */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: "1.5px solid var(--sage-md)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <span className="serif" style={{ fontSize: 22, color: "var(--sage)" }}>LR</span>
        </div>
        <h1 className="display-sm serif">Living Rhythm</h1>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginTop: 4 }}>Planner</p>
      </div>

      <div className="rule-gold" />

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
      </div>

      <div className="rule" style={{ marginTop: 8 }} />

      {/* Philosophy card */}
      <div className="card-gold" style={{ marginTop: 4 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Philosophy</p>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>
          "Education is an atmosphere, a discipline, a life."
        </p>
        <p className="caption" style={{ marginTop: 8 }}>— Charlotte Mason</p>
      </div>

      <div style={{ marginTop: 28, textAlign: "center" }}>
        <p className="caption">Delight & Savor · Living Rhythm Planner</p>
        <p className="caption" style={{ marginTop: 4 }}>delightandsavor.com</p>
      </div>
    </div>
  );
}
