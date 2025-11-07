const express = require('express');
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getSubmissionsForAssignment
} = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Facilitator routes
router.route('/')
  .post(roleMiddleware('facilitator'), createAssignment)
  .get(getAssignments);

router.route('/:id')
  .get(getAssignmentById)
  .put(roleMiddleware('facilitator'), updateAssignment)
  .delete(roleMiddleware('facilitator'), deleteAssignment);

router.route('/:id/submissions')
  .get(roleMiddleware('facilitator'), getSubmissionsForAssignment);

module.exports = router;