const mongoose = require("mongoose");

const funFactSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "general",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "funfacts" // explicitly mapping to the user's existing collection
  }
);

module.exports = mongoose.model("FunFact", funFactSchema);
