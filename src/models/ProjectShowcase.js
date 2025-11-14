const mongoose = require('mongoose');

const projectShowcaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  projectUrl: {
    type: String,
    required: true
  },
  githubUrl: {
    type: String
  },
  liveUrl: {
    type: String
  },
  imageUrl: {
    type: String
  },
  technologies: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
projectShowcaseSchema.index({ cohort: 1, createdAt: -1 });
projectShowcaseSchema.index({ student: 1 });
projectShowcaseSchema.index({ featured: 1, likes: -1 });

module.exports = mongoose.model('ProjectShowcase', projectShowcaseSchema);
