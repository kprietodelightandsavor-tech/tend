import { useState } from "react";
import "./styles/globals.css";

import BottomNav           from "./components/BottomNav";
import OnboardingScreen    from "./screens/OnboardingScreen";
import HomeScreen          from "./screens/HomeScreen";
import PlannerScreen       from "./screens/PlannerScreen";
import NarrationScreen     from "./screens/NarrationScreen";
import OutdoorsScreen      from "./screens/OutdoorsScreen";
import HabitsScreen        from "./screens/HabitScreen";
import LiliesScreen        from "./screens/LiliesScreen";
import StudentsScreen      from "./screens/StudentsScreen";
import MenuScreen          from "./screens/MenuScreen";
import SettingsScreen      from "./screens/SettingsScreen";

// ─── DEFAULT SETTINGS ─────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  name:         "Friend",
  outdoorGoal:  15,
  term:         1,
  week:         1,
  onboarded:    false,
  activeHabit:  "attention",
};

// ─── SCREEN REGISTRY ─────────────────────────────────────────────────────────
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

// Bottom nav screens only
const NAV_SCREENS = ["home", "planner", "narration", "menu"];

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [screen, setScreen]     = useState("home");

  const navigate = id => setScreen(id);

  const completeOnboarding = ({ name, activeHabit, term, week }) => {
    setSettings(s => ({ ...s, name, activeHabit, term, week, onboarded: true }));
    setScreen("home");
  };

  const saveSettings = (updated) => {
    setSettings(s => ({ ...s, ...updated }));
  };

  // Show onboarding for new users
  if (!settings.onboarded) {
    return (
      <>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <OnboardingScreen onComplete={completeOnboarding} />
      </>
    );
  }

  const ScreenComponent = SCREENS[screen] || HomeScreen;
  const showNav = NAV_SCREENS.includes(screen);

  return (
    <div className="shell">
      <div key={screen} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <ScreenComponent
          onNavigate={navigate}
          settings={settings}
          onSave={saveSettings}
        />
      </div>

      {/* Ambient ornament */}
      <div style={{
        position: "fixed", bottom: showNav ? 90 : 22, right: 22,
        fontFamily: "'Playfair Display', serif", fontSize: 56,
        color: "var(--sage)", opacity: .05, pointerEvents: "none",
        userSelect: "none", lineHeight: 1,
      }}>
        ❧
      </div>

      {showNav && <BottomNav active={screen} onNavigate={navigate} />}
    </div>
  );
}
