const {
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
  } = require('../models/industrymodels'); // You will create these in models
  
  // INDUSTRIES
  
  const getIndustries = async (req, res) => {
    try {
      const industries = await getAllIndustries();
      res.status(200).json(industries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getIndustry = async (req, res) => {
    const { id } = req.params;
    try {
      const industry = await getIndustryById(id);
      if (!industry) return res.status(404).json({ error: 'Industry not found' });
      res.status(200).json(industry);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const createIndustryController = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    try {
      await createIndustry({ name });
      res.status(201).json({ message: 'Industry created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const updateIndustryController = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    try {
      const industry = await getIndustryById(id);
      if (!industry) return res.status(404).json({ error: 'Industry not found' });
  
      await updateIndustry(id, { name });
      res.status(200).json({ message: 'Industry updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const deleteIndustryController = async (req, res) => {
    const { id } = req.params;
    try {
      const industry = await getIndustryById(id);
      if (!industry) return res.status(404).json({ error: 'Industry not found' });
  
      await deleteIndustry(id);
      res.status(200).json({ message: 'Industry deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // LOCATIONS
  
  const getLocations = async (req, res) => {
    try {
      const locations = await getAllLocations();
      res.status(200).json(locations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const getLocation = async (req, res) => {
    const { id } = req.params;
    try {
      const location = await getLocationById(id);
      if (!location) return res.status(404).json({ error: 'Location not found' });
      res.status(200).json(location);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const createLocationController = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    try {
      await createLocation({ name });
      res.status(201).json({ message: 'Location created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const updateLocationController = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    try {
      const location = await getLocationById(id);
      if (!location) return res.status(404).json({ error: 'Location not found' });
  
      await updateLocation(id, { name });
      res.status(200).json({ message: 'Location updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const deleteLocationController = async (req, res) => {
    const { id } = req.params;
    try {
      const location = await getLocationById(id);
      if (!location) return res.status(404).json({ error: 'Location not found' });
  
      await deleteLocation(id);
      res.status(200).json({ message: 'Location deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    getIndustries,
    getIndustry,
    createIndustryController,
    updateIndustryController,
    deleteIndustryController,
    getLocations,
    getLocation,
    createLocationController,
    updateLocationController,
    deleteLocationController
  };