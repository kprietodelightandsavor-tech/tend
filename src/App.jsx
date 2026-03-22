import { useState, useEffect } from "react";
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

const NAV_SCREENS = ["home", "planner", "narration", "menu"];

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
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none" style={{ margin: "0 auto 16px", display: "block" }}>
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
          <circle cx="24" cy="40" r="1.2" fill="#A9B786"/><circle cx="40" cy="40" r="1.2" fill="#A9B786"/>
          <circle cx="23" cy="33" r="1.2" fill="#A9B786"/><circle cx="41" cy="33" r="1.2" fill="#A9B786"/>
          <circle cx="24" cy="27" r="1.2" fill="#A9B786"/><circle cx="40" cy="27" r="1.2" fill="#A9B786"/>
          <circle cx="25" cy="21" r="1.2" fill="#A9B786"/><circle cx="39" cy="21" r="1.2" fill="#A9B786"/>
          <text x="32" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontSize="5" fill="#A9B786" fontStyle="italic" letterSpacing="0.08em">tend</text>
        </svg>
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
  };

  return (
    <div className="shell">
      <div key={screen} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <ScreenComponent onNavigate={id => setScreen(id)} settings={settings} onSave={saveSettings} />
      </div>
      <div style={{ position: "fixed", bottom: showNav ? 90 : 22, right: 22, fontFamily: "'Playfair Display', serif", fontSize: 56, color: "var(--sage)", opacity: .05, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>❧</div>
      {showNav && <BottomNav active={screen} onNavigate={id => setScreen(id)} />}
    </div>
  );
}
