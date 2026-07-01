const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema(
  {
    breedId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    lifestyleFilters: {
      size: { type: String },
      sheddingLevel: { type: String },
      spaceRequirement: { type: String },
      barkingLevel: { type: String },
      weatherTolerance: { type: String },
      vulnerabilityToDisease: { type: String },
    },
    physicalStats: {
      weight: { type: String },
      height: { type: String },
      lifespan: { type: String },
    },
    coreTraits: [{ type: String }],
    careAdvice: [{ type: String }],
    healthRisks: [{ type: String }],
    comparisonMetrics: {
      trainability: { type: Number },
      energyLevel: { type: Number },
      apartmentFriendly: { type: Number },
      kidFriendly: { type: Number },
      aloneTolerance: { type: Number },
      petFriendly: { type: Number },
    },
    visualArchives: [
      {
        url: { type: String },
        caption: { type: String },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Breed", breedSchema, "dogbreeds");