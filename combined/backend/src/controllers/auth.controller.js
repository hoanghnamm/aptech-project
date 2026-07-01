const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendSuccess } = require("../utils/response");

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      const err = new Error("Email already registered");
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({
      name,
      email,
      password: User.hashPassword(password),
    });

    return sendSuccess(
      res,
      { token: signToken(user), user },
      "Registered successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // password has select:false, so pull it explicitly for verification.
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user || !user.verifyPassword(password)) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    return sendSuccess(
      res,
      { token: signToken(user), user },
      "Logged in successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Current user from a valid token (route guarded by authenticate).
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    return sendSuccess(res, { user }, "Current user");
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me };
