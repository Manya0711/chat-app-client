const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    // Finds everyone except the logged-in user
    const users = await User.find({ _id: { $ne: req.user.id } }).select('username _id');
    res.json(users);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

module.exports = router;