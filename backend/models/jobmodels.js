const sql = require('mssql');

const createJob = async (job, companyId) => {
    const { title, description, salary_range, location } = job;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('title', sql.VarChar, title)
            .input('description', sql.Text, description)
            .input('salary_range', sql.VarChar, salary_range)
            .input('location', sql.VarChar, location)
            .input('company_id', sql.Int, companyId)
            .query(`
                INSERT INTO jobs (title, description, salary_range, location, company_id)
                VALUES (@title, @description, @salary_range, @location, @company_id)
            `);
        return result;
    } catch (error) {
        console.error('SQL Error creating job:', error); // Add this for visibility
        throw new Error('Error creating job');
    }
};

const getAllJobs = async () => {
    try {
      const pool = await sql.connect();
      const result = await pool.request()
        .query(`
          SELECT jobs.*, companies.name AS company_name
          FROM jobs
          INNER JOIN companies ON jobs.company_id = companies.id
        `);
      return result.recordset;
    } catch (error) {
      throw new Error('Error fetching jobs');
    }
  };

const getJobById = async (id) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM jobs WHERE id = @id');
        return result.recordset[0];
    } catch (error) {
        throw new Error('Error fetching job');
    }
};
const getJobs = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        let jobs;

        if (userRole === 'admin') {
            jobs = await getAllJobs(); // Admin sees all
        } else {
            // Employer: fetch jobs only for companies they own
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
        res.status(500).json({ error: err.message });
    }
};
const getJobsByUserId = async (userId) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
            SELECT jobs.*
            FROM jobs
            INNER JOIN companies ON jobs.company_id = companies.id
            WHERE companies.user_id = @userId
        `);
    return result.recordset;
};
const updateJob = async (id, job) => {
    const { title, description, salary_range, location } = job;

    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.VarChar, title)
            .input('description', sql.Text, description)
            .input('salary_range', sql.VarChar, salary_range)
            .input('location', sql.VarChar, location)
            .query(`
                UPDATE jobs
                SET title = @title,
                    description = @description,
                    salary_range = @salary_range,
                    location = @location
                WHERE id = @id
            `);
    } catch (error) {
        throw new Error('Error updating job');
    }
};

const deleteJob = async (id) => {
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM jobs WHERE id = @id');
    } catch (error) {
        throw new Error('Error deleting job');
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobs,
    getJobsByUserId
};