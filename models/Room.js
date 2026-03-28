const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  members: [{ type: String }],
  isGroup: { type: Boolean, default: false },
  name: { type: String, default: "Private Chat" },
  usernames: [{ type: String }], // This stores the names for the sidebar!
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);