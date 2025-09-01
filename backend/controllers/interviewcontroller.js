const sql = require('mssql');

// Employer schedules an interview for a specific application
const createInterviewController = async (req, res) => {
  const { applicationId, interviewDate, interviewer, status } = req.body;
  const userId = req.user.id;  // From auth middleware
  const userRole = req.user.role;

  if (userRole !== 'employer') {
    return res.status(403).json({ error: 'Only employers can create interviews.' });
  }

  try {
    const pool = await sql.connect();

    // Check if the application belongs to a job under this employer's company
    const checkAppQuery = `
      SELECT a.id FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.id = @applicationId AND c.user_id = @userId
    `;

    const checkResult = await pool.request()
      .input('applicationId', sql.Int, applicationId)
      .input('userId', sql.Int, userId)
      .query(checkAppQuery);

    if (checkResult.recordset.length === 0) {
      return res.status(403).json({ error: 'Application not found or you do not have permission.' });
    }

    // Insert the interview
    await pool.request()
      .input('applicationId', sql.Int, applicationId)
      .input('interviewDate', sql.DateTime, interviewDate)
      .input('interviewer', sql.VarChar, interviewer)
      .input('status', sql.VarChar, status || 'scheduled')
      .query(`
        INSERT INTO interviews (application_id, interview_date, interviewer, status)
        VALUES (@applicationId, @interviewDate, @interviewer, @status)
      `);

    res.status(201).json({ message: 'Interview scheduled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error scheduling interview' });
  }
};
const getInterviewsController = async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user.id;
  
    try {
      const pool = await sql.connect();
  
      let query = `
        SELECT i.id, i.interview_date, i.interviewer, i.status,
               a.id AS application_id, a.job_id, a.user_id AS applicant_id,
               u.name AS applicant_name,
               j.title AS job_title,
               c.name AS company_name
        FROM interviews i
        JOIN applications a ON i.application_id = a.id
        JOIN users u ON a.user_id = u.id
        JOIN jobs j ON a.job_id = j.id
        JOIN companies c ON j.company_id = c.id
      `;
  
      if (userRole === 'job_seeker') {
        // Job seeker sees only their interviews
        query += ` WHERE a.user_id = @userId `;
      } else if (userRole === 'employer') {
        // Employer sees interviews for their company only
        query += ` WHERE c.user_id = @userId `;
      } // admin sees all - no where needed
  
      const request = pool.request();
  
      if (userRole === 'job_seeker' || userRole === 'employer') {
        request.input('userId', sql.Int, userId);
      }
  
      const result = await request.query(query);
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error fetching interviews:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = { createInterviewController,
    getInterviewsController
 };