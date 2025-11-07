const Cohort = require('../models/Cohort');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// @desc    Create a new cohort
// @route   POST /api/cohorts
// @access  Private/Admin
const createCohort = async (req, res) => {
  try {
    const { name, description, programmingLanguage } = req.body;
    
    // Check if cohort with this name already exists
    const existingCohort = await Cohort.findOne({ name });
    
    if (existingCohort) {
      return res.status(400).json({ message: 'Cohort with this name already exists' });
    }
    
    // Create cohort
    const cohort = await Cohort.create({
      name,
      description,
      programmingLanguage
    });
    
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
      .populate('assignments');
    
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
    const { name, description, programmingLanguage } = req.body;
    
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
    
    await cohort.remove();
    
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
    user.cohort = cohort._id;
    
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
    
    // Remove cohort reference from user if it matches this cohort
    if (user.cohort && user.cohort.toString() === req.params.id) {
      user.cohort = undefined;
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
    user.cohort = cohort._id;
    
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
    
    // Remove cohort reference from user if it matches this cohort
    if (user.cohort && user.cohort.toString() === req.params.id) {
      user.cohort = undefined;
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
// @access  Private
const getAssignmentsForCohort = async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    // Check if user belongs to this cohort (either as student or facilitator)
    const isMember = cohort.students.includes(req.user._id) || 
                     cohort.facilitators.includes(req.user._id);
    
    if (!isMember) {
      return res.status(401).json({ message: 'User not authorized to view assignments for this cohort' });
    }
    
    const assignments = await Assignment.find({ _id: { $in: cohort.assignments } })
      .populate('createdBy', 'name');
    
    res.json(assignments);
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
  getAssignmentsForCohort
};