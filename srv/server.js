const cds = require('@sap/cds');
const cors = require('cors');
const cookieParser = require('cookie')

// Fetch the whitelist from environment variables
const whiteListedData = process.env.WHITELIST || ["*"];

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

const cookieHandler = async (req, res, next) => {
  const data = cookieParser.parse(req.headers['cookie']).authToken;
  console.log(data, "authToken parse");
  

  // console.log(cookieData, "Request header");
  const token = await generateToken({ sub: `token-${Date.now()}`, name: 'DTESERVICE' });
  console.log(token, "Token content----");
  
  // Check if there are any cookies
  if (data) {
    const verifyTokenData = await verifyToken(data);
    
      if ((data === undefined) || (verifyTokenData.value === false)) {
        console.log("authToken found");

        // Update the authToken cookie with new content
        res.setHeader('Set-Cookie', `authToken=${token};Path=/`);
        
        next(); // Proceed to the next middleware
        return; // Exit the function after updating the cookie
    }
  }
  // If no authToken is found, set a new cookie
  res.setHeader('Set-Cookie', `authToken=${token};Path=/`);
  next(); // Proceed to the next middleware
};

cds.on('bootstrap', async (app)=>{
  // Access the CorsValidation
    app.use(cors(dynamicCorsHandler));  
    app.use('*', cookieHandler);

})

cds.on('served', (services)=>{  
  const { DTEConsentAppPortal } = services;

    // Middleware to check authentication for specific entities
    const checkAuth = (req) => {
      const userAgent = req.headers['cookie'];
      const userAgentPost = req.headers['user-agent'];
      console.log(userAgent);
      
      if (userAgent || userAgentPost || userAgentPost?.startsWith('Postman')) {
          req.reject(401, 'Unauthorized: Direct browser access or postman is not allowed');
      }
    };

    // Apply middleware to specific entities
    DTEConsentAppPortal.before('*', 'ApplicationDetail', checkAuth);
    DTEConsentAppPortal.before('READ', 'AccountDetail', checkAuth);
    DTEConsentAppPortal.before('READ', 'BuildingDetail', checkAuth);
    DTEConsentAppPortal.before('READ', 'ApplicationConsent', checkAuth);
})

module.exports = cds.server;