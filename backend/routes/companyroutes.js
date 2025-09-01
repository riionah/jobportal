const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const roleMiddleware = require('../middleware/rolemiddleware');
const {
  getCompanies,
  getCompany,
  createCompanyController,
  updateCompanyController,
  deleteCompanyController,
  getAllCompaniesPublic,
} = require('../controllers/companycontroller');

const router = express.Router();

// Public routes
router.get('/companies', authMiddleware, getCompanies);
router.get('/companies/:id', authMiddleware, getCompany);
router.get('/public/companies', getAllCompaniesPublic);
// Admin-only routes
router.post('/companies', authMiddleware, roleMiddleware(['admin', 'employer']), createCompanyController);
router.put('/companies/:id', authMiddleware, roleMiddleware(['admin', 'employer']), updateCompanyController);
router.delete('/companies/:id', authMiddleware, roleMiddleware(['admin', 'employer']), deleteCompanyController);

module.exports = router;