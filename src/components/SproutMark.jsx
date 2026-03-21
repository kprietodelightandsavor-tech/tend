// src/components/SproutMark.jsx
// The Tend sprout icon — sage on transparent background
// Matches the uploaded app icon: sprouting plant with two leaves rising from earth
// Use this everywhere the botanical tree SVG was used

export default function SproutMark({ size = 52, color = "#A9B786" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Earth curve */}
      <path
        d="M18 72 Q50 62 82 72"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Stem */}
      <line
        x1="50" y1="70"
        x2="50" y2="38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Left leaf */}
      <path
        d="M50 52 Q36 44 32 30 Q44 30 50 44"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.18"
      />
      {/* Left leaf vein */}
      <path
        d="M50 50 Q41 43 34 31"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Right leaf */}
      <path
        d="M50 52 Q64 44 68 30 Q56 30 50 44"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.18"
      />
      {/* Right leaf vein */}
      <path
        d="M50 50 Q59 43 66 31"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Top bud */}
      <path
        d="M50 38 Q44 28 46 20 Q52 22 50 38"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.15"
      />
      <path
        d="M50 38 Q56 28 54 20 Q48 22 50 38"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.15"
      />
    </svg>
  );
}
