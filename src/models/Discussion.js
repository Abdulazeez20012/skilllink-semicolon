const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  // Upvotes for the comment
  upvotes: {
    type: Number,
    default: 0
  },
  // Users who upvoted this comment
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Mark as solved/accepted answer
  isAcceptedAnswer: {
    type: Boolean,
    default: false
  },
  // Facilitator endorsement
  isEndorsed: {
    type: Boolean,
    default: false
  },
  endorsedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const discussionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Discussion', discussionSchema);