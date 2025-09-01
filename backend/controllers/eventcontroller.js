const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../models/eventmodels');

// GET: All events
const getEvents = async (req, res) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET: One event by ID
const getEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await getEventById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST: Create event
const createEventController = async (req, res) => {
    const { name, type, date, location, company_id } = req.body;

    if (!name || !type || !date || !location || !company_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await createEvent({ name, type, date, location }, company_id);
        res.status(201).json({ message: 'Event created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Creating event with:', { name, type, date, location, company_id });
    }
};

// PUT: Update event
const updateEventController = async (req, res) => {
    const { id } = req.params;
    const { name, type, date, location } = req.body;

    try {
        const event = await getEventById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        await updateEvent(id, { name, type, date, location });
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE: Delete event
const deleteEventController = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await getEventById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        await deleteEvent(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getEvents,
    getEvent,
    createEventController,
    updateEventController,
    deleteEventController
};