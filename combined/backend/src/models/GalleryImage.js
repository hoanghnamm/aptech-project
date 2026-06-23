const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    imageUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    breed: { type: String, default: null },
    confidence: { type: Number, default: null },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
