const chatbotService = require("../services/ai/chatbot.service");
const ChatHistory = require("../models/ChatHistory");
const { sendSuccess } = require("../utils/response");
const mongoose = require("mongoose");

const chat = async (req, res, next) => {
  try {
    const { message, history = [], sessionId } = req.body;
    const userId = req.user?._id || req.user?.id || null;

    const reply = await chatbotService.generateChatReply(message, history);

    let activeSessionId = sessionId;

    if (userId) {
      if (activeSessionId && mongoose.Types.ObjectId.isValid(activeSessionId)) {
        // Update existing chat thread session
        try {
          const updated = await ChatHistory.findOneAndUpdate(
            { _id: activeSessionId, userId },
            {
              $set: { assistantReply: reply },
              $push: {
                context: {
                  $each: [
                    { role: "user", content: message },
                    { role: "assistant", content: reply },
                  ],
                },
              },
            },
            { new: true }
          );
          if (!updated) {
            // If session not found, fall back to creating a new one
            activeSessionId = null;
          }
        } catch (err) {
          console.error("Failed to update existing chat session:", err.message);
          activeSessionId = null;
        }
      }

      if (!activeSessionId) {
        // Create new chat thread session
        const initialContext = [];
        // Optional: Include previous history items into context if they exist
        history.forEach((h) => {
          initialContext.push({ role: h.role, content: h.content });
        });
        initialContext.push({ role: "user", content: message });
        initialContext.push({ role: "assistant", content: reply });

        try {
          const doc = await ChatHistory.create({
            userId,
            userMessage: message, // Save the first message as userMessage (title/summary)
            assistantReply: reply,
            context: initialContext,
          });
          activeSessionId = doc._id;
        } catch (err) {
          console.error("Failed to create new chat session:", err.message);
        }
      }
    }

    return sendSuccess(res, { reply, sessionId: activeSessionId }, "Chat reply generated");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/chatbot/history — fetch list of chat sessions for the authenticated user.
 */
const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const limit = Math.min(Number(req.query.limit) || 30, 100);

    const history = await ChatHistory.find({ userId })
      .select("_id userMessage assistantReply createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    return sendSuccess(res, history, "Chat history sessions fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/chatbot/history/:sessionId — fetch details of a specific chat session.
 */
const getChatSession = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ success: false, message: "Invalid session ID" });
    }

    const session = await ChatHistory.findOne({ _id: sessionId, userId }).lean();
    if (!session) {
      return res.status(404).json({ success: false, message: "Chat session not found" });
    }

    return sendSuccess(res, session, "Chat session details fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  getChatHistory,
  getChatSession,
};
