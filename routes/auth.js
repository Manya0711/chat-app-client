router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '7d' });

    // CRITICAL: Ensure we send an OBJECT, not just a string
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});