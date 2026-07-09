const fs = require("fs");
const path = require("path");
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

    // Populate userId to include user name
    const populated = await GalleryImage.findById(doc._id)
      .populate("userId", "name email")
      .lean();

    const item = { ...populated };
    item.imageUrl = absoluteUrl(req, item.imageUrl);
    // Flatten user info for frontend
    if (item.userId && typeof item.userId === "object") {
      item.uploaderName = item.userId.name || "Anonymous";
    } else {
      item.uploaderName = "Guest";
    }

    return sendSuccess(res, item, "Image uploaded and tagged", 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/gallery?tag=&page=&limit=
const listImages = async (req, res, next) => {
  try {
    // Exclude/Delete unrecognized and untagged images as requested
    await GalleryImage.deleteMany({ tags: { $in: ["#Unrecognized", "#Untagged"] } });

    const { tag, page = 1, limit = 24 } = req.query;
    let query = {};
    if (tag) {
      if (tag === "#Unrecognized" || tag === "#Untagged") {
        query = { tags: tag };
      } else {
        query = { $and: [{ tags: tag }, { tags: { $nin: ["#Unrecognized", "#Untagged"] } }] };
      }
    } else {
      query = { tags: { $nin: ["#Unrecognized", "#Untagged"] } };
    }

    const perPage = Math.min(60, Math.max(1, Number(limit) || 24));
    const skip = (Math.max(1, Number(page) || 1) - 1) * perPage;

    const docs = await GalleryImage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("userId", "name email")
      .lean();

    // Verify if physical image file exists on server disk
    const validItems = [];
    for (const d of docs) {
      const filePath = path.join(imageUploadService.UPLOAD_DIR, d.fileName);
      if (fs.existsSync(filePath)) {
        const item = { ...d, imageUrl: absoluteUrl(req, d.imageUrl) };
        // Flatten user info
        if (item.userId && typeof item.userId === "object") {
          item.uploaderName = item.userId.name || "Anonymous";
        } else {
          item.uploaderName = "Guest";
        }
        validItems.push(item);
      } else {
        // Asynchronously delete record from DB since file is physically missing on disk
        GalleryImage.deleteOne({ _id: d._id }).catch((err) => 
          console.error("Failed to delete stale database record:", err)
        );
      }
    }

    const total = await GalleryImage.countDocuments(query);

    return sendSuccess(res, { items: validItems, total }, "Gallery fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  listImages,
};
