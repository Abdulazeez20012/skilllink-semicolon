const express = require('express');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Update user avatar
    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });
    
    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: `${process.env.API_URL || 'http://localhost:5000'}${avatarUrl}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload assignment file
router.post('/assignment', upload.single('assignment'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/assignments/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      fileUrl: `${process.env.API_URL || 'http://localhost:5000'}${fileUrl}`,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload chat file
router.post('/chat', upload.single('chatFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/chat/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      fileUrl: `${process.env.API_URL || 'http://localhost:5000'}${fileUrl}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload resource file
router.post('/resource', upload.single('resource'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/resources/${req.file.filename}`;
    
    res.json({
      message: 'Resource uploaded successfully',
      fileUrl: `${process.env.API_URL || 'http://localhost:5000'}${fileUrl}`,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const files = req.files.map(file => ({
      fileUrl: `${process.env.API_URL || 'http://localhost:5000'}/uploads/general/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype
    }));
    
    res.json({
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
