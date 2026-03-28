const mongoose = require('mongoose');
require('dotenv').config();

const initDB = async () => {
  try {
    // 1. Set global options to prevent the "Buffering" crash
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Don't kill the process immediately, let's see the error in Render logs
  }
};

module.exports = { initDB };