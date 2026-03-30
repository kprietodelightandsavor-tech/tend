import { useState, useEffect } from "react";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const callLog = async (body) => {
  const res = await fetch("/.netlify/functions/teaching-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getSchoolYear() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

function weekRange(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  mon.setHours(0, 0, 0, 0);
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 6);
  fri.setHours(23, 59, 59, 999);
  return { start: mon, end: fri };
}

function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function fmtWeekLabel(offset) {
  if (offset === 0) return "This Week";
  if (offset === -1) return "Last Week";
  const { start } = weekRange(offset);
  return start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const SUBJECTS = ["All Subjects", "Math", "Language Arts", "History", "Science", "Geography",
  "Nature Study", "Read Aloud", "Spanish", "Co-op", "Living Literature", "Bible", "Other"];

const SKIP_SUBJECTS = ["Rise & Shine", "Lunch", "Outdoor Break", "Afternoon Pursuits",
  "House Reset & Animal Chores", "Tuesday Rhythm", "Tennis"];

// ─── PRINT HELPER ─────────────────────────────────────────────────────────────
function printReport(records, weekLabel, filterChild, filterSubject) {
  const byDate = {};
  records.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r);
  });

  const rows = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) => `
    <div class="day">
      <p class="day-label">${fmtDate(date)}</p>
      <div class="blocks">
        ${items.map(r => `
          <div class="block ${r.status === 'skipped' ? 'skipped' : ''}">
            <span class="subj">${r.subject}</span>
            ${r.time_block ? `<span class="time">${r.time_block}</span>` : ""}
            ${r.note ? `<span class="note">${r.note}</span>` : ""}
            ${r.status === "skipped" ? `<span class="skip-badge">skipped</span>` : ""}
          </div>`).join("")}
      </div>
    </div>`).join("");

  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>Teaching Record · ${weekLabel}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Lato:wght@300;400&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Lato',sans-serif;background:#faf6ee;color:#2C2A27;padding:32px;max-width:760px;margin:0 auto;}
      h1{font-family:'Playfair Display',serif;font-size:24px;font-weight:400;margin-bottom:4px;}
      .meta{font-size:11px;color:#A8A49E;letter-spacing:.1em;text-transform:uppercase;margin-bottom:28px;}
      .day{margin-bottom:24px;page-break-inside:avoid;}
      .day-label{font-family:'Lato',sans-serif;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#A9B786;font-weight:700;padding-bottom:6px;border-bottom:2px solid #A9B786;margin-bottom:10px;}
      .blocks{display:flex;flex-direction:column;gap:6px;}
      .block{display:flex;align-items:baseline;gap:10px;padding:5px 0;border-bottom:1px solid #e8e4dc;}
      .block.skipped{opacity:.45;}
      .subj{font-family:'Playfair Display',serif;font-size:14px;color:#2C2A27;flex:1;}
      .time{font-family:'Lato',sans-serif;font-size:10px;color:#A8A49E;width:40px;flex-shrink:0;}
      .note{font-family:'Cormorant Garamond',serif;font-size:12px;font-style:italic;color:#9a9488;}
      .skip-badge{font-family:'Lato',sans-serif;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#B8935A;margin-left:8px;}
      .footer{margin-top:32px;padding-top:16px;border-top:1px solid #e8e4dc;font-size:10px;color:#A8A49E;text-align:center;}
      @media print{body{background:white;padding:20px;}}
    </style></head><body>
    <h1>Teaching Record</h1>
    <p class="meta">${weekLabel}${filterChild !== "All" ? ` · ${filterChild}` : ""}${filterSubject !== "All Subjects" ? ` · ${filterSubject}` : ""} · ${getSchoolYear()}</p>
    ${rows || "<p style='font-family:Cormorant Garamond,serif;font-style:italic;color:#A8A49E;'>No records for this period.</p>"}
    <p class="footer">Delight & Savor · Tend · tend-ds.netlify.app</p>
    </body></html>`);
  win.document.close();
  win.print();
}

// ─── SCREEN ───────────────────────────────────────────────────────────────────
export default function TeachingLogScreen({ onNavigate, settings }) {
  const userId      = settings?.userId;
  const schoolYear  = getSchoolYear();
  const students    = settings?.students || [];
  const childOptions = ["All", ...students.map(s => s.name)];

  const [records, setRecords]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterChild, setFilterChild]     = useState("All");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [editingId, setEditingId]   = useState(null);
  const [editNote, setEditNote]     = useState("");

  const { start, end } = weekRange(weekOffset);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    callLog({
      method:     "list",
      userId,
      schoolYear,
      startDate:  start.toISOString().slice(0, 10),
      endDate:    end.toISOString().slice(0, 10),
    }).then(({ records }) => { setRecords(records || []); setLoading(false); });
  }, [userId, weekOffset]);

  const filtered = records.filter(r => {
    if (filterChild !== "All" && r.child_name !== "All" && r.child_name !== filterChild) return false;
    if (filterSubject !== "All Subjects" && r.subject !== filterSubject) return false;
    return true;
  });

  const byDate = {};
  filtered.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r);
  });

  const saveNote = async (id) => {
    await callLog({ method: "update-note", userId, recordId: id, note: editNote });
    setRecords(prev => prev.map(r => r.id === id ? { ...r, note: editNote } : r));
    setEditingId(null);
  };

  const deleteRecord = async (id) => {
    await callLog({ method: "delete-record", userId, recordId: id });
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const completed = filtered.filter(r => r.status === "completed").length;
  const skipped   = filtered.filter(r => r.status === "skipped").length;

  return (
    <div className="screen">
      <button onClick={() => onNavigate("menu")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Menu
      </button>

      <p className="eyebrow" style={{ marginBottom: 6 }}>{schoolYear} · Teaching Record</p>
      <h1 className="display serif" style={{ marginBottom: 20 }}>What We Did</h1>

      {/* Week navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => setWeekOffset(w => w - 1)}
          style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "6px 12px", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          ← Prev
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "var(--ink)" }}>{fmtWeekLabel(weekOffset)}</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)", letterSpacing: ".08em", marginTop: 2 }}>
            {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
        <button onClick={() => setWeekOffset(w => Math.min(w + 1, 0))}
          disabled={weekOffset === 0}
          style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "6px 12px", cursor: weekOffset === 0 ? "default" : "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: weekOffset === 0 ? "var(--rule)" : "var(--ink-faint)" }}>
          Next →
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, padding: "10px 14px", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 3 }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--sage)" }}>{completed}</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>Completed</p>
        </div>
        <div style={{ width: 1, background: "var(--sage-md)" }} />
        <div style={{ textAlign: "center", flex: 1 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--gold)" }}>{skipped}</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)" }}>Skipped</p>
        </div>
        <div style={{ width: 1, background: "var(--sage-md)" }} />
        <div style={{ textAlign: "center", flex: 1 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--ink)" }}>{Object.keys(byDate).length}</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Days</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {childOptions.length > 1 && (
          <select value={filterChild} onChange={e => setFilterChild(e.target.value)}
            style={{ flex: 1, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink)", outline: "none" }}>
            {childOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
          style={{ flex: 2, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink)", outline: "none" }}>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => printReport(filtered, fmtWeekLabel(weekOffset), filterChild, filterSubject)}
          style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)", flexShrink: 0 }}>
          Print
        </button>
      </div>

      {/* Records */}
      {loading ? (
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", textAlign: "center", padding: "32px 0" }}>Loading…</p>
      ) : Object.keys(byDate).length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 8 }}>
            No records for this week yet.
          </p>
          <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7 }}>
            Check off subjects on the Home screen and they'll appear here automatically.
          </p>
        </div>
      ) : Object.entries(byDate).map(([date, items]) => (
        <div key={date} style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--sage)", borderBottom: "2px solid var(--sage)", paddingBottom: 6, marginBottom: 10 }}>
            {fmtDate(date)}
          </p>
          {items.map(r => (
            <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--rule)", opacity: r.status === "skipped" ? 0.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: r.note ? 3 : 0 }}>
                    {r.time_block && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)", width: 36, flexShrink: 0 }}>{r.time_block}</span>}
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "var(--ink)", textDecoration: r.status === "skipped" ? "line-through" : "none" }}>{r.subject}</span>
                    {r.status === "skipped" && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)" }}>skipped</span>}
                  </div>
                  {editingId === r.id ? (
                    <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                      <input value={editNote} onChange={e => setEditNote(e.target.value)}
                        placeholder="Add a note…"
                        style={{ flex: 1, background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink)", outline: "none", padding: "2px 0" }}
                        onKeyDown={e => e.key === "Enter" && saveNote(r.id)}
                        autoFocus />
                      <button onClick={() => saveNote(r.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 9, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Cancel</button>
                    </div>
                  ) : r.note ? (
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)", marginTop: 3, lineHeight: 1.5 }}
                      onClick={() => { setEditingId(r.id); setEditNote(r.note); }}>
                      ✦ {r.note}
                    </p>
                  ) : null}
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  <button onClick={() => { setEditingId(r.id); setEditNote(r.note || ""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sage)" }}>
                    Note
                  </button>
                  <button onClick={() => deleteRecord(r.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
