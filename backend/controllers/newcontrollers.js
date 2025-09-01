const {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews
} = require('../models/newmodels');

// GET all news
const getNews = async (req, res) => {
    try {
        const news = await getAllNews();
        res.status(200).json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET news by ID
const getNewsItem = async (req, res) => {
    const { id } = req.params;
    try {
        const news = await getNewsById(id);
        if (!news) return res.status(404).json({ error: 'News not found' });
        res.status(200).json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST create news
const createNewsController = async (req, res) => {
    const { title, content, publish_date, company_id } = req.body;

    if (!title || !content || !publish_date || !company_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await createNews({ title, content, publish_date }, company_id);
        res.status(201).json({ message: 'News created successfully' });
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: error.message });
    }
};
// PUT update news
const updateNewsController = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const existing = await getNewsById(id);
        if (!existing) return res.status(404).json({ error: 'News not found' });

        await updateNews(id, { title, content });
        res.status(200).json({ message: 'News updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE news
const deleteNewsController = async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await getNewsById(id);
        if (!existing) return res.status(404).json({ error: 'News not found' });

        await deleteNews(id);
        res.status(200).json({ message: 'News deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getNews,
    getNewsItem,
    createNewsController,
    updateNewsController,
    deleteNewsController
};