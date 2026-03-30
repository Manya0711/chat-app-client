const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { initDB } = require('./db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// 1. Vercel URL Configuration
const allowedOrigin = 'https://chat-app-client-tau-two.vercel.app';

const io = new Server(server, {
  cors: { 
    origin: allowedOrigin, 
    methods: ['GET', 'POST'],
    credentials: true 
  }
});

// 2. Middleware
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json());

// 3. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/users', require('./routes/users'));

// Test route
app.get('/', (req, res) => res.send('Chat server running! ✅'));

// 4. Socket.io
require('./socket')(io);

// 5. Database Connection & Server Start
const PORT = process.env.PORT || 10000;

initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ MongoDB Connection Established`);
  });
}).catch(err => {
  console.error("❌ Failed to start server:", err);
});