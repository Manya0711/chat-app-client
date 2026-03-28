const mongoose = require('mongoose');
require('dotenv').config();

const initDB = async () => {
  try {
    // We add some extra options here to handle connection drops better
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds instead of 30
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = { initDB };