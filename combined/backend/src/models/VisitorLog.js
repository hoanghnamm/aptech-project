const mongoose = require("mongoose");

const visitorLogSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    eventType: {
      type: String,
      enum: ["page_view", "breed_view"],
      required: true,
    },
    page: { type: String, default: null },
    breedName: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitorLog", visitorLogSchema);
