const cds = require('@sap/cds');

cds.on('bootstrap', async (app)=>{

    app.use((req, res, next) =>{
      const corsAllowOrigins = JSON.parse(process.env.CORS_ALLOW_ORIGINS  || '[]');

      // Restric access when CORS_ALLOW_ORIGINS is empty
      if(corsAllowOrigins.length === 0) {
        // Explicitly block requests from disallowed origins        
        return res.status(403).send('CORS policy: Access denied for this origin.');
      }

      // Allow every origin
      if(corsAllowOrigins.includes("*")) return next();

      // Check incoming path is service path
      const isServicePath = /^\/service(\/.*)?$/.test(req.path);
      if(!isServicePath) return next();
      else{
        // Allow access service When req header's referer in CORS_ALLOW_ORIGINS 
        if(corsAllowOrigins.includes(req.headers.referer)) return next();
        else return res.status(403).send('Forbidden');
      }   
    });  
})

module.exports = cds.server;