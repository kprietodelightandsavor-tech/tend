import { Ic } from "./Icons";

// Inline Memory Book icon — a small camera/photo icon
// Uses inline SVG so it doesn't depend on what's in ./Icons
function MemoryIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

const NAV = [
  { id: "home",        label: "Home",    Icon: Ic.Home    },
  { id: "planner",     label: "Planner", Icon: Ic.Plan    },
  { id: "narration",   label: "Narrate", Icon: Ic.Feather },
  { id: "memory-book", label: "Memory",  Icon: MemoryIcon },
  { id: "menu",        label: "Menu",    Icon: Ic.Menu    },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bnav">
      {NAV.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={"bnav-btn " + (active === id ? "active" : "")}
          onClick={() => onNavigate(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  );
}
