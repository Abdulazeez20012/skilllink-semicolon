const Leaderboard = require('../models/Leaderboard');
const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');
const Discussion = require('../models/Discussion');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// @desc    Calculate and update leaderboard for a cohort
// @route   POST /api/leaderboard/calculate/:cohortId
// @access  Private/Admin
const calculateLeaderboard = async (req, res) => {
  try {
    const { cohortId } = req.params;
    
    // Get all students in the cohort
    const students = await User.find({ cohorts: cohortId, role: 'student' });
    
    // Get all assignments for the cohort
    const assignments = await Assignment.find({ cohort: cohortId });
    const assignmentIds = assignments.map(a => a._id);
    
    // Calculate scores for each student
    const leaderboardData = await Promise.all(students.map(async (student) => {
      // 1. Assignment Score (40% weight)
      const submissions = await Submission.find({
        assignmentId: { $in: assignmentIds },
        studentId: student._id,
        grade: { $ne: null }
      });
      
      const avgGrade = submissions.length > 0
        ? submissions.reduce((sum, sub) => sum + sub.grade, 0) / submissions.length
        : 0;
      
      const assignmentScore = avgGrade * 0.4;
      
      // 2. Attendance Score (30% weight)
      const attendanceRecords = await Attendance.find({ cohort: cohortId });
      const attendedSessions = attendanceRecords.filter(record =>
        record.students.some(s => s.student.toString() === student._id.toString())
      ).length;
      
      const attendanceRate = attendanceRecords.length > 0
        ? (attendedSessions / attendanceRecords.length) * 100
        : 0;
      
      const attendanceScore = attendanceRate * 0.3;
      
      // 3. Forum Score (30% weight)
      const discussions = await Discussion.find({
        assignmentId: { $in: assignmentIds }
      });
      
      let helpfulAnswers = 0;
      discussions.forEach(discussion => {
        discussion.comments.forEach(comment => {
          if (comment.userId.toString() === student._id.toString()) {
            if (comment.isAcceptedAnswer) helpfulAnswers += 3;
            else if (comment.isEndorsed) helpfulAnswers += 2;
            else if (comment.upvotes > 0) helpfulAnswers += comment.upvotes * 0.5;
          }
        });
      });
      
      const forumScore = Math.min(helpfulAnswers * 2, 30); // Cap at 30
      
      // Total Score
      const totalScore = Math.round(assignmentScore + attendanceScore + forumScore);
      
      return {
        user: student._id,
        cohort: cohortId,
        assignmentScore: Math.round(assignmentScore),
        attendanceScore: Math.round(attendanceScore),
        forumScore: Math.round(forumScore),
        totalScore,
        assignmentsCompleted: submissions.length,
        averageGrade: Math.round(avgGrade),
        attendanceRate: Math.round(attendanceRate),
        helpfulAnswers,
        currentStreak: student.currentStreak || 0
      };
    }));
    
    // Sort by total score and assign ranks
    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    // Update or create leaderboard entries
    await Promise.all(leaderboardData.map(async (entry) => {
      await Leaderboard.findOneAndUpdate(
        { user: entry.user, cohort: entry.cohort },
        entry,
        { upsert: true, new: true }
      );
    }));
    
    res.json({ message: 'Leaderboard calculated successfully', entries: leaderboardData.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard for a cohort
// @route   GET /api/leaderboard/:cohortId
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { cohortId } = req.params;
    const { limit = 50 } = req.query;
    
    const leaderboard = await Leaderboard.find({ cohort: cohortId })
      .populate('user', 'name email avatar')
      .sort({ totalScore: -1, rank: 1 })
      .limit(parseInt(limit));
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's leaderboard position
// @route   GET /api/leaderboard/:cohortId/user/:userId
// @access  Private
const getUserPosition = async (req, res) => {
  try {
    const { cohortId, userId } = req.params;
    
    const entry = await Leaderboard.findOne({ cohort: cohortId, user: userId })
      .populate('user', 'name email avatar');
    
    if (!entry) {
      return res.status(404).json({ message: 'User not found in leaderboard' });
    }
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  calculateLeaderboard,
  getLeaderboard,
  getUserPosition
};
