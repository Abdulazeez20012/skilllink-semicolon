const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config/config');
const http = require('http');
const { Server } = require('socket.io');
const setupChatSocket = require('./src/socket/chatSocket');

// Connect to database
connectDB();

const PORT = config.port;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Setup chat socket handlers
setupChatSocket(io);

// Make io accessible to routes
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io ready for real-time chat`);
});