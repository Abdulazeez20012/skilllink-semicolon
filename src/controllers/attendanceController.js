const Attendance = require('../models/Attendance');
const Cohort = require('../models/Cohort');
const User = require('../models/User');
const crypto = require('crypto');
const QRCode = require('qrcode');

// Helper function to check if two dates are consecutive days
const areConsecutiveDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Set both dates to midnight for comparison
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};

// @desc    Generate QR code for attendance
// @route   POST /api/attendance/generate
// @access  Private/Facilitator
const generateQRCode = async (req, res) => {
  try {
    const { cohortId } = req.body;
    
    // Check if cohort exists
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Check if user is a facilitator of this cohort
    if (!cohort.facilitators.includes(req.user._id)) {
      return res.status(401).json({ message: 'User not authorized to generate attendance for this cohort' });
    }
    
    // Generate unique QR code identifier
    const qrCodeId = crypto.randomBytes(16).toString('hex');
    
    // Create attendance record
    const attendance = await Attendance.create({
      cohort: cohortId,
      sessionDate: new Date(),
      qrCode: qrCodeId
    });
    
    // Generate QR code image
    const qrCodeData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attendance/${qrCodeId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    
    res.status(201).json({
      qrCodeId,
      qrCodeImage,
      sessionDate: attendance.sessionDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance using QR code
// @route   POST /api/attendance/mark
// @access  Private/Student
const markAttendance = async (req, res) => {
  try {
    const { qrCodeId } = req.body;
    
    // Find attendance record by QR code
    const attendance = await Attendance.findOne({ qrCode: qrCodeId });
    if (!attendance) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }
    
    // Check if student is enrolled in the cohort
    const cohort = await Cohort.findById(attendance.cohort);
    if (!cohort.students.includes(req.user._id)) {
      return res.status(401).json({ message: 'Student not enrolled in this cohort' });
    }
    
    // Check if student already marked attendance
    const alreadyMarked = attendance.students.find(s => s.student.toString() === req.user._id.toString());
    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked' });
    }
    
    // Add student to attendance record
    attendance.students.push({
      student: req.user._id,
      timestamp: new Date()
    });
    
    await attendance.save();
    
    // Update streak tracking
    const student = await User.findById(req.user._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if this is a consecutive day
    if (student.lastAttendanceDate) {
      const lastAttendance = new Date(student.lastAttendanceDate);
      lastAttendance.setHours(0, 0, 0, 0);
      
      if (areConsecutiveDays(lastAttendance, today)) {
        // Increment current streak
        student.currentStreak += 1;
        
        // Update longest streak if needed
        if (student.currentStreak > student.longestStreak) {
          student.longestStreak = student.currentStreak;
        }
      } else if (lastAttendance.getTime() !== today.getTime()) {
        // Reset streak if not consecutive and not the same day
        student.currentStreak = 1;
      }
      // If it's the same day, we don't update anything
    } else {
      // First attendance
      student.currentStreak = 1;
      student.longestStreak = 1;
    }
    
    student.lastAttendanceDate = today;
    await student.save();
    
    res.json({ 
      message: 'Attendance marked successfully',
      currentStreak: student.currentStreak,
      longestStreak: student.longestStreak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records for a cohort
// @route   GET /api/attendance/cohort/:cohortId
// @access  Private/Facilitator
const getAttendanceByCohort = async (req, res) => {
  try {
    const { cohortId } = req.params;
    
    // Check if cohort exists
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Check if user is a facilitator of this cohort
    if (!cohort.facilitators.includes(req.user._id)) {
      return res.status(401).json({ message: 'User not authorized to view attendance for this cohort' });
    }
    
    // Get all attendance records for this cohort
    const attendanceRecords = await Attendance.find({ cohort: cohortId })
      .populate('students.student', 'name email')
      .sort({ sessionDate: -1 });
    
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student attendance for a cohort
// @route   GET /api/attendance/student/:cohortId
// @access  Private/Student
const getStudentAttendance = async (req, res) => {
  try {
    const { cohortId } = req.params;
    
    // Check if cohort exists
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Check if student is enrolled in the cohort
    if (!cohort.students.includes(req.user._id)) {
      return res.status(401).json({ message: 'Student not enrolled in this cohort' });
    }
    
    // Get all attendance records for this cohort
    const attendanceRecords = await Attendance.find({ cohort: cohortId })
      .sort({ sessionDate: -1 });
    
    // Calculate attendance stats
    const totalSessions = attendanceRecords.length;
    const attendedSessions = attendanceRecords.filter(record => 
      record.students.some(s => s.student.toString() === req.user._id.toString())
    ).length;
    
    const attendancePercentage = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;
    
    // Get student's streak information
    const student = await User.findById(req.user._id);
    
    res.json({
      totalSessions,
      attendedSessions,
      attendancePercentage,
      currentStreak: student.currentStreak,
      longestStreak: student.longestStreak,
      records: attendanceRecords.map(record => ({
        sessionDate: record.sessionDate,
        attended: record.students.some(s => s.student.toString() === req.user._id.toString())
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateQRCode,
  markAttendance,
  getAttendanceByCohort,
  getStudentAttendance
};