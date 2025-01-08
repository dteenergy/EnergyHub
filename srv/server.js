const cds = require('@sap/cds');

cds.on('bootstrap', async (app) => {
  app.use((req, res, next) => {
     // CORS orgin restriction
     const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || '["https://forms.dteenergy.com"]');
     const allowedMethods = process.env.ALLOWED_METHODS;

     
    const origin = req.headers.origin; // Origin header for cross-origin requests
    const host = req.headers.host; // Host header for same-origin requests

    if (!origin) {
      // No Origin header: Assume same-origin, validate against host
      if (host && allowedOrigins.some((allowed) => allowed.includes(host))) {
        res.setHeader('Access-Control-Allow-Origin', `https://${host}`);
      } else {
        res.status(403).send('Access denied: No Origin header and invalid host.');
        return;
      }
    } else {
      // Origin header present: Validate against allowed origins
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else {
        res.status(403).send('Access denied: Origin not allowed.');
        return;
      }

    }

    res.setHeader('Access-Control-Allow-Methods', allowedMethods);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  });
})

module.exports = cds.server;