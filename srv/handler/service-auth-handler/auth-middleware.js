// auth-middleware.js
const { verifyToken } = require("./jwt-utils");

// Middleware to check for token validity
async function checkTokenExpiration(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token && req.headers['user-agent'].startsWith("Postman")) {
    // return res.status(401).json({ message: 'Unauthorized. Please provide a valid token.' });
    return res.json({'code':401, 'message':'Unauthorized. Please provide a valid token.'})
  }

  const status = await verifyToken(token);

  if (!status.valid && req.headers['user-agent'].startsWith("Postman")) {
    // return res.status(401).json({ message: status.message });
    return res.json({'code':401, 'message':'Unauthorized. Pleade provide the valid token by triggering the endpoint /api/gettoken'})
  }

  // Attach decoded token to request object
  req.user = status.decoded;
  next();
}

module.exports = checkTokenExpiration;
