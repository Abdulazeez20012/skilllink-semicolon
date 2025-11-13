const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectLink: {
    type: String,
    required: true
  },
  fileUpload: {
    type: String
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  },
  // GitHub integration fields
  githubRepoUrl: {
    type: String
  },
  githubCommitMessage: {
    type: String
  },
  githubLastCommitDate: {
    type: Date
  },
  githubReadme: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);