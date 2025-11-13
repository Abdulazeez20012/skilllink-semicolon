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
  getAssignmentsForCohort,
  joinCohortByInviteCode,
  getCohortHealthScore,
  getPredictiveAlerts
} = require('../controllers/cohortController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Public routes for viewing cohorts (students and facilitators can view)
router.route('/')
  .get(getCohorts);

// Routes for creating cohorts (admin and facilitators can create)
router.route('/')
  .post(roleMiddleware('admin', 'facilitator'), createCohort);

router.route('/:id')
  .get(getCohortById);

// Route for joining cohort by invite code (students can join)
router.route('/join/:inviteCode')
  .post(joinCohortByInviteCode);

// Admin routes for modifying cohorts
router.route('/:id')
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

// Admin route for cohort health score
router.route('/:id/health')
  .get(roleMiddleware('admin'), getCohortHealthScore);

// Admin route for predictive alerts
router.route('/:id/alerts')
  .get(roleMiddleware('admin'), getPredictiveAlerts);

module.exports = router;