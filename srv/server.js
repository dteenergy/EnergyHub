const cds = require('@sap/cds');
const cors = require('cors');
const express = require('express');
const app = express();


app.use(getAuthToken)
cds.on("bootstrap", async(app)=>{
    app.use(cors({ origin: "*" }));
})