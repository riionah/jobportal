const express = require('express');
const {
  applyToJobController,
  getEmployerApplicationsController,
  getAllApplicationsController,
  getApplicantsByJobIdController,
  checkIfAppliedController,
  getAllJobSeekers,
  getExtendedApplicationsController,
  getApplicationByIdController
} = require('../controllers/applicationcontrollers');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['job_seeker']), applyToJobController);
router.get('/employer', authMiddleware, roleMiddleware(['employer']), getEmployerApplicationsController);
router.get('/admin', authMiddleware, roleMiddleware(['admin']), getAllApplicationsController);
router.get('/job/:jobId', authMiddleware, roleMiddleware(['employer', 'admin']), getApplicantsByJobIdController);
router.get('/check/:jobId', authMiddleware, roleMiddleware(['job_seeker']), checkIfAppliedController);
router.get('/jobseekers', authMiddleware, roleMiddleware(['admin', 'employer']), getAllJobSeekers);
router.get('/extended', authMiddleware, roleMiddleware(['admin', 'employer']), getExtendedApplicationsController);
router.get('/details/:id', authMiddleware, roleMiddleware(['admin', 'employer']), getApplicationByIdController);


module.exports = router;