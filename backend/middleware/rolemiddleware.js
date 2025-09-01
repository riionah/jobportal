const roleMiddleware = (roles) => {
    return (req, res, next) => {
      console.log('User role:', req.user.role);  // Log the user role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    };
  };
module.exports = roleMiddleware;