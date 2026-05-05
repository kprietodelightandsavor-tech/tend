// src/data/family-bible-seed.js
// Four independent Bible reading streams for family homeschool.
// Each stream advances independently as you check off readings.

// ─────────────────────────────────────────────────────────────────────
// STREAM 1: OLD TESTAMENT
// Simply Charlotte Mason — The Story of God and His People (72 lessons)
// ─────────────────────────────────────────────────────────────────────
export const OT_READINGS = [
  { id: "ot-1",  label: "God Creates",                     reference: "Genesis 1:1—2:3" },
  { id: "ot-2",  label: "Creation Details",                reference: "Genesis 2:4–25" },
  { id: "ot-3",  label: "Adam and Eve Sin",                reference: "Genesis 3" },
  { id: "ot-4",  label: "Cain Kills Abel",                 reference: "Genesis 4" },
  { id: "ot-5",  label: "Noah Builds the Ark",             reference: "Genesis 6:1—7:5" },
  { id: "ot-6",  label: "The Waters Prevail",              reference: "Genesis 7:6—8:14" },
  { id: "ot-7",  label: "The Ark Lands",                   reference: "Genesis 8:15—9:17" },
  { id: "ot-8",  label: "God's Promise",                   reference: "Genesis 9:18—10:32" },
  { id: "ot-9",  label: "The Languages Confused",          reference: "Genesis 11:1–9" },
  { id: "ot-10", label: "The Testing of Job",              reference: "Job 1—2; 38—42" },
  { id: "ot-11", label: "Abram Goes to Egypt",             reference: "Genesis 11:27—12:20" },
  { id: "ot-12", label: "Abram Separates from Lot",        reference: "Genesis 13—14" },
  { id: "ot-13", label: "Hagar Bears Ishmael",             reference: "Genesis 15—16" },
  { id: "ot-14", label: "God Confirms the Covenant Again", reference: "Genesis 17" },
  { id: "ot-15", label: "Sarah Is Promised a Son",         reference: "Genesis 18:1–15" },
  { id: "ot-16", label: "Abraham Pleads for Sodom",        reference: "Genesis 18:16–33" },
  { id: "ot-17", label: "God Destroys Sodom and Gomorrah", reference: "Genesis 19" },
  { id: "ot-18", label: "Abraham Lies about Sarah Again",  reference: "Genesis 20" },
  { id: "ot-19", label: "Isaac Is Born",                   reference: "Genesis 21" },
  { id: "ot-20", label: "Abraham Offers Isaac",            reference: "Genesis 22" },
  { id: "ot-21", label: "Sarah Dies",                      reference: "Genesis 23" },
  { id: "ot-22", label: "A Wife for Isaac",                reference: "Genesis 24" },
  { id: "ot-23", label: "Exam",                            reference: "Review Lessons 1–22", isExam: true },
  { id: "ot-24", label: "Exam",                            reference: "Review Lessons 1–22", isExam: true },
  { id: "ot-25", label: "Esau Sells His Birthright",       reference: "Genesis 25" },
  { id: "ot-26", label: "Isaac Lies about Rebekah",        reference: "Genesis 26" },
  { id: "ot-27", label: "Jacob Steals the Blessing",       reference: "Genesis 27" },
  { id: "ot-28", label: "Jacob Flees",                     reference: "Genesis 28" },
  { id: "ot-29", label: "Jacob with Laban",                reference: "Genesis 29—30" },
  { id: "ot-30", label: "Jacob's Sons and Flocks",         reference: "Genesis 30:25–43" },
  { id: "ot-31", label: "Jacob Flees from Laban",          reference: "Genesis 31" },
  { id: "ot-32", label: "Jacob Fears Esau",                reference: "Genesis 32" },
  { id: "ot-33", label: "Jacob Meets Esau Again",          reference: "Genesis 33" },
  { id: "ot-34", label: "Grief Comes to Jacob",            reference: "Genesis 34—35" },
  { id: "ot-35", label: "Joseph Is Sold",                  reference: "Genesis 37" },
  { id: "ot-36", label: "Joseph Is Thrown into Prison",    reference: "Genesis 39" },
  { id: "ot-37", label: "The Cupbearer and the Baker",     reference: "Genesis 40" },
  { id: "ot-38", label: "Joseph Is Released from Prison",  reference: "Genesis 41" },
  { id: "ot-39", label: "Jacob Sends His Sons to Egypt",   reference: "Genesis 42" },
  { id: "ot-40", label: "Joseph's Brothers Return to Egypt", reference: "Genesis 43" },
  { id: "ot-41", label: "Joseph Tests His Brothers",       reference: "Genesis 44" },
  { id: "ot-42", label: "Joseph Reveals Himself to His Brothers", reference: "Genesis 45" },
  { id: "ot-43", label: "Jacob Moves His Family to Egypt", reference: "Genesis 46" },
  { id: "ot-44", label: "Jacob's Household Settles in Egypt", reference: "Genesis 47" },
  { id: "ot-45", label: "Jacob's Final Blessings",         reference: "Genesis 48—49" },
  { id: "ot-46", label: "Jacob and Joseph Die",            reference: "Genesis 50" },
  { id: "ot-47", label: "Exam",                            reference: "Review Lessons 25–46", isExam: true },
  { id: "ot-48", label: "Exam",                            reference: "Review Lessons 25–46", isExam: true },
  { id: "ot-49", label: "The Israelites Enslaved",         reference: "Exodus 1" },
  { id: "ot-50", label: "Moses Is Born",                   reference: "Exodus 2" },
  { id: "ot-51", label: "The Burning Bush",                reference: "Exodus 3—4:17" },
  { id: "ot-52", label: "Moses Prepares to Return to Egypt", reference: "Exodus 4:18–31" },
  { id: "ot-53", label: "Brick-making Becomes Harder",     reference: "Exodus 5—6" },
  { id: "ot-54", label: "The Plague of Blood",             reference: "Exodus 7" },
  { id: "ot-55", label: "The Plagues of Frogs, Gnats, and Flies", reference: "Exodus 8" },
  { id: "ot-56", label: "The Plagues on Livestock, of Boils, and of Hail", reference: "Exodus 9" },
  { id: "ot-57", label: "The Plagues of Locusts and Darkness", reference: "Exodus 10" },
  { id: "ot-58", label: "The Passover Explained",          reference: "Exodus 11—12:30" },
  { id: "ot-59", label: "The Plague of the Death of the Firstborn", reference: "Exodus 12:31—13:22" },
  { id: "ot-60", label: "Israel Crosses the Red Sea",      reference: "Exodus 14—15" },
  { id: "ot-61", label: "God Provides Water and Food",     reference: "Exodus 16" },
  { id: "ot-62", label: "God Provides Water and Victory",  reference: "Exodus 17" },
  { id: "ot-63", label: "Moses Gets Help",                 reference: "Exodus 18" },
  { id: "ot-64", label: "Israel at Mount Sinai",           reference: "Exodus 19" },
  { id: "ot-65", label: "God Gives the Law",               reference: "Exodus 20" },
  { id: "ot-66", label: "Moses on the Mountain",           reference: "Exodus 24" },
  { id: "ot-67", label: "The Golden Calf",                 reference: "Exodus 32" },
  { id: "ot-68", label: "Broken Covenant",                 reference: "Exodus 33" },
  { id: "ot-69", label: "The Covenant Renewed",            reference: "Exodus 34" },
  { id: "ot-70", label: "The Tent of Meeting",             reference: "Exodus 40" },
  { id: "ot-71", label: "Exam",                            reference: "Review Lessons 49–70", isExam: true },
  { id: "ot-72", label: "Exam",                            reference: "Review Lessons 49–70", isExam: true },
];

// ─────────────────────────────────────────────────────────────────────
// STREAM 2: NEW TESTAMENT
// Bible Recap order, broken into 12–30 verse chunks at natural section breaks.
// Roughly follows NIrV section headings (using common modern Bible breaks).
// ─────────────────────────────────────────────────────────────────────
export const NT_READINGS = [
  // ─── Day 274: Luke 1; John 1 ───
  { id: "nt-1",  reference: "Luke 1:1–25" },
  { id: "nt-2",  reference: "Luke 1:26–56" },
  { id: "nt-3",  reference: "Luke 1:57–80" },
  { id: "nt-4",  reference: "John 1:1–18" },
  { id: "nt-5",  reference: "John 1:19–51" },

  // ─── Day 275: Matthew 1; Luke 2 ───
  { id: "nt-6",  reference: "Matthew 1" },
  { id: "nt-7",  reference: "Luke 2:1–20" },
  { id: "nt-8",  reference: "Luke 2:21–40" },
  { id: "nt-9",  reference: "Luke 2:41–52" },

  // ─── Day 276: Matthew 2 ───
  { id: "nt-10", reference: "Matthew 2:1–12" },
  { id: "nt-11", reference: "Matthew 2:13–23" },

  // ─── Day 277: Matthew 3; Mark 1; Luke 3 ───
  { id: "nt-12", reference: "Matthew 3" },
  { id: "nt-13", reference: "Mark 1:1–20" },
  { id: "nt-14", reference: "Mark 1:21–45" },
  { id: "nt-15", reference: "Luke 3:1–22" },
  { id: "nt-16", reference: "Luke 3:23–38" },

  // ─── Day 278: Matthew 4; Luke 4–5 ───
  { id: "nt-17", reference: "Matthew 4:1–11" },
  { id: "nt-18", reference: "Matthew 4:12–25" },
  { id: "nt-19", reference: "Luke 4:1–30" },
  { id: "nt-20", reference: "Luke 4:31–44" },
  { id: "nt-21", reference: "Luke 5:1–16" },
  { id: "nt-22", reference: "Luke 5:17–39" },

  // ─── Day 279: John 2–4 ───
  { id: "nt-23", reference: "John 2" },
  { id: "nt-24", reference: "John 3:1–21" },
  { id: "nt-25", reference: "John 3:22–36" },
  { id: "nt-26", reference: "John 4:1–26" },
  { id: "nt-27", reference: "John 4:27–54" },

  // ─── Day 280: Matthew 8; Mark 2 ───
  { id: "nt-28", reference: "Matthew 8:1–17" },
  { id: "nt-29", reference: "Matthew 8:18–34" },
  { id: "nt-30", reference: "Mark 2" },

  // ─── Day 281: John 5 ───
  { id: "nt-31", reference: "John 5:1–24" },
  { id: "nt-32", reference: "John 5:25–47" },

  // ─── Day 282: Matthew 12; Mark 3; Luke 6 ───
  { id: "nt-33", reference: "Matthew 12:1–21" },
  { id: "nt-34", reference: "Matthew 12:22–50" },
  { id: "nt-35", reference: "Mark 3" },
  { id: "nt-36", reference: "Luke 6:1–26" },
  { id: "nt-37", reference: "Luke 6:27–49" },

  // ─── Day 283: Matthew 5–7 (Sermon on the Mount) ───
  { id: "nt-38", reference: "Matthew 5:1–20" },
  { id: "nt-39", reference: "Matthew 5:21–48" },
  { id: "nt-40", reference: "Matthew 6:1–18" },
  { id: "nt-41", reference: "Matthew 6:19–34" },
  { id: "nt-42", reference: "Matthew 7" },

  // ─── Day 284: Matthew 9; Luke 7 ───
  { id: "nt-43", reference: "Matthew 9:1–17" },
  { id: "nt-44", reference: "Matthew 9:18–38" },
  { id: "nt-45", reference: "Luke 7:1–17" },
  { id: "nt-46", reference: "Luke 7:18–50" },

  // ─── Day 285: Matthew 11 ───
  { id: "nt-47", reference: "Matthew 11" },

  // ─── Day 286: Luke 11 ───
  { id: "nt-48", reference: "Luke 11:1–28" },
  { id: "nt-49", reference: "Luke 11:29–54" },

  // ─── Day 287: Matthew 13; Luke 8 ───
  { id: "nt-50", reference: "Matthew 13:1–23" },
  { id: "nt-51", reference: "Matthew 13:24–58" },
  { id: "nt-52", reference: "Luke 8:1–25" },
  { id: "nt-53", reference: "Luke 8:26–56" },

  // ─── Day 288: Mark 4–5 ───
  { id: "nt-54", reference: "Mark 4" },
  { id: "nt-55", reference: "Mark 5:1–20" },
  { id: "nt-56", reference: "Mark 5:21–43" },

  // ─── Day 289: Matthew 10 ───
  { id: "nt-57", reference: "Matthew 10:1–23" },
  { id: "nt-58", reference: "Matthew 10:24–42" },

  // ─── Day 290: Matthew 14; Mark 6; Luke 9 ───
  { id: "nt-59", reference: "Matthew 14:1–21" },
  { id: "nt-60", reference: "Matthew 14:22–36" },
  { id: "nt-61", reference: "Mark 6:1–29" },
  { id: "nt-62", reference: "Mark 6:30–56" },
  { id: "nt-63", reference: "Luke 9:1–27" },
  { id: "nt-64", reference: "Luke 9:28–62" },

  // ─── Day 291: John 6 ───
  { id: "nt-65", reference: "John 6:1–24" },
  { id: "nt-66", reference: "John 6:25–59" },
  { id: "nt-67", reference: "John 6:60–71" },

  // ─── Day 292: Matthew 15; Mark 7 ───
  { id: "nt-68", reference: "Matthew 15:1–20" },
  { id: "nt-69", reference: "Matthew 15:21–39" },
  { id: "nt-70", reference: "Mark 7" },

  // ─── Day 293: Matthew 16; Mark 8 ───
  { id: "nt-71", reference: "Matthew 16" },
  { id: "nt-72", reference: "Mark 8" },

  // ─── Day 294: Matthew 17; Mark 9 ───
  { id: "nt-73", reference: "Matthew 17" },
  { id: "nt-74", reference: "Mark 9:1–29" },
  { id: "nt-75", reference: "Mark 9:30–50" },

  // ─── Day 295: Matthew 18 ───
  { id: "nt-76", reference: "Matthew 18:1–20" },
  { id: "nt-77", reference: "Matthew 18:21–35" },

  // ─── Day 296: John 7–8 ───
  { id: "nt-78", reference: "John 7:1–24" },
  { id: "nt-79", reference: "John 7:25–53" },
  { id: "nt-80", reference: "John 8:1–30" },
  { id: "nt-81", reference: "John 8:31–59" },

  // ─── Day 297: John 9–10 ───
  { id: "nt-82", reference: "John 9:1–23" },
  { id: "nt-83", reference: "John 9:24–41" },
  { id: "nt-84", reference: "John 10:1–21" },
  { id: "nt-85", reference: "John 10:22–42" },

  // ─── Day 298: Luke 10 ───
  { id: "nt-86", reference: "Luke 10:1–24" },
  { id: "nt-87", reference: "Luke 10:25–42" },

  // ─── Day 299: Luke 12–13 ───
  { id: "nt-88", reference: "Luke 12:1–34" },
  { id: "nt-89", reference: "Luke 12:35–59" },
  { id: "nt-90", reference: "Luke 13:1–17" },
  { id: "nt-91", reference: "Luke 13:18–35" },

  // ─── Day 300: Luke 14–15 ───
  { id: "nt-92", reference: "Luke 14:1–24" },
  { id: "nt-93", reference: "Luke 14:25–35" },
  { id: "nt-94", reference: "Luke 15:1–10" },
  { id: "nt-95", reference: "Luke 15:11–32" },

  // ─── Day 301: Luke 16–17 ───
  { id: "nt-96", reference: "Luke 16:1–18" },
  { id: "nt-97", reference: "Luke 16:19–31" },
  { id: "nt-98", reference: "Luke 17:1–19" },
  { id: "nt-99", reference: "Luke 17:20–37" },

  // ─── Day 302: John 11 ───
  { id: "nt-100", reference: "John 11:1–27" },
  { id: "nt-101", reference: "John 11:28–57" },

  // ─── Day 303: Luke 18 ───
  { id: "nt-102", reference: "Luke 18:1–17" },
  { id: "nt-103", reference: "Luke 18:18–43" },

  // ─── Day 304: Matthew 19; Mark 10 ───
  { id: "nt-104", reference: "Matthew 19:1–15" },
  { id: "nt-105", reference: "Matthew 19:16–30" },
  { id: "nt-106", reference: "Mark 10:1–31" },
  { id: "nt-107", reference: "Mark 10:32–52" },

  // ─── Day 305: Matthew 20–21 ───
  { id: "nt-108", reference: "Matthew 20:1–16" },
  { id: "nt-109", reference: "Matthew 20:17–34" },
  { id: "nt-110", reference: "Matthew 21:1–17" },
  { id: "nt-111", reference: "Matthew 21:18–46" },

  // ─── Day 306: Luke 19 ───
  { id: "nt-112", reference: "Luke 19:1–27" },
  { id: "nt-113", reference: "Luke 19:28–48" },

  // ─── Day 307: Mark 11; John 12 ───
  { id: "nt-114", reference: "Mark 11:1–19" },
  { id: "nt-115", reference: "Mark 11:20–33" },
  { id: "nt-116", reference: "John 12:1–26" },
  { id: "nt-117", reference: "John 12:27–50" },

  // ─── Day 308: Matthew 22; Mark 12 ───
  { id: "nt-118", reference: "Matthew 22:1–22" },
  { id: "nt-119", reference: "Matthew 22:23–46" },
  { id: "nt-120", reference: "Mark 12:1–27" },
  { id: "nt-121", reference: "Mark 12:28–44" },

  // ─── Day 309: Matthew 23; Luke 20–21 ───
  { id: "nt-122", reference: "Matthew 23:1–22" },
  { id: "nt-123", reference: "Matthew 23:23–39" },
  { id: "nt-124", reference: "Luke 20:1–26" },
  { id: "nt-125", reference: "Luke 20:27–47" },
  { id: "nt-126", reference: "Luke 21" },

  // ─── Day 310: Mark 13 ───
  { id: "nt-127", reference: "Mark 13:1–23" },
  { id: "nt-128", reference: "Mark 13:24–37" },

  // ─── Day 311: Matthew 24 ───
  { id: "nt-129", reference: "Matthew 24:1–28" },
  { id: "nt-130", reference: "Matthew 24:29–51" },

  // ─── Day 312: Matthew 25 ───
  { id: "nt-131", reference: "Matthew 25:1–30" },
  { id: "nt-132", reference: "Matthew 25:31–46" },

  // ─── Day 313: Matthew 26; Mark 14 ───
  { id: "nt-133", reference: "Matthew 26:1–30" },
  { id: "nt-134", reference: "Matthew 26:31–56" },
  { id: "nt-135", reference: "Matthew 26:57–75" },
  { id: "nt-136", reference: "Mark 14:1–31" },
  { id: "nt-137", reference: "Mark 14:32–72" },

  // ─── Day 314: Luke 22; John 13 ───
  { id: "nt-138", reference: "Luke 22:1–38" },
  { id: "nt-139", reference: "Luke 22:39–71" },
  { id: "nt-140", reference: "John 13:1–20" },
  { id: "nt-141", reference: "John 13:21–38" },

  // ─── Day 315: John 14–17 ───
  { id: "nt-142", reference: "John 14" },
  { id: "nt-143", reference: "John 15" },
  { id: "nt-144", reference: "John 16" },
  { id: "nt-145", reference: "John 17" },

  // ─── Day 316: Matthew 27; Mark 15 ───
  { id: "nt-146", reference: "Matthew 27:1–26" },
  { id: "nt-147", reference: "Matthew 27:27–56" },
  { id: "nt-148", reference: "Matthew 27:57–66" },
  { id: "nt-149", reference: "Mark 15:1–20" },
  { id: "nt-150", reference: "Mark 15:21–47" },

  // ─── Day 317: Luke 23; John 18–19 ───
  { id: "nt-151", reference: "Luke 23:1–25" },
  { id: "nt-152", reference: "Luke 23:26–56" },
  { id: "nt-153", reference: "John 18:1–27" },
  { id: "nt-154", reference: "John 18:28–40" },
  { id: "nt-155", reference: "John 19:1–22" },
  { id: "nt-156", reference: "John 19:23–42" },

  // ─── Day 318: Matthew 28; Mark 16 ───
  { id: "nt-157", reference: "Matthew 28" },
  { id: "nt-158", reference: "Mark 16" },

  // ─── Day 319: Luke 24; John 20–21 ───
  { id: "nt-159", reference: "Luke 24:1–35" },
  { id: "nt-160", reference: "Luke 24:36–53" },
  { id: "nt-161", reference: "John 20" },
  { id: "nt-162", reference: "John 21" },

  // ─── Day 320: Acts 1–3 ───
  { id: "nt-163", reference: "Acts 1" },
  { id: "nt-164", reference: "Acts 2:1–21" },
  { id: "nt-165", reference: "Acts 2:22–47" },
  { id: "nt-166", reference: "Acts 3" },

  // ─── Day 321: Acts 4–6 ───
  { id: "nt-167", reference: "Acts 4:1–22" },
  { id: "nt-168", reference: "Acts 4:23–37" },
  { id: "nt-169", reference: "Acts 5:1–16" },
  { id: "nt-170", reference: "Acts 5:17–42" },
  { id: "nt-171", reference: "Acts 6" },

  // ─── Day 322: Acts 7–8 ───
  { id: "nt-172", reference: "Acts 7:1–29" },
  { id: "nt-173", reference: "Acts 7:30–60" },
  { id: "nt-174", reference: "Acts 8:1–25" },
  { id: "nt-175", reference: "Acts 8:26–40" },

  // ─── Day 323: Acts 9–10 ───
  { id: "nt-176", reference: "Acts 9:1–19" },
  { id: "nt-177", reference: "Acts 9:20–43" },
  { id: "nt-178", reference: "Acts 10:1–23" },
  { id: "nt-179", reference: "Acts 10:24–48" },

  // ─── Day 324: Acts 11–12 ───
  { id: "nt-180", reference: "Acts 11" },
  { id: "nt-181", reference: "Acts 12" },

  // ─── Day 325: Acts 13–14 ───
  { id: "nt-182", reference: "Acts 13:1–25" },
  { id: "nt-183", reference: "Acts 13:26–52" },
  { id: "nt-184", reference: "Acts 14" },

  // ─── Day 326: James 1–5 ───
  { id: "nt-185", reference: "James 1" },
  { id: "nt-186", reference: "James 2" },
  { id: "nt-187", reference: "James 3" },
  { id: "nt-188", reference: "James 4" },
  { id: "nt-189", reference: "James 5" },

  // ─── Day 327: Acts 15–16 ───
  { id: "nt-190", reference: "Acts 15:1–21" },
  { id: "nt-191", reference: "Acts 15:22–41" },
  { id: "nt-192", reference: "Acts 16:1–15" },
  { id: "nt-193", reference: "Acts 16:16–40" },

  // ─── Day 328: Galatians 1–3 ───
  { id: "nt-194", reference: "Galatians 1" },
  { id: "nt-195", reference: "Galatians 2" },
  { id: "nt-196", reference: "Galatians 3" },

  // ─── Day 329: Galatians 4–6 ───
  { id: "nt-197", reference: "Galatians 4" },
  { id: "nt-198", reference: "Galatians 5" },
  { id: "nt-199", reference: "Galatians 6" },

  // ─── Day 330: Acts 17 ───
  { id: "nt-200", reference: "Acts 17:1–15" },
  { id: "nt-201", reference: "Acts 17:16–34" },

  // ─── Day 331: 1–2 Thessalonians ───
  { id: "nt-202", reference: "1 Thessalonians 1—2" },
  { id: "nt-203", reference: "1 Thessalonians 3—4" },
  { id: "nt-204", reference: "1 Thessalonians 5" },
  { id: "nt-205", reference: "2 Thessalonians 1—2" },
  { id: "nt-206", reference: "2 Thessalonians 3" },

  // ─── Day 332: Acts 18–19 ───
  { id: "nt-207", reference: "Acts 18" },
  { id: "nt-208", reference: "Acts 19:1–22" },
  { id: "nt-209", reference: "Acts 19:23–41" },

  // ─── Day 333: 1 Corinthians 1–4 ───
  { id: "nt-210", reference: "1 Corinthians 1" },
  { id: "nt-211", reference: "1 Corinthians 2" },
  { id: "nt-212", reference: "1 Corinthians 3" },
  { id: "nt-213", reference: "1 Corinthians 4" },

  // ─── Day 334: 1 Corinthians 5–8 ───
  { id: "nt-214", reference: "1 Corinthians 5—6" },
  { id: "nt-215", reference: "1 Corinthians 7" },
  { id: "nt-216", reference: "1 Corinthians 8" },

  // ─── Day 335: 1 Corinthians 9–11 ───
  { id: "nt-217", reference: "1 Corinthians 9" },
  { id: "nt-218", reference: "1 Corinthians 10" },
  { id: "nt-219", reference: "1 Corinthians 11" },

  // ─── Day 336: 1 Corinthians 12–14 ───
  { id: "nt-220", reference: "1 Corinthians 12" },
  { id: "nt-221", reference: "1 Corinthians 13" },
  { id: "nt-222", reference: "1 Corinthians 14" },

  // ─── Day 337: 1 Corinthians 15–16 ───
  { id: "nt-223", reference: "1 Corinthians 15:1–34" },
  { id: "nt-224", reference: "1 Corinthians 15:35–58" },
  { id: "nt-225", reference: "1 Corinthians 16" },

  // ─── Day 338: 2 Corinthians 1–4 ───
  { id: "nt-226", reference: "2 Corinthians 1" },
  { id: "nt-227", reference: "2 Corinthians 2" },
  { id: "nt-228", reference: "2 Corinthians 3" },
  { id: "nt-229", reference: "2 Corinthians 4" },

  // ─── Day 339: 2 Corinthians 5–9 ───
  { id: "nt-230", reference: "2 Corinthians 5" },
  { id: "nt-231", reference: "2 Corinthians 6—7" },
  { id: "nt-232", reference: "2 Corinthians 8" },
  { id: "nt-233", reference: "2 Corinthians 9" },

  // ─── Day 340: 2 Corinthians 10–13 ───
  { id: "nt-234", reference: "2 Corinthians 10" },
  { id: "nt-235", reference: "2 Corinthians 11" },
  { id: "nt-236", reference: "2 Corinthians 12" },
  { id: "nt-237", reference: "2 Corinthians 13" },

  // ─── Day 341: Romans 1–3 ───
  { id: "nt-238", reference: "Romans 1" },
  { id: "nt-239", reference: "Romans 2" },
  { id: "nt-240", reference: "Romans 3" },

  // ─── Day 342: Romans 4–7 ───
  { id: "nt-241", reference: "Romans 4" },
  { id: "nt-242", reference: "Romans 5" },
  { id: "nt-243", reference: "Romans 6" },
  { id: "nt-244", reference: "Romans 7" },

  // ─── Day 343: Romans 8–10 ───
  { id: "nt-245", reference: "Romans 8:1–17" },
  { id: "nt-246", reference: "Romans 8:18–39" },
  { id: "nt-247", reference: "Romans 9" },
  { id: "nt-248", reference: "Romans 10" },

  // ─── Day 344: Romans 11–13 ───
  { id: "nt-249", reference: "Romans 11" },
  { id: "nt-250", reference: "Romans 12" },
  { id: "nt-251", reference: "Romans 13" },

  // ─── Day 345: Romans 14–16 ───
  { id: "nt-252", reference: "Romans 14" },
  { id: "nt-253", reference: "Romans 15" },
  { id: "nt-254", reference: "Romans 16" },

  // ─── Day 346: Acts 20–23 ───
  { id: "nt-255", reference: "Acts 20:1–16" },
  { id: "nt-256", reference: "Acts 20:17–38" },
  { id: "nt-257", reference: "Acts 21:1–26" },
  { id: "nt-258", reference: "Acts 21:27–40" },
  { id: "nt-259", reference: "Acts 22" },
  { id: "nt-260", reference: "Acts 23:1–22" },
  { id: "nt-261", reference: "Acts 23:23–35" },

  // ─── Day 347: Acts 24–26 ───
  { id: "nt-262", reference: "Acts 24" },
  { id: "nt-263", reference: "Acts 25" },
  { id: "nt-264", reference: "Acts 26" },

  // ─── Day 348: Acts 27–28 ───
  { id: "nt-265", reference: "Acts 27:1–26" },
  { id: "nt-266", reference: "Acts 27:27–44" },
  { id: "nt-267", reference: "Acts 28" },

  // ─── Day 349: Colossians 1–4; Philemon ───
  { id: "nt-268", reference: "Colossians 1" },
  { id: "nt-269", reference: "Colossians 2" },
  { id: "nt-270", reference: "Colossians 3" },
  { id: "nt-271", reference: "Colossians 4" },
  { id: "nt-272", reference: "Philemon" },

  // ─── Day 350: Ephesians 1–6 ───
  { id: "nt-273", reference: "Ephesians 1" },
  { id: "nt-274", reference: "Ephesians 2" },
  { id: "nt-275", reference: "Ephesians 3" },
  { id: "nt-276", reference: "Ephesians 4" },
  { id: "nt-277", reference: "Ephesians 5" },
  { id: "nt-278", reference: "Ephesians 6" },

  // ─── Day 351: Philippians 1–4 ───
  { id: "nt-279", reference: "Philippians 1" },
  { id: "nt-280", reference: "Philippians 2" },
  { id: "nt-281", reference: "Philippians 3" },
  { id: "nt-282", reference: "Philippians 4" },

  // ─── Day 352: 1 Timothy 1–6 ───
  { id: "nt-283", reference: "1 Timothy 1" },
  { id: "nt-284", reference: "1 Timothy 2" },
  { id: "nt-285", reference: "1 Timothy 3" },
  { id: "nt-286", reference: "1 Timothy 4" },
  { id: "nt-287", reference: "1 Timothy 5" },
  { id: "nt-288", reference: "1 Timothy 6" },

  // ─── Day 353: Titus 1–3 ───
  { id: "nt-289", reference: "Titus 1" },
  { id: "nt-290", reference: "Titus 2" },
  { id: "nt-291", reference: "Titus 3" },

  // ─── Day 354: 1 Peter 1–5 ───
  { id: "nt-292", reference: "1 Peter 1" },
  { id: "nt-293", reference: "1 Peter 2" },
  { id: "nt-294", reference: "1 Peter 3" },
  { id: "nt-295", reference: "1 Peter 4" },
  { id: "nt-296", reference: "1 Peter 5" },

  // ─── Day 355: Hebrews 1–6 ───
  { id: "nt-297", reference: "Hebrews 1" },
  { id: "nt-298", reference: "Hebrews 2" },
  { id: "nt-299", reference: "Hebrews 3" },
  { id: "nt-300", reference: "Hebrews 4" },
  { id: "nt-301", reference: "Hebrews 5" },
  { id: "nt-302", reference: "Hebrews 6" },

  // ─── Day 356: Hebrews 7–10 ───
  { id: "nt-303", reference: "Hebrews 7" },
  { id: "nt-304", reference: "Hebrews 8" },
  { id: "nt-305", reference: "Hebrews 9" },
  { id: "nt-306", reference: "Hebrews 10:1–18" },
  { id: "nt-307", reference: "Hebrews 10:19–39" },

  // ─── Day 357: Hebrews 11–13 ───
  { id: "nt-308", reference: "Hebrews 11:1–22" },
  { id: "nt-309", reference: "Hebrews 11:23–40" },
  { id: "nt-310", reference: "Hebrews 12" },
  { id: "nt-311", reference: "Hebrews 13" },

  // ─── Day 358: 2 Timothy 1–4 ───
  { id: "nt-312", reference: "2 Timothy 1" },
  { id: "nt-313", reference: "2 Timothy 2" },
  { id: "nt-314", reference: "2 Timothy 3" },
  { id: "nt-315", reference: "2 Timothy 4" },

  // ─── Day 359: 2 Peter 1–3; Jude ───
  { id: "nt-316", reference: "2 Peter 1" },
  { id: "nt-317", reference: "2 Peter 2" },
  { id: "nt-318", reference: "2 Peter 3" },
  { id: "nt-319", reference: "Jude" },

  // ─── Day 360: 1 John 1–5 ───
  { id: "nt-320", reference: "1 John 1" },
  { id: "nt-321", reference: "1 John 2" },
  { id: "nt-322", reference: "1 John 3" },
  { id: "nt-323", reference: "1 John 4" },
  { id: "nt-324", reference: "1 John 5" },

  // ─── Day 361: 2 John; 3 John ───
  { id: "nt-325", reference: "2 John" },
  { id: "nt-326", reference: "3 John" },

  // ─── Day 362: Revelation 1–5 ───
  { id: "nt-327", reference: "Revelation 1" },
  { id: "nt-328", reference: "Revelation 2" },
  { id: "nt-329", reference: "Revelation 3" },
  { id: "nt-330", reference: "Revelation 4" },
  { id: "nt-331", reference: "Revelation 5" },

  // ─── Day 363: Revelation 6–11 ───
  { id: "nt-332", reference: "Revelation 6" },
  { id: "nt-333", reference: "Revelation 7" },
  { id: "nt-334", reference: "Revelation 8" },
  { id: "nt-335", reference: "Revelation 9" },
  { id: "nt-336", reference: "Revelation 10" },
  { id: "nt-337", reference: "Revelation 11" },

  // ─── Day 364: Revelation 12–18 ───
  { id: "nt-338", reference: "Revelation 12" },
  { id: "nt-339", reference: "Revelation 13" },
  { id: "nt-340", reference: "Revelation 14" },
  { id: "nt-341", reference: "Revelation 15" },
  { id: "nt-342", reference: "Revelation 16" },
  { id: "nt-343", reference: "Revelation 17" },
  { id: "nt-344", reference: "Revelation 18" },

  // ─── Day 365: Revelation 19–22 ───
  { id: "nt-345", reference: "Revelation 19" },
  { id: "nt-346", reference: "Revelation 20" },
  { id: "nt-347", reference: "Revelation 21" },
  { id: "nt-348", reference: "Revelation 22" },
];

// ─────────────────────────────────────────────────────────────────────
// STREAM 3: PSALMS — one per week, in canonical order
// ─────────────────────────────────────────────────────────────────────
export const PSALM_READINGS = Array.from({ length: 150 }, (_, i) => ({
  id: `ps-${i + 1}`,
  reference: `Psalm ${i + 1}`,
}));

// ─────────────────────────────────────────────────────────────────────
// STREAM 4: PROVERBS / ECCLESIASTES — one chapter per week
// ─────────────────────────────────────────────────────────────────────
export const PROVERB_READINGS = [
  ...Array.from({ length: 31 }, (_, i) => ({
    id: `pr-${i + 1}`,
    reference: `Proverbs ${i + 1}`,
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `ec-${i + 1}`,
    reference: `Ecclesiastes ${i + 1}`,
  })),
];

// ─────────────────────────────────────────────────────────────────────
// STREAM CONFIG — used by HomeScreen
// ─────────────────────────────────────────────────────────────────────
export const FAMILY_BIBLE_STREAMS = [
  { id: "ot",      label: "Old Testament", readings: OT_READINGS,      stateKey: "tend_fb_ot_idx" },
  { id: "nt",      label: "New Testament", readings: NT_READINGS,      stateKey: "tend_fb_nt_idx" },
  { id: "psalm",   label: "Psalm",         readings: PSALM_READINGS,   stateKey: "tend_fb_ps_idx" },
  { id: "proverb", label: "Proverb",       readings: PROVERB_READINGS, stateKey: "tend_fb_pr_idx" },
];

// ─────────────────────────────────────────────────────────────────────
// WEEKLY MONDAY SHIFT
// Returns the ISO date string for the Monday of the current week.
// ─────────────────────────────────────────────────────────────────────
export function getCurrentWeekStart(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setDate(d.getDate() - daysFromMonday);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────
// Stream state shape, stored in localStorage:
// {
//   currentIdx: 0,           // index of next reading to do
//   completedThisWeek: [],   // array of indexes completed in current week
//   weekStart: "2026-05-04", // ISO date of the Monday this week started
// }
// On Monday, if weekStart < currentMonday, clear completedThisWeek and
// advance currentIdx by however many were completed last week.
// ─────────────────────────────────────────────────────────────────────
export function loadStreamState(stateKey) {
  try {
    const raw = localStorage.getItem(stateKey);
    if (!raw) return { currentIdx: 0, completedThisWeek: [], weekStart: getCurrentWeekStart() };
    const parsed = JSON.parse(raw);

    const currentMonday = getCurrentWeekStart();
    if (parsed.weekStart && parsed.weekStart !== currentMonday) {
      // New week — last week's completions get retired (advance currentIdx past them)
      const completed = parsed.completedThisWeek || [];
      const newIdx = (parsed.currentIdx || 0) + completed.length;
      return {
        currentIdx: newIdx,
        completedThisWeek: [],
        weekStart: currentMonday,
      };
    }
    return {
      currentIdx: parsed.currentIdx || 0,
      completedThisWeek: parsed.completedThisWeek || [],
      weekStart: parsed.weekStart || currentMonday,
    };
  } catch {
    return { currentIdx: 0, completedThisWeek: [], weekStart: getCurrentWeekStart() };
  }
}

export function saveStreamState(stateKey, state) {
  try {
    localStorage.setItem(stateKey, JSON.stringify(state));
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────
// Get the active reading for a stream (the one to display + offer for check-off)
// Plus any readings already completed this week (shown grayed out below the active)
// ─────────────────────────────────────────────────────────────────────
export function getStreamView(stream) {
  const state = loadStreamState(stream.stateKey);
  const activeIdx = state.currentIdx;
  const active = stream.readings[activeIdx] || null;
  const completed = (state.completedThisWeek || []).map(i => stream.readings[i]).filter(Boolean);
  return { active, activeIdx, completed, state };
}

export function markStreamComplete(stream) {
  const state = loadStreamState(stream.stateKey);
  const idx = state.currentIdx;
  if (idx >= stream.readings.length) return;
  const newState = {
    currentIdx: idx + 1,
    completedThisWeek: [...(state.completedThisWeek || []), idx],
    weekStart: state.weekStart || getCurrentWeekStart(),
  };
  saveStreamState(stream.stateKey, newState);
}

export function undoStreamComplete(stream) {
  const state = loadStreamState(stream.stateKey);
  const completed = state.completedThisWeek || [];
  if (completed.length === 0) return;
  const lastCompletedIdx = completed[completed.length - 1];
  const newState = {
    currentIdx: lastCompletedIdx,
    completedThisWeek: completed.slice(0, -1),
    weekStart: state.weekStart || getCurrentWeekStart(),
  };
  saveStreamState(stream.stateKey, newState);
}
