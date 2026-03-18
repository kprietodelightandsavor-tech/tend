import { useState } from "react";
import "../src/styles/globals.css";

import BottomNav       from "./components/BottomNav";
import HomeScreen      from "./screens/HomeScreen";
import PlannerScreen   from "./screens/PlannerScreen";
import NarrationScreen from "./screens/NarrationScreen";
import OutdoorsScreen  from "./screens/OutdoorsScreen";
import HabitsScreen    from "./screens/HabitScreen";
import LiliesScreen    from "./screens/LiliesScreen";
import StudentsScreen  from "./screens/StudentsScreen";
import MenuScreen      from "./screens/MenuScreen";

// ─── SCREEN REGISTRY ─────────────────────────────────────────────────────────
// To add a new screen: create src/screens/YourScreen.jsx, import it above,
// and add it to this map.
const SCREENS = {
  home:      HomeScreen,
  planner:   PlannerScreen,
  narration: NarrationScreen,
  outdoors:  OutdoorsScreen,
  habits:    HabitsScreen,
  lilies:    LiliesScreen,
  students:  StudentsScreen,
  menu:      MenuScreen,
};

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");

  const navigate = id => setScreen(id);

  const ScreenComponent = SCREENS[screen] || HomeScreen;

  return (
    <div className="shell">
      {/* Keyed so each screen unmounts/remounts cleanly on navigation */}
      <div key={screen} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <ScreenComponent onNavigate={navigate} />
      </div>

      {/* Ambient ornament */}
      <div style={{
        position: "fixed", bottom: 90, right: 22,
        fontFamily: "'Playfair Display', serif", fontSize: 56,
        color: "var(--sage)", opacity: .05, pointerEvents: "none",
        userSelect: "none", lineHeight: 1,
      }}>
        ❧
      </div>

      <BottomNav active={screen} onNavigate={navigate} />
    </div>
  );
}
