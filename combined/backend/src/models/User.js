const mongoose = require("mongoose");
const crypto = require("crypto");

// Password hashing with Node's built-in scrypt (no bcrypt dependency).
// Stored format: "<saltHex>:<hashHex>".
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (typeof stored !== "string" || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Hashed; never selected by default so it can't leak in queries/responses.
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = hashPassword;
userSchema.methods.verifyPassword = function (password) {
  return verifyPassword(password, this.password);
};

// Drop the hash from any JSON serialization.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

// Exported alongside the model for a standalone self-check (User.selfcheck.js).
User.hashPassword = hashPassword;
User.verifyPassword = verifyPassword;

module.exports = User;
