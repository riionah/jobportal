const sql = require('mssql');

const createCompany = async (company, userId) => {
    const { name, industry, location, website } = company;
  
    try {
      const pool = await sql.connect();
      const result = await pool.request()
        .input('name', sql.VarChar, name)
        .input('industry', sql.VarChar, industry)
        .input('location', sql.VarChar, location)  // Use VarChar for consistency
        .input('website', sql.VarChar, website)
        .input('user_id', sql.Int, userId)
        .query(`
          INSERT INTO companies (name, industry, location, website, user_id)
          VALUES (@name, @industry, @location, @website, @user_id)
        `);
      return result;
    } catch (error) {
      console.error('Error in createCompany model:', error);
      throw error;
    }
  };
const getAllCompanies = async (user) => {
    try {
        const pool = await sql.connect();
        if (user.role === 'admin') {
            const result = await pool.request()
                .query('SELECT * FROM companies');
            return result.recordset;
        } else {
            const result = await pool.request()
                .input('user_id', sql.Int, user.id)
                .query('SELECT * FROM companies WHERE user_id = @user_id');
            return result.recordset;
        }
    } catch (error) {
        throw new Error('Error fetching companies');
    }
};

const getCompanyById = async (id) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM companies WHERE id = @id');
        return result.recordset[0];
    } catch (error) {
        throw new Error('Error fetching company');
    }
};

const deleteCompany = async (id) => {
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM companies WHERE id = @id');
    } catch (error) {
        throw new Error('Error deleting company');
    }
};

const updateCompany = async (id, company) => {
    const { name, industry, location, website,} = company;

    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('industry', sql.VarChar, industry)
            .input('location', sql.Text, location)
            .input('website', sql.VarChar, website)
            .query(`
                UPDATE companies
                SET name = @name,
                    industry = @industry,
                    location = @location,
                    website = @website
                WHERE id = @id
              `);
              
    } catch (error) {
        throw new Error('Error updating company');
    }
};

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};