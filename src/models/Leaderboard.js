const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  // Scoring components
  assignmentScore: {
    type: Number,
    default: 0
  },
  attendanceScore: {
    type: Number,
    default: 0
  },
  forumScore: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number
  },
  // Statistics
  assignmentsCompleted: {
    type: Number,
    default: 0
  },
  averageGrade: {
    type: Number,
    default: 0
  },
  attendanceRate: {
    type: Number,
    default: 0
  },
  helpfulAnswers: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
leaderboardEntrySchema.index({ cohort: 1, totalScore: -1 });
leaderboardEntrySchema.index({ user: 1, cohort: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardEntrySchema);
