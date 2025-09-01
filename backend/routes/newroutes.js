const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');
const {
    getNews,
    getNewsItem,
    createNewsController,
    updateNewsController,
    deleteNewsController,
  } = require('../controllers/newcontrollers');

const router = express.Router();

// Public routes
router.get('/', authMiddleware, getNews);
router.get('/:id', authMiddleware, getNewsItem);
router.post('/', authMiddleware, roleMiddleware(['admin']), createNewsController);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateNewsController);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteNewsController);

module.exports = router;