const express = require('express');
const {
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
} = require('../controllers/cohortController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Admin routes
router.route('/')
  .post(roleMiddleware('admin'), createCohort)
  .get(getCohorts);

router.route('/:id')
  .get(getCohortById)
  .put(roleMiddleware('admin'), updateCohort)
  .delete(roleMiddleware('admin'), deleteCohort);

// Admin routes for managing cohort members
router.route('/:id/facilitators')
  .post(roleMiddleware('admin'), assignFacilitator);

router.route('/:id/facilitators/:userId')
  .delete(roleMiddleware('admin'), removeFacilitator);

router.route('/:id/students')
  .post(roleMiddleware('admin'), enrollStudent);

router.route('/:id/students/:userId')
  .delete(roleMiddleware('admin'), unenrollStudent);

// Facilitator routes for posting assignments
router.route('/:id/assignments')
  .post(roleMiddleware('facilitator'), postAssignmentToCohort)
  .get(getAssignmentsForCohort);

module.exports = router;