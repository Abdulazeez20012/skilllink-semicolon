const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/discussionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.route('/:assignmentId')
  .post(addComment)
  .get(getComments);

router.route('/:assignmentId/:commentId')
  .delete(deleteComment);

module.exports = router;