const cds = require('@sap/cds');

cds.on('bootstrap', async (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://d78e4f76trial-ehconsentportal.cfapps.us10-001.hana.ondemand.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');


    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  });
})

module.exports = cds.server;