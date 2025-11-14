const express = require('express');
const { calculateLeaderboard, getLeaderboard, getUserPosition } = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Calculate leaderboard (admin only)
router.route('/calculate/:cohortId')
  .post(roleMiddleware('admin', 'facilitator'), calculateLeaderboard);

// Get leaderboard for a cohort
router.route('/:cohortId')
  .get(getLeaderboard);

// Get user's position
router.route('/:cohortId/user/:userId')
  .get(getUserPosition);

module.exports = router;
