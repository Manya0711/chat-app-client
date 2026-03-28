const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const auth = require('../middleware/auth');

// Get all rooms for a user
router.get('/', auth, async (req, res) => {
  try {
    await db.read();
    const rooms = db.data.rooms.filter(r => r.members.includes(req.user.id));
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a room
// Find or Create a Private Chat
router.post('/', auth, (req, res) => {
  try {
    const { recipientId } = req.body; // The ID of the friend you want to text
    const myId = req.user.id; // Your ID (from the auth middleware)

    db.read();

    // 1. Check if a private room already exists between these TWO specific users
    let room = db.data.rooms.find(r => 
      !r.isGroup && 
      r.members.includes(myId) && 
      r.members.includes(recipientId)
    );

    // 2. If no room exists, create a brand new one
    if (!room) {
      room = {
        id: uuidv4(),
        name: "Private Chat", // You can update this later to show the friend's name
        members: [myId, recipientId],
        isGroup: false,
        createdAt: new Date()
      };
      
      db.data.rooms.push(room);
      db.write();
    }

    // 3. Return the room (either the old one or the new one)
    res.status(200).json(room);

  } catch (err) {
    console.error("Room Creation Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});