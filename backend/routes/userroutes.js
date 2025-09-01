const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');
const {
  getUsers,
  getUser,
  updateUserController,
  deleteUserController
} = require('../controllers/usercontroller');

const router = express.Router();

// Admin-only routes
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getUser);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateUserController);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUserController);

module.exports = router;