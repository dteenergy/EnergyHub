const cds = require('@sap/cds');

const createEnrollmentFormDetail = require('./create-enrollment-form-action');
const createConsentFormDetail = require('./create-consent-form-action');

module.exports = cds.service.impl(async function (srv) {
    srv.on('CreateEnrollmentFormDetail', async (req) => {
        // Initialize the transaction
        const tx = cds.tx(req);
        try {
            // Method to create the Enrollment Form details
            const res = createEnrollmentFormDetail(req, this.entities, tx)

            return res;
        } catch (e) {
            return { 'error': 'Failed to create Enrollment Form' }
        }
    }),

    srv.on('CreateConsentFormDetail', async(req)=>{
        const tx = cds.tx(req);
        try{
            // Method to create the Consent Form details
            const consentResponse = await createConsentFormDetail(req, this.entities, tx);
            
            return consentResponse;
        } catch(e){
            return {'error':'Failed to create the consent detail'}
        }
    })
})