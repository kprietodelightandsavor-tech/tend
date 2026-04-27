import { useState, useEffect, useRef } from "react";
import "./styles/globals.css";
import { supabase } from "./lib/supabase";

import BottomNav        from "./components/BottomNav";
import OnboardingScreen from "./screens/OnboardingScreen";
import HomeScreen       from "./screens/HomeScreen";
import PlannerScreen    from "./screens/PlannerScreen";
import NarrationScreen  from "./screens/NarrationScreen";
import OutdoorsScreen   from "./screens/OutdoorsScreen";
import HabitsScreen     from "./screens/HabitScreen";
import LiliesScreen     from "./screens/LiliesScreen";
import StudentsScreen   from "./screens/StudentsScreen";
import MenuScreen       from "./screens/MenuScreen";
import SettingsScreen   from "./screens/SettingsScreen";
import NatureStudyScreen from "./screens/NatureStudyScreen";
import TeachingLogScreen from "./screens/TeachingLogScreen";
import AnnualReportScreen from "./screens/AnnualReportScreen";
import BooksScreen from "./screens/BooksScreen";
import BibleReadingScreen from "./screens/BibleReadingScreen";
import BeautyLoopEditorScreen from "./screens/BeautyLoopEditorScreen";
import MemoryBookScreen from "./screens/MemoryBookScreen";

const NAV_SCREENS = ["home", "planner", "narration", "menu"];

// ─── QUICK NOTES ─────────────────────────────────────────────────────────────
const NOTES_KEY = "tend_quick_notes";
const SUBJECTS  = ["General", "Math", "Language Arts", "History", "Science", "Geography", "Nature Study", "Read Aloud", "Spanish", "Co-op", "Other"];

function QuickNotesSheet({ onClose, students, userId }) {
  const [notes, setNotes]         = useState([]);
  const [text, setText]           = useState("");
  const [subject, setSubject]     = useState("General");
  const [child, setChild]         = useState("All");
  const [listening, setListening] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState("add");
  const recogRef                  = useRef(null);

  const childOptions = ["All", ...(students || []).map(s => s.name)];
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const hasVoice = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const voiceOk  = hasVoice && !isSafari;

  const callNotes = async (body) => {
    const res = await fetch("/.netlify/functions/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  // Load notes on open
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    callNotes({ method: "list", userId })
      .then(({ notes }) => { setNotes(notes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r  = new SR();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setText(t); };
    r.onerror = r.onend = () => setListening(false);
    recogRef.current = r; r.start(); setListening(true);
  };
  const stopListening = () => { recogRef.current?.stop(); setListening(false); };

  const save = async () => {
    if (!text.trim() || !userId) return;
    setSaving(true);
    const { note, error } = await callNotes({ method: "insert", userId, text: text.trim(), subject, childName: child });
    if (note) {
      setNotes(prev => [note, ...prev]);
      setText("");
      setView("list");
    }
    if (error) console.error("Note save error:", error);
    setSaving(false);
  };

  const deleteNote = async (id) => {
    await callNotes({ method: "delete", userId, noteId: id });
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,39,.45)", zIndex: 400 }} onClick={onClose}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "var(--cream)", borderRadius: "12px 12px 0 0", padding: "24px 24px 52px", maxHeight: "88dvh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 3, background: "var(--rule)", borderRadius: 2, margin: "0 auto 20px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <p className="serif" style={{ fontSize: 20 }}>Quick Notes</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["add", "list"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${view === v ? "var(--sage)" : "var(--rule)"}`, background: view === v ? "var(--sage-bg)" : "none", cursor: "pointer", fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: view === v ? "var(--sage)" : "var(--ink-faint)" }}>
                {v === "add" ? "+ Add" : `Notes (${notes.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* ADD VIEW */}
        {view === "add" && (
          <>
            {/* Tags */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Subject</p>
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink)", outline: "none" }}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {childOptions.length > 1 && (
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 6 }}>Child</p>
                  <select value={child} onChange={e => setChild(e.target.value)}
                    style={{ width: "100%", background: "none", border: "1px solid var(--rule)", borderRadius: 2, padding: "7px 8px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "var(--ink)", outline: "none" }}>
                    {childOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Text area */}
            <textarea className="textarea" placeholder="What do you want to remember?"
              value={text} onChange={e => setText(e.target.value)} rows={4}
              style={{ marginBottom: 14 }} />

            {/* Voice + Save */}
            <div style={{ display: "flex", gap: 10 }}>
              {voiceOk && (
                <button onClick={listening ? stopListening : startListening}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: listening ? "#c0392b" : "var(--sage-bg)", border: `1px solid ${listening ? "#c0392b" : "var(--sage-md)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={listening ? "white" : "var(--sage)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                    <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                  </svg>
                </button>
              )}
              {!voiceOk && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 12, color: "var(--ink-faint)", alignSelf: "center" }}>
                  Voice requires Chrome
                </p>
              )}
              <button className="btn-sage" style={{ flex: 1 }} onClick={save} disabled={!text.trim() || saving}>
                {saving ? "Saving…" : "Save Note"}
              </button>
            </div>
          </>
        )}

        {/* LIST VIEW */}
        {view === "list" && (
          <>
            {loading ? (
              <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", textAlign: "center", padding: "24px 0" }}>Loading notes…</p>
            ) : notes.length === 0 ? (
              <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)", textAlign: "center", padding: "24px 0", lineHeight: 1.7 }}>
                No notes yet. Tap + Add to capture something.
              </p>
            ) : notes.map(n => (
              <div key={n.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--rule)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 20, padding: "2px 7px" }}>{n.subject}</span>
                    {n.child_name !== "All" && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", background: "var(--gold-bg)", border: "1px solid #E0CBA8", borderRadius: 20, padding: "2px 7px" }}>{n.child_name}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)" }}>{formatDate(n.created_at)}</p>
                    <button onClick={() => deleteNote(n.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: 11, fontFamily: "'Lato', sans-serif", padding: 0 }}>✕</button>
                  </div>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "var(--ink)", lineHeight: 1.7 }}>{n.text}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const SCREENS = {
  home:      HomeScreen,
  planner:   PlannerScreen,
  narration: NarrationScreen,
  outdoors:  OutdoorsScreen,
  habits:    HabitsScreen,
  lilies:    LiliesScreen,
  students:  StudentsScreen,
  menu:      MenuScreen,
  settings:  SettingsScreen,
  naturestudy:  NatureStudyScreen,
  teachinglog:  TeachingLogScreen,
  annualreport: AnnualReportScreen,
  books:        BooksScreen,
  scripture:    BibleReadingScreen,
  case "beauty-loop-editor":
        return <BeautyLoopEditorScreen settings={settings} onNavigate={onNavigate} />;
      case "memory-book":
        return <MemoryBookScreen settings={settings} onNavigate={onNavigate} />;
};

const STORAGE_KEY = 'tend_user';

function saveLocal(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen() {
  const [mode, setMode]         = useState("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handle = async () => {
    setLoading(true); setError(""); setSuccess("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess("Account created! You can now sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "var(--cream)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 32px", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <img src="/tend.icon.png" alt="Tend" style={{ width: 72, height: 72, borderRadius: 16, display: "block", margin: "0 auto 16px" }} />
        <h1 className="display serif" style={{ fontSize: 32, marginBottom: 4 }}>Tend</h1>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)" }}>A daily rhythm for Charlotte Mason families</p>
      </div>

      <div style={{ display: "flex", marginBottom: 28, border: "1px solid var(--rule)", borderRadius: 2, overflow: "hidden" }}>
        {["signin", "signup"].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
            style={{ flex: 1, padding: "10px 0", background: mode === m ? "var(--sage)" : "none", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: mode === m ? "white" : "var(--ink-faint)", transition: "all .2s" }}>
            {m === "signin" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      <input className="input-line" type="email" placeholder="Email address"
        value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handle()}
        style={{ marginBottom: 16, fontSize: 16 }} />
      <input className="input-line" type="password" placeholder="Password"
        value={password} onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handle()}
        style={{ marginBottom: 28, fontSize: 16 }} />

      {error   && <p style={{ fontSize: 13, color: "var(--red)",  fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginBottom: 16, lineHeight: 1.6 }}>{error}</p>}
      {success && <p style={{ fontSize: 13, color: "var(--sage)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginBottom: 16, lineHeight: 1.6 }}>{success}</p>}

      <button className="btn-sage" style={{ width: "100%", opacity: loading ? .6 : 1 }}
        onClick={handle} disabled={loading || !email || !password}>
        {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
      </button>

      {mode === "signin" && (
        <button onClick={async () => {
          if (!email) { setError("Enter your email first."); return; }
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) setError(error.message);
          else setSuccess("Password reset email sent.");
        }}
          style={{ background: "none", border: "none", cursor: "pointer", marginTop: 16, fontSize: 12, color: "var(--ink-faint)", fontFamily: "'Lato', sans-serif", letterSpacing: ".08em" }}>
          Forgot password?
        </button>
      )}

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <p className="caption">A Delight & Savor app</p>
        <a href="https://www.delightandsavor.com" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".06em", textDecoration: "none" }}>
          delightandsavor.com
        </a>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]   = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [screen, setScreen]     = useState("home");
  const [showNotes, setShowNotes] = useState(false);

  // ── Save to both localStorage and Supabase metadata ──────────────────────
  const persistData = async (data) => {
    saveLocal(data);
    setUserData(data);
    try {
      await supabase.auth.updateUser({ data });
    } catch(e) {
      console.log('Supabase sync failed, localStorage used:', e);
    }
  };

  // ── Load user data fresh from Supabase ────────────────────────────────────
  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const meta   = user?.user_metadata || {};
      const cached = loadLocal();
      // Supabase wins on conflicts so is_paid always comes through
      const merged = { ...cached, ...meta };
      if (merged.onboarded) {
        saveLocal(merged);
        setUserData(merged);
      } else {
        setUserData(meta);
      }
    } catch(e) {
      // Fall back to cache if Supabase unreachable
      const cached = loadLocal();
      if (cached) setUserData(cached);
    } finally {
      setLoading(false);
    }
  };

  // ── Load on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserData();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        setLoading(true);
        loadUserData();
      }
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Onboarding complete ───────────────────────────────────────────────────
  const completeOnboarding = async ({ name, activeHabit, term, week }) => {
    const data = {
      name,
      active_habit:       activeHabit,
      term,
      week,
      onboarded:          true,
      is_rest_week:       false,
      outdoor_minutes:    0,
      outdoor_week_start: new Date().toISOString().split('T')[0],
    };
    await persistData(data);
    setScreen("home");
  };

  // ── Save settings ─────────────────────────────────────────────────────────
  const saveSettings = async (updated) => {
    const newData = {
      ...userData,
      name:         updated.name,
      active_habit: updated.activeHabit || userData?.active_habit,
      term:         updated.term,
      week:         updated.week,
      is_rest_week: updated.isRestWeek ?? userData?.is_rest_week,
    };
    await persistData(newData);
  };

  // ── Save to meta (used by HomeScreen for outdoor minutes) ─────────────────
  const saveToMeta = async (updates) => {
    const newData = { ...userData, ...updates };
    await persistData(newData);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
        <p className="corm italic" style={{ fontSize: 18, color: "var(--ink-faint)" }}>Tending…</p>
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!session) return <AuthScreen />;

  // ── Onboarding ────────────────────────────────────────────────────────────
  if (!userData?.onboarded) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  // ── Main app ──────────────────────────────────────────────────────────────
  const ScreenComponent = SCREENS[screen] || HomeScreen;
  const showNav = NAV_SCREENS.includes(screen);

  const settings = {
    name:           userData?.name         || "Friend",
    activeHabit:    userData?.active_habit || "attention",
    term:           userData?.term         || 1,
    week:           userData?.week         || 1,
    isRestWeek:     userData?.is_rest_week || false,
    outdoorGoal:    15,
    userId:         session.user.id,
    outdoorMinutes: userData?.outdoor_minutes || 0,
    saveToMeta,
    isPaid:         userData?.is_paid      || false,
    students:       userData?.children     || [],
  };

  return (
    <div className="shell">
      <div key={screen} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <ScreenComponent onNavigate={id => setScreen(id)} settings={settings} onSave={saveSettings} />
      </div>
      <div style={{ position: "fixed", bottom: showNav ? 90 : 22, right: 16, opacity: .06, pointerEvents: "none", userSelect: "none" }}>
        <img src="/ds-logo.png" alt="" style={{ width: 52, height: 52 }} />
      </div>

      {/* Floating Quick Notes button */}
      <button onClick={() => setShowNotes(true)}
        style={{ position: "fixed", bottom: showNav ? 104 : 24, left: 22, width: 44, height: 44, borderRadius: "50%", background: "var(--cream)", border: "1.5px solid var(--sage-md)", boxShadow: "0 2px 12px rgba(0,0,0,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, transition: "all .2s" }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      {showNav && <BottomNav active={screen} onNavigate={id => setScreen(id)} />}
      {showNotes && <QuickNotesSheet onClose={() => setShowNotes(false)} students={userData?.children || []} userId={session?.user?.id} />}
    </div>
  );
}
