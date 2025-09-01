const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');
const {
  getIndustries,
  getIndustry,
  createIndustryController,
  updateIndustryController,
  deleteIndustryController,
  getLocations,
  getLocation,
  createLocationController,
  updateLocationController,
  deleteLocationController
} = require('../controllers/industrucontroller');

const router = express.Router();

// LOCATIONS routes — move this ABOVE the dynamic /:id route
router.get('/locations', authMiddleware, getLocations);
router.get('/locations/:id', authMiddleware, getLocation);
router.post('/locations', authMiddleware, roleMiddleware(['admin']), createLocationController);
router.put('/locations/:id', authMiddleware, roleMiddleware(['admin']), updateLocationController);
router.delete('/locations/:id', authMiddleware, roleMiddleware(['admin']), deleteLocationController);

// INDUSTRIES routes
router.get('/', authMiddleware, getIndustries);
router.post('/', authMiddleware, roleMiddleware(['admin']), createIndustryController);
router.get('/:id', authMiddleware, getIndustry); // dynamic — keep last
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateIndustryController);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteIndustryController);

module.exports = router;