const cds = require('@sap/cds');

const createEnrollmentFormDetail = require('./create-enrollment-form-action');

module.exports = cds.service.impl(async function(srv){
    
    srv.on('CreateEnrollmentFormDetail',  async(req)=>
        {
            const tx = cds.tx(req);
            
            try{
                const res = createEnrollmentFormDetail(req, this.entities, tx)

                return res;
            } catch(e){

                return {'error':'Failed to create'}
            }
            
        })   
})