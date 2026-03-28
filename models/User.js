const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Check if the model already exists before defining it
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);