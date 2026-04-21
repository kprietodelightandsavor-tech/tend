// GENTLE FEAST FOUR-YEAR READING PLAN (UPDATED)
// Curated OT + Psalms + Proverbs + NT Chronological
// Each week has 4 readings, each ~10 minutes
// OT cycle: ~3.5 years (180 passages), then repeats
// Psalms cycle: 4 years (150 chapters)
// Proverbs cycle: 4 years (31 chapters)
// NT cycle: 4 years (complete NT chronologically)

import { CURATED_OT_PASSAGES, getOTPassageForWeek } from "./curated-ot-passages";

// NT Chronological (from previous file - Blue Letter Bible order)
const NT_CHRONOLOGICAL = [
  // Gospels woven chronologically (Jesus's life - ~85 passages total)
  "Matthew 1:1-25 (Birth & genealogy)",
  "Luke 1:1-80 (John the Baptist & Mary)",
  "Matthew 2 (Magi & flight to Egypt)",
  "Luke 2:1-52 (Jesus's birth & childhood)",
  "John 1:1-18 (The Word)",
  "Matthew 3 (John baptizes Jesus)",
  "Mark 1:1-13 (Jesus baptized & tempted)",
  "John 1:19-51 (John's testimony & first disciples)",
  "John 2:1-11 (Wedding at Cana)",
  "John 2:12-25 (Jesus at temple)",
  "John 3:1-21 (Nicodemus)",
  "John 3:22-36 (John's final testimony)",
  "Matthew 4:12 & Mark 1:14-15 (John arrested; Jesus to Galilee)",
  "John 4:4-42 (Woman at well)",
  "John 4:43-54 (Healing of official's son)",
  "Matthew 4:18-22 & Mark 1:16-20 (Call of disciples)",
  "Luke 5:1-11 (Fishing miracle)",
  "Mark 1:21-34 (Capernaum ministry begins)",
  "Matthew 8:14-17 (Peter's mother-in-law & healings)",
  "Luke 5:12-32 (Leper & tax collectors)",
  "Mark 2:23-28 & Matthew 12:1-8 (Sabbath grain)",
  "Matthew 12:9-14 & Mark 3:1-6 (Healing on Sabbath)",
  "Matthew 5:1-12 (Beatitudes)",
  "Matthew 5:13-7:29 (Sermon on Mount)",
  "Luke 7:1-10 (Centurion's servant)",
  "Luke 7:11-17 (Widow's son)",
  "Luke 7:18-35 (John's disciples & Jesus's response)",
  "Luke 7:36-50 (Sinful woman anoints Jesus)",
  "Luke 8:1-3 (Women followers)",
  "Matthew 12:22-45 (Blasphemy & return of spirits)",
  "Mark 3:20-35 (Jesus's family)",
  "Matthew 13 (Parables: sower, weeds, mustard seed, yeast, treasure, pearl, net)",
  "Mark 4:35-41 & Matthew 8:23-27 (Storm & demon-possessed man)",
  "Mark 5:21-43 & Matthew 9:18-26 (Jairus's daughter & bleeding woman)",
  "Matthew 9:27-34 (Blind men & demon-possessed)",
  "Matthew 9:35-11:1 (Sending out twelve)",
  "Matthew 11:2-12:21 (John's question; Jesus on yoke)",
  "Mark 6:1-6 & Luke 4:16-30 (Rejection at Nazareth)",
  "Mark 6:7-29 (Twelve sent out & John's death)",
  "John 6:1-71 (Feeding 5000 & bread of life discourse)",
  "Matthew 14:22-33 & Mark 6:45-52 (Jesus walks on water)",
  "Matthew 15:1-20 & Mark 7:1-23 (Traditions of elders)",
  "Matthew 15:21-28 & Mark 7:24-30 (Canaanite/Syrophenician woman)",
  "Mark 7:31-37 (Deaf & mute healed)",
  "Matthew 15:29-31 (Healings)",
  "Matthew 15:32-39 & Mark 8:1-10 (Feeding 4000)",
  "Matthew 16:1-12 & Mark 8:11-21 (Leaven warning)",
  "Mark 8:22-26 (Blind man of Bethsaida)",
  "Matthew 16:13-20 & Mark 8:27-30 (Peter's confession)",
  "Matthew 16:21-28 & Mark 8:31-9:1 (First passion prediction)",
  "Matthew 17:1-13 & Mark 9:2-13 (Transfiguration)",
  "Matthew 17:14-20 & Mark 9:14-29 (Demon-possessed boy)",
  "Matthew 17:22-23 & Mark 9:30-32 (Second passion prediction)",
  "Matthew 17:24-27 (Temple tax)",
  "Matthew 18:1-35 & Mark 9:33-50 (Greatness; forgiveness; salt)",
  "John 7:1-52 (Jesus at Feast of Booths)",
  "John 8:1-11 (Woman caught in adultery)",
  "John 8:12-59 (Light of world; Jesus before Abraham)",
  "John 9:1-41 (Blind man healed)",
  "John 10:1-21 (Good Shepherd)",
  "John 10:22-42 (Feast of Dedication; Jesus's claim)",
  "John 11:1-54 (Lazarus raised)",
  "Luke 10:1-24 (Seventy sent out)",
  "Luke 10:25-37 (Good Samaritan)",
  "Luke 10:38-11:13 (Mary & Martha; Lord's Prayer)",
  "Luke 11:14-54 (Demon & woes)",
  "Luke 12:1-48 (Greed & faithfulness)",
  "Luke 12:49-13:9 (Division; repentance)",
  "Luke 13:10-35 (Crippled woman; narrow door)",
  "Luke 14:1-35 (Banquet; cost of discipleship)",
  "Luke 15:1-32 (Lost sheep, coin, son)",
  "Luke 16:1-31 (Shrewd manager; rich man & Lazarus)",
  "Luke 17:1-10 (Forgiveness; faith; duty)",
  "Luke 17:11-19 (Ten lepers)",
  "Luke 17:20-37 (Kingdom of God; Jesus's return)",
  "Luke 18:1-14 (Widow & judge; Pharisee & tax collector)",
  "Matthew 19:1-15 & Mark 10:1-16 (Divorce; children)",
  "Matthew 19:16-30 & Mark 10:17-31 (Rich young ruler)",
  "Matthew 20:1-16 (Workers in vineyard)",
  "Matthew 20:17-34 & Mark 10:32-52 (Third passion prediction; Bartimaeus)",
  "John 12:1-8 (Mary anoints Jesus)",
  "Matthew 21:1-11 & Mark 11:1-11 (Triumphal entry)",
  "John 12:12-19 (Another account of entry)",
  "Matthew 21:12-17 & Mark 11:15-19 (Temple cleansing)",
  "Matthew 21:18-32 & Mark 11:20-33 (Fig tree; authority)",
  "Matthew 21:33-46 & Mark 12:1-12 (Tenants)",
  "Matthew 22:1-14 (Wedding banquet)",
  "Matthew 22:15-46 & Mark 12:13-37 (Taxes; Sadducees; David's son)",
  "Matthew 23:1-39 & Mark 12:38-40 (Woes to Pharisees)",
  "Mark 12:41-44 & Luke 21:1-4 (Widow's offering)",
  "Matthew 24-25 (Olivet Discourse; ten virgins; talents; sheep & goats)",
  "John 13:1-38 (Foot washing; Judas; Peter's denial predicted)",
  "Matthew 26:20-29 & Mark 14:17-25 (Last Supper)",
  "John 14-16 (Farewell discourse: way, truth, life; vine & branches; Holy Spirit; prayer)",
  "John 17 (High Priestly Prayer)",
  "Luke 22:39-46 & Matthew 26:36-46 (Gethsemane prayer)",
  "Matthew 26:47-68 & Mark 14:43-65 (Arrest & trial)",
  "John 18:1-27 (Another account of arrest & denial)",
  "Matthew 27:1-31 & Mark 15:1-20 (Before Pilate; mocking)",
  "John 18:28-19:16 (Extended trial before Pilate)",
  "Matthew 27:32-56 & Mark 15:21-41 (Crucifixion)",
  "John 19:17-37 (Crucifixion account)",
  "Matthew 27:57-61 & Mark 15:42-47 (Burial)",
  "John 19:38-42 (Another burial account)",
  "Matthew 28:1-10 & Mark 16:1-8 (Resurrection)",
  "Luke 24:1-12 (Luke's resurrection account)",
  "John 20:1-18 (John's resurrection appearance)",
  "Matthew 28:11-15 (Guards' report)",
  "Luke 24:13-35 (Emmaus road)",
  "John 20:19-31 (Appearances to disciples; Thomas)",
  "Matthew 28:16-20 (Great Commission)",
  "Luke 24:36-53 (Ascension)",
  "John 21:1-25 (Breakfast by sea; Peter's restoration)",

  // ACTS & EPISTLES (interspersed chronologically)
  "Acts 1-2 (Ascension; Pentecost)",
  "Acts 3-5 (Miracles; persecution)",
  "Acts 6-7 (Stephen; persecution begins)",
  "Acts 8:1-40 (Philip; Samaria)",
  "Acts 9:1-31 (Paul's conversion)",
  "Acts 9:32-10:48 (Peter: Aeneas, Dorcas, Cornelius)",
  "Acts 11:1-30 (Jerusalem council; Antioch)",
  "James 1-5 (Written ~49 A.D.)",
  "Acts 12 (James killed; Peter freed)",
  "Acts 13:1-14:28 (Paul's first missionary journey)",
  "Galatians 1-6 (Written ~50-51 A.D.)",
  "Acts 15 (Jerusalem Council on circumcision)",
  "Acts 15:36-16:10 (Second journey begins)",
  "1 Thessalonians 1-5 (Written ~50-51 A.D.)",
  "2 Thessalonians 1-3 (Written ~51-52 A.D.)",
  "Acts 16:11-18:22 (Philippi; Thessalonica; Berea; Athens; Corinth)",
  "1 Corinthians 1-16 (Written ~53-54 A.D.)",
  "2 Corinthians 1-13 (Written ~55-56 A.D.)",
  "Romans 1-16 (Written ~56-57 A.D.)",
  "Acts 18:23-19:41 (Third journey)",
  "Philippians 1-4 (Written ~62-63 A.D., from Rome)",
  "Ephesians 1-6 (Written ~62-63 A.D., from Rome)",
  "Colossians 1-4 (Written ~62-63 A.D., from Rome)",
  "Philemon 1 (Written ~62-63 A.D., from Rome)",
  "Acts 20-28 (Journey to Rome; trials; voyage; Rome arrival)",
  "1 Timothy 1-6 (Written ~63-65 A.D.)",
  "Titus 1-3 (Written ~64-66 A.D.)",
  "2 Timothy 1-4 (Written ~66-67 A.D., from Rome)",
  "Hebrews 1-13 (Written ~64-70 A.D.)",
  "1 Peter 1-5 (Written ~63-65 A.D.)",
  "2 Peter 1-3 (Written ~67-68 A.D.)",
  "1 John 1-5 (Written ~90-95 A.D.)",
  "2 John 1 (Written ~90-95 A.D.)",
  "3 John 1 (Written ~90-95 A.D.)",
  "Jude 1 (Written ~65-80 A.D.)",
  "Revelation 1-22 (Written ~95-96 A.D.)",
];

// Helper: Get reading for a given week
export function getWeeklyReading(weekNumber) {
  // Each strand has its own cycle
  const psalmNum = ((weekNumber - 1) % 150) + 1;
  const proverbNum = ((weekNumber - 1) % 31) + 1;
  const ntIndex = (weekNumber - 1) % NT_CHRONOLOGICAL.length;
  const otPassage = getOTPassageForWeek(weekNumber);

  return {
    weekNumber,
    ot: otPassage,
    psalm: `Psalm ${psalmNum}`,
    proverb: `Proverbs ${proverbNum}`,
    nt: NT_CHRONOLOGICAL[ntIndex],
  };
}

// Generate full plan for reference
export const READING_PLAN = Array.from({ length: 208 }, (_, i) => 
  getWeeklyReading(i + 1)
);

// Stats
console.log(`OT passages: ${CURATED_OT_PASSAGES.length} (~${Math.round(CURATED_OT_PASSAGES.length / 52)} years)`);
console.log(`NT passages: ${NT_CHRONOLOGICAL.length}`);
console.log(`Full 4-year cycle: 208 weeks = ${208 / 52} years`);
console.log(`After 4 years: OT repeats from week ${(4 * 52) % CURATED_OT_PASSAGES.length}`);
