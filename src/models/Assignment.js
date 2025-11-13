const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  resources: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  module: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Rubric grading fields
  rubric: [{
    criterion: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    maxPoints: {
      type: Number,
      required: true,
      min: 1
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);