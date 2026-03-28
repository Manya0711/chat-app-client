const router = require('express').Router();
const { db } = require('../db');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all rooms for the logged-in user
router.get('/', auth, (req, res) => {
  db.read();
  const userRooms = db.data.rooms.filter(r => r.members.includes(req.user.id));
  res.json(userRooms);
});

// Start or Get a Private Chat
router.post('/', auth, (req, res) => {
  const { recipientId } = req.body;
  db.read();

  // Find if a private chat already exists between these two
  let room = db.data.rooms.find(r => 
    !r.isGroup && 
    r.members.includes(req.user.id) && 
    r.members.includes(recipientId)
  );

  if (!room) {
    // Find the usernames to store them in the room object
    const user1 = db.data.users.find(u => u.id === req.user.id);
    const user2 = db.data.users.find(u => u.id === recipientId);

    room = {
      id: uuidv4(),
      name: "Private Chat",
      isGroup: false,
      members: [req.user.id, recipientId],
      usernames: [user1.username, user2.username], // Store names here!
      createdAt: new Date().toISOString()
    };
    db.data.rooms.push(room);
    db.write();
  }

  res.json(room);
});

module.exports = router;