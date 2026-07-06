const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// CM Form guidelines for sufficiency evaluation
const CM_FORM_GUIDES = {
  "Form 1": {
    label: "Form 1 (Ages 6-9)",
    weeklyHours: 15,
    subjects: {
      "Language Arts": { min: 3, label: "Reading & Language Arts", cm: "Living books, copywork, narration — the foundation of all learning." },
      "Math": { min: 2.5, label: "Mathematics", cm: "Slow and thorough. Manipulatives and mental math over worksheets." },
      "History": { min: 1.5, label: "History & Biography", cm: "Stories of real people and times. Narration over dates and facts." },
      "Science": { min: 1.5, label: "Nature Study & Science", cm: "Outdoor observation, nature journal, living science books." },
      "Geography": { min: 1, label: "Geography", cm: "Maps, living geography books, and place-based stories." },
      "Read Aloud": { min: 1.5, label: "Read Aloud", cm: "The heart of a CM education. Living books read together daily." },
      "Nature Study": { min: 1, label: "Nature Study", cm: "Weekly outdoor time, nature journal, observation habit." },
      "Artist Study": { min: 0.5, label: "Picture Study", cm: "One artist per term, studied through quiet observation." },
      "Composer Study": { min: 0.5, label: "Composer Study", cm: "One composer per term, studied through listening." },
    },
    outdoorHours: { min: 40, label: "Outdoor Hours" },
  },
  "Form 2": {
    label: "Form 2 (Ages 9-12)",
    weeklyHours: 18,
    subjects: {
      "Language Arts": { min: 3.5, label: "Language Arts", cm: "Narration transitions toward written work. Dictation, grammar through use." },
      "Math": { min: 3, label: "Mathematics", cm: "Steady progress. Understanding over speed." },
      "History": { min: 2, label: "History & Biography", cm: "Longer books, timeline work, great lives studied in depth." },
      "Science": { min: 2, label: "Science", cm: "Nature study continues plus living science books and simple experiments." },
      "Geography": { min: 1.5, label: "Geography", cm: "World geography through living books and map work." },
      "Read Aloud": { min: 1.5, label: "Read Aloud", cm: "Rich literature read aloud together — poetry, prose, and story." },
      "Living Literature": { min: 1.5, label: "Living Literature", cm: "Great books read and narrated. Quality over quantity." },
      "Nature Study": { min: 1, label: "Nature Study", cm: "Nature journal, seasonal observation, The Year Round curriculum." },
      "Spanish": { min: 1, label: "Modern Language", cm: "Conversational, living language — songs, stories, and daily use." },
      "Artist Study": { min: 0.5, label: "Picture Study", cm: "One artist per term." },
      "Composer Study": { min: 0.5, label: "Composer Study", cm: "One composer per term." },
    },
    outdoorHours: { min: 30, label: "Outdoor Hours" },
  },
  "Form 3": {
    label: "Form 3 (Ages 12-15)",
    weeklyHours: 22,
    subjects: {
      "Language Arts": { min: 4, label: "Language Arts & Composition", cm: "Written narration, essay, dictation, and grammar in use." },
      "Math": { min: 3.5, label: "Mathematics", cm: "Algebra and geometry. Careful, thorough work." },
      "History": { min: 2.5, label: "History", cm: "Primary sources introduced. Long historical works narrated in writing." },
      "Science": { min: 2.5, label: "Science", cm: "Systematic study of one science per term with living books." },
      "Geography": { min: 1.5, label: "Geography", cm: "World geography and current events." },
      "Living Literature": { min: 2, label: "Living Literature", cm: "Great books, Shakespeare, poetry studied carefully." },
      "Nature Study": { min: 1, label: "Nature Study", cm: "Continued nature journal and outdoor observation." },
      "Spanish": { min: 1.5, label: "Modern Language", cm: "Reading and conversation in the target language." },
      "Artist Study": { min: 0.5, label: "Picture Study", cm: "One artist per term with written narration." },
      "Composer Study": { min: 0.5, label: "Composer Study", cm: "One composer per term." },
    },
    outdoorHours: { min: 25, label: "Outdoor Hours" },
  },
  "Form 4-6": {
    label: "Form 4-6 (Ages 15-18)",
    weeklyHours: 25,
    subjects: {
      "Language Arts": { min: 5, label: "Language Arts & Rhetoric", cm: "Essays, composition, rhetoric, and grammar mastery." },
      "Math": { min: 4, label: "Mathematics", cm: "Higher math studied with care and understanding." },
      "History": { min: 3, label: "History", cm: "Primary sources, historical essays, and great thinkers." },
      "Science": { min: 3, label: "Science", cm: "Systematic lab science with living books alongside." },
      "Living Literature": { min: 3, label: "Living Literature", cm: "Great books, classical literature, and poetry at depth." },
      "Geography": { min: 1.5, label: "Geography", cm: "World geography and geopolitics through living books." },
      "Spanish": { min: 2, label: "Modern Language", cm: "Reading literature in the target language." },
      "Nature Study": { min: 1, label: "Nature Study", cm: "Continued outdoor habit and nature journal." },
      "Artist Study": { min: 0.5, label: "Picture Study", cm: "One artist per term with written analysis." },
      "Composer Study": { min: 0.5, label: "Composer Study", cm: "One composer per term with written narration." },
    },
    outdoorHours: { min: 20, label: "Outdoor Hours" },
  },
};

// Subject duration map (minutes) based on typical time blocks
const SUBJECT_DURATIONS = {
  "Math": 45,
  "Language Arts": 45,
  "Using Language Well": 40,
  "Living Literature": 50,
  "History": 45,
  "Science": 40,
  "Geography": 35,
  "Nature Study": 60,
  "Read Aloud": 30,
  "Spanish": 30,
  "Artist Study": 20,
  "Composer Study": 20,
  "Poet & Poetry Study": 20,
  "Poetry Study": 20,
  "Biography Study": 25,
  "Citizenship Study": 25,
  "Folk Song & Recitation": 15,
  "Hymn Study": 15,
  "Bible": 20,
  "Co-op": 90,
  "default": 35,
};

function getDuration(subject) {
  for (const [key, mins] of Object.entries(SUBJECT_DURATIONS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) return mins;
  }
  return SUBJECT_DURATIONS.default;
}

function normalizeSubject(subject) {
  const s = subject.toLowerCase();
  if (s.includes("math")) return "Math";
  if (s.includes("language") || s.includes("using language")) return "Language Arts";
  if (s.includes("literature") || s.includes("living lit")) return "Living Literature";
  if (s.includes("history") || s.includes("biography")) return "History";
  if (s.includes("science")) return "Science";
  if (s.includes("geography")) return "Geography";
  if (s.includes("nature")) return "Nature Study";
  if (s.includes("read aloud")) return "Read Aloud";
  if (s.includes("spanish")) return "Spanish";
  if (s.includes("artist") || s.includes("picture study")) return "Artist Study";
  if (s.includes("composer")) return "Composer Study";
  if (s.includes("poet") || s.includes("poetry")) return "Poet & Poetry Study";
  if (s.includes("bible") || s.includes("hymn") || s.includes("folk song")) return "Morning Time";
  if (s.includes("co-op") || s.includes("chispa") || s.includes("bach")) return "Co-op";
  return subject;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { userId, schoolYear, childName, formLevel, outdoorMinutes } = JSON.parse(event.body || '{}');

    if (!userId || !schoolYear) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId or schoolYear' }) };
    }

    // 1. Fetch teaching log for the year
    const { data: records, error: logError } = await supabase
      .from('teaching_log')
      .select('*')
      .eq('user_id', userId)
      .eq('school_year', schoolYear)
      .eq('status', 'completed')
      .order('date', { ascending: true });

    if (logError) throw logError;

    // 2. Filter by child if specified
    const filtered = childName && childName !== 'All'
      ? records.filter(r => r.child_name === childName || r.child_name === 'All')
      : records;

    // 3. Calculate time per subject
    const subjectMap = {};
    const rawSubjects = {};
    filtered.forEach(r => {
      const norm = normalizeSubject(r.subject);
      const mins = getDuration(r.subject);
      if (!subjectMap[norm]) subjectMap[norm] = 0;
      subjectMap[norm] += mins;
      if (!rawSubjects[norm]) rawSubjects[norm] = new Set();
      rawSubjects[norm].add(r.subject);
    });

    // Convert to hours
    const subjectHours = {};
    Object.entries(subjectMap).forEach(([sub, mins]) => {
      subjectHours[sub] = Math.round((mins / 60) * 10) / 10;
    });

    const totalHours = Object.values(subjectHours).reduce((a, b) => a + b, 0);
    const uniqueDays = new Set(filtered.map(r => r.date)).size;
    const outdoorHours = Math.round((outdoorMinutes || 0) / 60 * 10) / 10;

    // 4. CM sufficiency evaluation
    const form = CM_FORM_GUIDES[formLevel] || CM_FORM_GUIDES["Form 2"];
    const evaluation = {};
    const weeksInYear = uniqueDays > 0 ? Math.ceil(uniqueDays / 5) : 32;

    Object.entries(form.subjects).forEach(([subjectKey, guide]) => {
      const actual = subjectHours[subjectKey] || 0;
      const expectedAnnual = guide.min * weeksInYear;
      const pct = expectedAnnual > 0 ? actual / expectedAnnual : 0;
      evaluation[subjectKey] = {
        label: guide.label,
        cm: guide.cm,
        actual: actual,
        expected: expectedAnnual,
        pct: Math.min(pct, 1),
        status: pct >= 0.85 ? 'strong' : pct >= 0.6 ? 'adequate' : 'light',
      };
    });

    // Outdoor evaluation
    const outdoorExpected = form.outdoorHours.min;
    const outdoorPct = outdoorHours / outdoorExpected;
    evaluation['Outdoor Time'] = {
      label: 'Outdoor Hours',
      cm: 'Charlotte Mason considered outdoor time essential — not optional.',
      actual: outdoorHours,
      expected: outdoorExpected,
      pct: Math.min(outdoorPct, 1),
      status: outdoorPct >= 0.85 ? 'strong' : outdoorPct >= 0.6 ? 'adequate' : 'light',
    };

    // 5. Build subject list for AI narrative
    const subjectSummary = Object.entries(subjectHours)
      .sort((a, b) => b[1] - a[1])
      .map(([sub, hrs]) => `${sub}: ${hrs} hours`)
      .join('\n');

    const evalSummary = Object.entries(evaluation)
      .map(([sub, e]) => `${e.label}: ${e.actual}h actual / ${e.expected}h expected (${e.status})`)
      .join('\n');

    // 6. Generate AI narrative transcript
    const prompt = `You are writing a Charlotte Mason annual transcript for a homeschool family using the Tend app by Delight & Savor.

Child: ${childName || 'Student'}
Form Level: ${form.label}
School Year: ${schoolYear}
Total teaching days: ${uniqueDays}
Total academic hours: ${Math.round(totalHours * 10) / 10}
Outdoor hours: ${outdoorHours}

Subject hours completed this year:
${subjectSummary}

CM sufficiency evaluation:
${evalSummary}

Write a warm, narrative annual transcript in the tradition of Charlotte Mason's PNEU school reports. This should read like a real school record that a CM educator would be proud of — not a bureaucratic checklist.

Structure:
1. A one-paragraph opening that describes the child's year in a holistic, CM voice — mentioning the breadth of their education, their growing capacity for narration and attention, and the living books and ideas they encountered.

2. A subject-by-subject narrative section. For each major subject area, write 2-4 sentences describing what was accomplished, in CM language. Do not just list hours — speak about the education as a living thing. Mention any areas that were particularly strong and any that could receive more attention next year.

3. A "Beautiful Things" paragraph — mention the beauty loop subjects studied (composer, artist, poet, folk song) and the nature study topics covered through The Year Round by C.J. Hylander.

4. A closing paragraph that evaluates the year through the lens of CM's philosophy — ideas, atmosphere, and discipline. End with an encouraging, honest sentence about next year.

Tone: warm, literary, honest, CM-fluent. Use phrases like "living ideas," "the habit of attention," "narration," "the feast of knowledge." Do not use corporate or bureaucratic language. Write as if Charlotte Mason herself might approve of this report.

Keep the full transcript under 600 words.`;

    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const aiData = await aiResponse.json();
    const narrative = aiData.content?.[0]?.text || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        subjectHours,
        totalHours: Math.round(totalHours * 10) / 10,
        outdoorHours,
        uniqueDays,
        weeksInYear,
        evaluation,
        narrative,
        schoolYear,
        childName,
        formLevel: form.label,
      }),
    };

  } catch (e) {
    console.error('Annual report error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
