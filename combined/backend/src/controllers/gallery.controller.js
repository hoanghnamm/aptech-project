const GalleryImage = require("../models/GalleryImage");
const imageTaggingService = require("../services/image/image-tagging.service");
const imageUploadService = require("../services/image/image-upload.service");
const { sendSuccess, sendError } = require("../utils/response");

const absoluteUrl = (req, relativeUrl) =>
  `${req.protocol}://${req.get("host")}${relativeUrl}`;

// POST /api/gallery  (multipart, key "image")
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, "No image uploaded under form-data key 'image'.", 400);
    }

    // 1. AI auto-tagging (breed model + DB enrichment)
    const tagging = await imageTaggingService.generateTags(
      req.file.buffer,
      req.file.originalname
    );

    // 2. Save the file to disk
    const { fileName, relativeUrl } = imageUploadService.saveImage(
      req.file.buffer,
      req.file.originalname
    );

    // 3. Save the gallery record
    const doc = await GalleryImage.create({
      userId: req.user?._id || req.user?.id || null,
      imageUrl: relativeUrl,
      fileName,
      breed: tagging.breed,
      confidence: tagging.confidence,
      tags: tagging.tags,
    });

    const item = doc.toObject();
    item.imageUrl = absoluteUrl(req, item.imageUrl);

    return sendSuccess(res, item, "Image uploaded and tagged", 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/gallery?tag=&page=&limit=
const listImages = async (req, res, next) => {
  try {
    const { tag, page = 1, limit = 24 } = req.query;
    const query = tag ? { tags: tag } : {};
    const perPage = Math.min(60, Math.max(1, Number(limit) || 24));
    const skip = (Math.max(1, Number(page) || 1) - 1) * perPage;

    const [docs, total] = await Promise.all([
      GalleryImage.find(query).sort({ createdAt: -1 }).skip(skip).limit(perPage).lean(),
      GalleryImage.countDocuments(query),
    ]);

    const items = docs.map((d) => ({ ...d, imageUrl: absoluteUrl(req, d.imageUrl) }));

    return sendSuccess(res, { items, total }, "Gallery fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  listImages,
};
