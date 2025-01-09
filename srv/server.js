const cds = require('@sap/cds');

cds.on('bootstrap', async (app)=>{

    app.use((req, res, next) =>{
      const whiteList = JSON.parse(process.env.WHITELIST || '[]');

      // Allow every request to access service
      if(whiteList.length === 0) {
        // Explicitly block requests from disallowed origins        
        return res.status(403).send('CORS policy: Access denied for this origin.');
        
      }

      // Check incoming path is service path
      const isServicePath = /^\/service(\/.*)?$/.test(req.path);
      if(!isServicePath) next();
      else{
        // Allow access service When req header's referer in White list
        if(whiteList.includes(req.headers.referer)) next()
        else return res.status(403).send('Forbidden');
      }   
    });  
})

module.exports = cds.server;