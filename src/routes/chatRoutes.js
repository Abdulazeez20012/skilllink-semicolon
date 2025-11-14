const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get messages for a cohort
router.get('/cohort/:cohortId', async (req, res) => {
  try {
    const { cohortId } = req.params;
    const { limit = 50, before } = req.query;
    
    let query = { cohort: cohortId };
    
    // Pagination: get messages before a certain timestamp
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    const messages = await Message.find(query)
      .populate('sender', 'name avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pinned messages for a cohort
router.get('/cohort/:cohortId/pinned', async (req, res) => {
  try {
    const { cohortId } = req.params;
    
    const messages = await Message.find({ 
      cohort: cohortId, 
      isPinned: true 
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search messages in a cohort
router.get('/cohort/:cohortId/search', async (req, res) => {
  try {
    const { cohortId } = req.params;
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }
    
    const messages = await Message.find({
      cohort: cohortId,
      content: { $regex: q, $options: 'i' }
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
