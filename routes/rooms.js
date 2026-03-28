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
router.post('/', auth, async (req, res) => {
  try {
    const { name, members, isGroup } = req.body;
    await db.read();
    
    const newRoom = {
      id: uuidv4(),
      name,
      members: members || [],
      isGroup: isGroup || false,
      createdAt: new Date()
    };

    db.data.rooms.push(newRoom);
    await db.write();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;