const router = require('express').Router();
const { db } = require('../db');
const auth = require('../middleware/auth');

// GET /api/users - Get all registered users except the logged-in one
router.get('/', auth, (req, res) => {
  try {
    // 1. Read the latest data from the database
    db.read();

    // 2. Filter out YOUR own name (you don't need to chat with yourself!)
    // 3. Only send back the ID and Username (don't send passwords!)
    const others = db.data.users
      .filter(u => u.id !== req.user.id)
      .map(u => ({
        id: u.id,
        username: u.username
      }));

    res.json(others);
  } catch (err) {
    console.error("User Fetch Error:", err);
    res.status(500).json({ message: "Error loading contacts" });
  }
});

// VERY IMPORTANT: Export the router so index.js can use it
module.exports = router;