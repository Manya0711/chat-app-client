const router = require('express').Router();
const { db } = require('../db');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/', auth, (req, res) => {
  db.read();
  // Ensure we only show rooms the user is actually in
  const userRooms = db.data.rooms.filter(r => r.members.includes(req.user.id));
  res.json(userRooms);
});

router.post('/', auth, (req, res) => {
  const { recipientId } = req.body;
  db.read();

  // 1. Check if room exists
  let room = db.data.rooms.find(r => 
    !r.isGroup && 
    r.members.includes(req.user.id) && 
    r.members.includes(recipientId)
  );

  if (!room) {
    // 2. Fetch both usernames to ensure the "Phonebook" is correct
    const me = db.data.users.find(u => u.id === req.user.id);
    const friend = db.data.users.find(u => u.id === recipientId);

    room = {
      id: uuidv4(),
      name: "Private Chat",
      isGroup: false,
      members: [req.user.id, recipientId],
      usernames: [me.username, friend.username], // Both names saved here
      createdAt: new Date().toISOString()
    };
    db.data.rooms.push(room);
    db.write();
  }

  res.json(room);
});

module.exports = router;