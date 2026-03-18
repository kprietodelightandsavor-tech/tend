import { useState } from "react";
import { Ic } from "../components/Icons";
import { STUDENTS, STUDENT_NARRATIONS } from "../data/seed";

function stageCss(stage) {
  if (stage === "Find It")   return "find";
  if (stage === "Follow It") return "follow";
  return "frame";
}

function StudentDetail({ student, onBack }) {
  const narrations = STUDENT_NARRATIONS[student.id] || [];

  return (
    <div className="screen">
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--sage)", fontSize: 13, letterSpacing: ".08em",
          textTransform: "uppercase", fontFamily: "'Lato', sans-serif",
          marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
        }}
      >
        ← Students
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div className="student-avatar" style={{ background: student.color }}>
          <span>{student.initial}</span>
        </div>
        <div>
          <h2 className="serif" style={{ fontSize: 24 }}>{student.name}</h2>
          <p className="caption">{student.grade} grade</p>
        </div>
      </div>

      <div className="rule" />
      <p className="eyebrow" style={{ marginBottom: 14 }}>Narration History</p>

      {narrations.length === 0 && <p className="body italic">No narrations yet.</p>}
      {narrations.map((n, i) => (
        <div key={i} className="lily-entry">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p className="caption">{n.date} · {n.book}</p>
            <span className={`stage-badge stage-${stageCss(n.stage)}`} style={{ fontSize: 10 }}>
              {n.stage}
            </span>
          </div>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.7 }}>{n.text}</p>
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <button className="btn-ghost">Add Narration for {student.name}</button>
      </div>
    </div>
  );
}

export default function StudentsScreen() {
  const [activeIdx, setActiveIdx] = useState(null);

  if (activeIdx !== null) {
    return (
      <StudentDetail
        student={STUDENTS[activeIdx]}
        onBack={() => setActiveIdx(null)}
      />
    );
  }

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Family</p>
      <h1 className="display serif" style={{ marginBottom: 24 }}>Students</h1>

      {STUDENTS.map((s, i) => (
        <button
          key={s.id}
          onClick={() => setActiveIdx(i)}
          style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 16, padding: "16px 0",
            borderBottom: "1px solid var(--rule)", textAlign: "left",
          }}
        >
          <div className="student-avatar" style={{ background: s.color }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "white" }}>{s.initial}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p className="serif" style={{ fontSize: 18, color: "var(--ink)" }}>{s.name}</p>
            <p className="caption" style={{ marginTop: 3 }}>
              {s.grade} grade · {STUDENT_NARRATIONS[s.id]?.length || 0} narrations
            </p>
          </div>
          <Ic.Arrow />
        </button>
      ))}

      <p className="corm italic" style={{ textAlign: "center", marginTop: 32, fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7 }}>
        "Every child is a person."<br />— Charlotte Mason
      </p>
    </div>
  );
}
