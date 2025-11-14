const Discussion = require('../models/Discussion');
const Assignment = require('../models/Assignment');
const Cohort = require('../models/Cohort');

// @desc    Add comment to assignment discussion
// @route   POST /api/discussions/:assignmentId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { message, tags } = req.body;
    
    // Find discussion by assignment ID
    let discussion = await Discussion.findOne({ assignmentId: req.params.assignmentId });
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found for this assignment' });
    }
    
    // Add comment with tags
    discussion.comments.push({
      userId: req.user._id,
      message,
      tags: tags || []
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
    
    // Remove comment using pull
    discussion.comments.pull(req.params.commentId);
    await discussion.save();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote a comment
// @route   POST /api/discussions/:assignmentId/:commentId/upvote
// @access  Private
const upvoteComment = async (req, res) => {
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
    
    // Check if user has already upvoted
    const alreadyUpvoted = comment.upvotedBy.some(userId => userId.toString() === req.user._id.toString());
    
    if (alreadyUpvoted) {
      // Remove upvote
      comment.upvotedBy = comment.upvotedBy.filter(userId => userId.toString() !== req.user._id.toString());
      comment.upvotes = Math.max(0, comment.upvotes - 1);
    } else {
      // Add upvote
      comment.upvotedBy.push(req.user._id);
      comment.upvotes += 1;
    }
    
    await discussion.save();
    
    res.json({ upvotes: comment.upvotes, upvoted: !alreadyUpvoted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark comment as accepted answer (by question author)
// @route   POST /api/discussions/:assignmentId/:commentId/accept
// @access  Private
const acceptAnswer = async (req, res) => {
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
    
    // Verify user is the author of the question (first comment in discussion)
    if (discussion.comments.length === 0 || discussion.comments[0].userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only the question author can accept an answer' });
    }
    
    // Mark comment as accepted answer
    comment.isAcceptedAnswer = true;
    
    await discussion.save();
    
    res.json({ message: 'Answer accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Endorse a comment (facilitator only)
// @route   POST /api/discussions/:assignmentId/:commentId/endorse
// @access  Private/Facilitator
const endorseComment = async (req, res) => {
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
    
    // Verify user is a facilitator for this cohort
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    const cohort = await Cohort.findById(assignment.cohort);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    const isFacilitator = cohort.facilitators.some(facilitator => facilitator.toString() === req.user._id.toString());
    if (!isFacilitator) {
      return res.status(401).json({ message: 'Only facilitators can endorse comments' });
    }
    
    // Endorse comment
    comment.isEndorsed = true;
    comment.endorsedBy = req.user._id;
    
    await discussion.save();
    
    res.json({ message: 'Comment endorsed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get discussions by tag
// @route   GET /api/discussions/tag/:tag
// @access  Private
const getDiscussionsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    
    // Find all discussions with comments that have this tag
    const discussions = await Discussion.find({
      'comments.tags': tag.toLowerCase()
    }).populate('assignmentId', 'title')
      .populate('comments.userId', 'name');
    
    // Filter comments to only include those with the tag
    const filteredDiscussions = discussions.map(discussion => {
      const filteredComments = discussion.comments.filter(comment => 
        comment.tags.includes(tag.toLowerCase())
      );
      return {
        assignmentId: discussion.assignmentId,
        comments: filteredComments
      };
    });
    
    res.json(filteredDiscussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  upvoteComment,
  acceptAnswer,
  endorseComment,
  getDiscussionsByTag
};