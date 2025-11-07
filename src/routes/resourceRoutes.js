const express = require('express');
const { createResource, getResources, deleteResource } = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Facilitator can create and delete resources
router.route('/')
  .post(roleMiddleware('facilitator'), createResource)
  .get(getResources);

router.route('/:id')
  .delete(roleMiddleware('facilitator'), deleteResource);

module.exports = router;