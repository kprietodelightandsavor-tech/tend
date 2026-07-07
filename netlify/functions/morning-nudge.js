// netlify/functions/morning-nudge.js
// Scheduled: gentle good-morning nudge. Time set in netlify.toml (UTC).

const { sendToAll } = require('./send-nudge');

const MORNING_LINES = [
  "Good morning. The day has a shape — here's your one thing.",
  "Minds are fresh. Morning Focus first, then gather.",
  "A gentle start: outside light, then the feast.",
];

exports.handler = async () => {
  const line = MORNING_LINES[new Date().getDate() % MORNING_LINES.length];
  const result = await sendToAll({ title: "Tend", body: line, url: "/" });
  return { statusCode: 200, body: JSON.stringify(result) };
};
