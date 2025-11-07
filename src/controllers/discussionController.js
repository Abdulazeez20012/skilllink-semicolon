const Discussion = require('../models/Discussion');

// @desc    Add comment to assignment discussion
// @route   POST /api/discussions/:assignmentId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Find discussion by assignment ID
    let discussion = await Discussion.findOne({ assignmentId: req.params.assignmentId });
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found for this assignment' });
    }
    
    // Add comment
    discussion.comments.push({
      userId: req.user._id,
      message
    });
    
    await discussion.save();
    
    // Populate user info in the last comment
    const populatedDiscussion = await Discussion.populate(discussion, {
      path: 'comments.userId',
      select: 'name'
    });
    
    // Return the last comment
    const lastComment = populatedDiscussion.comments[populatedDiscussion.comments.length - 1];
    res.status(201).json(lastComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for assignment discussion
// @route   GET /api/discussions/:assignmentId
// @access  Private
const getComments = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ assignmentId: req.params.assignmentId })
      .populate('comments.userId', 'name');
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found for this assignment' });
    }
    
    res.json(discussion.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment from assignment discussion
// @route   DELETE /api/discussions/:assignmentId/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ assignmentId: req.params.assignmentId });
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found for this assignment' });
    }
    
    // Find comment
    const comment = discussion.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the owner of the comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Remove comment
    comment.remove();
    await discussion.save();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment
};