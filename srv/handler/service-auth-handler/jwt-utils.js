// jwt-utils.js
const jwt = require('jsonwebtoken');

// Secret key
const secretKey = process.env.JWT_SECRET_KEY || '@dteEneHub*123*ServiceAuth';

// Generate JWT token
async function generateToken(payload) {
  // Generate the Token with the payload, secretkey
  const token = jwt.sign(payload, secretKey, { expiresIn: '2m' });
  return token;
}

// Verify JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, message: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token' };
  }
}

module.exports = {
  generateToken,
  verifyToken
};