const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;