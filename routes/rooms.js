const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const auth = require('../middleware/auth');

// Get all rooms for a user
router.get('/', auth, (req, res) => { // Removed 'async'
  try {
    db.read(); // Removed 'await'
    const rooms = db.data.rooms.filter(r => r.members.includes(req.user.id));
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Find or Create a Private Chat
router.post('/', auth, (req, res) => {
  try {
    const { recipientId } = req.body;
    const myId = req.user.id;

    db.read();

    let room = db.data.rooms.find(r => 
      !r.isGroup && 
      r.members.includes(myId) && 
      r.members.includes(recipientId)
    );

    if (!room) {
      room = {
        id: uuidv4(),
        name: "Private Chat",
        members: [myId, recipientId],
        isGroup: false,
        createdAt: new Date()
      };
      
      db.data.rooms.push(room);
      db.write();
    }

    res.status(200).json(room);
  } catch (err) {
    console.error("Room Creation Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// THIS IS THE LINE YOU ARE MISSING:
module.exports = router;