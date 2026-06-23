const breedIdentificationService = require("../services/ai/breed-identification.service");
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

    return sendSuccess(res, result, "Breed recognition completed");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  identifyBreed,
};
