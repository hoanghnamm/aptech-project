const groq = require("../../config/groq");
const { buildChatMessages } = require("../../prompts/chatbot/chatbot.prompt");

/**
 * Generate a conversational veterinary-assistant reply via Groq.
 * @param {string} message - the new user message
 * @param {Array} history - prior conversation turns [{role, content}]
 * @returns {Promise<string>} the assistant's reply text
 */
async function generateChatReply(message, history = []) {
  const messages = buildChatMessages(history, message);

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    messages,
    temperature: 0.6,
    max_tokens: 700,
  });

  const reply = response?.choices?.[0]?.message?.content?.trim();
  return reply || "Sorry, I couldn't generate a response. Please try again.";
}

module.exports = {
  generateChatReply,
};
