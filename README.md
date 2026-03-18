# Living Rhythm Planner — Vite + React

## File Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Shell, routing, bottom nav
├── styles/
│   └── globals.css           # All CSS variables, base styles, shared classes
├── data/
│   └── seed.js               # All seed data (DAYS, HABITS, STUDENTS, etc.)
├── components/
│   ├── BottomNav.jsx         # Navigation bar
│   ├── Sheet.jsx             # Bottom sheet modal
│   ├── CollapseSection.jsx   # Collapsible section
│   └── Icons.jsx             # All SVG icons
└── screens/
    ├── HomeScreen.jsx
    ├── PlannerScreen.jsx
    ├── NarrationScreen.jsx
    ├── OutdoorsScreen.jsx
    ├── HabitsScreen.jsx
    ├── LiliesScreen.jsx
    ├── StudentsScreen.jsx
    └── MenuScreen.jsx
```

## Setup

```bash
npm create vite@latest living-rhythm-planner -- --template react
cd living-rhythm-planner
npm install
# Replace src/ contents with the files provided
npm run dev
```

## Working on a single screen

Each screen is fully self-contained in `src/screens/ScreenName.jsx`.
Shared data lives in `src/data/seed.js`.
Shared styles live in `src/styles/globals.css`.
