require("dotenv").config();
const connectDB = require("../config/db");
const Breed = require("../models/Breed");
const breeds = require("./breeds.json");

async function seed() {
  try {
    await connectDB();
    await Breed.deleteMany({});
    await Breed.insertMany(breeds);
    console.log("Breed seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();