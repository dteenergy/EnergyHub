const cds = require('@sap/cds');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const {verifyReCAPTCHA} = require('./middleware/verify-recaptcha');
const malwareScanner = require('./utils/malware-scanner');

//Expand .env configuration to support variables
const dotenvConfig = dotenv.config();
dotenvExpand.expand(dotenvConfig);

cds.on('bootstrap', async (app) => {
  // Middleware to parse JSON with an increased limit (e.g., 5MB) 
  app.use(bodyParser.json({ limit: '5mb' })); 

  app.use((req, res, next) => {
    const corsAllowOrigins = JSON.parse(process.env.CORS_ALLOW_ORIGINS || '[]');

    // Restric access when CORS_ALLOW_ORIGINS is empty
    if (corsAllowOrigins.length === 0) {
      // Explicitly block requests from disallowed origins        
      return res.status(403).send('CORS policy: Access denied for this origin.');
    }

    // Allow every origin
    if (corsAllowOrigins.includes("*")) return next();

    // Check incoming path is service path
    const isServicePath = /^\/service(\/.*)?$/.test(req.path);
    if (!isServicePath) return next();
    else {      
      // Allow access service When req header's referer in CORS_ALLOW_ORIGINS 
      if (corsAllowOrigins.includes(req.headers.referer)) return next();
      else return res.status(403).send('Forbidden');
    }
  });

  // To verify reCATCHA token
  app.use(verifyReCAPTCHA);
});

module.exports = cds.server;