const sql = require('mssql');
const createEvent = async (event, companyId) => {
    const { name, type, date, location } = event;

    // Ensure the date is a valid date object
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date format');
    }

    // Check if the date is in the future (if that’s required)
    if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date format');
    }

    try {
        const pool = await sql.connect();
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('type', sql.VarChar, type)
            .input('date', sql.DateTime, eventDate)
            .input('location', sql.VarChar, location)
            .input('company_id', sql.Int, companyId)
            .query(`
                INSERT INTO events (name, type, date, location, company_id)
                VALUES (@name, @type, @date, @location, @company_id)
            `);
        return { message: 'Event created successfully' };
    } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Error creating event');
    }
};
const getAllEvents = async () => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .query('SELECT * FROM events');
        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching events');
    }
};

const getEventById = async (id) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM events WHERE id = @id');
        return result.recordset[0];
    } catch (error) {
        throw new Error('Error fetching event');
    }
};

const updateEvent = async (id, event) => {
    const { name, type, date, location } = event;

    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('type', sql.VarChar, type)
            .input('date', sql.DateTime, date)
            .input('location', sql.VarChar, location)
            .query(`
                UPDATE events
                SET name = @name,
                    type = @type,
                    date = @date,
                    location = @location
                WHERE id = @id
            `);
    } catch (error) {
        throw new Error('Error updating event');
    }
};

const deleteEvent = async (id) => {
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM events WHERE id = @id');
    } catch (error) {
        throw new Error('Error deleting event');
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};