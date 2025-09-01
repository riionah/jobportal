const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware'); // Optional for admin role
const {
  createProfileController,
  getProfileController,
  updateProfileController,
  getAllProfilesController,
  deleteProfileController,
  addEducationController,
  updateEducationController,
  getAllEducationController,
  getEducationController,
  deleteEducationController,
  createSkillController,
  getAllSkillsController,
  deleteSkillController,
  updateSkillController,
  createLanguageController,
  deleteLanguageController,
  getAllLanguagesController,
  updateLanguageController
} = require('../controllers/profilecontroller')
const router = express.Router();

// Get full profile of the authenticated user
router.post('/', authMiddleware, createProfileController);
router.get('/all', authMiddleware, roleMiddleware(['admin']), getAllProfilesController);
router.get('/user', authMiddleware, roleMiddleware(['job_seeker']), getProfileController);
router.put('/:id', authMiddleware, updateProfileController);
router.delete('/:id', authMiddleware, deleteProfileController);

// Education routes
router.post('/education', authMiddleware, addEducationController);
router.put('/education/:id', authMiddleware, updateEducationController);
router.delete('/education/:id', authMiddleware, deleteEducationController);
router.get('/education', authMiddleware, getAllEducationController);
router.get('/education/:id', authMiddleware, getEducationController);

// Skills routes
router.post('/skills', authMiddleware, createSkillController);
router.get('/skills', authMiddleware, getAllSkillsController);
router.delete('/skills/:id', authMiddleware, deleteSkillController);
router.put('/skills/:id', authMiddleware, updateSkillController);

// Languages routes
router.post('/languages', authMiddleware, createLanguageController);
router.get('/languages', authMiddleware, getAllLanguagesController);
router.delete('/languages/:id', authMiddleware, deleteLanguageController);
router.put('/languages/:id', authMiddleware, updateLanguageController);

module.exports = router;