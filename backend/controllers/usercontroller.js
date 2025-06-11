const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../models/usermodels');

// GET: All users
const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET: One user by ID
const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT: Update user (admin use only)
const updateUserController = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await updateUser(id, { name, email, role });
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE: Delete user (admin only)
const deleteUserController = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await deleteUser(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUsers,
    getUser,
    updateUserController,
    deleteUserController
};