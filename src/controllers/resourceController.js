const Resource = require('../models/Resource');

// @desc    Upload or share resource link
// @route   POST /api/resources
// @access  Private/Facilitator
const createResource = async (req, res) => {
  try {
    const { title, description, link, type, cohort, module, tags } = req.body;
    
    // Create resource
    const resource = await Resource.create({
      title,
      description,
      link,
      type,
      cohort,
      module,
      tags,
      uploadedBy: req.user._id
    });
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('uploadedBy', 'name')
      .populate('cohort', 'name')
      .sort({ uploadedAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resources by cohort
// @route   GET /api/resources/cohort/:cohortId
// @access  Private
const getResourcesByCohort = async (req, res) => {
  try {
    const resources = await Resource.find({ cohort: req.params.cohortId })
      .populate('uploadedBy', 'name')
      .populate('cohort', 'name')
      .sort({ uploadedAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resources by module
// @route   GET /api/resources/module/:module
// @access  Private
const getResourcesByModule = async (req, res) => {
  try {
    const resources = await Resource.find({ module: req.params.module })
      .populate('uploadedBy', 'name')
      .populate('cohort', 'name')
      .sort({ uploadedAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private/Facilitator
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is the uploader
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await resource.deleteOne();
    
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourcesByCohort,
  getResourcesByModule,
  deleteResource
};