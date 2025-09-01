const sql = require('mssql');

// Get full profile by user ID
const createProfile = async (profile) => {
  const { userId, phone, summary } = profile; // Use userId from the already-created user
  const pool = await sql.connect();
const userExists = await pool.request()
  .input('id', sql.Int, userId)
  .query('SELECT 1 FROM users WHERE id = @id');

if (userExists.recordset.length === 0) {
  throw new Error('User ID not found in users table.');
}

  const result = await pool.request()
    .input('id', sql.Int, userId)
    .input('phone', sql.VarChar, phone)
    .input('summary', sql.Text, summary)
    .query(`
      INSERT INTO job_seekers (id, phone, summary)
      VALUES (@id, @phone, @summary);
      SELECT SCOPE_IDENTITY() AS insertedId;
    `);

  return { id: result.recordset[0].insertedId, phone, summary };
};

// GET all profiles (admin only)
const getAllProfiles = async () => {
  const pool = await sql.connect();
  const result = await pool.request().query('SELECT * FROM job_seekers');
  return result.recordset;
};

// get profile by ID
const getProfileById = async (userId) => {
  const pool = await sql.connect();
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query('SELECT * FROM job_seekers WHERE id = @userId');
  return result.recordset[0];
};

// GET full profile by userId with education, skills, and languages
const getProfileByUserId = async (userId) => {
  try {
    const pool = await sql.connect();

    const seekerResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM job_seekers WHERE id = @userId');

    const seeker = seekerResult.recordset[0];
    if (!seeker) return null;

    const educationResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM education WHERE user_id = @userId');

    const skillsResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM skills WHERE user_id = @userId');

    const languagesResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM languages WHERE user_id = @userId');

    return {
      ...seeker,
      education: educationResult.recordset,
      skills: skillsResult.recordset,
      languages: languagesResult.recordset,
    };
  } catch (error) {
    console.error('Error getting job seeker profile:', error);
    throw new Error('Error getting profile');
  }
};

// UPDATE basic profile info (phone and summary)
const updateProfileBasics = async (userId, { phone, summary }) => {
  try {
    const pool = await sql.connect();

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('phone', sql.VarChar, phone)
      .input('summary', sql.Text, summary)
      .query(`
        UPDATE job_seekers
        SET phone = @phone,
            summary = @summary
        WHERE id = @userId
      `);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error updating job seeker basics:', error);
    throw new Error('Error updating profile basics');
  }
};

// UPDATE full profile by ID
const updateProfileById = async (userId, data) => {
  if (!userId || isNaN(userId)) throw new Error('Invalid profile id');

  const pool = await sql.connect();
  const result = await pool.request()
    .input('id', sql.Int, userId)
    .input('phone', sql.VarChar, data.phone)
    .input('summary', sql.Text, data.summary)
    .query(`
      UPDATE job_seekers
      SET phone = @phone, summary = @summary
      WHERE id = @id
    `);

  return result.rowsAffected[0] > 0;
};

// DELETE profile by ID
const deleteProfileById = async (id) => {
  const pool = await sql.connect();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM job_seekers WHERE id = @id');
  return result.rowsAffected[0] > 0;
};
const addEducation = async (userId, educationData) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('school', sql.VarChar, educationData.school)
      .input('degree', sql.VarChar, educationData.degree)
      .input('field_of_study', sql.VarChar, educationData.field_of_study || null)
      .input('start_year', sql.Int, educationData.start_year || null)
      .input('end_year', sql.Int, educationData.end_year || null)
      .query(`
        INSERT INTO education (user_id, school, degree, field_of_study, start_year, end_year)
        VALUES (@userId, @school, @degree, @field_of_study, @start_year, @end_year);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    return {
      id: result.recordset[0].id,
      user_id: userId,
      school: educationData.school,
      degree: educationData.degree,
      field_of_study: educationData.field_of_study,
      start_year: educationData.start_year,
      end_year: educationData.end_year,
    };
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};
  const getAllEducation = async (userId) => {
    try {
      const pool = await sql.connect();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM education WHERE user_id = @userId');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching education:', error);
      throw error;
    }
  };
  
  // Update one education entry by userId and educationId
  const updateEducation = async (userId, educationId, updatedEducation) => {
    try {
      const pool = await sql.connect();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('educationId', sql.Int, educationId)
        .input('school', sql.VarChar, updatedEducation.school)
        .input('degree', sql.VarChar, updatedEducation.degree)
        .input('field_of_study', sql.VarChar, updatedEducation.field_of_study || null)
        .input('start_year', sql.Int, updatedEducation.start_year || null)
        .input('end_year', sql.Int, updatedEducation.end_year || null)
        .query(`
          UPDATE education
          SET school = @school,
              degree = @degree,
              field_of_study = @field_of_study,
              start_year = @start_year,
              end_year = @end_year
          WHERE id = @educationId AND user_id = @userId
        `);
  
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  };
  
  // Delete one education entry by userId and educationId
  const deleteEducation = async (userId, educationId) => {
    try {
      const pool = await sql.connect();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('educationId', sql.Int, educationId)
        .query('DELETE FROM education WHERE id = @educationId AND user_id = @userId');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  };

const getEducationById = async (userId) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM education WHERE user_id = @userId');
    return result.recordset;  // array of education records
  } catch (error) {
    console.error('Error fetching education:', error);
    throw error;
  }
};

const createSkill = async (userId, skill) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('skill', sql.VarChar, skill)
      .query(`
        INSERT INTO skills (user_id, skill)
        VALUES (@userId, @skill);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    return { id: result.recordset[0].id, user_id: userId, skill };
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
};

// READ all skills for a user
const getSkillsByUserId = async (userId) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM skills WHERE user_id = @userId');
    return result.recordset;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};const getAllSkills = async (userId) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM skills WHERE user_id = @userId');
    return result.recordset;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

// UPDATE a skill
const updateSkill = async (skillId, userId, updatedSkill) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('skillId', sql.Int, skillId)
      .input('userId', sql.Int, userId)
      .input('skill', sql.VarChar, updatedSkill.skill) // updatedSkill is an object { skill: 'new skill' }
      .query(`
        UPDATE skills
        SET skill = @skill
        WHERE id = @skillId AND user_id = @userId
      `);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

// Delete skill (skillId, userId order)
const deleteSkill = async (skillId, userId) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('skillId', sql.Int, skillId)
      .input('userId', sql.Int, userId)
      .query('DELETE FROM skills WHERE id = @skillId AND user_id = @userId');

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};
const createLanguage = async (userId, language, proficiency) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('language', sql.VarChar, language)
      .input('proficiency', sql.VarChar, proficiency)
      .query(`
        INSERT INTO languages (user_id, language, proficiency)
        VALUES (@userId, @language, @proficiency);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    return { id: result.recordset[0].id, user_id: userId, language, proficiency };
  } catch (error) {
    console.error('Error creating language:', error);
    throw error;
  }
};

// READ all languages for a user
const getLanguagesByUserId = async (userId) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM languages WHERE user_id = @userId');
    return result.recordset;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

// UPDATE a language
const updateLanguage = async (languageId, userId, updatedLanguage) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('languageId', sql.Int, languageId)
      .input('userId', sql.Int, userId)
      .input('language', sql.VarChar, updatedLanguage.language)
      .input('proficiency', sql.VarChar, updatedLanguage.proficiency)
      .query(`
        UPDATE languages
        SET language = @language, proficiency = @proficiency
        WHERE id = @languageId AND user_id = @userId
      `);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error updating language:', error);
    throw error;
  }
};

// DELETE a language
const deleteLanguage = async (languageId, userId) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('languageId', sql.Int, languageId)
      .input('userId', sql.Int, userId)
      .query('DELETE FROM languages WHERE id = @languageId AND user_id = @userId');

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error deleting language:', error);
    throw error;
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileByUserId,
  updateProfileBasics,
  updateProfileById,
  getProfileById,
  deleteProfileById,
  addEducation,
  updateEducation,
  deleteEducation,
  getAllEducation,
  getEducationById,
  createSkill,
  getSkillsByUserId,
  getAllSkills,
  updateSkill,
  deleteSkill,
  createLanguage,
  deleteLanguage,
  getLanguagesByUserId,
  updateLanguage
};