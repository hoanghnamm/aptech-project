const mongoose = require("mongoose");

const nutritionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    breedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Breed",
      default: null,
    },

    breedName: {
      type: String,
      required: true,
      trim: true,
    },

    breedMatched: {
      type: Boolean,
      default: false,
    },

    breedSnapshot: {
      type: Object,
      default: {},
    },

    requestData: {
      type: Object,
      required: true,
    },

    baseEstimate: {
      type: Object,
      required: true,
    },

    aiResponse: {
      type: Object,
      required: true,
    },

    modelUsed: {
      type: String,
      default: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NutritionHistory", nutritionHistorySchema);