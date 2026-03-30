const router = require('express').Router();
const Message = require('../models/Message'); // You'll need to create this model
const auth = require('../middleware/auth');

// Get messages for a specific room
router.get('/:roomId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error loading messages" });
  }
});

module.exports = router;