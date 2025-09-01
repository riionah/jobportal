const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');
const {
  getJobs,
  getJob,
  createJobController,
  updateJobController,
  deleteJobController,
  getAllJobsPublic,
  getJobPublic
} = require('../controllers/jobcontroller');

const router = express.Router();

// Public routes
router.get('/public/:id', getJobPublic); // <-- Add this
router.get('/public', getAllJobsPublic);
router.get('/', authMiddleware, getJobs);
router.get('/:id', authMiddleware, getJob);
// Admin-only routes
router.post('/', authMiddleware, roleMiddleware(['admin', 'employer']), createJobController);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'employer']), updateJobController);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'employer']), deleteJobController);

module.exports = router;