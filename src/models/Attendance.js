const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  sessionDate: {
    type: Date,
    required: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  students: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add index for faster queries
attendanceSchema.index({ cohort: 1, sessionDate: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);