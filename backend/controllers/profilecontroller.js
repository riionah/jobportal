const {
  createProfile,
  getAllProfiles,
  updateProfileById,
  getProfileById,
  deleteProfileById,
  addEducation,
  updateEducation,
  deleteEducation,
  getAllEducation,
  getEducationById,
  getAllSkills,
  updateSkill,
  createSkill,
  deleteSkill,
  createLanguage,
  deleteLanguage,
  getLanguagesByUserId,
  updateLanguage
} = require('../models/profilemodels');

// GET full profile for logged-in user
const createProfileController = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get from token
    const { phone, summary } = req.body;

    const result = await createProfile({ userId, phone, summary });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in createProfileController:', error);
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
};

// Get all profiles (admin only)
const getAllProfilesController = async (req, res) => {
  console.log('User role:', req.user.role); // Should print 'admin'
  try {
    const result = await getAllProfiles();
    console.log('Profiles fetched:', result.length);
    res.json(result);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
};


// Job seeker: Get own profile
const getProfileController = async (req, res) => {
  const userId = req.user.id;  // make sure req.user is set by authMiddleware

  try {
    const profile = await getProfileById(userId); // or getProfileByUserId if you want full profile

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};
// Update profile by ID
const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id; // get from auth middleware
    const data = req.body;

    const updated = await updateProfileById(userId, data); // update by userId

    if (!updated) return res.status(404).json({ message: 'Profile not found or not updated' });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Delete profile by ID
const deleteProfileController = async (req, res) => {
  try {
    const deleted = await deleteProfileById(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Profile not found or not deleted' });
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error: error.message });
  }
};

// POST add education
const addEducationController = async (req, res) => {
  const userId = req.user.id;
  const educationData = req.body; // expect fields like degree, institution, start_date, end_date

  try {
    await addEducation(userId, educationData);
    res.status(201).json({ message: 'Education added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllEducationController = async (req, res) => {
  const userId = req.user.id;
  try {
    const educationList = await getAllEducation(userId);
    res.status(200).json(educationList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education list' });
  }
};

const getEducationController = async (req, res) => {
  const userId = req.user.id;
  const educationId = req.params.id;

  try {
    const education = await getEducationById(userId, educationId);
    if (!education) return res.status(404).json({ error: 'Education not found' });
    res.status(200).json(education);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education' });
  }
};

// PUT update education by ID
const updateEducationController = async (req, res) => {
  const userId = req.user.id;
  const educationId = req.params.id;
  const educationData = req.body;

  try {
    const updated = await updateEducation(userId, educationId, educationData);
    if (!updated) return res.status(404).json({ error: 'Education not found' });
    res.status(200).json({ message: 'Education updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE education by ID
const deleteEducationController = async (req, res) => {
  const userId = req.user.id;
  const educationId = req.params.id;

  try {
    const deleted = await deleteEducation(userId, educationId);
    if (!deleted) return res.status(404).json({ error: 'Education not found' });
    res.status(200).json({ message: 'Education deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST add skill

// POST create a new skill
const createSkillController = async (req, res) => {
  const userId = req.user.id;
  const { skill } = req.body;  // skill name string

  if (!skill) {
    return res.status(400).json({ error: 'Skill name is required' });
  }
  try {
    const newSkill = await createSkill(userId, skill); // pass skill string only
    res.status(201).json(newSkill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create skill' });
  }
};

const getAllSkillsController = async (req, res) => {
  const userId = req.user.id;
  try {
    const skills = await getAllSkills(userId);
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// PUT update a skill by ID
const updateSkillController = async (req, res) => {
  const userId = req.user.id;
  const skillId = req.params.id;
  const { skill } = req.body; // change from {name, level} to {skill}

  if (!skill) {
    return res.status(400).json({ error: 'Skill name is required' });
  }

  try {
    const updated = await updateSkill(skillId, userId, { skill });
    if (!updated) return res.status(404).json({ error: 'Skill not found' });
    res.status(200).json({ message: 'Skill updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteSkillController = async (req, res) => {
  const userId = req.user.id;
  const skillId = req.params.id;

  try {
    const deleted = await deleteSkill(skillId, userId);
    if (!deleted) return res.status(404).json({ error: 'Skill not found' });
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const createLanguageController = async (req, res) => {
  const userId = req.user.id;
  const { language, proficiency } = req.body;

  if (!language || !proficiency) {
    return res.status(400).json({ error: 'Language and proficiency are required' });
  }

  try {
    const newLanguage = await createLanguage(userId, language, proficiency);
    res.status(201).json(newLanguage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create language' });
  }
};

const getAllLanguagesController = async (req, res) => {
  const userId = req.user.id;
  try {
    const languages = await getLanguagesByUserId(userId);
    res.status(200).json(languages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const updateLanguageController = async (req, res) => {
  const userId = req.user.id;
  const languageId = req.params.id;
  const { language, proficiency } = req.body;

  if (!language || !proficiency) {
    return res.status(400).json({ error: 'Language and proficiency are required' });
  }

  try {
    const updated = await updateLanguage(languageId, userId, { language, proficiency });
    if (!updated) return res.status(404).json({ error: 'Language not found' });
    res.status(200).json({ message: 'Language updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteLanguageController = async (req, res) => {
  const userId = req.user.id;
  const languageId = req.params.id;

  try {
    const deleted = await deleteLanguage(languageId, userId);
    if (!deleted) return res.status(404).json({ error: 'Language not found' });
    res.status(200).json({ message: 'Language deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProfileController,
  getProfileController,
  updateProfileController,
  getAllProfilesController,
  addEducationController,
  deleteProfileController,
  updateEducationController,
  deleteEducationController,
  getAllEducationController,
  getEducationController,
  createSkillController,
  getAllSkillsController,
  deleteSkillController,
  updateSkillController,
  createLanguageController,
  deleteLanguageController,
  getAllLanguagesController,
  updateLanguageController
};