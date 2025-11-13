const Cohort = require('../models/Cohort');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const crypto = require('crypto'); // For generating invite codes

// @desc    Create a new cohort
// @route   POST /api/cohorts
// @access  Private/Facilitator
const createCohort = async (req, res) => {
  try {
    const { name, description, programmingLanguage, startDate, endDate, curriculumTrack, curriculum } = req.body;
    
    // Check if cohort with this name already exists
    const existingCohort = await Cohort.findOne({ name });
    
    if (existingCohort) {
      return res.status(400).json({ message: 'Cohort with this name already exists' });
    }
    
    // Generate unique invite code
    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Create cohort
    const cohort = await Cohort.create({
      name,
      description,
      programmingLanguage,
      startDate,
      endDate,
      curriculumTrack,
      curriculum: curriculum || [],
      inviteCode
    });
    
    // Automatically assign the creator as a facilitator
    cohort.facilitators.push(req.user._id);
    await cohort.save();
    
    // Also update the user's cohort field
    await User.findByIdAndUpdate(req.user._id, { cohort: cohort._id });
    
    res.status(201).json(cohort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all cohorts
// @route   GET /api/cohorts
// @access  Private
const getCohorts = async (req, res) => {
  try {
    const { language, name } = req.query;
    let filter = {};
    
    // Apply filters if provided
    if (language) {
      filter.programmingLanguage = new RegExp(language, 'i');
    }
    
    if (name) {
      filter.name = new RegExp(name, 'i');
    }
    
    const cohorts = await Cohort.find(filter)
      .populate('facilitators', 'name email')
      .populate('students', 'name email');
    
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cohort by ID
// @route   GET /api/cohorts/:id
// @access  Private
const getCohortById = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id)
      .populate('facilitators', 'name email')
      .populate('students', 'name email')
      .populate('assignments')
      .populate('curriculum.assignments');
    
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    res.json(cohort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cohort
// @route   PUT /api/cohorts/:id
// @access  Private/Admin
const updateCohort = async (req, res) => {
  try {
    const { name, description, programmingLanguage, startDate, endDate, curriculumTrack, curriculum } = req.body;
    
    const cohort = await Cohort.findById(req.params.id);
    
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Check if name is being changed and if it already exists
    if (name && name !== cohort.name) {
      const existingCohort = await Cohort.findOne({ name });
      if (existingCohort) {
        return res.status(400).json({ message: 'Cohort with this name already exists' });
      }
      cohort.name = name;
    }
    
    cohort.description = description || cohort.description;
    cohort.programmingLanguage = programmingLanguage || cohort.programmingLanguage;
    cohort.startDate = startDate || cohort.startDate;
    cohort.endDate = endDate || cohort.endDate;
    cohort.curriculumTrack = curriculumTrack || cohort.curriculumTrack;
    cohort.curriculum = curriculum || cohort.curriculum;
    
    const updatedCohort = await cohort.save();
    
    res.json(updatedCohort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete cohort
// @route   DELETE /api/cohorts/:id
// @access  Private/Admin
const deleteCohort = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    await cohort.deleteOne();
    
    // Remove cohort reference from all users
    await User.updateMany(
      { cohort: cohort._id },
      { $unset: { cohort: "" } }
    );
    
    res.json({ message: 'Cohort removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign facilitator to cohort
// @route   POST /api/cohorts/:id/facilitators
// @access  Private/Admin
const assignFacilitator = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'facilitator' && user.role !== 'admin') {
      return res.status(400).json({ message: 'User must be a facilitator or admin' });
    }
    
    // Check if user is already assigned to this cohort
    if (cohort.facilitators.includes(userId)) {
      return res.status(400).json({ message: 'User is already assigned to this cohort' });
    }
    
    cohort.facilitators.push(userId);
    
    // Add cohort to user's cohort list if not already there
    if (!user.cohorts) {
      user.cohorts = [];
    }
    
    if (!user.cohorts.includes(cohort._id)) {
      user.cohorts.push(cohort._id);
    }
    
    await cohort.save();
    await user.save();
    
    res.json({ message: 'Facilitator assigned to cohort successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove facilitator from cohort
// @route   DELETE /api/cohorts/:id/facilitators/:userId
// @access  Private/Admin
const removeFacilitator = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove user from cohort facilitators array
    cohort.facilitators = cohort.facilitators.filter(
      facilitator => facilitator.toString() !== req.params.userId
    );
    
    // Remove cohort from user's cohort list
    if (user.cohorts) {
      user.cohorts = user.cohorts.filter(
        cohortId => cohortId.toString() !== req.params.id
      );
    }
    
    await cohort.save();
    await user.save();
    
    res.json({ message: 'Facilitator removed from cohort successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll student in cohort
// @route   POST /api/cohorts/:id/students
// @access  Private/Admin
const enrollStudent = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'student') {
      return res.status(400).json({ message: 'User must be a student' });
    }
    
    // Check if user is already enrolled in this cohort
    if (cohort.students.includes(userId)) {
      return res.status(400).json({ message: 'User is already enrolled in this cohort' });
    }
    
    cohort.students.push(userId);
    
    // Add cohort to user's cohort list if not already there
    if (!user.cohorts) {
      user.cohorts = [];
    }
    
    if (!user.cohorts.includes(cohort._id)) {
      user.cohorts.push(cohort._id);
    }
    
    await cohort.save();
    await user.save();
    
    res.json({ message: 'Student enrolled in cohort successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unenroll student from cohort
// @route   DELETE /api/cohorts/:id/students/:userId
// @access  Private/Admin
const unenrollStudent = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove user from cohort students array
    cohort.students = cohort.students.filter(
      student => student.toString() !== req.params.userId
    );
    
    // Remove cohort from user's cohort list
    if (user.cohorts) {
      user.cohorts = user.cohorts.filter(
        cohortId => cohortId.toString() !== req.params.id
      );
    }
    
    await cohort.save();
    await user.save();
    
    res.json({ message: 'Student unenrolled from cohort successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post assignment to cohort
// @route   POST /api/cohorts/:id/assignments
// @access  Private/Facilitator
const postAssignmentToCohort = async (req, res) => {
  try {
    const { title, description, dueDate, resources } = req.body;
    
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Check if user is a facilitator of this cohort
    if (!cohort.facilitators.includes(req.user._id)) {
      return res.status(401).json({ message: 'User not authorized to post assignments to this cohort' });
    }
    
    // Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      resources,
      createdBy: req.user._id,
      cohort: cohort._id
    });
    
    // Add assignment to cohort
    cohort.assignments.push(assignment._id);
    await cohort.save();
    
    // Populate createdBy field
    await assignment.populate('createdBy', 'name');
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignments for cohort
// @route   GET /api/cohorts/:id/assignments
// @access  Private/Facilitator
const getAssignmentsForCohort = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id)
      .populate('assignments');
    
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    res.json(cohort.assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join cohort using invite code
// @route   POST /api/cohorts/join/:inviteCode
// @access  Private/Student
const joinCohortByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    
    const cohort = await Cohort.findOne({ inviteCode });
    if (!cohort) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }
    
    // Check if user is already enrolled in this cohort
    if (cohort.students.includes(req.user._id)) {
      return res.status(400).json({ message: 'User is already enrolled in this cohort' });
    }
    
    // Add student to cohort
    cohort.students.push(req.user._id);
    
    // Add cohort to user's cohort list if not already there
    if (!req.user.cohorts) {
      req.user.cohorts = [];
    }
    
    if (!req.user.cohorts.includes(cohort._id)) {
      req.user.cohorts.push(cohort._id);
    }
    
    await cohort.save();
    await req.user.save();
    
    res.json({ message: 'Successfully joined cohort', cohort });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cohort health score
// @route   GET /api/cohorts/:id/health
// @access  Private/Admin
const getCohortHealthScore = async (req, res) => {
  try {
    const cohortId = req.params.id;
    
    // Import required models
    const Attendance = require('../models/Attendance');
    const Submission = require('../models/Submission');
    const Discussion = require('../models/Discussion');
    const Assignment = require('../models/Assignment');
    
    // Get cohort
    const cohort = await Cohort.findById(cohortId)
      .populate('students', 'name');
    
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Get all assignments for this cohort
    const assignments = await Assignment.find({ cohort: cohortId });
    const assignmentIds = assignments.map(a => a._id);
    
    // 1. Calculate attendance score (40% of health score)
    const attendanceRecords = await Attendance.find({ cohort: cohortId });
    let attendanceScore = 0;
    
    if (attendanceRecords.length > 0 && cohort.students.length > 0) {
      // Calculate average attendance percentage across all sessions
      const totalPossibleAttendance = attendanceRecords.length * cohort.students.length;
      let totalActualAttendance = 0;
      
      attendanceRecords.forEach(record => {
        totalActualAttendance += record.students.length;
      });
      
      attendanceScore = totalPossibleAttendance > 0 ? 
        (totalActualAttendance / totalPossibleAttendance) * 100 : 0;
    }
    
    // 2. Calculate assignment completion score (40% of health score)
    let completionScore = 0;
    
    if (assignmentIds.length > 0 && cohort.students.length > 0) {
      // Count total submissions for all assignments in this cohort
      const totalSubmissions = await Submission.countDocuments({
        assignmentId: { $in: assignmentIds }
      });
      
      // Maximum possible submissions (each student submits each assignment once)
      const maxPossibleSubmissions = assignmentIds.length * cohort.students.length;
      
      completionScore = maxPossibleSubmissions > 0 ? 
        (totalSubmissions / maxPossibleSubmissions) * 100 : 0;
    }
    
    // 3. Calculate forum activity score (20% of health score)
    let forumScore = 0;
    
    if (assignmentIds.length > 0 && cohort.students.length > 0) {
      // Count total comments across all discussions for this cohort's assignments
      const discussions = await Discussion.find({ 
        assignmentId: { $in: assignmentIds } 
      });
      
      let totalComments = 0;
      discussions.forEach(discussion => {
        totalComments += discussion.comments.length;
      });
      
      // Average comments per student
      forumScore = cohort.students.length > 0 ? 
        (totalComments / cohort.students.length) * 10 : 0; // Scale to 100
      
      // Cap at 100
      forumScore = Math.min(100, forumScore);
    }
    
    // Calculate overall health score
    const healthScore = Math.round(
      (attendanceScore * 0.4) + 
      (completionScore * 0.4) + 
      (forumScore * 0.2)
    );
    
    // Determine health status
    let healthStatus = 'Healthy';
    if (healthScore < 50) {
      healthStatus = 'At Risk';
    } else if (healthScore < 75) {
      healthStatus = 'Needs Attention';
    }
    
    res.json({
      cohortId,
      cohortName: cohort.name,
      healthScore,
      healthStatus,
      metrics: {
        attendance: {
          score: Math.round(attendanceScore),
          weight: '40%'
        },
        completion: {
          score: Math.round(completionScore),
          weight: '40%'
        },
        forumActivity: {
          score: Math.round(forumScore),
          weight: '20%'
        }
      },
      statistics: {
        totalStudents: cohort.students.length,
        totalSessions: attendanceRecords.length,
        totalAssignments: assignmentIds.length,
        totalSubmissions: await Submission.countDocuments({
          assignmentId: { $in: assignmentIds }
        }),
        totalComments: await Discussion.aggregate([
          { $match: { assignmentId: { $in: assignmentIds } } },
          { $project: { commentCount: { $size: "$comments" } } },
          { $group: { _id: null, total: { $sum: "$commentCount" } } }
        ]).then(result => result.length > 0 ? result[0].total : 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get predictive alerts for at-risk students
// @route   GET /api/cohorts/:id/alerts
// @access  Private/Admin
const getPredictiveAlerts = async (req, res) => {
  try {
    const cohortId = req.params.id;
    
    // Import required models
    const Attendance = require('../models/Attendance');
    const Submission = require('../models/Submission');
    const Discussion = require('../models/Discussion');
    const Assignment = require('../models/Assignment');
    
    // Get cohort
    const cohort = await Cohort.findById(cohortId)
      .populate('students', 'name email currentStreak longestStreak');
    
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Get all assignments for this cohort
    const assignments = await Assignment.find({ cohort: cohortId });
    const assignmentIds = assignments.map(a => a._id);
    
    // Initialize alerts array
    const alerts = [];
    
    // Check each student for risk factors
    for (const student of cohort.students) {
      const studentId = student._id;
      let riskFactors = [];
      let riskScore = 0;
      
      // 1. Attendance risk factor
      const attendanceRecords = await Attendance.find({ cohort: cohortId });
      if (attendanceRecords.length > 0) {
        // Calculate student's attendance percentage
        const attendedSessions = attendanceRecords.filter(record => 
          record.students.some(s => s.student.toString() === studentId.toString())
        ).length;
        
        const attendancePercentage = (attendedSessions / attendanceRecords.length) * 100;
        
        // High risk if attendance < 60%
        if (attendancePercentage < 60) {
          riskFactors.push({
            type: 'attendance',
            message: `Attendance rate is ${attendancePercentage.toFixed(1)}%`,
            severity: 'high'
          });
          riskScore += 30;
        } 
        // Medium risk if attendance < 80%
        else if (attendancePercentage < 80) {
          riskFactors.push({
            type: 'attendance',
            message: `Attendance rate is ${attendancePercentage.toFixed(1)}%`,
            severity: 'medium'
          });
          riskScore += 15;
        }
      }
      
      // 2. Submission risk factor
      if (assignmentIds.length > 0) {
        // Count student's submissions
        const studentSubmissions = await Submission.countDocuments({
          assignmentId: { $in: assignmentIds },
          studentId: studentId
        });
        
        const submissionPercentage = (studentSubmissions / assignmentIds.length) * 100;
        
        // High risk if submission rate < 50%
        if (submissionPercentage < 50) {
          riskFactors.push({
            type: 'submissions',
            message: `Only submitted ${studentSubmissions} of ${assignmentIds.length} assignments`,
            severity: 'high'
          });
          riskScore += 30;
        } 
        // Medium risk if submission rate < 75%
        else if (submissionPercentage < 75) {
          riskFactors.push({
            type: 'submissions',
            message: `Only submitted ${studentSubmissions} of ${assignmentIds.length} assignments`,
            severity: 'medium'
          });
          riskScore += 15;
        }
      }
      
      // 3. Streak risk factor
      // Low streak indicates recent disengagement
      if (student.currentStreak < 3) {
        riskFactors.push({
          type: 'streak',
          message: `Current streak is only ${student.currentStreak} days`,
          severity: 'medium'
        });
        riskScore += 10;
      }
      
      // 4. Forum activity risk factor
      if (assignmentIds.length > 0) {
        // Count student's forum comments
        const discussions = await Discussion.find({ 
          assignmentId: { $in: assignmentIds } 
        });
        
        let studentComments = 0;
        discussions.forEach(discussion => {
          discussion.comments.forEach(comment => {
            if (comment.userId.toString() === studentId.toString()) {
              studentComments++;
            }
          });
        });
        
        // Low forum activity indicates disengagement
        if (studentComments < 2) {
          riskFactors.push({
            type: 'forum',
            message: `Only ${studentComments} forum contributions`,
            severity: 'medium'
          });
          riskScore += 10;
        }
      }
      
      // Generate alert if risk score is significant
      if (riskScore >= 20) {
        // Determine alert level
        let alertLevel = 'low';
        if (riskScore >= 50) {
          alertLevel = 'high';
        } else if (riskScore >= 30) {
          alertLevel = 'medium';
        }
        
        alerts.push({
          student: {
            id: student._id,
            name: student.name,
            email: student.email
          },
          riskScore: Math.min(100, riskScore), // Cap at 100
          alertLevel,
          riskFactors,
          streak: {
            current: student.currentStreak,
            longest: student.longestStreak
          }
        });
      }
    }
    
    // Sort alerts by risk score (highest first)
    alerts.sort((a, b) => b.riskScore - a.riskScore);
    
    res.json({
      cohortId,
      cohortName: cohort.name,
      totalStudents: cohort.students.length,
      atRiskStudents: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCohort,
  getCohorts,
  getCohortById,
  updateCohort,
  deleteCohort,
  assignFacilitator,
  removeFacilitator,
  enrollStudent,
  unenrollStudent,
  postAssignmentToCohort,
  getAssignmentsForCohort,
  joinCohortByInviteCode,
  getCohortHealthScore,
  getPredictiveAlerts
};