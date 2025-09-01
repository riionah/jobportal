const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} = require('../models/companymodels');

// GET: All companies
const getCompanies = async (req, res) => {
  try {
      // Pass user info (id and role) to getAllCompanies
      const companies = await getAllCompanies(req.user);
      res.status(200).json(companies);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

const getAllCompaniesPublic = async (req, res) => {
  try {
    const pool = await require('mssql').connect();
    const result = await pool.request().query('SELECT * FROM companies');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: One company by ID
const getCompany = async (req, res) => {
  const { id } = req.params;
  try {
      const company = await getCompanyById(id);
      if (!company) return res.status(404).json({ error: 'Company not found' });
      res.status(200).json(company);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Create company
const createCompanyController = async (req, res) => {
  const { name, industry, location, website,} = req.body;  // added logo_url
  const userId = req.user.id;  // get user id from token

  if (!name || !industry || !location || !website) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Pass userId and logo_url to your model so company is linked to this user
    await createCompany({ name, industry, location, website,}, userId);
    res.status(201).json({ message: 'Company created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update company
const updateCompanyController = async (req, res) => {
  const { id } = req.params;
  const { name, industry, location, website,} = req.body;  // added logo_url
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const company = await getCompanyById(id);
    if (!company) return res.status(404).json({ error: 'Company not found' });

    // If user is not admin, check if they own this company
    if (userRole !== 'admin' && company.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to edit this company' });
    }

    await updateCompany(id, { name, industry, location, website, logo_url });
    res.status(200).json({ message: 'Company updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete company
const deleteCompanyController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
      const company = await getCompanyById(id);
      if (!company) return res.status(404).json({ error: 'Company not found' });

      if (userRole !== 'admin' && company.user_id !== userId) {
          return res.status(403).json({ error: 'Unauthorized to delete this company' });
      }

      await deleteCompany(id);
      res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCompanies,
  getCompany,
  createCompanyController,
  updateCompanyController,
  deleteCompanyController,
  getAllCompaniesPublic
};