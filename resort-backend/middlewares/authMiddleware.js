const jwt = require('jsonwebtoken');

const verifyTokenAndRole = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    // token varify
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = verifyTokenAndRole;

