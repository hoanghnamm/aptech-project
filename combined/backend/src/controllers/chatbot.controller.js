const chatbotService = require("../services/ai/chatbot.service");
const ChatHistory = require("../models/ChatHistory");
const { sendSuccess } = require("../utils/response");

const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user?._id || req.user?.id || null;

    const reply = await chatbotService.generateChatReply(message, history);

    // Persist the exchange (non-fatal if the DB write fails)
    ChatHistory.create({
      userId,
      userMessage: message,
      assistantReply: reply,
      context: Array.isArray(history) ? history.slice(-10) : [],
    }).catch((err) => console.error("ChatHistory save failed:", err.message));

    return sendSuccess(res, { reply }, "Chat reply generated");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
};
