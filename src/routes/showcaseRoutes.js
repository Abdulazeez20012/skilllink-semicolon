const express = require('express');
const {
  createShowcase,
  getShowcasesByCohort,
  getUserShowcases,
  likeProject,
  addComment,
  toggleFeatured,
  deleteShowcase
} = require('../controllers/showcaseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create showcase
router.route('/')
  .post(roleMiddleware('student'), createShowcase);

// Get showcases by cohort
router.route('/cohort/:cohortId')
  .get(getShowcasesByCohort);

// Get user's showcases
router.route('/user/:userId')
  .get(getUserShowcases);

// Like project
router.route('/:id/like')
  .post(likeProject);

// Add comment
router.route('/:id/comment')
  .post(addComment);

// Toggle featured (facilitator only)
router.route('/:id/feature')
  .put(roleMiddleware('facilitator', 'admin'), toggleFeatured);

// Delete showcase
router.route('/:id')
  .delete(deleteShowcase);

module.exports = router;
