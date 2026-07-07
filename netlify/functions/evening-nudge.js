// netlify/functions/evening-nudge.js
// Scheduled: the Evening Close bell. Time set in netlify.toml (UTC).

const { sendToAll } = require('./send-nudge');

const EVENING_LINES = [
  "The day is waiting to be kept. Thirty seconds, then rest.",
  "Close the day — tap what happened, keep one delight.",
  "Before the evening slips: a few taps, and the record writes itself.",
];

exports.handler = async () => {
  const line = EVENING_LINES[new Date().getDate() % EVENING_LINES.length];
  const result = await sendToAll({ title: "Tend", body: line, url: "/?screen=evening-close" });
  return { statusCode: 200, body: JSON.stringify(result) };
};
