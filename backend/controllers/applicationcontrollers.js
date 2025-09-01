const {
    applyToJob,
    getEmployerApplications,
    getAllApplications,
  } = require('../models//applicationmodels');
  const sql = require('mssql');
  const applyToJobController = async (req, res) => {
    try {
      const userId = req.user.id;
      const { jobId, resumeUrl } = req.body;
      await applyToJob({ userId, jobId, resumeUrl });
      res.status(201).json({ message: 'Applied successfully' });
    } catch (err) {
      if (err.message === 'User already applied') {
        return res.status(409).json({ error: 'You have already applied to this job' });
      }
      res.status(500).json({ error: 'Error applying to job' });
    }
  };
  const getApplicantsByJobIdController = async (req, res) => {
    const jobId = req.params.jobId;
    const userRole = req.user.role;
    const userId = req.user.id;
  
    try {
      const pool = await sql.connect();
  
      let query = `
        SELECT a.id, u.name AS applicant, a.status, a.applied_at
        FROM applications a
        JOIN users u ON a.user_id = u.id
        WHERE a.job_id = @jobId
      `;
  
      // Restrict employers to only their company's jobs
      if (userRole === 'employer') {
        query += `
          AND a.job_id IN (
            SELECT j.id FROM jobs j
            JOIN companies c ON j.company_id = c.id
            WHERE c.user_id = @userId
          )
        `;
      }
  
      const result = await pool.request()
        .input('jobId', sql.Int, jobId)
        .input('userId', sql.Int, userId)
        .query(query);
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error fetching applicants by job ID:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getEmployerApplicationsController = async (req, res) => {
    try {
      const userId = req.user.id;
      const apps = await getEmployerApplications(userId);
      res.json(apps);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching employer applications' });
    }
  };
  const checkIfAppliedController = async (req, res) => {
    const userId = req.user.id;
    const jobId = req.params.jobId;
  
    try {
      const pool = await sql.connect();
  
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('jobId', sql.Int, jobId)
        .query(`
          SELECT COUNT(*) AS count
          FROM applications
          WHERE user_id = @userId AND job_id = @jobId
        `);
  
      const applied = result.recordset[0].count > 0;
      res.json({ applied });
    } catch (err) {
      console.error('Error checking application status:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getAllApplicationsController = async (req, res) => {
    try {
      const apps = await getAllApplications();
      res.json(apps);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching all applications' });
    }
  };
  const getAllJobSeekers = async (req, res) => {
    try {
      const pool = await sql.connect();
      const result = await pool.request().query(`
        SELECT u.id, u.name, u.email, js.phone, js.summary
        FROM job_seekers js
        JOIN users u ON js.id = u.id
        WHERE u.role = 'job_seeker'
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching job seeker profiles' });
    }
  };
  const getExtendedApplicationsController = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;
  
    try {
      const pool = await sql.connect();
  
      let query = `
        SELECT 
          a.id AS application_id,
          u.name AS applicant_name,
          u.email,
          js.phone,
          js.summary,
          j.title AS job_title,
          a.status,
          a.applied_at,
  
          STUFF((SELECT ',' + s.skill FROM skills s WHERE s.user_id = u.id FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS skills,
          STUFF((SELECT ',' + l.language + ' (' + l.proficiency + ')' FROM languages l WHERE l.user_id = u.id FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS languages,
          STUFF((SELECT ',' + e.degree + ' from ' + e.school + ' (' + CAST(e.start_year AS VARCHAR) + '-' + CAST(e.end_year AS VARCHAR) + ')' FROM education e WHERE e.user_id = u.id FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS education
        FROM applications a
        JOIN users u ON a.user_id = u.id
        JOIN job_seekers js ON js.id = u.id
        JOIN jobs j ON a.job_id = j.id
      `;
  
      if (role === 'employer') {
        query += `
          WHERE j.company_id IN (
            SELECT c.id FROM companies c WHERE c.user_id = @userId
          )
        `;
      }
  
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(query);
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error fetching extended applications:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getApplicationByIdController = async (req, res) => {
    const applicationId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;
  
    try {
      const pool = await sql.connect();
  
      let query = `
        SELECT 
          a.id AS application_id,
          u.name AS applicant_name,
          u.email,
          js.phone,
          js.summary,
          j.title AS job_title,
          a.status,
          a.applied_at,
  
          STUFF((SELECT ', ' + s.skill 
                 FROM skills s WHERE s.user_id = u.id FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS skills,
          STUFF((SELECT ', ' + l.language + ' (' + l.proficiency + ')' 
                 FROM languages l WHERE l.user_id = u.id FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS languages,
  
          edu.education_json AS education
        FROM applications a
        JOIN users u ON a.user_id = u.id
        JOIN job_seekers js ON js.id = u.id
        JOIN jobs j ON a.job_id = j.id
        OUTER APPLY (
          SELECT 
            (
              SELECT 
                e.school,
                e.field_of_study,
                e.degree,
                e.start_year,
                e.end_year
              FROM education e
              WHERE e.user_id = u.id
              FOR JSON PATH
            )
        ) AS edu(education_json)
        WHERE a.id = @applicationId
      `;
  
      if (role === 'employer') {
        query += ` AND j.company_id IN (SELECT c.id FROM companies c WHERE c.user_id = @userId)`;
      }
  
      const result = await pool.request()
        .input('applicationId', sql.Int, applicationId)
        .input('userId', sql.Int, userId)
        .query(query);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      // education_json is a JSON string, parse it to JSON object before sending
      const application = result.recordset[0];
      application.education = application.education ? JSON.parse(application.education) : [];
  
      res.json(application);
    } catch (err) {
      console.error('Error fetching application details:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  module.exports = {
    applyToJobController,
    getEmployerApplicationsController,
    getAllApplicationsController,
    getApplicantsByJobIdController,
    checkIfAppliedController,
    getAllJobSeekers,
    getExtendedApplicationsController,
    getApplicationByIdController
  };
  