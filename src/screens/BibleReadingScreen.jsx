import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ── Memory verses with durations ──────────────────────────────────────────────
// 38 verses across 108 weeks — 2, 3, or 6 week durations
const MEMORY_VERSES = [
  { ref:"Genesis 1:1",           weeks:2 },
  { ref:"Romans 5:12",           weeks:2 },
  { ref:"Genesis 12:1",          weeks:2 },
  { ref:"Genesis 22:14",         weeks:2 },
  { ref:"Genesis 50:20",         weeks:3 },
  { ref:"Matthew 1:21",          weeks:2 },
  { ref:"Matthew 28:19-20",      weeks:6 },
  { ref:"Mark 1:17",             weeks:2 },
  { ref:"John 6:35",             weeks:3 },
  { ref:"Exodus 20:2-3",         weeks:3 },
  { ref:"Leviticus 19:18",       weeks:3 },
  { ref:"Numbers 14:9",          weeks:2 },
  { ref:"John 1:1",              weeks:2 },
  { ref:"Deuteronomy 6:4-5",     weeks:6 },
  { ref:"Joshua 1:9",            weeks:3 },
  { ref:"Joshua 24:15",          weeks:3 },
  { ref:"Ruth 1:16",             weeks:3 },
  { ref:"Acts 16:31",            weeks:2 },
  { ref:"2 Samuel 7:16",         weeks:2 },
  { ref:"Romans 8:1",            weeks:2 },
  { ref:"Lamentations 3:22-23",  weeks:6 },
  { ref:"Ephesians 2:8-9",       weeks:3 },
  { ref:"2 Chronicles 20:15",    weeks:2 },
  { ref:"Isaiah 40:31",          weeks:3 },
  { ref:"Romans 8:28",           weeks:3 },
  { ref:"Isaiah 53:5",           weeks:3 },
  { ref:"Jeremiah 1:5",          weeks:2 },
  { ref:"Micah 6:8",             weeks:3 },
  { ref:"Habakkuk 3:17-18",      weeks:3 },
  { ref:"Hebrews 11:1",          weeks:3 },
  { ref:"Esther 4:14",           weeks:3 },
  { ref:"1 John 1:9",            weeks:2 },
  { ref:"Nehemiah 8:10",         weeks:2 },
  { ref:"Job 38:4",              weeks:2 },
  { ref:"Job 42:5",              weeks:2 },
  { ref:"Ezekiel 36:26",         weeks:3 },
  { ref:"Isaiah 65:17",          weeks:2 },
  { ref:"Revelation 22:20",      weeks:6 },
];

// Build week-to-verse lookup (1-indexed)
const VERSE_BY_WEEK = {};
let _w = 1;
for (const v of MEMORY_VERSES) {
  for (let i = 0; i < v.weeks; i++) { VERSE_BY_WEEK[_w++] = v; }
}

function getVerseForWeek(weekNumber) {
  return VERSE_BY_WEEK[weekNumber] || VERSE_BY_WEEK[1];
}

// API.Bible ESV Bible ID
const ESV_BIBLE_ID = "f421fe261da7624f-01";

async function fetchVerseText(ref) {
  const cacheKey = "lf_verse_" + ref.replace(/[\s:,-]+/g, "_");
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}
  try {
    const apiKey = import.meta.env.VITE_BIBLE_API_KEY;
    if (!apiKey) return null;
    const encoded = encodeURIComponent(ref);
    const res = await fetch(
      "https://api.scripture.api.bible/v1/bibles/" + ESV_BIBLE_ID + "/search?query=" + encoded + "&limit=1",
      { headers: { "api-key": apiKey } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const passage = data?.data?.passages?.[0] || data?.data?.verses?.[0];
    if (!passage) return null;
    const text = (passage.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return null;
    const result = { ref, text };
    try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch {}
    return result;
  } catch { return null; }
}

// ── Memory Verse Card — exported for HomeScreen and BibleReadingScreen ────────
export function MemoryVerseCard({ weekNumber = 1, onNavigate = null, prominent = false }) {
  const verseData = getVerseForWeek(weekNumber);
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchVerseText(verseData.ref).then(v => { setVerse(v); setLoading(false); });
  }, [verseData.ref]);

  // How many weeks on this verse, which week are we on
  const versesBeforeThis = (() => {
    let count = 0;
    for (const v of MEMORY_VERSES) {
      if (v.ref === verseData.ref) break;
      count += v.weeks;
    }
    return count;
  })();
  const weekOnThisVerse = weekNumber - versesBeforeThis;
  const weeksRemaining = verseData.weeks - weekOnThisVerse + 1;

  if (prominent) {
    // Large prominent version for top of HomeScreen
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--gold)", fontSize: 13 }}>✦</span>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>
              Memory Verse
            </p>
          </div>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)", margin: 0, letterSpacing: ".06em" }}>
            Week {weekOnThisVerse} of {verseData.weeks}
          </p>
        </div>
        {loading ? (
          <p className="corm italic" style={{ fontSize: 17, color: "var(--ink-faint)", margin: 0 }}>Loading...</p>
        ) : verse?.text ? (
          <>
            <p className="corm" style={{ fontSize: 21, color: "var(--ink)", lineHeight: 1.75, margin: "0 0 8px", fontStyle: "italic" }}>
              "{verse.text}"
            </p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--gold)", letterSpacing: ".08em", margin: 0 }}>
              {verseData.ref} &nbsp;·&nbsp; ESV
            </p>
          </>
        ) : (
          <>
            <p className="corm italic" style={{ fontSize: 18, color: "var(--ink-faint)", margin: "0 0 6px" }}>
              {verseData.ref}
            </p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--ink-faint)", margin: 0 }}>ESV</p>
          </>
        )}
        {onNavigate && (
          <button onClick={() => onNavigate("scripture")}
            style={{ background: "none", border: "none", cursor: "pointer", marginTop: 10, fontFamily: "'Lato', sans-serif", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", padding: 0 }}>
            Open Living Feast →
          </button>
        )}
      </div>
    );
  }

  // Compact version for Bible screen
  return (
    <div style={{ background: "var(--gold-bg)", border: "1px solid #E0CBA8", borderRadius: 4, padding: "16px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "var(--gold)", fontSize: 12 }}>✦</span>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>Memory Verse</p>
        </div>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 9, color: "var(--ink-faint)", margin: 0 }}>
          Week {weekOnThisVerse} of {verseData.weeks}
        </p>
      </div>
      {loading ? (
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", margin: 0 }}>Loading...</p>
      ) : verse?.text ? (
        <>
          <p className="corm italic" style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.75, margin: "0 0 6px" }}>"{verse.text}"</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: "var(--gold)", letterSpacing: ".06em", margin: 0 }}>{verseData.ref} · ESV</p>
        </>
      ) : (
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", margin: 0 }}>{verseData.ref} · ESV</p>
      )}
    </div>
  );
}

export function FlameIcon({ size = 20, color = "#C29B61" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 7 7 7 13a5 5 0 0010 0c0-3-2-5-2-5s-.5 2.5-2 3.5C12 12 11 10 12 7c0 0-2 2-2 5a3 3 0 006 0c0-4-4-10-4-10z" fill={color} opacity="0.9"/>
      <path d="M12 14c0 0-1.5-.5-1.5-2 0 0 .5 1 1.5 1s1.5-1 1.5-1c0 1.5-1.5 2-1.5 2z" fill="white" opacity="0.6"/>
    </svg>
  );
}

// ── Complete 108-week schedule ────────────────────────────────────────────────
const SCHEDULE = [
  // YEAR 1 — "In the Beginning"
  // Term 1: Genesis (Weeks 1–12)
  { week:1,  year:1, term:1, wisdom:"Proverbs 1:1-19",      nt:"Matthew 1",                 ot:"Genesis 1",                          psalm:"Psalm 1"    },
  { week:2,  year:1, term:1, wisdom:"Proverbs 1:20-33",     nt:"Matthew 2",                 ot:"Genesis 2",                          psalm:"Psalm 2"    },
  { week:3,  year:1, term:1, wisdom:"Proverbs 2",           nt:"Matthew 3-4",               ot:"Genesis 3",                          psalm:"Psalm 3"    },
  { week:4,  year:1, term:1, wisdom:"Proverbs 3:1-18",      nt:"Matthew 5:1-48",            ot:"Genesis 6:1-22, 7:1-24",             psalm:"Psalm 4"    },
  { week:5,  year:1, term:1, wisdom:"Proverbs 3:19-35",     nt:"Matthew 6",                 ot:"Genesis 8:1-22, 9:1-17",             psalm:"Psalm 5"    },
  { week:6,  year:1, term:1, wisdom:"Proverbs 4:1-19",      nt:"Matthew 7",                 ot:"Genesis 11:1-9",                     psalm:"Psalm 6"    },
  { week:7,  year:1, term:1, wisdom:"Proverbs 4:20-27",     nt:"Matthew 8:1-27",            ot:"Genesis 12:1-9, 15",                 psalm:"Psalm 7"    },
  { week:8,  year:1, term:1, wisdom:"Proverbs 5:1-14",      nt:"Matthew 9:1-34",            ot:"Genesis 17, 18:1-15",                psalm:"Psalm 8"    },
  { week:9,  year:1, term:1, wisdom:"Proverbs 5:15-23",     nt:"Matthew 13:1-43",           ot:"Genesis 22:1-18",                    psalm:"Psalm 9"    },
  { week:10, year:1, term:1, wisdom:"Proverbs 6:1-19",      nt:"Matthew 14:13-33",          ot:"Genesis 25:19-34, 27:1-29",          psalm:"Psalm 10"   },
  { week:11, year:1, term:1, wisdom:"Proverbs 6:20-35",     nt:"Matthew 16:13-28",          ot:"Genesis 37:1-28",                    psalm:"Psalm 11"   },
  { week:12, year:1, term:1, wisdom:"Proverbs 7:1-27",      nt:"Matthew 17:1-20",           ot:"Genesis 39-41:16",                   psalm:"Psalm 12"   },
  // Term 2: Genesis cont. + Exodus (Weeks 13–24)
  { week:13, year:1, term:2, wisdom:"Proverbs 8:1-21",      nt:"Matthew 21:1-22",           ot:"Genesis 41:17-57, 45:1-15",          psalm:"Psalm 13"   },
  { week:14, year:1, term:2, wisdom:"Proverbs 8:22-36",     nt:"Matthew 26:1-56",           ot:"Genesis 50:15-26",                   psalm:"Psalm 14"   },
  { week:15, year:1, term:2, wisdom:"Proverbs 9",           nt:"Matthew 27:1-54",           ot:"Exodus 1-2:10",                      psalm:"Psalm 15"   },
  { week:16, year:1, term:2, wisdom:"Proverbs 10:1-16",     nt:"Matthew 27:55-28:20",       ot:"Exodus 2:11-25, 3:1-22",             psalm:"Psalm 16"   },
  { week:17, year:1, term:2, wisdom:"Proverbs 10:17-32",    nt:"Mark 1:1-45",               ot:"Exodus 4:1-17, 5:1-23",              psalm:"Psalm 17"   },
  { week:18, year:1, term:2, wisdom:"Proverbs 11:1-15",     nt:"Mark 2:1-28",               ot:"Exodus 7-8 (plagues begin)",         psalm:"Psalm 18"   },
  { week:19, year:1, term:2, wisdom:"Proverbs 11:16-31",    nt:"Mark 4:1-41",               ot:"Exodus 9-10 (plagues continue)",     psalm:"Psalm 19"   },
  { week:20, year:1, term:2, wisdom:"Proverbs 12:1-14",     nt:"Mark 6:30-52",              ot:"Exodus 12:1-32 (Passover)",          psalm:"Psalm 20"   },
  { week:21, year:1, term:2, wisdom:"Proverbs 12:15-28",    nt:"Mark 8:27-38, 9:2-29",      ot:"Exodus 14 (crossing the Red Sea)",   psalm:"Psalm 21"   },
  { week:22, year:1, term:2, wisdom:"Proverbs 13:1-12",     nt:"Mark 10:13-52",             ot:"Exodus 16, 17:1-7",                  psalm:"Psalm 22"   },
  { week:23, year:1, term:2, wisdom:"Proverbs 13:13-25",    nt:"Mark 14:1-52",              ot:"Exodus 19-20 (Sinai, the Law)",      psalm:"Psalm 23"   },
  { week:24, year:1, term:2, wisdom:"Proverbs 14:1-18",     nt:"Mark 15-16",                ot:"Exodus 24 (covenant sealed)",        psalm:"Psalm 24"   },
  // Term 3: Exodus cont. + Leviticus + Numbers (Weeks 25–36)
  { week:25, year:1, term:3, wisdom:"Proverbs 14:19-35",    nt:"Luke 1:26-56, 2:1-20",      ot:"Exodus 25:1-22, 31:1-11",            psalm:"Psalm 25"   },
  { week:26, year:1, term:3, wisdom:"Proverbs 15:1-17",     nt:"Luke 4:1-30",               ot:"Exodus 32 (golden calf)",            psalm:"Psalm 26"   },
  { week:27, year:1, term:3, wisdom:"Proverbs 15:18-33",    nt:"Luke 6:17-49",              ot:"Exodus 33-34:10 (Moses and glory)",  psalm:"Psalm 27"   },
  { week:28, year:1, term:3, wisdom:"Proverbs 16:1-16",     nt:"Luke 10:25-42",             ot:"Leviticus 16 (Day of Atonement)",    psalm:"Psalm 28"   },
  { week:29, year:1, term:3, wisdom:"Proverbs 16:17-33",    nt:"Luke 15",                   ot:"Leviticus 19 (the Holiness Code)",   psalm:"Psalm 29"   },
  { week:30, year:1, term:3, wisdom:"Proverbs 17:1-14",     nt:"Luke 19:1-48",              ot:"Numbers 9:15-23, 10:11-36",          psalm:"Psalm 30"   },
  { week:31, year:1, term:3, wisdom:"Proverbs 17:15-28",    nt:"Luke 22:1-46",              ot:"Numbers 13-14 (the spies)",          psalm:"Psalm 31"   },
  { week:32, year:1, term:3, wisdom:"Proverbs 18:1-12",     nt:"Luke 23",                   ot:"Numbers 20:1-13, 21:4-9",            psalm:"Psalm 32"   },
  { week:33, year:1, term:3, wisdom:"Proverbs 18:13-24",    nt:"Luke 24",                   ot:"Numbers 22:1-38 (Balaam)",           psalm:"Psalm 33"   },
  { week:34, year:1, term:3, wisdom:"Proverbs 19:1-15",     nt:"John 1:1-18",               ot:"Numbers 27:12-23",                   psalm:"Psalm 34"   },
  { week:35, year:1, term:3, wisdom:"Proverbs 19:16-29",    nt:"John 3:1-21",               ot:"Deuteronomy 6 (the Shema)",          psalm:"Psalm 35"   },
  { week:36, year:1, term:3, wisdom:"Proverbs 20:1-15",     nt:"John 6:25-59",              ot:"Deuteronomy 34 (Moses' death)",      psalm:"Psalm 36"   },

  // YEAR 2 — "Into the Land"
  // Term 1: John + Joshua + Judges (Weeks 37–48)
  { week:37, year:2, term:1, wisdom:"Proverbs 20:16-30",    nt:"John 10:1-30",              ot:"Joshua 1-2 (Rahab)",                 psalm:"Psalm 37"   },
  { week:38, year:2, term:1, wisdom:"Proverbs 21:1-15",     nt:"John 11:1-44",              ot:"Joshua 3-4, 6 (Jericho)",            psalm:"Psalm 38"   },
  { week:39, year:2, term:1, wisdom:"Proverbs 21:16-31",    nt:"John 14-15",                ot:"Joshua 23-24 (covenant renewal)",    psalm:"Psalm 39"   },
  { week:40, year:2, term:1, wisdom:"Proverbs 22:1-16",     nt:"John 17",                   ot:"Judges 2:6-23 (the cycle)",          psalm:"Psalm 40"   },
  { week:41, year:2, term:1, wisdom:"Proverbs 22:17-29",    nt:"John 20-21",                ot:"Judges 4-5 (Deborah)",               psalm:"Psalm 41"   },
  { week:42, year:2, term:1, wisdom:"Proverbs 23:1-18",     nt:"Acts 1-2:41",               ot:"Judges 6:1-40 (Gideon called)",      psalm:"Psalm 42"   },
  { week:43, year:2, term:1, wisdom:"Proverbs 23:19-35",    nt:"Acts 2:42-4:31",            ot:"Judges 7 (Gideon's victory)",        psalm:"Psalm 43"   },
  { week:44, year:2, term:1, wisdom:"Proverbs 24:1-22",     nt:"Acts 6-7 (Stephen)",        ot:"Judges 11:1-11, 29-40 (Jephthah)",  psalm:"Psalm 44"   },
  { week:45, year:2, term:1, wisdom:"Proverbs 24:23-34",    nt:"Acts 8-9:31",               ot:"Judges 13, 16:4-30 (Samson)",       psalm:"Psalm 45"   },
  { week:46, year:2, term:1, wisdom:"Proverbs 25:1-15",     nt:"Acts 10-11",                ot:"Ruth 1-2",                           psalm:"Psalm 46"   },
  { week:47, year:2, term:1, wisdom:"Proverbs 25:16-28",    nt:"Acts 12-13:12",             ot:"Ruth 3-4",                           psalm:"Psalm 47"   },
  { week:48, year:2, term:1, wisdom:"Proverbs 26:1-16",     nt:"Acts 13:13-52",             ot:"1 Samuel 1-3 (Hannah, Samuel)",      psalm:"Psalm 48"   },
  // Term 2: Acts + Samuel (Weeks 49–60)
  { week:49, year:2, term:2, wisdom:"Proverbs 26:17-28",    nt:"Acts 14-15",                ot:"1 Samuel 8-10 (Saul becomes king)",  psalm:"Psalm 49"   },
  { week:50, year:2, term:2, wisdom:"Proverbs 27:1-14",     nt:"Acts 16:1-40",              ot:"1 Samuel 16-17 (David, Goliath)",    psalm:"Psalm 50"   },
  { week:51, year:2, term:2, wisdom:"Proverbs 27:15-27",    nt:"Acts 17",                   ot:"1 Samuel 18:1-16, 20:1-42",          psalm:"Psalm 51"   },
  { week:52, year:2, term:2, wisdom:"Proverbs 28:1-14",     nt:"Acts 18-19:20",             ot:"1 Samuel 24 (David spares Saul)",    psalm:"Psalm 52"   },
  { week:53, year:2, term:2, wisdom:"Proverbs 28:15-28",    nt:"Acts 19:21-20:38",          ot:"2 Samuel 5:1-12, 7:1-17",            psalm:"Psalm 53"   },
  { week:54, year:2, term:2, wisdom:"Proverbs 29:1-14",     nt:"Acts 21-22",                ot:"2 Samuel 9 (Mephibosheth)",          psalm:"Psalm 54"   },
  { week:55, year:2, term:2, wisdom:"Proverbs 29:15-27",    nt:"Acts 23-24",                ot:"2 Samuel 11-12:15 \u26a0\ufe0f mature themes — alt: 2 Samuel 9", psalm:"Psalm 55" },
  { week:56, year:2, term:2, wisdom:"Proverbs 30:1-14",     nt:"Acts 25-26",                ot:"2 Samuel 22:1-51 (David's song)",    psalm:"Psalm 56"   },
  { week:57, year:2, term:2, wisdom:"Proverbs 30:15-33",    nt:"Acts 27-28",                ot:"1 Kings 3 (Solomon's wisdom)",       psalm:"Psalm 57"   },
  { week:58, year:2, term:2, wisdom:"Proverbs 31",          nt:"Romans 1:1-17, 3:21-31",    ot:"1 Kings 8:22-53 (temple prayer)",    psalm:"Psalm 58"   },
  { week:59, year:2, term:2, wisdom:"Ecclesiastes 1",       nt:"Romans 5-6",                ot:"1 Kings 11:1-13 (Solomon's fall)",   psalm:"Psalm 59"   },
  { week:60, year:2, term:2, wisdom:"Ecclesiastes 2:1-16",  nt:"Romans 8",                  ot:"1 Kings 12:1-24 (kingdom splits)",   psalm:"Psalm 60"   },
  // Term 3: Romans + Kings + Elijah (Weeks 61–72)
  { week:61, year:2, term:3, wisdom:"Ecclesiastes 2:17-26", nt:"Romans 12",                 ot:"1 Kings 17 (Elijah begins)",         psalm:"Psalm 61"   },
  { week:62, year:2, term:3, wisdom:"Ecclesiastes 3:1-14",  nt:"Romans 15:1-13",            ot:"1 Kings 18 (Mount Carmel)",          psalm:"Psalm 62"   },
  { week:63, year:2, term:3, wisdom:"Ecclesiastes 3:15-22", nt:"1 Corinthians 1-2",         ot:"1 Kings 19 (still small voice)",     psalm:"Psalm 63"   },
  { week:64, year:2, term:3, wisdom:"Ecclesiastes 4",       nt:"1 Corinthians 13",          ot:"2 Kings 2:1-18 (Elijah taken)",      psalm:"Psalm 64"   },
  { week:65, year:2, term:3, wisdom:"Ecclesiastes 5:1-7",   nt:"1 Corinthians 15:1-28",     ot:"2 Kings 5 (Naaman)",                 psalm:"Psalm 65"   },
  { week:66, year:2, term:3, wisdom:"Ecclesiastes 5:8-20",  nt:"2 Corinthians 4-5",         ot:"2 Kings 17:1-23 (fall of Israel)",   psalm:"Psalm 66"   },
  { week:67, year:2, term:3, wisdom:"Ecclesiastes 6",       nt:"2 Corinthians 12:1-10",     ot:"2 Kings 22-23:3 (Josiah)",           psalm:"Psalm 67"   },
  { week:68, year:2, term:3, wisdom:"Ecclesiastes 7:1-14",  nt:"Galatians 2:15-21, 5:1-25", ot:"2 Kings 24-25:12 (exile begins)",    psalm:"Psalm 68"   },
  { week:69, year:2, term:3, wisdom:"Ecclesiastes 7:15-29", nt:"Ephesians 1-2:10",          ot:"1 Chronicles 28-29 (temple prep)",   psalm:"Psalm 69"   },
  { week:70, year:2, term:3, wisdom:"Ecclesiastes 8",       nt:"Ephesians 6:10-20",         ot:"2 Chronicles 20:1-30 (Jehoshaphat)", psalm:"Psalm 70"   },
  { week:71, year:2, term:3, wisdom:"Ecclesiastes 9",       nt:"Philippians 1-2:18",        ot:"2 Chronicles 34-35:19 (Josiah)",     psalm:"Psalm 71"   },
  { week:72, year:2, term:3, wisdom:"Ecclesiastes 10",      nt:"Philippians 4",             ot:"Isaiah 40 (Comfort my people)",      psalm:"Psalm 72"   },

  // YEAR 3 — "Exile, Return & New Creation"
  // Term 1: Prophets (Weeks 73–84)
  { week:73,  year:3, term:1, wisdom:"Ecclesiastes 11",      nt:"Colossians 1-2",            ot:"Isaiah 53 (suffering servant)",      psalm:"Psalm 73"   },
  { week:74,  year:3, term:1, wisdom:"Ecclesiastes 12",      nt:"Colossians 3:1-17",         ot:"Isaiah 55 (come, all who thirst)",   psalm:"Psalm 74"   },
  { week:75,  year:3, term:1, wisdom:"Proverbs 1:1-19",      nt:"1 Thessalonians 4-5",       ot:"Jeremiah 1 (the call)",              psalm:"Psalm 75"   },
  { week:76,  year:3, term:1, wisdom:"Proverbs 2",           nt:"2 Thessalonians 2-3",       ot:"Jeremiah 31:27-34 (new covenant)",   psalm:"Psalm 76"   },
  { week:77,  year:3, term:1, wisdom:"Proverbs 3:1-18",      nt:"1 Timothy 6",               ot:"Lamentations 3:1-33",                psalm:"Psalm 77"   },
  { week:78,  year:3, term:1, wisdom:"Proverbs 4:1-19",      nt:"2 Timothy 3-4",             ot:"Ezekiel 37 (valley of dry bones)",   psalm:"Psalm 78"   },
  { week:79,  year:3, term:1, wisdom:"Proverbs 5:1-14",      nt:"Titus 2-3",                 ot:"Amos 5:1-24 (let justice roll)",     psalm:"Psalm 79"   },
  { week:80,  year:3, term:1, wisdom:"Proverbs 6:1-19",      nt:"Hebrews 1-2",               ot:"Micah 6 (what does the Lord require)", psalm:"Psalm 80" },
  { week:81,  year:3, term:1, wisdom:"Proverbs 7",           nt:"Hebrews 4-5",               ot:"Habakkuk 3 (though the fig tree)",   psalm:"Psalm 81"   },
  { week:82,  year:3, term:1, wisdom:"Proverbs 8:1-21",      nt:"Hebrews 11",                ot:"Zephaniah 3:14-20",                  psalm:"Psalm 82"   },
  { week:83,  year:3, term:1, wisdom:"Proverbs 8:22-36",     nt:"Hebrews 12:1-13",           ot:"Malachi 3:1-4:6",                    psalm:"Psalm 83"   },
  { week:84,  year:3, term:1, wisdom:"Proverbs 9",           nt:"Hebrews 13",                ot:"Jonah 1-4 (complete)",               psalm:"Psalm 84"   },
  // Term 2: Daniel + Esther + Ezra/Nehemiah (Weeks 85–96)
  { week:85,  year:3, term:2, wisdom:"Proverbs 10:1-16",     nt:"James 1-2",                 ot:"Daniel 1 (purpose of heart)",        psalm:"Psalm 85"   },
  { week:86,  year:3, term:2, wisdom:"Proverbs 10:17-32",    nt:"James 3-5",                 ot:"Daniel 3 (fiery furnace)",           psalm:"Psalm 86"   },
  { week:87,  year:3, term:2, wisdom:"Proverbs 11:1-15",     nt:"1 Peter 1-2",               ot:"Daniel 6 (lions' den)",              psalm:"Psalm 87"   },
  { week:88,  year:3, term:2, wisdom:"Proverbs 11:16-31",    nt:"1 Peter 3-5",               ot:"Daniel 9:1-19 (Daniel's prayer)",    psalm:"Psalm 88"   },
  { week:89,  year:3, term:2, wisdom:"Proverbs 12:1-14",     nt:"2 Peter 1-3",               ot:"Esther 1-2 (Esther chosen)",         psalm:"Psalm 89"   },
  { week:90,  year:3, term:2, wisdom:"Proverbs 12:15-28",    nt:"1 John 1-2",                ot:"Esther 3-5 (Haman's plot)",          psalm:"Psalm 90"   },
  { week:91,  year:3, term:2, wisdom:"Proverbs 13:1-12",     nt:"1 John 3-4",                ot:"Esther 7-9:17 (rescue)",             psalm:"Psalm 91"   },
  { week:92,  year:3, term:2, wisdom:"Proverbs 13:13-25",    nt:"1 John 5, 2 John, 3 John",  ot:"Ezra 1, 3 (return, altar rebuilt)",  psalm:"Psalm 92"   },
  { week:93,  year:3, term:2, wisdom:"Proverbs 14:1-18",     nt:"Jude",                      ot:"Ezra 7-8:23 (Ezra's journey)",       psalm:"Psalm 93"   },
  { week:94,  year:3, term:2, wisdom:"Proverbs 14:19-35",    nt:"Revelation 1",              ot:"Nehemiah 1-2 (prayer, journey)",     psalm:"Psalm 94"   },
  { week:95,  year:3, term:2, wisdom:"Proverbs 15:1-17",     nt:"Revelation 4-5",            ot:"Nehemiah 4, 6:15-16 (the wall)",     psalm:"Psalm 95"   },
  { week:96,  year:3, term:2, wisdom:"Proverbs 15:18-33",    nt:"Revelation 12-13",          ot:"Nehemiah 8 (Ezra reads the Law)",    psalm:"Psalm 96"   },
  // Term 3: Job + Revelation + Closing (Weeks 97–108)
  { week:97,  year:3, term:3, wisdom:"Proverbs 16:1-16",     nt:"Revelation 17-18",          ot:"Job 1-2 (the testing)",              psalm:"Psalm 97"   },
  { week:98,  year:3, term:3, wisdom:"Proverbs 16:17-33",    nt:"Revelation 19-20",          ot:"Job 3 (Job's lament)",               psalm:"Psalm 98"   },
  { week:99,  year:3, term:3, wisdom:"Proverbs 17:1-14",     nt:"Revelation 21",             ot:"Job 38-39 (God's answer)",           psalm:"Psalm 99"   },
  { week:100, year:3, term:3, wisdom:"Proverbs 17:15-28",    nt:"Revelation 22",             ot:"Job 40:1-9, 42:1-17 (restoration)",  psalm:"Psalm 100"  },
  { week:101, year:3, term:3, wisdom:"Proverbs 18:1-12",     nt:"Romans 1:1-17",             ot:"Isaiah 6 (the call of Isaiah)",      psalm:"Psalm 101"  },
  { week:102, year:3, term:3, wisdom:"Proverbs 18:13-24",    nt:"Romans 8",                  ot:"Isaiah 61 (the Spirit of the Lord)", psalm:"Psalm 102"  },
  { week:103, year:3, term:3, wisdom:"Proverbs 19:1-15",     nt:"Romans 12",                 ot:"Ezekiel 36:22-36 (new heart)",       psalm:"Psalm 103"  },
  { week:104, year:3, term:3, wisdom:"Proverbs 19:16-29",    nt:"Ephesians 1-2:10",          ot:"Zechariah 8:1-17",                   psalm:"Psalm 104"  },
  { week:105, year:3, term:3, wisdom:"Proverbs 20:1-16",     nt:"Ephesians 3-4",             ot:"Zechariah 9:9-10, 12:10, 14:1-9",   psalm:"Psalm 105"  },
  { week:106, year:3, term:3, wisdom:"Proverbs 20:17-30",    nt:"Philippians 1-2",           ot:"Nehemiah 9:1-38 (great confession)", psalm:"Psalm 106"  },
  { week:107, year:3, term:3, wisdom:"Proverbs 21:1-16",     nt:"Colossians 3:1-17",         ot:"Isaiah 65:17-25 (new creation)",     psalm:"Psalm 107"  },
  { week:108, year:3, term:3, wisdom:"Proverbs 21:17-31",    nt:"1 John 4:7-21",             ot:"Revelation 22:1-5 (river of life)",  psalm:"Psalm 108"  },
];

// ── Track config ──────────────────────────────────────────────────────────────
const TRACKS = [
  {
    key: "wisdom",
    day: "Day 1",
    dayName: "Monday",
    label: "Proverbs & Wisdom",
    short: "Wisdom",
    icon: "◈",
    color: "#7A6A55",
    light: "#F7F4EF",
    prompt: "Which piece of wisdom caught your attention most? What would it look like to actually live that out this week?",
    note: "For Ecclesiastes: What is the Preacher saying about life — and does it match what you see in the world around you?",
  },
  {
    key: "nt",
    day: "Day 2",
    dayName: "Tuesday",
    label: "New Testament",
    short: "NT",
    icon: "✝",
    color: "#4A7C7E",
    light: "#EAF2F2",
    prompt: "Tell back what happened or what was said, in your own words. What stands out most to you?",
    note: "If narration is thin, gently ask: What do you think Jesus meant by this? Or — why do you think this was included here?",
  },
  {
    key: "ot",
    day: "Day 3",
    dayName: "Wednesday–Thursday",
    label: "Old Testament",
    short: "OT",
    icon: "✦",
    color: "#A9B786",
    light: "#EFF4EA",
    prompt: "Tell the story back — what happened, who was involved, and what changed by the end?",
    note: "For law or lists: What does this reveal about what God cares about? What does it show us about his character?",
  },
  {
    key: "psalm",
    day: "Day 4",
    dayName: "Friday",
    label: "Psalm",
    short: "Psalm",
    icon: "♪",
    color: "#C29B61",
    light: "#FAF3E8",
    prompt: "Read it slowly — perhaps twice. Let it settle. No narration required today. Simply receive it.",
    note: "On hard mornings, let the Psalm do the work. It holds what words sometimes cannot.",
  },
];

// ── State helpers ─────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  wisdom_week: 0,
  nt_week:     0,
  ot_week:     0,
  psalm_week:  0,
  onboarded:   false, // false = show the start picker on first launch
};

function loadLocal() {
  try {
    const raw = localStorage.getItem("living_feast_v1");
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch { return DEFAULT_STATE; }
}

function saveLocal(s) {
  try { localStorage.setItem("living_feast_v1", JSON.stringify(s)); } catch {}
}

function getReading(state, track) {
  const idx = Math.min(state[`${track}_week`] ?? 0, SCHEDULE.length - 1);
  return SCHEDULE[idx]?.[track] || null;
}

function getWeekMeta(state, track) {
  const idx = Math.min(state[`${track}_week`] ?? 0, SCHEDULE.length - 1);
  const w = SCHEDULE[idx];
  if (!w) return "";
  return `Year ${w.year} · Week ${w.week}`;
}

function advanceTrack(state, track) {
  const key = `${track}_week`;
  const next = Math.min((state[key] ?? 0) + 1, SCHEDULE.length - 1);
  return { ...state, [key]: next };
}

function getSuggested(state) {
  return TRACKS.reduce((behind, t) =>
    (state[`${t.key}_week`] ?? 0) < (state[`${behind.key}_week`] ?? 0) ? t : behind
  , TRACKS[0]);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BibleReadingScreen({ compact = false, userId = null, onNavigate = null }) {
  const [state, setState]   = useState(loadLocal);
  const [active, setActive] = useState(() => getSuggested(loadLocal()).key);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);

  const suggested = getSuggested(state);
  const track     = TRACKS.find(t => t.key === active);
  const reading   = getReading(state, active);
  const weekMeta  = getWeekMeta(state, active);

  // Load from Supabase on mount
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("bible_reading_progress")
      .select("track, week_index")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (!data?.length) return;
        const merged = { ...DEFAULT_STATE };
        data.forEach(row => { merged[`${row.track}_week`] = row.week_index; });
        setState(merged);
        saveLocal(merged);
      });
  }, [userId]);

  const persist = async (newState) => {
    setState(newState);
    saveLocal(newState);
    if (!userId) return;
    setSaving(true);
    // Upsert each track independently
    const upserts = TRACKS.map(t => ({
      user_id: userId,
      track: t.key,
      week_index: newState[`${t.key}_week`] ?? 0,
    }));
    await supabase
      .from("bible_reading_progress")
      .upsert(upserts, { onConflict: "user_id,track" });
    setSaving(false);
  };

  const markDone = async () => {
    const next = advanceTrack(state, active);
    await persist(next);
    setActive(getSuggested(next).key);
  };

  // ── Start picker (shown once on first open, or via gear) ────────────────────
  if (!state.onboarded) {
    return (
      <StartPicker
        compact={compact}
        onComplete={(picks) => {
          const next = { ...DEFAULT_STATE, ...picks, onboarded: true };
          persist(next);
          setActive(getSuggested(next).key);
        }}
      />
    );
  }
  if (compact) {
    const activeIdx = state[`${active}_week`] ?? 0;
    return (
      <div
        style={{ borderLeft: `3px solid ${track.color}`, paddingLeft: "12px", margin: "6px 0", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        {/* Track tabs + gear */}
        <div style={{ display: "flex", gap: "5px", marginBottom: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {TRACKS.map(t => {
            const isActive = t.key === active;
            const isSuggested = t.key === suggested.key;
            return (
              <button key={t.key} onClick={() => setActive(t.key)} style={{
                background: isActive ? t.color : "transparent",
                color: isActive ? "white" : t.color,
                border: `1.5px solid ${t.color}`,
                borderRadius: "20px", padding: "2px 9px",
                fontSize: "10px", fontFamily: "system-ui", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: "3px",
                opacity: isActive ? 1 : 0.65,
              }}>
                <span>{t.icon}</span><span>{t.short}</span>
                {isSuggested && !isActive && <span style={{ fontSize: "6px" }}>●</span>}
              </button>
            );
          })}
          <button onClick={() => setShowSettings(true)} style={{
            marginLeft: "auto", background: "none", border: "none",
            cursor: "pointer", color: "#C4B89A", fontSize: "14px", padding: "0 2px",
          }} title="Adjust reading position">⚙</button>
        </div>
        {/* Reference */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "#2D3748", lineHeight: 1.3 }}>
            {reading ? reading : <span style={{ color: "#9CA3AF", fontStyle: "italic", fontSize: "14px" }}>No reading this week</span>}
          </p>
          {reading && (
            <button onClick={markDone} style={{
              background: track.color, color: "white", border: "none", borderRadius: "5px",
              padding: "4px 12px", fontSize: "11px", fontFamily: "system-ui", fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", marginLeft: "10px", flexShrink: 0,
            }}>
              Done →
            </button>
          )}
        </div>
        <p style={{ margin: "3px 0 0", fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF" }}>
          {getWeekMeta(state, active)} {saving ? "· saving..." : ""}
        </p>
        {showSettings && <SettingsSheet state={state} persist={persist} onClose={() => setShowSettings(false)} />}
      </div>
    );
  }

  // ── Full screen ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", fontFamily: "'Cormorant Garamond', Georgia, serif", paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8E4DC", padding: "20px 24px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {onNavigate && (
              <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B89A", fontSize: "22px", padding: 0, lineHeight: 1, marginRight: "2px" }}>
                ‹
              </button>
            )}
            <FlameIcon size={22} color="#C29B61" />
            <div>
              <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "9px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                The Living Feast
              </p>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "#2D3748" }}>
                {reading || "—"}
              </h1>
              <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF" }}>
                {weekMeta}{saving ? " · saving..." : ""}
              </p>
            </div>
          </div>
          <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", fontSize: "17px", cursor: "pointer", color: "#C4B89A", marginTop: "4px" }}>⚙</button>
        </div>

        {/* Day tabs */}
        <div style={{ display: "flex", borderTop: "1px solid #F0EBE0" }}>
          {TRACKS.map(t => {
            const isActive = t.key === active;
            const isSuggested = t.key === suggested.key;
            const ref = getReading(state, t.key);
            return (
              <button key={t.key} onClick={() => setActive(t.key)} style={{
                flex: 1, padding: "10px 4px 12px", background: "none", border: "none",
                borderBottom: isActive ? `3px solid ${t.color}` : "3px solid transparent",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              }}>
                <span style={{ fontSize: "13px", color: isActive ? t.color : "#BDB5A8" }}>{t.icon}</span>
                <span style={{ fontFamily: "system-ui", fontSize: "8px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: isActive ? t.color : "#BDB5A8" }}>{t.short}</span>
                <span style={{ fontFamily: "system-ui", fontSize: "8px", color: isActive ? "#4A5568" : "#C4B89A", textAlign: "center", maxWidth: "64px", lineHeight: 1.3 }}>{ref || "—"}</span>
                {isSuggested && <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: t.color, display: "block", opacity: isActive ? 0 : 0.55, marginTop: "1px" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Off-suggested note */}
      {active !== suggested.key && (
        <div style={{ margin: "14px 24px 0", padding: "8px 14px", background: "#F7F5F0", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: suggested.color }}>{suggested.icon}</span>
          <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "11px", color: "#9CA3AF" }}>
            Suggested today: <span style={{ color: suggested.color, fontWeight: 700 }}>{suggested.label}</span> — but read what calls to you.
          </p>
        </div>
      )}

      {/* Reading card */}
      <div style={{ padding: "20px 24px" }}>

        {/* Memory verse */}
        <MemoryVerseCard weekNumber={SCHEDULE[state[`${active}_week`] ?? 0]?.week || 1} />
        <div style={{
          background: "white", borderRadius: "14px", padding: "28px 24px",
          borderTop: `4px solid ${track.color}`,
          border: `1px solid ${track.light}`,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)", textAlign: "center", marginBottom: "16px",
        }}>
          <p style={{ margin: "0 0 4px", fontFamily: "system-ui", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: track.color }}>{track.label}</p>
          <p style={{ margin: "0 0 2px", fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF" }}>{track.dayName}</p>
          <p style={{ margin: 0, fontSize: "26px", fontWeight: 600, color: "#2D3748", lineHeight: 1.3 }}>
            {reading || <span style={{ color: "#9CA3AF", fontStyle: "italic", fontSize: "18px" }}>No reading this week</span>}
          </p>
        </div>

        {/* Narration prompt */}
        <div style={{ background: "white", borderRadius: "12px", padding: "18px 20px", border: "1px solid #E8E4DC", marginBottom: "10px" }}>
          <p style={{ margin: "0 0 8px", fontFamily: "system-ui", fontSize: "10px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            After Reading
          </p>
          <p style={{ margin: 0, fontSize: "16px", color: "#4A5568", lineHeight: 1.85, fontStyle: "italic" }}>
            "{track.prompt}"
          </p>
        </div>

        {/* Track note */}
        <div style={{ background: track.key === "psalm" ? "#FAF3E8" : "#F7F5F0", borderRadius: "10px", padding: "14px 16px", borderLeft: `3px solid ${track.color}`, marginBottom: "16px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#6B7280", lineHeight: 1.75, fontStyle: "italic" }}>
            {active === "wisdom" && reading?.toLowerCase().includes("ecclesiastes")
              ? "For Ecclesiastes: What is the Preacher saying about life — and does it match what you see in the world around you?"
              : track.note}
          </p>
        </div>

        {/* Full week at a glance */}
        <p style={{ margin: "0 0 10px", fontFamily: "system-ui", fontSize: "10px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          This Week's Full Feast
        </p>
        {TRACKS.map(t => {
          const isActive = t.key === active;
          const ref = getReading(state, t.key);
          return (
            <div key={t.key} onClick={() => setActive(t.key)} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "8px", marginBottom: "6px",
              background: isActive ? "#F7F5F0" : "white",
              border: `1px solid ${isActive ? "#E8E4DC" : "#F0EBE0"}`,
              cursor: "pointer",
            }}>
              <span style={{ color: t.color, fontSize: "14px", flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "9px", fontWeight: 700, color: t.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {t.day} · {t.dayName}
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "#2D3748" }}>{ref || "—"}</p>
              </div>
              {isActive && <span style={{ color: track.color, fontSize: "10px" }}>●</span>}
            </div>
          );
        })}
      </div>

      {/* Bottom button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #E8E4DC", padding: "14px 24px" }}>
        <button onClick={markDone} disabled={!reading} style={{
          width: "100%", background: reading ? track.color : "#E8E4DC", color: "white",
          border: "none", borderRadius: "12px", padding: "14px",
          fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 700, cursor: reading ? "pointer" : "default", letterSpacing: "0.03em",
        }}>
          We read it — move on →
        </button>
      </div>

      {showSettings && <SettingsSheet state={state} persist={persist} onClose={() => setShowSettings(false)} />}
    </div>
  );
}

// ── Settings sheet (shared by compact and full screen) ────────────────────────
function SettingsSheet({ state, persist, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "white", borderRadius: "20px 20px 0 0", padding: "24px 24px 48px", maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#2D3748", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Adjust Your Position
          </h2>
          <button onClick={onClose} style={{ background: "#F3F0E8", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "16px", cursor: "pointer", color: "#6B7280" }}>×</button>
        </div>
        <p style={{ margin: "0 0 20px", fontFamily: "system-ui", fontSize: "12px", color: "#9CA3AF", lineHeight: 1.6 }}>
          Each track saves independently. Use arrows to move forward or back one week.
        </p>
        {TRACKS.map(t => {
          const key  = `${t.key}_week`;
          const idx  = state[key] ?? 0;
          const ref  = getReading(state, t.key);
          const meta = getWeekMeta(state, t.key);
          return (
            <div key={t.key} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #F0EBE0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ color: t.color }}>{t.icon}</span>
                <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "11px", fontWeight: 700, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.label}</p>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "15px", color: "#2D3748" }}>{ref || "No reading"}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => persist({ ...state, [key]: Math.max(0, idx - 1) })}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F3F0E8", border: "none", cursor: "pointer", fontSize: "16px", color: "#6B7280" }}>←</button>
                <span style={{ fontFamily: "system-ui", fontSize: "11px", color: "#9CA3AF", minWidth: "110px", textAlign: "center" }}>{meta}</span>
                <button onClick={() => persist({ ...state, [key]: Math.min(SCHEDULE.length - 1, idx + 1) })}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F3F0E8", border: "none", cursor: "pointer", fontSize: "16px", color: "#6B7280" }}>→</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Start picker ──────────────────────────────────────────────────────────────
// Shown on first open. Lets users pick their starting week for each track.
// Groups SCHEDULE by track into searchable lists.

function StartPicker({ compact, onComplete }) {
  const [step, setStep] = useState(0); // 0=welcome, 1-4=track pickers
  const [picks, setPicks] = useState({
    wisdom_week: 0,
    nt_week:     0,
    ot_week:     0,
    psalm_week:  0,
  });

  const steps = [
    { key: "welcome" },
    ...TRACKS.map(t => ({ key: t.key, track: t })),
  ];

  const current = steps[step];
  const isLast  = step === steps.length - 1;

  // Build unique reading list per track for the dropdown
  const getOptions = (trackKey) =>
    SCHEDULE.map((w, idx) => ({ idx, ref: w[trackKey], year: w.year, week: w.week }))
      .filter(o => o.ref);

  const containerStyle = compact
    ? { background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #E8E4DC", fontFamily: "'Cormorant Garamond', Georgia, serif" }
    : { minHeight: "100vh", background: "#FAFAF7", fontFamily: "'Cormorant Garamond', Georgia, serif", paddingBottom: "80px" };

  return (
    <div
      style={containerStyle}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
    >
      {/* Progress bar */}
      {step > 0 && (
        <div style={{ height: "3px", background: "#E8E4DC", marginBottom: "24px", borderRadius: "2px" }}>
          <div style={{ height: "100%", background: "#C29B61", borderRadius: "2px", width: `${(step / (steps.length - 1)) * 100}%`, transition: "width 0.3s ease" }} />
        </div>
      )}

      <div style={{ padding: compact ? "0" : "32px 24px 100px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Welcome */}
        {step === 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <FlameIcon size={32} color="#C29B61" />
              <div>
                <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Delight & Savor
                </p>
                <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 600, color: "#2D3748" }}>
                  The Living Feast
                </h2>
              </div>
            </div>
            <p style={{ margin: "0 0 16px", fontSize: "17px", color: "#6B7280", lineHeight: 1.7, fontStyle: "italic" }}>
              A three-year feast through the whole story of Scripture.
            </p>
            <div style={{ margin: "16px 0 20px" }}>
              {TRACKS.map(t => (
                <div key={t.key} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "7px", background: t.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: t.color, flexShrink: 0 }}>
                    {t.icon}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "10px", fontWeight: 700, color: t.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.dayName}</p>
                    <p style={{ margin: 0, fontSize: "15px", color: "#4A5568" }}>{t.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#9CA3AF", fontStyle: "italic", lineHeight: 1.7 }}>
              Already partway through a reading program? Next you'll choose where each track begins.
            </p>
          </div>
        )}

        {/* Track picker */}
        {step > 0 && current.track && (() => {
          const t = current.track;
          const options = getOptions(t.key);
          const currentIdx = picks[`${t.key}_week`];
          const currentRef = options.find(o => o.idx === currentIdx);
          return (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "22px", color: t.color }}>{t.icon}</span>
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: "#2D3748" }}>{t.label}</h2>
              </div>
              <p style={{ margin: "0 0 6px", fontFamily: "system-ui", fontSize: "10px", color: t.color, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {t.dayName}
              </p>
              <p style={{ margin: "0 0 20px", fontSize: "15px", color: "#6B7280", lineHeight: 1.7 }}>
                Where would you like to begin? Start from the beginning or choose any passage.
              </p>

              {/* Current selection display */}
              <div style={{ background: t.light, borderRadius: "10px", padding: "14px 16px", marginBottom: "16px", borderLeft: `3px solid ${t.color}` }}>
                <p style={{ margin: "0 0 2px", fontFamily: "system-ui", fontSize: "10px", fontWeight: 700, color: t.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>Starting at</p>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "#2D3748" }}>
                  {currentRef?.ref || options[0]?.ref}
                </p>
                <p style={{ margin: "2px 0 0", fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF" }}>
                  Year {currentRef?.year || 1} · Week {currentRef?.week || 1}
                </p>
              </div>

              {/* Dropdown selector */}
              <label style={{ display: "block", fontFamily: "system-ui", fontSize: "10px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                Choose a different starting point
              </label>
              <select
                value={currentIdx}
                onChange={e => setPicks(prev => ({ ...prev, [`${t.key}_week`]: parseInt(e.target.value) }))}
                style={{ width: "100%", padding: "12px 14px", border: "2px solid #E8E4DC", borderRadius: "10px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", color: "#2D3748", background: "white", appearance: "none", cursor: "pointer" }}
              >
                {options.map(o => (
                  <option key={o.idx} value={o.idx}>
                    Y{o.year} W{o.week} — {o.ref}
                  </option>
                ))}
              </select>
            </div>
          );
        })()}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: compact ? "relative" : "fixed",
        bottom: 0, left: 0, right: 0,
        background: "white", borderTop: compact ? "none" : "1px solid #E8E4DC",
        padding: compact ? "16px 0 0" : "14px 24px",
        display: "flex", gap: "10px",
      }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 18px", background: "#F3F0E8", border: "none", borderRadius: "10px", fontFamily: "system-ui", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>
            ← Back
          </button>
        )}
        <button
          onClick={() => isLast ? onComplete(picks) : setStep(s => s + 1)}
          style={{ flex: 1, background: "#C29B61", color: "white", border: "none", borderRadius: "10px", padding: "13px", fontSize: "16px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em" }}
        >
          {isLast ? "Begin The Living Feast →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
