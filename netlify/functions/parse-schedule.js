// netlify/functions/parse-schedule.js
//
// Accepts a base64 image and returns structured schedule blocks
// extracted by Claude's vision API.

const Anthropic = require("@anthropic-ai/sdk");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { imageData, mediaType, day, isVoice, voiceText } = JSON.parse(event.body);

    if (!imageData && !voiceText) {
      return { statusCode: 400, body: JSON.stringify({ error: "No image or voice text provided" }) };
    }

    const client = new Anthropic.default({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    let messages;

    if (isVoice && voiceText) {
      // Voice path — parse natural language into schedule blocks
      messages = [{
        role: "user",
        content: `Someone spoke their school schedule out loud. Here is what they said:

"${voiceText}"

Extract all the time blocks and subjects from this. Return ONLY a JSON array of schedule blocks, nothing else. Each block should have:
- "time": the time as a string like "9:00" or "10:30" (use "" if no time mentioned)
- "subject": the subject or activity name
- "note": any additional detail (use "" if none)

Be generous with interpretation — "math" means "Mathematics", "basket" or "morning basket" means "Morning Basket", "narrate" means "Narration", etc.

Return ONLY the JSON array, no explanation.`
      }];
    } else {
      // Photo path — vision API
      messages = [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageData },
          },
          {
            type: "text",
            text: `Look at this schedule or planner image. Extract all the time blocks, subjects, and any notes you can see.

Return ONLY a JSON array of schedule blocks, nothing else. Each block should have:
- "time": the time as a string like "9:00" or "10:30" (use "" if no time visible)
- "subject": the subject or activity name  
- "note": any additional detail or note (use "" if none)

If the image is for a specific day (${day || "unknown"}), only extract that day's blocks.
If you cannot read the image clearly, return an empty array [].

Return ONLY the JSON array, no explanation.`
          }
        ]
      }];
    }

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages,
    });

    const raw = response.content[0]?.text || "[]";

    // Strip any markdown fences if present
    const clean = raw.replace(/```json|```/g, "").trim();

    let blocks;
    try {
      blocks = JSON.parse(clean);
    } catch {
      blocks = [];
    }

    // Ensure each block has required fields
    const sanitized = blocks.map((b, i) => ({
      id: `imported-${Date.now()}-${i}`,
      time: b.time || "",
      subject: b.subject || "Untitled",
      note: b.note || "",
      day: b.day || day || null,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks: sanitized }),
    };

  } catch (err) {
    console.error("Parse schedule error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to parse schedule", detail: err.message }),
    };
  }
};
