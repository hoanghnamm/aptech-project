const mongoose = require("mongoose");

const breedRecognitionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    breedName: { type: String, required: true },
    confidence: { type: Number, default: null },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BreedRecognitionHistory",
  breedRecognitionHistorySchema
);
