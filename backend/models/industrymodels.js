const sql = require('mssql');

// INDUSTRIES

const createIndustry = async (industry) => {
  const { name } = industry;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .query(`INSERT INTO industries (name) VALUES (@name)`);
    return result;
  } catch (error) {
    throw new Error('Error creating industry');
  }
};

const getAllIndustries = async () => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM industries');
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching industries');
  }
};

const getIndustryById = async (id) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM industries WHERE id = @id');
    return result.recordset[0];
  } catch (error) {
    throw new Error('Error fetching industry');
  }
};

const updateIndustry = async (id, industry) => {
  const { name } = industry;
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .query(`UPDATE industries SET name = @name WHERE id = @id`);
  } catch (error) {
    throw new Error('Error updating industry');
  }
};

const deleteIndustry = async (id) => {
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM industries WHERE id = @id');
  } catch (error) {
    throw new Error('Error deleting industry');
  }
};

// LOCATIONS

const createLocation = async (location) => {
  const { name } = location;
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .query(`INSERT INTO locations (name) VALUES (@name)`);
    return result;
  } catch (error) {
    throw new Error('Error creating location');
  }
};

const getAllLocations = async () => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM locations');
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching locations');
  }
};

const getLocationById = async (id) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM locations WHERE id = @id');
    return result.recordset[0];
  } catch (error) {
    throw new Error('Error fetching location');
  }
};

const updateLocation = async (id, location) => {
  const { name } = location;
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .query(`UPDATE locations SET name = @name WHERE id = @id`);
  } catch (error) {
    throw new Error('Error updating location');
  }
};

const deleteLocation = async (id) => {
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM locations WHERE id = @id');
  } catch (error) {
    throw new Error('Error deleting location');
  }
};

module.exports = {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry,
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};
