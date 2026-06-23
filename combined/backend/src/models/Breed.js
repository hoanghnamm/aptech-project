const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema(
  {
    breedName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    origin: {
      type: String,
      trim: true,
      default: "Unknown",
    },

    size: {
      type: String,
      enum: ["toy", "small", "medium", "large", "giant"],
      required: true,
    },

    energyLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    lifeExpectancy: {
      type: String,
      trim: true,
      default: "Unknown",
    },

    temperament: [
      {
        type: String,
        trim: true,
      },
    ],

    sheddingLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    familyFriendly: {
      type: Boolean,
      default: true,
    },

    apartmentFriendly: {
      type: Boolean,
      default: false,
    },

    commonAllergies: [
      {
        type: String,
        trim: true,
      },
    ],

    healthIssues: [
      {
        type: String,
        trim: true,
      },
    ],

    nutritionProfile: {
      caloriesPerKg: {
        type: Number,
        default: 35,
      },
      proteinRequirement: {
        type: String,
        default: "medium",
      },
      fatRequirement: {
        type: String,
        default: "medium",
      },
      carbRequirement: {
        type: String,
        default: "medium",
      },
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Breed", breedSchema);