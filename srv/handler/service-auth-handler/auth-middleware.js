// auth-middleware.js
const { verifyToken } = require("./jwt-utils");

// Middleware to check for token validity
async function checkTokenExpiration(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please provide a valid token.' });
  }

  const status = await verifyToken(token);

  if (!status.valid) {
    return res.status(401).json({ message: status.message });
  }

  // Attach decoded token to request object
  req.user = status.decoded;
  next();
}

module.exports = checkTokenExpiration;
