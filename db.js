const mongoose = require('mongoose');
require('dotenv').config();

const initDB = async () => {
  // 1. This is the magic line. It tells Mongoose: 
  // "If the DB isn't ready, throw an error immediately instead of staying (pending)"
  mongoose.set('bufferCommands', false); 

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Wait 10 seconds before giving up
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // If the DB fails, we want the server to restart so it tries again
    process.exit(1); 
  }
};

module.exports = { initDB };