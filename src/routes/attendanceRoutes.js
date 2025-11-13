const express = require('express');
const {
  generateQRCode,
  markAttendance,
  getAttendanceByCohort,
  getStudentAttendance
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Facilitator routes
router.route('/generate')
  .post(roleMiddleware('facilitator'), generateQRCode);

router.route('/cohort/:cohortId')
  .get(roleMiddleware('facilitator'), getAttendanceByCohort);

// Student routes
router.route('/mark')
  .post(roleMiddleware('student'), markAttendance);

router.route('/student/:cohortId')
  .get(roleMiddleware('student'), getStudentAttendance);

module.exports = router;