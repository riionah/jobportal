const sql = require('mssql');

const createNews = async (news, companyId) => {
    const { title, content, publish_date } = news;

    try {
        console.log('Creating news:', { title, content, publish_date, companyId });

        const pool = await sql.connect();
        const result = await pool.request()
            .input('title', sql.VarChar, title)
            .input('content', sql.Text, content)
            .input('publish_date', sql.Date, publish_date)
            .input('company_id', sql.Int, companyId)
            .query(`
                INSERT INTO news (title, content, publish_date, company_id)
                VALUES (@title, @content, @publish_date, @company_id)
            `);

        return result;
    } catch (error) {
        console.error('Error creating news:', error);
        throw new Error('Error creating news');
    }
};

const getAllNews = async () => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .query('SELECT * FROM news');
        return result.recordset;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Error fetching news');
    }
};

const getNewsById = async (id) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM news WHERE id = @id');
        return result.recordset[0];
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        throw new Error('Error fetching news by ID');
    }
};

const updateNews = async (id, news) => {
    const { title, content, publish_date } = news;

    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.VarChar, title)
            .input('content', sql.Text, content)
            .input('publish_date', sql.Date, publish_date)
            .query(`
                UPDATE news
                SET title = @title,
                    content = @content,
                    publish_date = @publish_date
                WHERE id = @id
            `);
    } catch (error) {
        console.error('Error updating news:', error);
        throw new Error('Error updating news');
    }
};

const deleteNews = async (id) => {
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM news WHERE id = @id');
    } catch (error) {
        console.error('Error deleting news:', error);
        throw new Error('Error deleting news');
    }
};

module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews
};