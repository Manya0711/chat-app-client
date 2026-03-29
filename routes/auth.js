const router = require('express').Router();
const User = require('../models/User'); // Import the model you just showed me
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check if user exists in MongoDB
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username already taken" });

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save to Cloud
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({ message: "Database Error: " + err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // 3. Create Token (Use 'secret' or your process.env.JWT_SECRET)
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { id: user._id, username: user.username } 
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;