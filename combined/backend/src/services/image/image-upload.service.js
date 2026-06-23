const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Folder where uploaded gallery images are stored (served statically at /uploads)
const UPLOAD_DIR = path.join(__dirname, "../../../uploads");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Save an image buffer to the uploads folder and return its public path.
 * @param {Buffer} buffer
 * @param {string} originalName
 * @returns {{ fileName: string, relativeUrl: string }}
 */
function saveImage(buffer, originalName) {
  ensureUploadDir();
  const ext = (path.extname(originalName || "") || ".jpg").toLowerCase();
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${safeExt}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, fileName), buffer);
  return { fileName, relativeUrl: `/uploads/${fileName}` };
}

module.exports = {
  saveImage,
  UPLOAD_DIR,
};
