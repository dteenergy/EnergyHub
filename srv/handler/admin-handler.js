const cds = require('@sap/cds');
const { generateConsentUrl } = require('./generate-consent-url');

module.exports = cds.service.impl(async function DTEEnergyAdminPortal(srv) {
    const {ApplicationConsent} = this.entities;
    // Method to Generate the Consent URL
    srv.on('GenerateUrl', 'ApplicationDetail', async ({ params: [id] }) => {
        // Get the AppId
        const appId = id.AppId;

        // Generate the URL
        const generatedUrl = await generateConsentUrl(appId);

        // Return the ConsentURL with the encryptedid.
        return generatedUrl;
    }),

    // Method to add the NoOfConsentReceived Field.
    srv.after('READ', 'ApplicationDetail', async(data)=>{
        // If data contains value
        if(Array.isArray(data)){
            for(const e of data){
                // Check the ReferenceId with the AppId
                const ConsentDetailCount = await cds.run(
                    SELECT.from(ApplicationConsent)
                    .where({AppRefId_AppId: e.AppId})
                )
                e.NoOfConsentReceived =  ConsentDetailCount.length;
            }
        } else {
            // Set the NoOdConsentReceived as 0
            data.NoOfConsentReceived = 0
        }
    })

})