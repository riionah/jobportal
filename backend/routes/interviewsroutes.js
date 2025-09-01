const express = require('express');
const { createInterviewController ,
    getInterviewsController
} = require('../controllers/interviewcontroller');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['employer']), createInterviewController);
router.get('/', authMiddleware, roleMiddleware(['admin', 'employer', 'job_seeker']), getInterviewsController);
module.exports = router;