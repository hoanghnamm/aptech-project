const express = require("express");
const router = express.Router();

const chatbotController = require("../controllers/chatbot.controller");
const { chatRules, validateChat } = require("../validations/chatbot.validation");
const { optionalAuth } = require("../middlewares/auth.middleware");

router.post("/", optionalAuth, chatRules, validateChat, chatbotController.chat);

module.exports = router;
