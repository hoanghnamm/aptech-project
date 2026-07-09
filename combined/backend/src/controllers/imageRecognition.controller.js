const breedIdentificationService = require("../services/ai/breed-identification.service");
const BreedRecognitionHistory = require("../models/BreedRecognitionHistory");
const { sendSuccess } = require("../utils/response");

const identifyBreed = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error(
        "No image uploaded. Send an image under the form-data key 'image'."
      );
      error.statusCode = 400;
      throw error;
    }

    const result = await breedIdentificationService.identifyBreed(
      req.file.buffer,
      req.file.originalname
    );

    // Save history if user is authenticated
    const userId = req.user?._id || req.user?.id;
    if (userId && result && result.predictions && result.predictions.length > 0) {
      const topPrediction = result.predictions[0];
      BreedRecognitionHistory.create({
        userId,
        breedName: topPrediction.className || topPrediction.label,
        confidence: topPrediction.probability || topPrediction.confidence,
        imageUrl: null, // Image buffer not saved, only metadata
      }).catch((err) => console.error("Failed to save breed recognition history:", err));
    }

    return sendSuccess(res, result, "Breed recognition completed");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  identifyBreed,
};
