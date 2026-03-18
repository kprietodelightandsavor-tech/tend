import { useState } from "react";
import { Ic } from "./Icons";

// ─── BOTTOM SHEET MODAL ───────────────────────────────────────────────────────
export function Sheet({ onClose, children }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}

// ─── COLLAPSIBLE SECTION ──────────────────────────────────────────────────────
export function CollapseSection({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "12px 0", borderTop: "1px solid var(--rule)",
          color: "var(--ink-faint)", fontSize: 11, letterSpacing: ".12em",
          textTransform: "uppercase", fontFamily: "'Lato', sans-serif",
        }}
      >
        <span>{label}</span>
        <Ic.Chevron open={open} />
      </button>
      <div className={`collapse ${open ? "open" : "closed"}`}>
        <div style={{ paddingTop: 12, paddingBottom: 4 }}>{children}</div>
      </div>
    </div>
  );
}
