const sql = require('mssql');

// Apply to a job
const applyToJob = async ({ userId, jobId, resumeUrl }) => {
    const pool = await sql.connect();
  
    // Check if already applied
    const check = await pool.request()
      .input('userId', sql.Int, userId)
      .input('jobId', sql.Int, jobId)
      .query(`
        SELECT COUNT(*) AS count
        FROM applications
        WHERE user_id = @userId AND job_id = @jobId
      `);
  
    if (check.recordset[0].count > 0) {
      throw new Error('User already applied');
    }
  
    // Proceed to insert
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('jobId', sql.Int, jobId)
      .input('resumeUrl', sql.VarChar, resumeUrl)
      .query(`
        INSERT INTO applications (user_id, job_id, status, resume_url)
        VALUES (@userId, @jobId, 'applied', @resumeUrl)
      `);
  };  

// Get applications for employer (their company’s jobs)
const getEmployerApplications = async (userId) => {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT a.*, u.name AS applicant_name, j.title, js.phone, js.summary
        FROM applications a
        JOIN users u ON a.user_id = u.id
        JOIN jobs j ON a.job_id = j.id
        JOIN companies c ON j.company_id = c.id
        LEFT JOIN job_seekers js ON js.id = u.id
        WHERE c.user_id = @userId
      `);
    return result.recordset;
  };
  
  // Get all applications (admin)
  const getAllApplications = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT a.*, u.name AS applicant_name, j.title, js.phone, js.summary
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN job_seekers js ON js.id = u.id
    `);
    return result.recordset;
  };
module.exports = {
    applyToJob,
    getEmployerApplications,
    getAllApplications
  };