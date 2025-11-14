const ProjectShowcase = require('../models/ProjectShowcase');

// @desc    Create a project showcase
// @route   POST /api/showcase
// @access  Private/Student
const createShowcase = async (req, res) => {
  try {
    const { title, description, projectUrl, githubUrl, liveUrl, imageUrl, technologies, cohort } = req.body;
    
    const showcase = await ProjectShowcase.create({
      title,
      description,
      student: req.user._id,
      cohort,
      projectUrl,
      githubUrl,
      liveUrl,
      imageUrl,
      technologies
    });
    
    await showcase.populate('student', 'name email avatar');
    
    res.status(201).json(showcase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all showcases for a cohort
// @route   GET /api/showcase/cohort/:cohortId
// @access  Private
const getShowcasesByCohort = async (req, res) => {
  try {
    const { cohortId } = req.params;
    const { featured, sortBy = 'recent' } = req.query;
    
    let query = { cohort: cohortId };
    if (featured === 'true') {
      query.featured = true;
    }
    
    let sort = {};
    if (sortBy === 'popular') {
      sort = { likes: -1, createdAt: -1 };
    } else if (sortBy === 'recent') {
      sort = { createdAt: -1 };
    }
    
    const showcases = await ProjectShowcase.find(query)
      .populate('student', 'name email avatar')
      .populate('comments.userId', 'name avatar')
      .sort(sort);
    
    res.json(showcases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's showcases
// @route   GET /api/showcase/user/:userId
// @access  Private
const getUserShowcases = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const showcases = await ProjectShowcase.find({ student: userId })
      .populate('cohort', 'name')
      .sort({ createdAt: -1 });
    
    res.json(showcases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a project
// @route   POST /api/showcase/:id/like
// @access  Private
const likeProject = async (req, res) => {
  try {
    const showcase = await ProjectShowcase.findById(req.params.id);
    
    if (!showcase) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const alreadyLiked = showcase.likedBy.some(userId => userId.toString() === req.user._id.toString());
    
    if (alreadyLiked) {
      // Unlike
      showcase.likedBy = showcase.likedBy.filter(userId => userId.toString() !== req.user._id.toString());
      showcase.likes = Math.max(0, showcase.likes - 1);
    } else {
      // Like
      showcase.likedBy.push(req.user._id);
      showcase.likes += 1;
    }
    
    await showcase.save();
    
    res.json({ likes: showcase.likes, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to project
// @route   POST /api/showcase/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    
    const showcase = await ProjectShowcase.findById(req.params.id);
    
    if (!showcase) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    showcase.comments.push({
      userId: req.user._id,
      comment
    });
    
    await showcase.save();
    await showcase.populate('comments.userId', 'name avatar');
    
    const newComment = showcase.comments[showcase.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle featured status
// @route   PUT /api/showcase/:id/feature
// @access  Private/Facilitator
const toggleFeatured = async (req, res) => {
  try {
    const showcase = await ProjectShowcase.findById(req.params.id);
    
    if (!showcase) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    showcase.featured = !showcase.featured;
    await showcase.save();
    
    res.json({ featured: showcase.featured });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete showcase
// @route   DELETE /api/showcase/:id
// @access  Private
const deleteShowcase = async (req, res) => {
  try {
    const showcase = await ProjectShowcase.findById(req.params.id);
    
    if (!showcase) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the owner
    if (showcase.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await showcase.deleteOne();
    
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShowcase,
  getShowcasesByCohort,
  getUserShowcases,
  likeProject,
  addComment,
  toggleFeatured,
  deleteShowcase
};
