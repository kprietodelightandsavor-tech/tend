import { useState } from "react";
import { Ic } from "../components/Icons";

const COLORS = ["#7A8F6F", "#B8935A", "#8A7A9E", "#6B8E9E", "#9E6B6B", "#7A9E8E"];
const GRADES = ["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

const NARRATION_STAGES = {
  "Find It":   "find",
  "Follow It": "follow",
  "Frame It":  "frame",
};

const SEED_STUDENTS = [
  { id: 1, name: "Nico",   color: "#7A8F6F", initial: "N", grade: "11th", narrations: [{ date: "March 14", text: "Macbeth sees the dagger and isn't sure if it's real. Shakespeare shows how guilt can make you see things that aren't there.", stage: "Frame It", book: "Macbeth" }] },
  { id: 2, name: "Emma",   color: "#B8935A", initial: "E", grade: "9th",  narrations: [{ date: "March 13", text: "The dagger leads him toward Duncan's room. He knows what he's about to do is wrong but he goes anyway.", stage: "Follow It", book: "Macbeth" }] },
  { id: 3, name: "Marcos", color: "#8A7A9E", initial: "M", grade: "7th",  narrations: [{ date: "March 12", text: "Macbeth talks to himself a lot. He seems scared of what he's going to do.", stage: "Find It", book: "Macbeth" }] },
];

// ─── ADD STUDENT SHEET ────────────────────────────────────────────────────────
function AddStudentSheet({ onSave, onClose }) {
  const [name, setName]   = useState("");
  const [grade, setGrade] = useState("7th");
  const [color, setColor] = useState(COLORS[0]);

  const save = () => {
    if (!name.trim()) return;
    onSave({
      id: Date.now(),
      name: name.trim(),
      initial: name.trim()[0].toUpperCase(),
      grade, color,
      narrations: [],
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }}
      onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 20 }}>Add a Student</p>

        <input className="input-line" placeholder="Student's name"
          value={name} onChange={e => setName(e.target.value)}
          style={{ marginBottom: 20, fontSize: 18, fontFamily: "'Playfair Display', serif" }}
          autoFocus />

        <p className="eyebrow" style={{ marginBottom: 10 }}>Grade</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {GRADES.map(g => (
            <button key={g} onClick={() => setGrade(g)}
              style={{
                padding: "6px 12px", borderRadius: 2,
                border: `1px solid ${grade === g ? "var(--sage)" : "var(--rule)"}`,
                background: grade === g ? "var(--sage-bg)" : "none",
                cursor: "pointer", fontSize: 12,
                fontFamily: "'Lato', sans-serif",
                color: grade === g ? "var(--sage)" : "var(--ink-faint)",
              }}>
              {g}
            </button>
          ))}
        </div>

        <p className="eyebrow" style={{ marginBottom: 10 }}>Color</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              style={{
                width: 32, height: 32, borderRadius: "50%", background: c,
                border: color === c ? "3px solid var(--ink)" : "3px solid transparent",
                cursor: "pointer", transition: "border .2s",
              }} />
          ))}
        </div>

        <button className="btn-sage" style={{ width: "100%" }} onClick={save}
          disabled={!name.trim()}>
          Add {name.trim() || "Student"}
        </button>
      </div>
    </div>
  );
}

// ─── ADD NARRATION SHEET ──────────────────────────────────────────────────────
function AddNarrationSheet({ studentName, onSave, onClose }) {
  const [text, setText]   = useState("");
  const [book, setBook]   = useState("");
  const [stage, setStage] = useState("Find It");

  const save = () => {
    if (!text.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
    onSave({ date: today, text, book, stage });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.42)", zIndex: 200 }}
      onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "28px 28px 48px", maxHeight: "88dvh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 20 }}>
          Add Narration for {studentName}
        </p>

        <input className="input-line" placeholder="Book or subject"
          value={book} onChange={e => setBook(e.target.value)}
          style={{ marginBottom: 16 }} />

        <p className="eyebrow" style={{ marginBottom: 10 }}>Stage</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {Object.keys(NARRATION_STAGES).map(s => (
            <button key={s} onClick={() => setStage(s)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 20,
                border: `1px solid ${stage === s ? "var(--sage)" : "var(--rule)"}`,
                background: stage === s ? "var(--sage-bg)" : "none",
                cursor: "pointer", fontSize: 11,
                fontFamily: "'Lato', sans-serif", letterSpacing: ".08em",
                color: stage === s ? "var(--sage)" : "var(--ink-faint)",
              }}>
              {s}
            </button>
          ))}
        </div>

        <textarea className="textarea" placeholder="The narration, in the student's own words…"
          value={text} onChange={e => setText(e.target.value)} rows={5}
          style={{ marginBottom: 20 }} />

        <button className="btn-sage" style={{ width: "100%" }} onClick={save}
          disabled={!text.trim()}>
          Save Narration
        </button>
      </div>
    </div>
  );
}

// ─── STUDENT DETAIL ───────────────────────────────────────────────────────────
function StudentDetail({ student, onBack, onAddNarration, onDelete }) {
  const [showAddNarration, setShowAddNarration] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="screen">
      <button onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
        ← Students
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: student.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "white" }}>{student.initial}</span>
          </div>
          <div>
            <h2 className="serif" style={{ fontSize: 24 }}>{student.name}</h2>
            <p className="caption">{student.grade} grade</p>
          </div>
        </div>
        <button onClick={() => setShowDeleteConfirm(true)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "var(--red)", fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>
          Remove
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="card" style={{ marginBottom: 20, border: "1px solid #E8C4BB" }}>
          <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-lt)", marginBottom: 14, lineHeight: 1.7 }}>
            Remove {student.name} from Tend? Their narration history will be lost.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onDelete}
              style={{ flex: 1, background: "var(--red)", border: "none", borderRadius: 2, padding: "10px 0", cursor: "pointer", color: "white", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase" }}>
              Remove
            </button>
            <button className="btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ height: 1, background: "var(--rule)", marginBottom: 20 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p className="eyebrow">Narration History</p>
        <button onClick={() => setShowAddNarration(true)}
          style={{ background: "none", border: "1px solid var(--sage-md)", borderRadius: 2, padding: "5px 12px", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)" }}>
          + Add
        </button>
      </div>

      {student.narrations.length === 0 && (
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", lineHeight: 1.7 }}>
          No narrations yet. Begin after your next read-aloud.
        </p>
      )}

      {student.narrations.map((n, i) => (
        <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p className="caption">{n.date}{n.book ? ` · ${n.book}` : ""}</p>
            <span className={`stage-badge stage-${NARRATION_STAGES[n.stage] || "find"}`} style={{ fontSize: 10 }}>
              {n.stage}
            </span>
          </div>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.7 }}>{n.text}</p>
        </div>
      ))}

      {showAddNarration && (
        <AddNarrationSheet
          studentName={student.name}
          onSave={(narration) => { onAddNarration(student.id, narration); setShowAddNarration(false); }}
          onClose={() => setShowAddNarration(false)}
        />
      )}
    </div>
  );
}

// ─── STUDENTS SCREEN ──────────────────────────────────────────────────────────
export default function StudentsScreen() {
  const [students, setStudents]     = useState(SEED_STUDENTS);
  const [activeIdx, setActiveIdx]   = useState(null);
  const [showAdd, setShowAdd]       = useState(false);

  const addStudent = (student) => setStudents(prev => [...prev, student]);

  const removeStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setActiveIdx(null);
  };

  const addNarration = (studentId, narration) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, narrations: [narration, ...s.narrations] } : s
    ));
  };

  if (activeIdx !== null) {
    const student = students[activeIdx];
    if (!student) { setActiveIdx(null); return null; }
    return (
      <StudentDetail
        student={student}
        onBack={() => setActiveIdx(null)}
        onAddNarration={addNarration}
        onDelete={() => removeStudent(student.id)}
      />
    );
  }

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Family</p>
      <h1 className="display serif" style={{ marginBottom: 24 }}>Students</h1>

      {students.map((s, i) => (
        <button key={s.id} onClick={() => setActiveIdx(i)}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--rule)", textAlign: "left" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "white" }}>{s.initial}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{s.name}</p>
            <p className="caption" style={{ marginTop: 3 }}>
              {s.grade} grade · {s.narrations.length} narration{s.narrations.length !== 1 ? "s" : ""}
            </p>
          </div>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      ))}

      {/* Add student */}
      <button onClick={() => setShowAdd(true)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0", marginTop: 8, background: "none", border: "1px dashed var(--rule)", borderRadius: 3, cursor: "pointer", color: "var(--ink-faint)", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
        + Add a student
      </button>

      <p className="corm italic" style={{ textAlign: "center", marginTop: 32, fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7 }}>
        "Every child is a person."<br />— Charlotte Mason
      </p>

      {showAdd && (
        <AddStudentSheet
          onSave={addStudent}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
