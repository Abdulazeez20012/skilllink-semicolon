const express = require('express');
const { createResource, getResources, getResourcesByCohort, getResourcesByModule, deleteResource } = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Facilitator can create and delete resources
router.route('/')
  .post(roleMiddleware('facilitator'), createResource)
  .get(getResources);

router.route('/cohort/:cohortId')
  .get(getResourcesByCohort);

router.route('/module/:module')
  .get(getResourcesByModule);

router.route('/:id')
  .delete(roleMiddleware('facilitator'), deleteResource);

module.exports = router;