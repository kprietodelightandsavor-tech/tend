// Tend logo — the wildflower sprig from the cover cards
import { SprigPaths } from "../components/SproutMark";

function TendMark() {
  // The interior mark — deliberately bolder than the app icon's seedling:
  // deep-sage sprig on warm cream, ringed in gold so it stands out on the page.
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" style={{ display: "block", margin: "0 auto" }}>
      <circle cx="42" cy="42" r="40" stroke="#C49A4E" strokeWidth="1.25" fill="#FDF7EE"/>
      <circle cx="42" cy="42" r="36" stroke="#E3D9C2" strokeWidth="0.75" fill="none"/>
      <g transform="translate(9.5, 8) scale(0.65)">
        <SprigPaths color="#5C6B4F" />
      </g>
    </svg>
  );
}

// Where to buy the TEND Keeping Journal — paste your shop link between the quotes
// when the journal is listed (e.g. your Etsy or website product page).
const JOURNAL_URL = "";

// Everything that isn't Home or Planner, in four calm groups.
const GROUPS = [
  {
    heading: "Rhythm & Journals",
    items: [
      { title: "Consider the Lilies", sub: "Commonplace & nature journal", screen: "lilies" },
      { title: "Nature Study",        sub: "Topics & the nature loop",     screen: "naturestudy" },
      { title: "Outdoors",            sub: "Time outside & observation",    screen: "outdoors" },
      { title: "Habits",              sub: "The tended life",               screen: "habits" },
      { title: "Bible Reading",       sub: "Family scripture streams",      screen: "scripture" },
    ],
  },
  {
    heading: "Children",
    items: [
      { title: "Students",  sub: "Profiles & narration history", screen: "students" },
      { title: "Narration", sub: "Telling back what was read",   screen: "narration" },
    ],
  },
  {
    heading: "Records & Keepsakes",
    items: [
      { title: "Evening Close",   sub: "Thirty seconds of keeping",      screen: "evening-close" },
      { title: "Teaching Record", sub: "What we taught, week by week",   screen: "teachinglog" },
      { title: "Annual Report",   sub: "CM transcript & evaluation",     screen: "annualreport" },
      { title: "Memory Book",     sub: "The year in images & moments",   screen: "memory-book" },
    ],
  },
  {
    heading: "Library & Setup",
    items: [
      { title: "Books & Curriculum", sub: "Your year in books",                screen: "books" },
      { title: "Beauty Loop",        sub: "Edit your daily beauty moments",    screen: "beauty-loop-editor" },
      { title: "Settings",           sub: "Name, goals, schedule mode",        screen: "settings" },
    ],
  },
];

export default function MenuScreen({ onNavigate }) {
  return (
    <div className="screen">
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <TendMark />
        </div>
        <h1 className="display serif" style={{ fontSize: 36, marginBottom: 4 }}>Tend</h1>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-faint)" }}>
          A daily rhythm for Charlotte Mason families
        </p>
      </div>

      <div className="rule-gold" />

      {/* Grouped contents */}
      {GROUPS.map((g, gi) => (
        <div key={gi} style={{ marginTop: gi === 0 ? 16 : 30 }}>
          <p className="eyebrow" style={{ marginBottom: 4 }}>{g.heading}</p>
          {g.items.map((it) => (
            <div key={it.screen} className="chapter-row" onClick={() => onNavigate(it.screen)}>
              <div style={{ flex: 1 }}>
                <p className="chapter-title">{it.title}</p>
                <p className="chapter-sub">{it.sub}</p>
              </div>
              <span className="chapter-arrow">→</span>
            </div>
          ))}
        </div>
      ))}

      <div className="rule" style={{ marginTop: 24 }} />

      {/* Philosophy */}
      <div className="card-gold" style={{ marginTop: 4 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Philosophy</p>
        <p className="corm italic" style={{ fontSize: 16, color: "var(--ink-lt)", lineHeight: 1.8 }}>
          "Education is an atmosphere, a discipline, a life."
        </p>
        <p className="caption" style={{ marginTop: 8 }}>— Charlotte Mason</p>
      </div>

      {/* ─── Also from Delight & Savor ─────────────────────────────────── */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
        <p className="eyebrow" style={{ marginBottom: 16, textAlign: "center" }}>
          Also from Delight & Savor
        </p>

        {/* TEND Keeping Journal — paste your shop link into JOURNAL_URL below when it's listed */}
        <a
          href={JOURNAL_URL || undefined}
          target={JOURNAL_URL ? "_blank" : undefined}
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block", marginBottom: 12, cursor: JOURNAL_URL ? "pointer" : "default" }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px",
            background: "var(--gold-bg)",
            border: "1px solid var(--rule)",
            borderRadius: 3,
          }}>
            <img
              src="/ds_icon.png"
              alt="TEND Keeping Journal"
              style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>
                TEND · The Keeping Journal
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5 }}>
                The paper half of Tend — the app plans, the journal keeps. For GoodNotes or print.
              </p>
            </div>
            {!JOURNAL_URL && (
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", whiteSpace: "nowrap" }}>
                coming soon
              </span>
            )}
          </div>
        </a>

        <a
          href="https://in-the-margin.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block" }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px",
            background: "var(--sage-bg)",
            border: "1px solid var(--sage-md)",
            borderRadius: 3,
            transition: "opacity .2s",
          }}
            onMouseOver={e => e.currentTarget.style.opacity = ".8"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            <img
              src="/margin_icon.png"
              alt="In the Margin"
              style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--ink)", marginBottom: 3 }}>
                In the Margin
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: "italic", color: "var(--ink-faint)", lineHeight: 1.5 }}>
                A reading companion for parents — notes, quotes, and reflections alongside great books.
              </p>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#93A388" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </a>
      </div>

      {/* Footer — D&S website link */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <a
          href="https://www.delightandsavor.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}
            onMouseOver={e => e.currentTarget.style.opacity = ".75"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            <img
              src="/ds_icon.png"
              alt="Delight & Savor"
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>
                Delight & Savor
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".06em", color: "var(--sage)" }}>
                delightandsavor.com
              </p>
            </div>
          </div>
        </a>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: "italic", color: "var(--ink-faint)", marginTop: 12 }}>
          Literature · Writing · Living Books
        </p>
      </div>
    </div>
  );
}
