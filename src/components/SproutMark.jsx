// src/components/SproutMark.jsx
// The Tend botanical — a hand-drawn wildflower sprig in line art,
// matching the sage cover cards: slender stem, leaf pairs, small
// five-petal blooms and a bud. Pure strokes; scales anywhere.

// The bare sprig art (a <g>, 100x100 space) — reusable inside other SVGs.
export function SprigPaths({ color = "#93A388" }) {
  const petal = (cx, cy, r) => {
    // five small petal circles around a center
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      pts.push([cx + Math.cos(a) * r * 1.9, cy + Math.sin(a) * r * 1.9]);
    }
    return (
      <g key={`${cx}-${cy}`}>
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={r} stroke={color} strokeWidth="1.6" fill="none" />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.55} stroke={color} strokeWidth="1.4" fill="none" />
      </g>
    );
  };

  return (
    <g>
      {/* main stem */}
      <path d="M50 92 C47 74 48 52 53 30" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* branch to the tall bloom */}
      <path d="M53 30 C54 26 56 23 58 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* branch to the side bloom */}
      <path d="M51 42 C48 34 45 27 43 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* branch to the bud */}
      <path d="M52 36 C57 34 61 33 64 33" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* leaves — slender outlines, alternating */}
      <path d="M49.5 72 C42 70 36.5 65 34.5 58 C42 60.5 47 65.5 49.5 72 Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <path d="M50.5 63 C58 61 63.5 56 65.5 49 C58 51.5 53 56.5 50.5 63 Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <path d="M49 53 C43 51 39 46.5 37.5 41 C43.5 43 47.5 47.5 49 53 Z"
        stroke={color} strokeWidth="1.7" strokeLinejoin="round" fill="none" />

      {/* blooms + bud */}
      {petal(58, 16, 2.6)}
      {petal(42, 15, 2.2)}
      <circle cx="66.5" cy="32.5" r="2" stroke={color} strokeWidth="1.6" fill="none" />
    </g>
  );
}

export default function SproutMark({ size = 52, color = "#5C6B4F" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <SprigPaths color={color} />
    </svg>
  );
}
