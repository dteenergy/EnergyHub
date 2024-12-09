const cds = require('@sap/cds');

const createEnrollmentFormDetail = require('./create-enrollment-form-action');

class DTEConsentAppPortal extends cds.ApplicationService{
    async init(){

        // Create the Enrollment form details
        this.on('CreateEnrollmentFormDetail', async(req)=>createEnrollmentFormDetail(req, this.entities));

        super.init();
    }
}

module.exports = DTEConsentAppPortal;