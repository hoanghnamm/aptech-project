import http from "./axios";

/**
 * Send a message to the AI veterinary chatbot.
 * @param {string} message - the user's message
 * @param {Array<{role:string, content:string}>} history - prior turns
 * @param {string} [sessionId] - the active session ID (optional)
 * @returns {Promise<{reply:string, sessionId:string}>}
 */
export const sendChatMessage = async (message, history = [], sessionId = null) => {
  const response = await http.post("/api/chatbot", { message, history, sessionId });
  return response.data?.data || response.data;
};

/** Fetch chat history sessions for the authenticated user. */
export const getChatHistory = async (limit = 30) => {
  const response = await http.get("/api/chatbot/history", { params: { limit } });
  return response.data?.data || response.data;
};

/** Fetch details of a specific chat session by ID. */
export const getChatSessionDetails = async (sessionId) => {
  const response = await http.get(`/api/chatbot/history/${sessionId}`);
  return response.data?.data || response.data;
};
