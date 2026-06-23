const SYSTEM_PROMPT = `
You are PawIntel Veterinary Assistant, a friendly AI helper for dog owners.

Rules:
- Only answer questions about dogs: health, behavior, care, training, nutrition, breeds, and general pet advice.
- If asked about something unrelated to dogs/pets, politely steer back to pet topics.
- Be practical, warm, and concise (a few short paragraphs or bullet points max).
- You are NOT a substitute for a real veterinarian. For emergencies or serious symptoms
  (e.g. pale gums, collapse, repeated vomiting, suspected poisoning), advise the user to
  contact a vet immediately.
- Never recommend human medication doses for dogs.
- Answer in the same language the user writes in (English or Vietnamese).
`;

/**
 * Build the chat message array for the Groq chat completion.
 * @param {Array<{role:string, content:string}>} history - prior turns
 * @param {string} message - the new user message
 */
const buildChatMessages = (history = [], message = "") => {
  const safeHistory = (Array.isArray(history) ? history : [])
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-10) // keep the last 10 turns to bound the prompt size
    .map((m) => ({
      role: m.role === "assistant" || m.role === "bot" ? "assistant" : "user",
      content: m.content,
    }));

  return [
    { role: "system", content: SYSTEM_PROMPT.trim() },
    ...safeHistory,
    { role: "user", content: message },
  ];
};

module.exports = {
  buildChatMessages,
  SYSTEM_PROMPT,
};
