const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} = require('../models/jobmodels');
const sql = require('mssql');  // <--- Add this import
const {
    getCompanyById  // <-- This is what was missing
} = require('../models/companymodels');

// GET all jobs

const getJobs = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
  
    try {
      let jobs;
  
      if (userRole === 'admin') {
        jobs = await getAllJobs();
      } else {
        const pool = await sql.connect();
        const result = await pool.request()
          .input('userId', sql.Int, userId)
          .query(`
            SELECT jobs.*
            FROM jobs
            INNER JOIN companies ON jobs.company_id = companies.id
            WHERE companies.user_id = @userId
          `);
        jobs = result.recordset;
      }
  
      res.status(200).json(jobs);
    } catch (err) {
      console.error('Error in getJobs controller:', err);  // <== Add this line
      res.status(500).json({ error: err.message });
    }
  };

// GET job by ID
const getJob = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await getJobById(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST: Create a new job
const createJobController = async (req, res) => {
    const { title, description, salary_range, location, company_id } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!title || !description || !salary_range || !location || !company_id) {
        return res.status(400).json({ message: 'All fields including company_id are required' });
    }

    try {
        if (userRole !== 'admin') {
            const company = await getCompanyById(company_id);
            if (!company) return res.status(404).json({ message: 'Company not found' });

            if (company.user_id !== userId) {
                return res.status(403).json({ message: 'You are not authorized to create jobs for this company' });
            }
        }

        await createJob({ title, description, salary_range, location }, company_id);
        res.status(201).json({ message: 'Job created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getAllJobsPublic = async (req, res) => {
    try {
      const pool = await require('mssql').connect();
      const result = await pool.request().query(`
        SELECT jobs.*, companies.name AS company_name
        FROM jobs
        INNER JOIN companies ON jobs.company_id = companies.id
      `);
      res.status(200).json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  const getJobPublic = async (req, res) => {
    const { id } = req.params;
    try {
      const job = await getJobById(id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      res.status(200).json(job);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// PUT: Update job
const updateJobController = async (req, res) => {
    const { id } = req.params;
    const { title, description, salary_range, location } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const job = await getJobById(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        // Check company ownership if user not admin
        if (userRole !== 'admin') {
            const company = await getCompanyById(job.company_id);
            if (!company) return res.status(404).json({ error: 'Company not found' });

            if (company.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized to update this job' });
            }
        }

        await updateJob(id, { title, description, salary_range, location });
        res.status(200).json({ message: 'Job updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE job
const deleteJobController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const job = await getJobById(id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        if (userRole !== 'admin') {
            const company = await getCompanyById(job.company_id);
            if (!company) return res.status(404).json({ error: 'Company not found' });

            if (company.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized to delete this job' });
            }
        }

        await deleteJob(id);
        res.status(200).json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getJobs,
    getJob,
    createJobController,
    updateJobController,
    deleteJobController,
    getAllJobsPublic,
    getJobPublic
};