const Assignment = require('../models/Assignment');
const Discussion = require('../models/Discussion');
const Cohort = require('../models/Cohort');
const Submission = require('../models/Submission');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Facilitator
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, resources, cohort, module, tags, rubric } = req.body;
    
    // Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      resources,
      cohort,
      module,
      tags,
      rubric,
      createdBy: req.user._id
    });
    
    // Add assignment to cohort if provided
    if (cohort) {
      await Cohort.findByIdAndUpdate(cohort, { $push: { assignments: assignment._id } });
    }
    
    // Create discussion thread for this assignment
    await Discussion.create({
      assignmentId: assignment._id,
      comments: []
    });
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('createdBy', 'name')
      .populate('cohort', 'name')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignments by cohort
// @route   GET /api/assignments/cohort/:cohortId
// @access  Private
const getAssignmentsByCohort = async (req, res) => {
  try {
    const assignments = await Assignment.find({ cohort: req.params.cohortId })
      .populate('createdBy', 'name')
      .populate('cohort', 'name')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('cohort', 'name');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private/Facilitator
const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, resources, module, tags, rubric } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if user is the creator
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.resources = resources || assignment.resources;
    assignment.module = module || assignment.module;
    assignment.tags = tags || assignment.tags;
    assignment.rubric = rubric || assignment.rubric;
    
    const updatedAssignment = await assignment.save();
    
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Facilitator
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if user is the creator
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await assignment.deleteOne();
    
    // Also delete the discussion thread
    await Discussion.deleteMany({ assignmentId: req.params.id });
    
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions for an assignment
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

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentsByCohort,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getSubmissionsForAssignment
};