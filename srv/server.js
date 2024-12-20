const cds = require('@sap/cds');
const cors = require('cors');

// Store the Whitelisted URL
const whiteListedData = process.env.WHITELIST;

const dynamicCorsHandler = function (req, callback) {
  let corsOptions;
  if (whiteListedData.indexOf(req.header('Origin')) !== -1) {
    // reflect (enable) the requested origin in the CORS response
    corsOptions = { origin: true } 
  } else {
    // disable CORS for this request
    corsOptions = { origin: false }
  }
  // callback expects two parameters: error and options
  callback(null, corsOptions) 
}

cds.on('bootstrap', async (app)=>{
  // Access the CorsValidation
    app.use(cors(dynamicCorsHandler));  
})

module.exports = cds.server;