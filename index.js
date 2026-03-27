const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { initDB } = require('./db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/rooms', require('./routes/rooms'));

// Test route
app.get('/', (req, res) => res.send('Chat server running!'));

// Socket.io
require('./socket')(io);

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} ✅ DB ready`));
});