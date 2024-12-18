const cds = require('@sap/cds');
const cors = require('cors');

// Get the HTML5 Production URL and set to the Origins object
const adminUrl = process.env.ADMIN_PRODUCTION;
const data = process.env.HTML5_PRODUCTION;

// Variable to store the list of Origin
const ORIGINS = {};
ORIGINS[data] = 1;
ORIGINS[adminUrl] = 1;

cds.on('bootstrap', app => app.use ((req, res, next) => {
    if (req.headers.origin in ORIGINS) {
    
    res.set('access-control-allow-origin', req.headers.origin)
    if (req.method === 'OPTIONS')
      return res.set('access-control-allow-methods', 'GET,HEAD,PUT,PATCH,POST,DELETE').end()
  }
  next()
}))