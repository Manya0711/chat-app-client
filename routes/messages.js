const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const auth = require('../middleware/auth');

// Get messages for a room
router.get('/:roomId', auth, async (req, res) => {
  try {
    await db.read();
    const messages = db.data.messages.filter(m => m.roomId === req.params.roomId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    await db.read();
    const { roomId, text } = req.body;
    const message = {
      id: uuidv4(),
      roomId,
      text,
      senderId: req.user.id,
      readBy: [req.user.id],
      createdAt: new Date()
    };
    db.data.messages.push(message);
    await db.write();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;