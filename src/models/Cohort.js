const mongoose = require('mongoose');

const cohortSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  programmingLanguage: {
    type: String,
    required: true,
    trim: true
  },
  // New fields for enhanced cohort management
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  curriculumTrack: {
    type: String,
    enum: ['Full-Stack', 'Data Science', 'Mobile Development', 'DevOps', 'Cybersecurity'],
    required: true
  },
  // Curriculum roadmap
  curriculum: [{
    week: {
      type: Number,
      required: true
    },
    topics: [{
      type: String,
      required: true
    }],
    assignments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    }]
  }],
  facilitators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Lead Instructor', 'Mentor', 'Guest Lecturer', 'Teaching Assistant'],
      default: 'Mentor'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  // For invite links/codes
  inviteCode: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cohort', cohortSchema);