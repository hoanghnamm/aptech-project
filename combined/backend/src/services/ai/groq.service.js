const groq = require("../../config/groq");

function safeJsonParse(content) {
  if (typeof content !== "string") return content;

  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const cleaned = trimmed
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  }
}

async function callGroqStructured({
  messages,
  model = process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  temperature = 0.2,
  schemaName,
  schema,
}) {
  const response = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: schemaName,
        strict: true,
        schema,
      },
    },
  });

  const rawContent = response?.choices?.[0]?.message?.content || "{}";
  return safeJsonParse(rawContent);
}

module.exports = {
  callGroqStructured,
};