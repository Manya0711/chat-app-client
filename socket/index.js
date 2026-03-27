const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('userOnline', async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('sendMessage', async (data) => {
      console.log('sendMessage received:', data);
      try {
        const { roomId, text, senderId } = data;
        await db.read();
        const message = {
          id: uuidv4(),
          roomId,
          text,
          senderId,
          readBy: [senderId],
          createdAt: new Date()
        };
        db.data.messages.push(message);
        await db.write();
        console.log('Message saved:', message);
        io.to(roomId).emit('newMessage', message);
        socket.emit('newMessage', message);
      } catch (err) {
        console.error('sendMessage error:', err);
      }
    });

    socket.on('typing', ({ roomId, username }) => {
      socket.to(roomId).emit('userTyping', { username });
    });

    socket.on('stopTyping', ({ roomId }) => {
      socket.to(roomId).emit('userStopTyping');
    });

    socket.on('markRead', async ({ roomId, userId }) => {
      await db.read();
      db.data.messages = db.data.messages.map(m => {
        if (m.roomId === roomId && !m.readBy.includes(userId)) {
          m.readBy.push(userId);
        }
        return m;
      });
      await db.write();
      io.to(roomId).emit('messagesRead', { roomId, userId });
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      }
      console.log('User disconnected:', socket.id);
    });
  });
};