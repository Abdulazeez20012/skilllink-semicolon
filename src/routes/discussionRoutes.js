const express = require('express');
const { addComment, getComments, deleteComment, upvoteComment, acceptAnswer, endorseComment } = require('../controllers/discussionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.route('/:assignmentId')
  .post(addComment)
  .get(getComments);

router.route('/:assignmentId/:commentId')
  .delete(deleteComment);

// New routes for Q&A features
router.route('/:assignmentId/:commentId/upvote')
  .post(upvoteComment);

router.route('/:assignmentId/:commentId/accept')
  .post(acceptAnswer);

router.route('/:assignmentId/:commentId/endorse')
  .post(roleMiddleware('facilitator'), endorseComment);

module.exports = router;