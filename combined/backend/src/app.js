const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const nutritionRoutes = require("./routes/nutrition.routes");
const breedRecognitionRoutes = require("./routes/imageRecognition.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const breedRoutes = require("./routes/breed.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const searchRoutes = require("./routes/search.routes");
const vetRoutes = require("./routes/vet.routes");
const galleryRoutes = require("./routes/gallery.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/breed", breedRecognitionRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/breeds", breedRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/vet", vetRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve uploaded gallery images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(notFound);
app.use(errorHandler);

module.exports = app;