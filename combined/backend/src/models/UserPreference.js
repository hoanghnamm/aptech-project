const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    viewedBreeds: [
      {
        breedName: { type: String, required: true },
        size: { type: String, default: null },
        energyLevel: { type: String, default: null },
        viewCount: { type: Number, default: 1 },
        lastViewedAt: { type: Date, default: Date.now },
      },
    ],
    searchHistory: [
      {
        query: { type: String, required: true },
        searchedAt: { type: Date, default: Date.now },
      },
    ],
    favoriteBreeds: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPreference", userPreferenceSchema);
