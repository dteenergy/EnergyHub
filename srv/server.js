const cds = require('@sap/cds');

cds.on('bootstrap', async (app) => {
  app.use((req, res, next) => {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || null;
     const allowedMethods = process.env.ALLOWED_METHODS;

    // Only allows when incoming request present in allowed origin
    if (allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    } else {
      // Explicitly block requests from disallowed origins        
      res.status(403).send('CORS policy: Access denied for this origin.');
      return;
    }
    res.header('Access-Control-Allow-Methods', allowedMethods);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  });
})

module.exports = cds.server;