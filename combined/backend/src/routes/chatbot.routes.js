const express = require("express");
const router = express.Router();

const chatbotController = require("../controllers/chatbot.controller");
const { chatRules, validateChat } = require("../validations/chatbot.validation");
const { optionalAuth, authenticate } = require("../middlewares/auth.middleware");

router.post("/", optionalAuth, chatRules, validateChat, chatbotController.chat);
router.get("/history", authenticate, chatbotController.getChatHistory);
router.get("/history/:sessionId", authenticate, chatbotController.getChatSession);

module.exports = router;
