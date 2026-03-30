import { useState } from "react";

const FORMS = ["Form 1", "Form 2", "Form 3", "Form 4-6"];

function getSchoolYear() {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  return m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

function StatusDot({ status }) {
  const colors = { strong: "#A9B786", adequate: "#C29B61", light: "#C0847A" };
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: colors[status] || "#ccc", marginRight: 6, flexShrink: 0, marginTop: 4 }} />;
}

function printReport(data, students) {
  const { subjectHours, totalHours, outdoorHours, uniqueDays, evaluation, narrative, schoolYear, childName, formLevel } = data;

  const evalRows = Object.entries(evaluation).map(([, e]) => `
    <div class="eval-row">
      <div class="eval-dot ${e.status}"></div>
      <div class="eval-content">
        <p class="eval-label">${e.label}</p>
        <div class="eval-bar-wrap"><div class="eval-bar" style="width:${Math.round(e.pct * 100)}%"></div></div>
        <p class="eval-nums">${e.actual}h of ~${Math.round(e.expected)}h expected · <em>${e.status}</em></p>
      </div>
    </div>`).join('');

  const subjectRows = Object.entries(subjectHours)
    .sort((a, b) => b[1] - a[1])
    .map(([sub, hrs]) => `<div class="subj-row"><span>${sub}</span><span>${hrs}h</span></div>`)
    .join('');

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <title>Annual Report · ${childName} · ${schoolYear}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Lato',sans-serif;background:#faf6ee;color:#2C2A27;padding:40px;max-width:780px;margin:0 auto;font-size:12px;}
    .header{text-align:center;margin-bottom:36px;padding-bottom:24px;border-bottom:2px solid #A9B786;}
    .ds-mark{font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#A9B786;margin-bottom:8px;}
    h1{font-family:'Playfair Display',serif;font-size:28px;font-weight:400;margin-bottom:4px;}
    .meta{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#A8A49E;margin-top:6px;}
    .stats{display:flex;gap:0;margin-bottom:32px;border:1px solid #e8e4dc;border-radius:3px;overflow:hidden;}
    .stat{flex:1;text-align:center;padding:14px 8px;border-right:1px solid #e8e4dc;}
    .stat:last-child{border-right:none;}
    .stat-num{font-family:'Playfair Display',serif;font-size:24px;color:#A9B786;}
    .stat-label{font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:#A8A49E;margin-top:3px;}
    .section{margin-bottom:28px;}
    .section-title{font-family:'Lato',sans-serif;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:#A9B786;border-bottom:2px solid #A9B786;padding-bottom:5px;margin-bottom:14px;}
    .narrative{font-family:'Cormorant Garamond',serif;font-size:15px;line-height:1.85;color:#2C2A27;}
    .narrative p{margin-bottom:14px;}
    .eval-row{display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;}
    .eval-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px;}
    .eval-dot.strong{background:#A9B786;}
    .eval-dot.adequate{background:#C29B61;}
    .eval-dot.light{background:#C0847A;}
    .eval-content{flex:1;}
    .eval-label{font-family:'Playfair Display',serif;font-size:12px;color:#2C2A27;margin-bottom:3px;}
    .eval-bar-wrap{height:3px;background:#e8e4dc;border-radius:2px;margin-bottom:3px;}
    .eval-bar{height:3px;background:#A9B786;border-radius:2px;}
    .eval-nums{font-size:9px;color:#A8A49E;font-style:italic;}
    .subj-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f0ece4;font-size:11px;}
    .subj-row span:first-child{color:#2C2A27;}
    .subj-row span:last-child{color:#A9B786;font-family:'Playfair Display',serif;}
    .footer{margin-top:36px;padding-top:16px;border-top:1px solid #e8e4dc;text-align:center;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#A8A49E;}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
    @media print{body{background:white;padding:24px;} .stats{page-break-inside:avoid;}}
  </style></head><body>
  <div class="header">
    <p class="ds-mark">Delight & Savor · Tend</p>
    <h1>Annual Academic Report</h1>
    <p class="meta">${childName || 'Student'} · ${formLevel} · ${schoolYear}</p>
  </div>

  <div class="stats">
    <div class="stat"><p class="stat-num">${uniqueDays}</p><p class="stat-label">Days Taught</p></div>
    <div class="stat"><p class="stat-num">${totalHours}h</p><p class="stat-label">Academic Hours</p></div>
    <div class="stat"><p class="stat-num">${outdoorHours}h</p><p class="stat-label">Outdoor Hours</p></div>
  </div>

  <div class="two-col">
    <div class="section">
      <p class="section-title">CM Sufficiency Evaluation</p>
      ${evalRows}
    </div>
    <div class="section">
      <p class="section-title">Hours by Subject</p>
      ${subjectRows}
    </div>
  </div>

  <div class="section">
    <p class="section-title">Annual Narrative Transcript</p>
    <div class="narrative">${narrative.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
  </div>

  <div class="footer">Prepared with Tend by Delight & Savor · tend-ds.netlify.app · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
  </body></html>`);
  win.document.close();
  win.print();
}

export default function AnnualReportScreen({ onNavigate, settings }) {
  const userId   = settings?.userId;
  const isPaid   = settings?.isPaid || false;
  const students = settings?.students || [];

  const [childName, setChildName]   = useState(students[0]?.name || "All");
  const [formLevel, setFormLevel]   = useState(students[0]?.form || "Form 2");
  const [schoolYear, setSchoolYear] = useState(getSchoolYear());
  const [loading, setLoading]       = useState(false);
  const [report, setReport]         = useState(null);
  const [error, setError]           = useState(null);

  const childOptions = ["All", ...students.map(s => s.name)];

  const generate = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/.netlify/functions/annual-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          schoolYear,
          childName: childName === "All" ? null : childName,
          formLevel,
          outdoorMinutes: settings?.outdoorMinutes || 0,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const STATUS_LABELS = { strong: "Strong", adequate: "Adequate", light: "Light" };
  const STATUS_COLORS = { strong: "var(--sage)", adequate: "var(--gold)", light: "#C0847A" };

  if (!isPaid) {
    return (
      <div className="screen">
        <button onClick={() => onNavigate("menu")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <- Menu
        </button>
        <p className="eyebrow" style={{ marginBottom: 6 }}>Premium Feature</p>
        <h1 className="display serif" style={{ marginBottom: 16 }}>Annual Report</h1>
        <div style={{ background: "var(--gold-bg)", border: "1px solid #E0CBA8", borderRadius: 4, padding: "20px 18px", marginBottom: 20 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--gold)", marginBottom: 10 }}>Unlock with Tend Premium</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 16 }}>
            The Annual Report generates a beautiful CM-style transcript for each child — including subject hours, a sufficiency evaluation against Charlotte Mason guidelines, and a narrative transcript written in CM voice.
          </p>
          <a href="https://delightnsavor.gumroad.com/l/qrxxi" target="_blank" rel="noreferrer"
            style={{ display: "block", background: "var(--gold)", color: "white", textAlign: "center", padding: "12px 0", borderRadius: 2, fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", textDecoration: "none" }}>
            Get Tend Premium - $47/year
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <button onClick={() => onNavigate("menu")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        <- Menu
      </button>

      <p className="eyebrow" style={{ marginBottom: 6 }}>End of Year</p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>Annual Report</h1>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 24 }}>
        A Charlotte Mason sufficiency evaluation and narrative transcript — drawn from your teaching record.
      </p>

      {/* Setup */}
      <div className="card" style={{ marginBottom: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Report Settings</p>

        {/* School year */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>School Year</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["2024-2025", "2025-2026", "2026-2027"].map(y => (
              <button key={y} onClick={() => setSchoolYear(y)}
                style={{ flex: 1, padding: "8px 0", borderRadius: 2, border: `1px solid ${schoolYear === y ? "var(--sage)" : "var(--rule)"}`, background: schoolYear === y ? "var(--sage-bg)" : "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", color: schoolYear === y ? "var(--sage)" : "var(--ink-faint)" }}>
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Child */}
        {childOptions.length > 1 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Child</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {childOptions.map(c => (
                <button key={c} onClick={() => setChildName(c)}
                  style={{ padding: "7px 14px", borderRadius: 2, border: `1px solid ${childName === c ? "var(--sage)" : "var(--rule)"}`, background: childName === c ? "var(--sage-bg)" : "none", cursor: "pointer", fontFamily: "'Playfair Display', serif", fontSize: 14, color: childName === c ? "var(--sage)" : "var(--ink)" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form level */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>CM Form Level</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FORMS.map(f => (
              <button key={f} onClick={() => setFormLevel(f)}
                style={{ padding: "7px 14px", borderRadius: 2, border: `1px solid ${formLevel === f ? "var(--sage)" : "var(--rule)"}`, background: formLevel === f ? "var(--sage-bg)" : "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", color: formLevel === f ? "var(--sage)" : "var(--ink-faint)" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-sage" style={{ width: "100%" }} onClick={generate} disabled={loading}>
          {loading ? "Generating report..." : "Generate Annual Report"}
        </button>
        {loading && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", textAlign: "center", marginTop: 10 }}>
            Gathering your year's work and writing the transcript...
          </p>
        )}
        {error && (
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#C0847A", marginTop: 10 }}>Error: {error}</p>
        )}
      </div>

      {/* Report */}
      {report && (
        <>
          {/* Stats bar */}
          <div style={{ display: "flex", gap: 0, marginBottom: 20, border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
            {[
              { num: report.uniqueDays, label: "Days Taught" },
              { num: `${report.totalHours}h`, label: "Academic Hours" },
              { num: `${report.outdoorHours}h`, label: "Outdoor Hours" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "14px 8px", borderRight: i < 2 ? "1px solid var(--rule)" : "none" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--sage)" }}>{s.num}</p>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* CM Sufficiency */}
          <div className="card" style={{ marginBottom: 20 }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>CM Sufficiency Evaluation</p>
            {Object.entries(report.evaluation).map(([key, e]) => (
              <div key={key} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                <StatusDot status={e.status} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)" }}>{e.label}</p>
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: STATUS_COLORS[e.status] }}>{STATUS_LABELS[e.status]}</span>
                  </div>
                  <div style={{ height: 3, background: "var(--rule)", borderRadius: 2, marginBottom: 4 }}>
                    <div style={{ height: 3, width: `${Math.round(e.pct * 100)}%`, background: STATUS_COLORS[e.status], borderRadius: 2, transition: "width .5s ease" }} />
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)" }}>
                    {e.actual}h of ~{Math.round(e.expected)}h expected
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Subject hours */}
          <div className="card" style={{ marginBottom: 20 }}>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Hours by Subject</p>
            {Object.entries(report.subjectHours).sort((a, b) => b[1] - a[1]).map(([sub, hrs]) => (
              <div key={sub} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--rule)" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)" }}>{sub}</p>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "var(--sage)", letterSpacing: ".06em" }}>{hrs}h</p>
              </div>
            ))}
          </div>

          {/* Narrative transcript */}
          <div className="card" style={{ marginBottom: 20 }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Annual Narrative Transcript</p>
            {report.narrative.split('\n\n').filter(p => p.trim()).map((para, i) => (
              <p key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, lineHeight: 1.85, color: "var(--ink)", marginBottom: 16 }}>{para}</p>
            ))}
          </div>

          {/* Print button */}
          <button onClick={() => printReport(report)} className="btn-sage" style={{ width: "100%", marginBottom: 40 }}>
            Print / Export PDF
          </button>
        </>
      )}
    </div>
  );
}
