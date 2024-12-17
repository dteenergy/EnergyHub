const cds = require('@sap/cds');
const cors = require('cors');

cds.on("bootstrap", async(app)=>{
    //Cors Orgin
    app.use(cors({ origin: "*" }));
})