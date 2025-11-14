const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Import configuration
const config = require('./config/config');

// Import database connection
const connectDB = require('./config/db');

// Import middleware
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const cohortRoutes = require('./routes/cohortRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const showcaseRoutes = require('./routes/showcaseRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware - CORS must come before rate limiting
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiting after CORS
app.use(rateLimiter);
app.use(express.json({ 
  extended: false,
  limit: process.env.FILE_SIZE_LIMIT || '10mb'
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'SkillLink API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/cohorts', cohortRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/showcase', showcaseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(require('./middleware/errorHandler'));

module.exports = app;