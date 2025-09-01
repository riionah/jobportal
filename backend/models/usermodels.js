const sql = require('mssql');
const bcrypt = require('bcrypt');

// Create a new user with hashed password
const createUser = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const pool = await sql.connect();
    const result = await pool.request()
        .input('name', sql.VarChar, user.name)
        .input('email', sql.VarChar, user.email)
        .input('password', sql.Text, hashedPassword)
        .input('role', sql.VarChar, user.role || 'job_seeker')
        .query(`
            INSERT INTO users (name, email, password, role)
            VALUES (@name, @email, @password, @role)
        `);
    return result;
};

// Find a user by email (for login)
const findUserByEmail = async (email) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM users WHERE email = @email');
    return result.recordset[0];
};

// Get all users (for admin dashboard)
const getAllUsers = async () => {
    const pool = await sql.connect();
    const result = await pool.request()
        .query('SELECT id, name, email, role, created_at FROM users');
    return result.recordset;
};

// Get user by ID
const getUserById = async (id) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT id, name, email, role, created_at FROM users WHERE id = @id');
    return result.recordset[0];
};

// Update user details (except password)
const updateUser = async (id, data) => {
    const pool = await sql.connect();
    const request = pool.request()
        .input('id', sql.Int, id)
        .input('name', sql.VarChar, data.name)
        .input('email', sql.VarChar, data.email)
        .input('role', sql.VarChar, data.role);

    // Update query without password
    const query = `
        UPDATE users 
        SET name = @name, email = @email, role = @role
        WHERE id = @id
    `;

    const result = await request.query(query);
    return result;
};

// Update user password separately
const updateUserPassword = async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('password', sql.Text, hashedPassword)
        .query('UPDATE users SET password = @password WHERE id = @id');
    return result;
};

// Delete user by ID
const deleteUser = async (id) => {
    const pool = await sql.connect();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM users WHERE id = @id');
    return result;
};

module.exports = {
    createUser,
    findUserByEmail,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser
};
