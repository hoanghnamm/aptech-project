import http from "./axios";

/**
 * Send a message to the AI veterinary chatbot.
 * @param {string} message - the user's message
 * @param {Array<{role:string, content:string}>} history - prior turns
 * @returns {Promise<{reply:string}>}
 */
export const sendChatMessage = async (message, history = []) => {
  const response = await http.post("/api/chatbot", { message, history });
  return response.data?.data || response.data;
};
