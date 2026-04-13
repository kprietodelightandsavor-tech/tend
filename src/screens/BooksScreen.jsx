import { useState, useEffect } from "react";

// ─── ALL CM FEAST SUBJECTS ─────────────────────────────────────────────────────
const CM_SUBJECTS = [
  {
    category: "The Humanities",
    color: "#7B9BB5",
    subjects: [
      "Living Literature",
      "Poetry",
      "Shakespeare",
      "Plutarch & Lives",
      "History & Biography",
      "Geography",
      "Citizenship & Civics",
    ],
  },
  {
    category: "Language & Composition",
    color: "#A9B786",
    subjects: [
      "Language Arts & Composition",
      "Copywork & Dictation",
      "Grammar",
      "Narration",
      "Read Aloud",
      "Spanish / Modern Language",
      "Latin",
    ],
  },
  {
    category: "Mathematics & Logic",
    color: "#B8935A",
    subjects: [
      "Mathematics",
      "Logic & Reasoning",
    ],
  },
  {
    category: "The Sciences",
    color: "#8A7A9E",
    subjects: [
      "Nature Study",
      "Natural History",
      "Science",
      "Botany",
      "Astronomy",
      "Earth Science",
    ],
  },
  {
    category: "The Arts & Beauty Loop",
    color: "#C0847A",
    subjects: [
      "Artist / Picture Study",
      "Composer Study",
      "Hymn Study",
      "Poet & Poetry Study",
      "Folk Song & Recitation",
      "Handicrafts",
      "Drawing & Watercolor",
      "Music & Instrument",
    ],
  },
  {
    category: "Formation & Habit",
    color: "#9B8EC4",
    subjects: [
      "Bible & Scripture",
      "Theology & Catechism",
      "Habit Training",
      "Morning Time",
    ],
  },
  {
    category: "Physical & Practical",
    color: "#6B8E7A",
    subjects: [
      "Outdoor Hours & Nature Walks",
      "Physical Education",
      "Practical Life Skills",
      "Cooking & Homemaking",
    ],
  },
];

const ALL_SUBJECTS = CM_SUBJECTS.flatMap(c => c.subjects);
const STATUS_LABELS = { current: "Reading Now", completed: "Completed", upcoming: "Up Next" };
const STATUS_COLORS = { current: "var(--sage)", completed: "var(--ink-faint)", upcoming: "var(--gold)" };

function getSchoolYear() {
  const y = new Date().getFullYear(), m = new Date().getMonth();
  return m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

const callBooks = async (body) => {
  const res = await fetch("/.netlify/functions/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
};

function AddBookSheet({ onClose, onSave, userId, schoolYear, students }) {
  const [subject, setSubject]   = useState(ALL_SUBJECTS[0]);
  const [title, setTitle]       = useState("");
  const [author, setAuthor]     = useState("");
  const [child, setChild]       = useState("All");
  const [status, setStatus]     = useState("current");
  const [saving, setSaving]     = useState(false);
  const childOptions = ["All", ...(students || []).map(s => s.name)];

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const result = await callBooks({ method: "add", userId, schoolYear, subject, title: title.trim(), author: author.trim() || null, childName: child, status });
      if (result.book) {
        onSave(result.book);
        onClose();
      } else {
        alert("Could not save: " + (result.error || "Unknown error"));
      }
    } catch (e) {
      alert("Save failed: " + e.message);
    }
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.45)", zIndex: 400 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "24px 24px 52px", maxHeight: "88dvh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 20px" }} />
        <p className="serif" style={{ fontSize: 20, marginBottom: 20 }}>Add a Book</p>

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Subject</p>
          <select value={subject} onChange={e => setSubject(e.target.value)}
            style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "8px 10px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--ink)", outline: "none" }}>
            {CM_SUBJECTS.map(cat => (
              <optgroup key={cat.category} label={cat.category}>
                {cat.subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </optgroup>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Title</p>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book or resource title"
            style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", outline: "none", padding: "4px 0 8px" }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Author <span style={{ opacity: 0.5 }}>(optional)</span></p>
          <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name"
            style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--rule)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink)", outline: "none", padding: "4px 0 8px" }} />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {childOptions.length > 1 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Child</p>
              <select value={child} onChange={e => setChild(e.target.value)}
                style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink)", outline: "none" }}>
                {childOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Status</p>
            <select value={status} onChange={e => setStatus(e.target.value)}
              style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink)", outline: "none" }}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        <button className="btn-sage" style={{ width: "100%" }} onClick={save} disabled={!title.trim() || saving}>
          {saving ? "Saving..." : "Add Book"}
        </button>
      </div>
    </div>
  );
}

export default function BooksScreen({ onNavigate, settings }) {
  const userId     = settings?.userId;
  const students   = settings?.students || [];
  const schoolYear = getSchoolYear();
  const [books, setBooks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [expanded, setExpanded]   = useState({});
  const [filterChild, setFilterChild] = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const childOptions = ["All", ...(students || []).map(s => s.name)];

  useEffect(() => {
    if (!userId) return;
    callBooks({ method: "list", userId, schoolYear })
      .then(({ books }) => { setBooks(books || []); setLoading(false); });
  }, [userId]);

  const markComplete = async (book) => {
    await callBooks({ method: "update", userId, bookId: book.id, status: "completed", finishedAt: new Date().toISOString().slice(0, 10) });
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: "completed", finished_at: new Date().toISOString().slice(0, 10) } : b));
  };

  const deleteBook = async (id) => {
    await callBooks({ method: "delete", userId, bookId: id });
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const filtered = books.filter(b => {
    if (filterChild !== "All" && b.child_name !== "All" && b.child_name !== filterChild) return false;
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    return true;
  });

  // Group by category
  const byCategory = CM_SUBJECTS.map(cat => ({
    ...cat,
    books: filtered.filter(b => cat.subjects.includes(b.subject)),
  })).filter(cat => cat.books.length > 0);

  const total     = filtered.length;
  const current   = filtered.filter(b => b.status === "current").length;
  const completed = filtered.filter(b => b.status === "completed").length;

  return (
    <div className="screen">
      <button onClick={() => onNavigate("menu")}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage)", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
        ← Menu
      </button>

      <p className="eyebrow" style={{ marginBottom: 6 }}>{schoolYear}</p>
      <h1 className="display serif" style={{ marginBottom: 4 }}>Books & Curriculum</h1>
      <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 20 }}>
        A living record of the books and resources that shaped this year's feast.
      </p>

      {/* Stats */}
      {total > 0 && (
        <div style={{ display: "flex", gap: 0, marginBottom: 20, border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
          {[
            { num: total,     label: "Total Books" },
            { num: current,   label: "Reading Now",  color: "var(--sage)" },
            { num: completed, label: "Completed",    color: "var(--ink-faint)" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 6px", borderRight: i < 2 ? "1px solid var(--rule)" : "none" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: s.color || "var(--ink)" }}>{s.num}</p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters + Add */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {childOptions.length > 1 && (
          <select value={filterChild} onChange={e => setFilterChild(e.target.value)}
            style={{ flex: 1, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink)", outline: "none" }}>
            {childOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ flex: 1, background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink)", outline: "none" }}>
          <option value="all">All Books</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={() => setShowAdd(true)} className="btn-sage" style={{ flexShrink: 0, padding: "0 16px" }}>
          + Add
        </button>
      </div>

      {/* Books by category */}
      {loading ? (
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", textAlign: "center", padding: "32px 0" }}>Loading...</p>
      ) : books.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-faint)", lineHeight: 1.8, marginBottom: 16 }}>
            No books yet — tap + Add to begin your curriculum record.
          </p>
          <p className="corm italic" style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.7 }}>
            Charlotte Mason called education a feast. This is where you set the table.
          </p>
        </div>
      ) : byCategory.length === 0 ? (
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", textAlign: "center", padding: "24px 0" }}>No books match this filter.</p>
      ) : byCategory.map(cat => (
        <div key={cat.category} style={{ marginBottom: 24 }}>
          {/* Category header */}
          <button onClick={() => setExpanded(e => ({ ...e, [cat.category]: !e[cat.category] }))}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: "0 0 8px", borderBottom: `2px solid ${cat.color}`, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: cat.color }}>{cat.category}</p>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)" }}>· {cat.books.length}</span>
            </div>
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)" }}>{expanded[cat.category] === false ? "↓" : "↑"}</span>
          </button>

          {expanded[cat.category] !== false && cat.books.map(book => (
            <div key={book.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--rule)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: STATUS_COLORS[book.status], background: book.status === "current" ? "var(--sage-bg)" : "transparent", border: `1px solid ${STATUS_COLORS[book.status]}`, borderRadius: 20, padding: "1px 6px", flexShrink: 0 }}>
                      {STATUS_LABELS[book.status]}
                    </span>
                    {book.child_name !== "All" && (
                      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 8, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.8 }}>{book.child_name}</span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 2 }}>{book.title}</p>
                  {book.author && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 13, color: "var(--ink-faint)" }}>{book.author}</p>}
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", color: "var(--ink-faint)", marginTop: 4, opacity: 0.7 }}>{book.subject}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 4 }}>
                  {book.status === "current" && (
                    <button onClick={() => markComplete(book)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sage)" }}>
                      Done
                    </button>
                  )}
                  <button onClick={() => deleteBook(book.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)" }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Empty state with all subjects if no books */}
      {books.length > 0 && filtered.length > 0 && (
        <div style={{ marginTop: 12, marginBottom: 40, textAlign: "center" }}>
          <p className="corm italic" style={{ fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.7 }}>
            Tap + Add to record another book for this year's feast.
          </p>
        </div>
      )}

      {showAdd && (
        <AddBookSheet
          onClose={() => setShowAdd(false)}
          onSave={book => setBooks(prev => [book, ...prev])}
          userId={userId}
          schoolYear={schoolYear}
          students={students}
        />
      )}
    </div>
  );
}
