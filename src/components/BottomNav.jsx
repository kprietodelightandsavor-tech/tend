import { Ic } from "./Icons";

// Four calm tabs. Everything else lives in "More" (the grouped menu).
const NAV = [
  { id: "home",    label: "Home",    Icon: Ic.Home },
  { id: "planner", label: "Planner", Icon: Ic.Plan },
  { id: "guide",   label: "Lantern", Icon: Ic.Lantern },
  { id: "menu",    label: "More",    Icon: Ic.Menu },
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
