const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');
const {
    getEvents,
    getEvent,
    createEventController,
    updateEventController,
    deleteEventController,
  } = require('../controllers/eventcontroller');

const router = express.Router();

// Public routes
router.get('/', authMiddleware, getEvents);
router.get('/:id', authMiddleware, getEvent);

// Admin-only routes
router.post('/', authMiddleware, roleMiddleware(['admin']), createEventController);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateEventController);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteEventController);

module.exports = router;