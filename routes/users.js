const router = require('express').Router();
const { db } = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  try {
    db.read();
    
    // DEBUG: Let's see if there are any users in the database at all
    if (!db.data.users || db.data.users.length === 0) {
      console.log("DB is empty!");
      return res.json([]);
    }

    // Return EVERYONE for now so we can see if it's working
    const allUsers = db.data.users.map(u => ({
      id: u.id,
      username: u.username
    }));

    console.log("Sending users to frontend:", allUsers);
    res.json(allUsers);
  } catch (err) {
    console.error("Users Route Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;