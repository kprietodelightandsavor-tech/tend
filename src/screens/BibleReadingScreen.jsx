import { useState } from "react";

// ── All four CC cycles — 144 weeks total ──────────────────────────────────────
// Order: finish Cycle 3 (weeks 29-36 remaining), then Cycle 4, Cycle 1, Cycle 2, repeat
// You are currently at Cycle 3 Week 28 (just finished). Next = Cycle 3 Week 29.

const CYCLE3 = [
  { nt: "Acts 4",                    ot: "Joshua 1:1-9",                   psalm: "Psalm 73",  wisdom: "Proverbs 1:1-19"    }, // W1
  { nt: "Acts 6, 7:54-60",           ot: "Joshua 2:1-24",                  psalm: "Psalm 74",  wisdom: "Proverbs 1:20-33"   }, // W2
  { nt: "Acts 8",                    ot: "Joshua 3:1-17, 4:10-13",         psalm: "Psalm 75",  wisdom: "Proverbs 2"         }, // W3
  { nt: "Acts 9:1-19",               ot: "Joshua 6",                       psalm: "Psalm 76",  wisdom: "Proverbs 3:1-12"    }, // W4
  { nt: "Acts 9:20-42",              ot: "Joshua 23",                      psalm: "Psalm 77",  wisdom: "Proverbs 3:13-35"   }, // W5
  { nt: "Acts 10:1-26",              ot: "Judges 6:1-18",                  psalm: "Psalm 78",  wisdom: "Proverbs 4"         }, // W6
  { nt: "Acts 10:27-48",             ot: "Judges 6:19-40",                 psalm: "Psalm 79",  wisdom: "Proverbs 5"         }, // W7
  { nt: "Acts 11",                   ot: "Judges 7:1-22",                  psalm: "Psalm 80",  wisdom: "Proverbs 6:1-19"    }, // W8
  { nt: "Acts 12:1-19",              ot: "Judges 13",                      psalm: "Psalm 81",  wisdom: "Proverbs 6:19-35"   }, // W9
  { nt: "Acts 13:1-12",              ot: "Judges 16:2-31",                 psalm: "Psalm 82",  wisdom: "Proverbs 8:1-21"    }, // W10
  { nt: "Acts 13:13-52",             ot: "Ruth 1",                         psalm: "Psalm 83",  wisdom: "Proverbs 8:22-36"   }, // W11
  { nt: "Acts 14:1-20",              ot: "Ruth 2",                         psalm: "Psalm 84",  wisdom: "Proverbs 9"         }, // W12
  { nt: "Acts 16:1-15",              ot: "Ruth 3",                         psalm: "Psalm 85",  wisdom: "Proverbs 10:1-19"   }, // W13
  { nt: "Acts 16:16-40",             ot: "Ruth 4:1-12, 14-22",             psalm: "Psalm 86",  wisdom: "Proverbs 10:20-32"  }, // W14
  { nt: "Acts 17:1-15",              ot: "1 Samuel 1:1-2, 7-28",           psalm: "Psalm 87",  wisdom: "Proverbs 11:1-18"   }, // W15
  { nt: "Acts 17:16-34",             ot: "1 Samuel 3:1-21",                psalm: "Psalm 88",  wisdom: "Proverbs 11:19-31"  }, // W16
  { nt: "Acts 18:1-17",              ot: "1 Samuel 8:1-22",                psalm: "Psalm 89",  wisdom: "Proverbs 12"        }, // W17
  { nt: "Acts 18:18-28",             ot: "1 Samuel 9",                     psalm: "Psalm 90",  wisdom: "Proverbs 13"        }, // W18
  { nt: "Acts 19:1-20",              ot: "1 Samuel 10",                    psalm: "Psalm 91",  wisdom: "Proverbs 14:1-19"   }, // W19
  { nt: "Acts 19:21-41",             ot: "1 Samuel 13:1-14",               psalm: "Psalm 92",  wisdom: "Proverbs 14:20-35"  }, // W20
  { nt: "Acts 20:1-21",              ot: "1 Samuel 14:1-15",               psalm: "Psalm 93",  wisdom: "Proverbs 15:1-19"   }, // W21
  { nt: "Acts 20:22-38",             ot: "1 Samuel 15:10-31",              psalm: "Psalm 94",  wisdom: "Proverbs 15:20-33"  }, // W22
  { nt: "Acts 21:1-26",              ot: "1 Samuel 16",                    psalm: "Psalm 95",  wisdom: "Proverbs 16:1-17"   }, // W23
  { nt: "Acts 21:27-36",             ot: "1 Samuel 17:1-24",               psalm: "Psalm 96",  wisdom: "Proverbs 16:18-33"  }, // W24
  { nt: "Acts 22",                   ot: "1 Samuel 17:25-58, 18:1-9",      psalm: "Psalm 97",  wisdom: "Proverbs 17:1-15"   }, // W25
  { nt: "Acts 23:1-22",              ot: "1 Samuel 19:1-14",               psalm: "Psalm 98",  wisdom: "Proverbs 17:16-28"  }, // W26
  { nt: "Acts 23:23-35",             ot: "1 Samuel 20",                    psalm: "Psalm 99",  wisdom: "Proverbs 18"        }, // W27
  { nt: "Acts 24:1-21",              ot: "1 Samuel 24",                    psalm: "Psalm 100", wisdom: "Proverbs 19:1-15"   }, // W28
  { nt: "Acts 25",                   ot: "1 Samuel 31:1-7, 2 Samuel 2:4",  psalm: "Psalm 101", wisdom: "Proverbs 19:16-29"  }, // W29
  { nt: "Acts 26:1-18",              ot: "2 Samuel 5:1-5, 17-25",          psalm: "Psalm 102", wisdom: "Proverbs 20:1-15"   }, // W30
  { nt: "Acts 26:19-32",             ot: "2 Samuel 6:1-19",                psalm: "Psalm 103", wisdom: "Proverbs 20:16-30"  }, // W31
  { nt: "Acts 27:1-12",              ot: "2 Samuel 7:1-17",                psalm: "Psalm 104", wisdom: "Proverbs 21:1-15"   }, // W32
  { nt: "Acts 27:13-44",             ot: "2 Samuel 22:1-30",               psalm: "Psalm 105", wisdom: "Proverbs 21:16-31"  }, // W33
  { nt: "Acts 28:1-16",              ot: "2 Samuel 22:31-51, 23:1-7",      psalm: "Psalm 106", wisdom: "Proverbs 22:1-16"   }, // W34
  { nt: "Acts 28:17-31",             ot: "2 Samuel 24:1-17",               psalm: "Psalm 107", wisdom: "Proverbs 22:17-29"  }, // W35
  { nt: null,                        ot: "2 Samuel 24:18-25",              psalm: "Psalm 108", wisdom: null                  }, // W36
];

const CYCLE4 = [
  { nt: "Romans 1:1-17",             ot: "1 Kings 1:1-27",                 psalm: "Psalm 109", wisdom: "Proverbs 23:1-16"   }, // W1
  { nt: "Romans 8:1-17",             ot: "1 Kings 1:28-53",                psalm: "Psalm 110", wisdom: "Proverbs 23:17-35"  }, // W2
  { nt: "Romans 8:18-39",            ot: "1 Kings 2:1-12",                 psalm: "Psalm 111", wisdom: "Proverbs 24:1-22"   }, // W3
  { nt: "Romans 12:1-21",            ot: "1 Kings 3",                      psalm: "Psalm 112", wisdom: "Proverbs 24:23-34"  }, // W4
  { nt: "1 Corinthians 1",           ot: "1 Kings 5",                      psalm: "Psalm 113", wisdom: "Proverbs 25:1-15"   }, // W5
  { nt: "1 Corinthians 2",           ot: "1 Kings 7:51, 8:1-21",           psalm: "Psalm 114", wisdom: "Proverbs 25:16-28"  }, // W6
  { nt: "1 Corinthians 13",          ot: "1 Kings 8:22-61",                psalm: "Psalm 115", wisdom: "Proverbs 26:1-13"   }, // W7
  { nt: "Galatians 5",               ot: "1 Kings 9:1-9, 10:1-10",         psalm: "Psalm 116", wisdom: "Proverbs 26:14-28"  }, // W8
  { nt: "Ephesians 1",               ot: "1 Kings 11:9-13, 26-40",         psalm: "Psalm 117", wisdom: "Proverbs 27:1-14"   }, // W9
  { nt: "Ephesians 2:1-10",          ot: "1 Kings 12",                     psalm: "Psalm 118", wisdom: "Proverbs 27:15-27"  }, // W10
  { nt: "Ephesians 6:10-20",         ot: "1 Kings 17",                     psalm: "Psalm 119", wisdom: "Proverbs 28:1-12"   }, // W11
  { nt: "Colossians 3:1-17, 4:2-6",  ot: "1 Kings 18:16-46",               psalm: "Psalm 120", wisdom: "Proverbs 28:13-28"  }, // W12
  { nt: "1 Thessalonians 1-2",       ot: "1 Kings 19",                     psalm: "Psalm 121", wisdom: "Proverbs 29:1-14"   }, // W13
  { nt: "1 Thessalonians 3, 4:9-12", ot: "2 Kings 2",                      psalm: "Psalm 122", wisdom: "Proverbs 29:15-27"  }, // W14
  { nt: "1 Thessalonians 5",         ot: "2 Kings 4:1-37",                 psalm: "Psalm 123", wisdom: "Proverbs 30:1-14"   }, // W15
  { nt: "1 Timothy 1",               ot: "2 Kings 5",                      psalm: "Psalm 124", wisdom: "Proverbs 30:15-33"  }, // W16
  { nt: "1 Timothy 2",               ot: "2 Kings 17:1-23",                psalm: "Psalm 125", wisdom: "Proverbs 31"        }, // W17
  { nt: "1 Timothy 6",               ot: "2 Kings 18",                     psalm: "Psalm 126", wisdom: "Ecclesiastes 1"     }, // W18
  { nt: "2 Timothy 1-2",             ot: "2 Kings 19",                     psalm: "Psalm 127", wisdom: "Ecclesiastes 2:1-16" }, // W19
  { nt: "2 Timothy 3-4",             ot: "2 Kings 20",                     psalm: "Psalm 128", wisdom: "Ecclesiastes 2:17-26"}, // W20
  { nt: "Titus",                     ot: "2 Kings 22",                     psalm: "Psalm 129", wisdom: "Ecclesiastes 3:1-14" }, // W21
  { nt: "Hebrews 1",                 ot: "2 Kings 23:1-30",                psalm: "Psalm 130", wisdom: "Ecclesiastes 3:15-22"}, // W22
  { nt: "Hebrews 2",                 ot: "2 Kings 24:1-17",                psalm: "Psalm 131", wisdom: "Ecclesiastes 4"     }, // W23
  { nt: "Hebrews 3",                 ot: "2 Kings 25:8-21",                psalm: "Psalm 132", wisdom: null                  }, // W24
  { nt: "Hebrews 4-5",               ot: "Daniel 1:1-21",                  psalm: "Psalm 133", wisdom: "Ecclesiastes 5:1-7"  }, // W25
  { nt: "Hebrews 6",                 ot: "Daniel 2",                       psalm: "Psalm 134", wisdom: "Ecclesiastes 5:8-20" }, // W26
  { nt: "Hebrews 7",                 ot: "Daniel 3",                       psalm: "Psalm 135", wisdom: "Ecclesiastes 6"      }, // W27
  { nt: "Hebrews 9",                 ot: "Daniel 6",                       psalm: "Psalm 136", wisdom: "Ecclesiastes 7:1-14" }, // W28
  { nt: "Hebrews 10",                ot: "Esther 1",                       psalm: "Psalm 137", wisdom: "Ecclesiastes 7:15-29"}, // W29
  { nt: "Hebrews 11",                ot: "Esther 2",                       psalm: "Psalm 138", wisdom: "Ecclesiastes 8:1-10" }, // W30
  { nt: "Hebrews 12",                ot: "Esther 4-5",                     psalm: "Psalm 139", wisdom: "Ecclesiastes 9"      }, // W31
  { nt: "Hebrews 13",                ot: "Esther 6-7",                     psalm: "Psalm 140", wisdom: "Ecclesiastes 10"     }, // W32
  { nt: "1 John 4:7-21",             ot: "Ezra 1:1-7, 3",                  psalm: "Psalm 141", wisdom: "Ecclesiastes 11"     }, // W33
  { nt: "Revelation 1",              ot: "Nehemiah 1",                     psalm: "Psalm 142", wisdom: "Ecclesiastes 12"     }, // W34
  { nt: "Revelation 21",             ot: "Nehemiah 2",                     psalm: "Psalm 143", wisdom: null                  }, // W35
  { nt: "Revelation 22",             ot: "Nehemiah 9",                     psalm: "Psalm 144", wisdom: null                  }, // W36
];

const CYCLE1 = [
  { nt: "Matthew 1",                 ot: "Genesis 1",                      psalm: "Psalm 1",   wisdom: "Proverbs 1:1-19"   }, // W1
  { nt: "Matthew 2",                 ot: "Genesis 2",                      psalm: "Psalm 2",   wisdom: "Proverbs 1:20-33"  }, // W2
  { nt: "Matthew 3",                 ot: "Genesis 3",                      psalm: "Psalm 3",   wisdom: "Proverbs 2"        }, // W3
  { nt: "Matthew 4",                 ot: "Genesis 6:1-22, 7:1-10",         psalm: "Psalm 4",   wisdom: "Proverbs 3:1-18"   }, // W4
  { nt: "Matthew 5:1-26",            ot: "Genesis 7:11-24, 8:1-19",        psalm: "Psalm 5",   wisdom: "Proverbs 3:19-35"  }, // W5
  { nt: "Matthew 5:27-48",           ot: "Genesis 9:1-17",                 psalm: "Psalm 6",   wisdom: "Proverbs 4:1-19"   }, // W6
  { nt: "Matthew 6:1-18",            ot: "Genesis 11:1-9",                 psalm: "Psalm 7",   wisdom: "Proverbs 4:20-27"  }, // W7
  { nt: "Matthew 6:19-34",           ot: "Genesis 12:1-9",                 psalm: "Psalm 8",   wisdom: "Proverbs 5:1-14"   }, // W8
  { nt: "Matthew 7",                 ot: "Genesis 15",                     psalm: "Psalm 9",   wisdom: "Proverbs 5:15-23"  }, // W9
  { nt: "Matthew 8:1-22",            ot: "Genesis 17:1-22",                psalm: "Psalm 10",  wisdom: "Proverbs 6:1-19"   }, // W10
  { nt: "Matthew 8:23-34",           ot: "Genesis 18:1-15",                psalm: "Psalm 11",  wisdom: "Proverbs 6:20-35"  }, // W11
  { nt: "Matthew 9:1-17",            ot: "Genesis 21:1-21",                psalm: "Psalm 12",  wisdom: "Proverbs 7:1-13"   }, // W12
  { nt: "Matthew 9:18-38",           ot: "Genesis 22:1-18",                psalm: "Psalm 13",  wisdom: "Proverbs 7:14-27"  }, // W13
  { nt: "Matthew 10:1-25",           ot: "Genesis 24:1-27",                psalm: "Psalm 14",  wisdom: "Proverbs 8:1-21"   }, // W14
  { nt: "Matthew 10:26-42",          ot: "Genesis 24:28-67",               psalm: "Psalm 15",  wisdom: "Proverbs 8:22-36"  }, // W15
  { nt: "Matthew 11",                ot: "Genesis 25:19-34",               psalm: "Psalm 16",  wisdom: "Proverbs 9"        }, // W16
  { nt: "Matthew 12:1-21",           ot: "Genesis 27:1-29",                psalm: "Psalm 17",  wisdom: "Proverbs 10:1-16"  }, // W17
  { nt: "Matthew 12:22-50",          ot: "Genesis 28:10-22",               psalm: "Psalm 18",  wisdom: "Proverbs 10:17-32" }, // W18
  { nt: "Matthew 13:1-30",           ot: "Genesis 32:22-32",               psalm: "Psalm 19",  wisdom: "Proverbs 11:1-15"  }, // W19
  { nt: "Matthew 13:31-58",          ot: "Genesis 37:1-28",                psalm: "Psalm 20",  wisdom: "Proverbs 11:16-31" }, // W20
  { nt: "Matthew 14:1-21",           ot: "Genesis 39",                     psalm: "Psalm 21",  wisdom: "Proverbs 12:1-14"  }, // W21
  { nt: "Matthew 14:22-36",          ot: "Genesis 41:1-40",                psalm: "Psalm 22",  wisdom: "Proverbs 12:15-28" }, // W22
  { nt: "Matthew 15:1-20",           ot: "Genesis 41:41-57",               psalm: "Psalm 23",  wisdom: "Proverbs 13:1-12"  }, // W23
  { nt: "Matthew 15:21-39",          ot: "Genesis 45:1-15",                psalm: "Psalm 24",  wisdom: "Proverbs 13:13-25" }, // W24
  { nt: "Matthew 16",                ot: "Genesis 46:1-7",                 psalm: "Psalm 25",  wisdom: "Proverbs 14:1-18"  }, // W25
  { nt: "Matthew 17",                ot: "Genesis 50:15-26",               psalm: "Psalm 26",  wisdom: "Proverbs 14:19-35" }, // W26
  { nt: "Matthew 18:1-9",            ot: "Exodus 1:1-22",                  psalm: "Psalm 27",  wisdom: "Proverbs 15:1-17"  }, // W27
  { nt: "Matthew 19",                ot: "Exodus 2:1-25",                  psalm: "Psalm 28",  wisdom: "Proverbs 15:18-33" }, // W28
  { nt: "Matthew 20:17-34",          ot: "Exodus 3:1-22",                  psalm: "Psalm 29",  wisdom: "Proverbs 16:1-16"  }, // W29
  { nt: "Matthew 21:1-22",           ot: "Exodus 4:1-17",                  psalm: "Psalm 30",  wisdom: "Proverbs 16:17-33" }, // W30
  { nt: "Matthew 22:1-22",           ot: "Exodus 5-6:1-13",                psalm: "Psalm 31",  wisdom: "Proverbs 17:1-14"  }, // W31
  { nt: "Matthew 22:23-46",          ot: "Exodus 7:1-25",                  psalm: "Psalm 32",  wisdom: "Proverbs 17:15-28" }, // W32
  { nt: "Matthew 23:1-28",           ot: "Exodus 8:1-32",                  psalm: "Psalm 33",  wisdom: "Proverbs 18:1-12"  }, // W33
  { nt: "Matthew 23:29-39",          ot: "Exodus 9",                       psalm: "Psalm 34",  wisdom: "Proverbs 18:13-24" }, // W34
  { nt: "Matthew 24:1-28",           ot: "Exodus 10",                      psalm: "Psalm 35",  wisdom: "Proverbs 19:1-15"  }, // W35
  { nt: "Matthew 24:29-51",          ot: "Exodus 11-12:1-28",              psalm: "Psalm 36",  wisdom: "Proverbs 19:16-29" }, // W36
];

const CYCLE2 = [
  { nt: "Mark 8:1-21",               ot: "Exodus 1:1-22",                  psalm: "Psalm 37",  wisdom: "Proverbs 23:1-16"   }, // W1
  { nt: "Mark 8:22-38",              ot: "Exodus 2:1-10",                  psalm: "Psalm 38",  wisdom: "Proverbs 23:17-35"  }, // W2
  { nt: "Mark 9:2-13",               ot: "Exodus 2:11-25",                 psalm: "Psalm 39",  wisdom: "Proverbs 24:1-22"   }, // W3
  { nt: "Mark 9:14-32",              ot: "Exodus 3:1-22",                  psalm: "Psalm 40",  wisdom: "Proverbs 24:23-34"  }, // W4
  { nt: "Mark 9:33-50",              ot: "Exodus 4:1-17",                  psalm: "Psalm 41",  wisdom: "Proverbs 25:1-15"   }, // W5
  { nt: "Matthew 18:10-20",          ot: "Exodus 5:1-23",                  psalm: "Psalm 42",  wisdom: "Proverbs 25:16-28"  }, // W6
  { nt: "Matthew 18:21-35",          ot: "Exodus 6:1-13",                  psalm: "Psalm 43",  wisdom: "Proverbs 26:1-13"   }, // W7
  { nt: "Luke 10:1-24",              ot: "Exodus 7:1-25",                  psalm: "Psalm 44",  wisdom: "Proverbs 26:14-28"  }, // W8
  { nt: "Luke 10:25-42",             ot: "Exodus 8:1-32",                  psalm: "Psalm 45",  wisdom: "Proverbs 27:1-14"   }, // W9
  { nt: "Luke 13:10-17",             ot: "Exodus 9",                       psalm: "Psalm 46",  wisdom: "Proverbs 27:15-27"  }, // W10
  { nt: "Luke 16:19-31",             ot: "Exodus 10",                      psalm: "Psalm 47",  wisdom: "Proverbs 28:1-12"   }, // W11
  { nt: "Luke 17:11-37",             ot: "Exodus 12:3-28",                 psalm: "Psalm 48",  wisdom: "Proverbs 28:13-28"  }, // W12
  { nt: "John 10:1-18",              ot: "Exodus 12:29-51",                psalm: "Psalm 49",  wisdom: "Proverbs 29:1-14"   }, // W13
  { nt: "Matthew 20:1-16",           ot: "Exodus 14:5-31",                 psalm: "Psalm 50",  wisdom: "Proverbs 29:15-27"  }, // W14
  { nt: "Luke 19:1-10",              ot: "Exodus 16:1-35",                 psalm: "Psalm 51",  wisdom: "Proverbs 30:1-14"   }, // W15
  { nt: "Matthew 21:23-32",          ot: "Exodus 20:1-21",                 psalm: "Psalm 52",  wisdom: "Proverbs 30:15-33"  }, // W16
  { nt: "Matthew 22:34-46",          ot: "Exodus 24",                      psalm: "Psalm 53",  wisdom: "Proverbs 31"        }, // W17
  { nt: "Matthew 26:1-16",           ot: "Exodus 25",                      psalm: "Psalm 54",  wisdom: "Ecclesiastes 1"     }, // W18
  { nt: "Matthew 26:17-29",          ot: "Exodus 32",                      psalm: "Psalm 55",  wisdom: "Ecclesiastes 2:1-16" }, // W19
  { nt: "Matthew 26:30-46",          ot: "Exodus 33",                      psalm: "Psalm 56",  wisdom: "Ecclesiastes 2:17-26"}, // W20
  { nt: "Matthew 26:47-75",          ot: "Exodus 34",                      psalm: "Psalm 57",  wisdom: "Ecclesiastes 3:1-14" }, // W21
  { nt: "John 13:1-30",              ot: "Exodus 37",                      psalm: "Psalm 58",  wisdom: "Ecclesiastes 3:15-22"}, // W22
  { nt: "Luke 23:1-25",              ot: "Exodus 39:1-21",                 psalm: "Psalm 59",  wisdom: "Ecclesiastes 4"     }, // W23
  { nt: "Matthew 27:27-50",          ot: "Exodus 40",                      psalm: "Psalm 60",  wisdom: null                  }, // W24
  { nt: "Matthew 27:51-66",          ot: "Numbers 10:1-10",                psalm: "Psalm 61",  wisdom: "Ecclesiastes 5:1-7"  }, // W25
  { nt: "Matthew 28:1-15",           ot: "Numbers 20:2-18",                psalm: "Psalm 62",  wisdom: "Ecclesiastes 5:8-20" }, // W26
  { nt: "Luke 24:13-49",             ot: "Numbers 27:12-23",               psalm: "Psalm 63",  wisdom: "Ecclesiastes 6"      }, // W27
  { nt: "John 20:24-31",             ot: "Deuteronomy 1:1-25",             psalm: "Psalm 64",  wisdom: "Ecclesiastes 7:1-14" }, // W28
  { nt: "John 21:1-14",              ot: "Deuteronomy 1:26-45",            psalm: "Psalm 65",  wisdom: "Ecclesiastes 7:15-29"}, // W29
  { nt: "John 21:15-25",             ot: "Deuteronomy 4:1-31",             psalm: "Psalm 66",  wisdom: "Ecclesiastes 8:1-10" }, // W30
  { nt: "Acts 1:1-11",               ot: "Deuteronomy 5",                  psalm: "Psalm 67",  wisdom: "Ecclesiastes 9"      }, // W31
  { nt: "Acts 1:12-26",              ot: "Deuteronomy 6",                  psalm: "Psalm 68",  wisdom: "Ecclesiastes 10"     }, // W32
  { nt: "Acts 2:1-21",               ot: "Deuteronomy 7",                  psalm: "Psalm 69",  wisdom: "Ecclesiastes 11"     }, // W33
  { nt: "Acts 2:22-47",              ot: "Deuteronomy 31:14-29, 32:48-52", psalm: "Psalm 70",  wisdom: "Ecclesiastes 12"     }, // W34
  { nt: "Acts 3:1-10",               ot: "Deuteronomy 34",                 psalm: "Psalm 71",  wisdom: null                  }, // W35
  { nt: "Acts 3:11-26",              ot: null,                             psalm: "Psalm 72",  wisdom: null                  }, // W36
];

// ── Full sequence: finish C3 (from W29), then C4, C1, C2, repeat ──────────────
// C3_REMAINING = weeks 29-36 of Cycle 3 (indices 28-35)
const C3_REMAINING = CYCLE3.slice(28); // 8 weeks
const ALL_READINGS = [...C3_REMAINING, ...CYCLE4, ...CYCLE1, ...CYCLE2];

// Cycle labels for display
function getCycleLabel(globalIdx) {
  if (globalIdx < 8)  return `Cycle 3 \u00b7 Week ${globalIdx + 29}`;
  if (globalIdx < 44) return `Cycle 4 \u00b7 Week ${globalIdx - 7}`;
  if (globalIdx < 80) return `Cycle 1 \u00b7 Week ${globalIdx - 43}`;
  if (globalIdx < 116) return `Cycle 2 \u00b7 Week ${globalIdx - 79}`;
  return `Week ${globalIdx + 1}`;
}

// ── Styling ───────────────────────────────────────────────────────────────────
const ROTATION = ["nt", "ot", "psalm", "wisdom"];

const SLOT_STYLES = {
  nt:     { accent: "#4A7C7E", light: "#EAF2F2", icon: "\u271d", label: "New Testament",    short: "NT"     },
  ot:     { accent: "#A9B786", light: "#EFF4EA", icon: "\u2726", label: "Old Testament",    short: "OT"     },
  psalm:  { accent: "#C29B61", light: "#FAF3E8", icon: "\u266a", label: "Psalm",            short: "Psalm"  },
  wisdom: { accent: "#7A6A55", light: "#F7F4EF", icon: "\u25c8", label: "Proverbs & Wisdom",short: "Wisdom" },
};

// ── State ─────────────────────────────────────────────────────────────────────
// Each track has its own index into ALL_READINGS, advancing independently
const DEFAULT_STATE = { nt_week: 0, ot_week: 0, psalm_week: 0, wisdom_week: 0 };

function loadState() {
  try {
    const raw = localStorage.getItem("tend_bible_v3");
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch { return DEFAULT_STATE; }
}

function saveState(s) { localStorage.setItem("tend_bible_v3", JSON.stringify(s)); }

function getReading(state, track) {
  const idx = Math.min(state[`${track}_week`] || 0, ALL_READINGS.length - 1);
  return ALL_READINGS[idx]?.[track] || null;
}

function advanceTrack(state, track) {
  const key = `${track}_week`;
  let next = (state[key] || 0) + 1;
  while (next < ALL_READINGS.length && !ALL_READINGS[next][track]) next++;
  if (next >= ALL_READINGS.length) next = state[key] || 0;
  return { ...state, [key]: next };
}

function getSuggested(state) {
  return ROTATION.reduce((behind, t) =>
    (state[`${t}_week`] || 0) < (state[`${behind}_week`] || 0) ? t : behind
  , ROTATION[0]);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BibleReadingScreen({ compact = false }) {
  const [state, setState]     = useState(loadState);
  const [active, setActive]   = useState(() => getSuggested(loadState()));
  const [showSettings, setShowSettings] = useState(false);

  const suggested  = getSuggested(state);
  const style      = SLOT_STYLES[active];
  const reading    = getReading(state, active);

  const markDone = () => {
    const next = advanceTrack(state, active);
    setState(next); saveState(next);
    setActive(getSuggested(next));
  };

  // ── Compact widget ──────────────────────────────────────────────────────────
  if (compact) {
    return (
      <div style={{ borderLeft: `3px solid ${style.accent}`, paddingLeft: "12px", margin: "6px 0", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        {/* Track tabs */}
        <div style={{ display: "flex", gap: "5px", marginBottom: "8px", flexWrap: "wrap" }}>
          {ROTATION.map(track => {
            const s = SLOT_STYLES[track];
            const isActive = track === active;
            return (
              <button key={track} onClick={() => setActive(track)} style={{
                background: isActive ? s.accent : "transparent", color: isActive ? "white" : s.accent,
                border: `1.5px solid ${s.accent}`, borderRadius: "20px", padding: "2px 9px",
                fontSize: "10px", fontFamily: "system-ui", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "3px", opacity: isActive ? 1 : 0.65,
              }}>
                {s.icon} {s.short}
                {track === suggested && !isActive && <span style={{ fontSize: "6px" }}>\u25cf</span>}
              </button>
            );
          })}
        </div>
        {/* Reference row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "#2D3748", lineHeight: 1.3 }}>
            {reading || <span style={{ color: "#9CA3AF", fontStyle: "italic", fontSize: "14px" }}>No reading this week</span>}
          </p>
          {reading && (
            <button onClick={markDone} style={{
              background: style.accent, color: "white", border: "none", borderRadius: "5px",
              padding: "4px 12px", fontSize: "11px", fontFamily: "system-ui", fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", marginLeft: "10px", flexShrink: 0,
            }}>Done \u2192</button>
          )}
        </div>
        <p style={{ margin: "3px 0 0", fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF" }}>
          {getCycleLabel(state[`${active}_week`] || 0)}
        </p>
      </div>
    );
  }

  // ── Full screen ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", fontFamily: "'Cormorant Garamond', Georgia, serif", paddingBottom: "80px" }}>
      {/* Sticky header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8E4DC", padding: "20px 24px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Daily Scripture</p>
            <h1 style={{ margin: "2px 0 0", fontSize: "22px", fontWeight: 700, color: "#2D3748" }}>{reading || "\u2014"}</h1>
            <p style={{ margin: "2px 0 0", fontFamily: "system-ui", fontSize: "11px", color: "#9CA3AF" }}>{getCycleLabel(state[`${active}_week`] || 0)}</p>
          </div>
          <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", fontSize: "17px", cursor: "pointer", color: "#C4B89A", marginTop: "4px" }}>\u2699</button>
        </div>
        {/* Track tabs */}
        <div style={{ display: "flex", borderTop: "1px solid #F0EBE0" }}>
          {ROTATION.map(track => {
            const s = SLOT_STYLES[track];
            const isActive = track === active;
            const ref = getReading(state, track);
            return (
              <button key={track} onClick={() => setActive(track)} style={{
                flex: 1, padding: "10px 4px 12px", background: "none", border: "none",
                borderBottom: isActive ? `3px solid ${s.accent}` : "3px solid transparent",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              }}>
                <span style={{ fontSize: "14px", color: isActive ? s.accent : "#BDB5A8" }}>{s.icon}</span>
                <span style={{ fontFamily: "system-ui", fontSize: "9px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: isActive ? s.accent : "#BDB5A8" }}>{s.short}</span>
                <span style={{ fontFamily: "system-ui", fontSize: "9px", color: isActive ? "#4A5568" : "#C4B89A", textAlign: "center", lineHeight: 1.3, maxWidth: "72px" }}>{ref || "\u2014"}</span>
                {track === suggested && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: s.accent, display: "block", opacity: isActive ? 0 : 0.55, marginTop: "1px" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Off-suggested note */}
      {active !== suggested && (
        <div style={{ margin: "14px 24px 0", padding: "8px 14px", background: "#F7F5F0", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: SLOT_STYLES[suggested].accent }}>{SLOT_STYLES[suggested].icon}</span>
          <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "11px", color: "#9CA3AF" }}>
            Suggested today: <span style={{ color: SLOT_STYLES[suggested].accent, fontWeight: 700 }}>{SLOT_STYLES[suggested].label}</span> \u2014 but read what calls to you.
          </p>
        </div>
      )}

      {/* Reading card */}
      <div style={{ padding: "24px" }}>
        <div style={{ background: "white", borderRadius: "14px", padding: "32px 28px", border: `1px solid ${style.light}`, boxShadow: "0 1px 8px rgba(0,0,0,0.04)", textAlign: "center" }}>
          <p style={{ margin: "0 0 8px", fontFamily: "system-ui", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: style.accent }}>{style.label}</p>
          <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#2D3748", lineHeight: 1.3 }}>
            {reading || <span style={{ color: "#9CA3AF", fontStyle: "italic", fontSize: "20px" }}>No reading this week</span>}
          </p>
          <p style={{ margin: "10px 0 0", fontFamily: "system-ui", fontSize: "11px", color: "#9CA3AF" }}>{getCycleLabel(state[`${active}_week`] || 0)}</p>
        </div>

        {/* Up next */}
        {(() => {
          const nextIdx = (state[`${active}_week`] || 0) + 1;
          const nextRef = ALL_READINGS[nextIdx]?.[active];
          if (!nextRef || nextIdx >= ALL_READINGS.length) return null;
          return (
            <div style={{ marginTop: "14px", padding: "12px 16px", background: "#F7F5F0", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: style.accent }}>{style.icon}</span>
              <div>
                <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "10px", color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Up next</p>
                <p style={{ margin: 0, fontSize: "15px", color: "#4A5568" }}>{nextRef}</p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #E8E4DC", padding: "14px 24px" }}>
        <button onClick={markDone} disabled={!reading} style={{
          width: "100%", background: reading ? style.accent : "#E8E4DC", color: "white",
          border: "none", borderRadius: "12px", padding: "14px",
          fontSize: "17px", fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 700, cursor: reading ? "pointer" : "default", letterSpacing: "0.03em",
        }}>We read it \u2014 move on \u2192</button>
      </div>

      {/* Settings sheet */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "flex-end" }} onClick={() => setShowSettings(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "white", borderRadius: "20px 20px 0 0", padding: "24px 24px 48px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#2D3748", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Adjust Your Position</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: "#F3F0E8", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "16px", cursor: "pointer", color: "#6B7280" }}>\u00d7</button>
            </div>
            <p style={{ margin: "0 0 20px", fontFamily: "system-ui", fontSize: "12px", color: "#9CA3AF", lineHeight: 1.6 }}>Use arrows to move each track forward or back one week.</p>
            {ROTATION.map(track => {
              const s = SLOT_STYLES[track];
              const key = `${track}_week`;
              const idx = state[key] || 0;
              const ref = getReading(state, track);
              return (
                <div key={track} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #F0EBE0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ color: s.accent }}>{s.icon}</span>
                    <p style={{ margin: 0, fontFamily: "system-ui", fontSize: "11px", fontWeight: 700, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "16px", color: "#2D3748" }}>{ref || "No reading"}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={() => { const n = { ...state, [key]: Math.max(0, idx - 1) }; setState(n); saveState(n); }} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F3F0E8", border: "none", cursor: "pointer", fontSize: "16px", color: "#6B7280" }}>\u2190</button>
                    <span style={{ fontFamily: "system-ui", fontSize: "11px", color: "#9CA3AF", minWidth: "110px", textAlign: "center" }}>{getCycleLabel(idx)}</span>
                    <button onClick={() => { const n = { ...state, [key]: Math.min(ALL_READINGS.length - 1, idx + 1) }; setState(n); saveState(n); }} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F3F0E8", border: "none", cursor: "pointer", fontSize: "16px", color: "#6B7280" }}>\u2192</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
