const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const githubService = require('../services/githubService');

// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Private/Student
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, projectLink, fileUpload } = req.body;
    
    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if submission already exists for this student and assignment
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId: req.user._id
    });
    
    if (existingSubmission) {
      return res.status(400).json({ message: 'Submission already exists for this assignment' });
    }
    
    // Check if due date has passed
    if (assignment.dueDate < Date.now()) {
      return res.status(400).json({ message: 'Due date has passed for this assignment' });
    }
    
    // Initialize submission data
    const submissionData = {
      assignmentId,
      studentId: req.user._id,
      projectLink,
      fileUpload
    };
    
    // If projectLink is a GitHub URL, fetch additional information
    if (projectLink && projectLink.includes('github.com')) {
      try {
        const githubData = await githubService.fetchRepoData(projectLink);
        
        submissionData.githubRepoUrl = githubData.url;
        submissionData.githubCommitMessage = githubData.latestCommit?.message;
        submissionData.githubLastCommitDate = githubData.latestCommit?.date;
        submissionData.githubReadme = githubData.readme;
      } catch (githubError) {
        // Log the error but don't fail the submission
        console.error('Failed to fetch GitHub data:', githubError.message);
      }
    }
    
    // Create submission
    const submission = await Submission.create(submissionData);
    
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions for current user
// @route   GET /api/submissions/me
// @access  Private
const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('assignmentId', 'title')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions for an assignment (facilitator)
// @route   GET /api/assignments/:id/submissions
// @access  Private/Facilitator
const getSubmissionsForAssignment = async (req, res) => {
  try {
    // Check if assignment exists
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if user is the creator of the assignment
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade and provide feedback on submission (with rubric support)
// @route   PUT /api/submissions/:id/grade
// @access  Private/Facilitator
const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback, rubricScores } = req.body;
    
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Get assignment to verify facilitator is the creator
    const assignment = await Assignment.findById(submission.assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update grading fields
    if (grade !== undefined) {
      submission.grade = grade;
    }
    
    if (feedback !== undefined) {
      submission.feedback = feedback;
    }
    
    // Handle rubric scores if provided
    if (rubricScores !== undefined) {
      submission.rubricScores = rubricScores;
    }
    
    const updatedSubmission = await submission.save();
    
    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private/Student
const updateSubmission = async (req, res) => {
  try {
    const { projectLink, fileUpload } = req.body;
    
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check if user is the owner
    if (submission.studentId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Check if due date has passed
    const assignment = await Assignment.findById(submission.assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.dueDate < Date.now()) {
      return res.status(400).json({ message: 'Due date has passed for this assignment' });
    }
    
    submission.projectLink = projectLink || submission.projectLink;
    submission.fileUpload = fileUpload || submission.fileUpload;
    
    // If projectLink is a GitHub URL, fetch additional information
    if (projectLink && projectLink.includes('github.com')) {
      try {
        const githubData = await githubService.fetchRepoData(projectLink);
        
        submission.githubRepoUrl = githubData.url;
        submission.githubCommitMessage = githubData.latestCommit?.message;
        submission.githubLastCommitDate = githubData.latestCommit?.date;
        submission.githubReadme = githubData.readme;
      } catch (githubError) {
        // Log the error but don't fail the update
        console.error('Failed to fetch GitHub data:', githubError.message);
      }
    }
    
    const updatedSubmission = await submission.save();
    
    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private/Student
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check if user is the owner
    if (submission.studentId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Check if due date has passed
    const assignment = await Assignment.findById(submission.assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.dueDate < Date.now()) {
      return res.status(400).json({ message: 'Cannot delete submission after due date' });
    }
    
    await submission.remove();
    
    res.json({ message: 'Submission removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAssignment,
  getUserSubmissions,
  getSubmissionsForAssignment,
  gradeSubmission,
  updateSubmission,
  deleteSubmission
};