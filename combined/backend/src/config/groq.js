const OpenAI = require("openai");

console.log("GROQ_API_KEY =", process.env.GROQ_API_KEY);
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

module.exports = groq;