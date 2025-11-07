const express = require('express');
const {
  submitAssignment,
  getUserSubmissions,
  getSubmissionsForAssignment,
  gradeSubmission,
  updateSubmission,
  deleteSubmission
} = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.route('/')
  .post(roleMiddleware('student'), submitAssignment);

router.route('/me')
  .get(getUserSubmissions);

router.route('/:id')
  .put(roleMiddleware('student'), updateSubmission)
  .delete(roleMiddleware('student'), deleteSubmission);

// Facilitator route for grading
router.route('/:id/grade')
  .put(roleMiddleware('facilitator'), gradeSubmission);

module.exports = router;