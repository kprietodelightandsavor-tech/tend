import { Ic } from "./Icons";

const NAV = [
  { id: "home",      label: "Home",    Icon: Ic.Home    },
  { id: "planner",   label: "Planner", Icon: Ic.Plan    },
  { id: "narration", label: "Narrate", Icon: Ic.Feather },
  { id: "menu",      label: "Menu",    Icon: Ic.Menu    },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bnav">
      {NAV.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`bnav-btn ${active === id ? "active" : ""}`}
          onClick={() => onNavigate(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  );
}
