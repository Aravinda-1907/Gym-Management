// backend/src/middleware/adminMiddleware.js
module.exports = (req, res, next) => {
  // Check if user exists (should be attached by authMiddleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login."
    });
  }

  // Check if user has admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }

  // User is admin, proceed
  next();
};