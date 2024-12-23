const cds = require('@sap/cds');
const { generateToken } = require('./handler/service-auth-handler/jwt-utils');
const checkTokenExpiration = require('./handler/service-auth-handler/auth-middleware');
const cors = require('cors');

cds.on('bootstrap', async (app) => {
  app.use(cors({ origin: "*" }));
  // Service Path to return a token
  app.get('/api/gettoken', async (req, res) => {
    console.log('Token request received');
    try {
      // Generate the token : currentDate and the name
      const token = await generateToken({ sub: `token-${Date.now()}`, name: 'DTESERVICE' });

      // Send the token as the response
      // res.status(200).json({ token: token });
      return res.json({'code':200, token : token})
    } catch (err) {
      console.error('Error fetching token:', err);
      // res.status(500).json({ error: 'Unable to generate token' });
      return res.json({'code':500, 'message': 'Unable to generate token'})
    }
  });

  // Apply authentication middleware to protected routes
  app.use(checkTokenExpiration); // Apply this globally or only to specific routes
});

module.exports = cds.server;
