const axios = require("axios");
const FormData = require("form-data");
const Breed = require("../../models/Breed");
const { normalizeBreed } = require("../breed/breed.service");

/**
 * Forward ảnh người dùng upload sang Python AI microservice (TensorFlow/Keras),
 * lấy Top-3 giống chó dự đoán, rồi map sang dữ liệu chi tiết trong MongoDB (collection Breed).
 *
 * @param {Buffer} fileBuffer  - buffer ảnh từ multer (memoryStorage)
 * @param {string} originalName - tên file gốc
 * @returns {Promise<object>} kết quả nhận diện đã được populate
 */
async function identifyBreed(fileBuffer, originalName) {
  const form = new FormData();
  form.append("file", fileBuffer, {
    filename: originalName || "upload_image.jpg",
    contentType: "image/jpeg",
  });

  const pythonAiUrl =
    process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000/predict";

  let aiData;
  try {
    const aiResponse = await axios.post(pythonAiUrl, form, {
      headers: { ...form.getHeaders() },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30000,
    });
    aiData = aiResponse.data;
  } catch (error) {
    const err = new Error(
      `AI recognition service is unavailable: ${error.message}`
    );
    err.statusCode = 503;
    throw err;
  }

  // Model không tự tin (dưới threshold) -> trả message gốc, không có prediction
  if (!aiData || !aiData.success) {
    return {
      success: false,
      message:
        (aiData && aiData.message) ||
        "Could not confidently identify a dog breed from this image.",
      predictions: [],
    };
  }

  const aiPredictions = Array.isArray(aiData.predictions)
    ? aiData.predictions
    : [];

  // Tra cứu chi tiết giống chó trong DB theo tên (CLASS_NAMES của model khớp với breedName hoặc name)
  const breedNames = aiPredictions.map((p) => p.breed);
  let breedDocs = [];
  try {
    breedDocs = await Breed.find({
      $or: [
        { name: { $in: breedNames } },
        { breedName: { $in: breedNames } },
      ],
    }).lean();
  } catch (_) {
    // Nếu DB lỗi/không kết nối, vẫn trả kết quả AI thô thay vì làm sập request
    breedDocs = [];
  }

  // Map theo tên đã chuẩn hóa để tra cứu O(1) (không phân biệt hoa/thường, khoảng trắng)
  const normalize = (s) => String(s || "").toLowerCase().trim();
  const breedMap = new Map();
  for (const doc of breedDocs) {
    const normalizedDoc = normalizeBreed(doc);
    if (normalizedDoc.name) breedMap.set(normalize(normalizedDoc.name), normalizedDoc);
    if (normalizedDoc.breedName) breedMap.set(normalize(normalizedDoc.breedName), normalizedDoc);
  }

  const predictions = aiPredictions.map((p) => {
    const details = breedMap.get(normalize(p.breed)) || null;
    return {
      breed: details ? details.name : p.breed,
      confidence: p.confidence,
      confidencePercentage: Math.round(p.confidence * 100),
      dbSynced: Boolean(details),
      details,
    };
  });

  return {
    success: true,
    message: "Breed identified successfully.",
    analyzedAt: new Date(),
    predictions,
  };
}

module.exports = {
  identifyBreed,
};

