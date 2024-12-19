const cds = require('@sap/cds');
const { generateConsentUrl } = require('./generate-consent-url');

module.exports = cds.service.impl(async function DTEEnergyAdminPortal(srv) {
    // Method to Generate the Consent URL
    srv.on('GenerateUrl', 'ApplicationDetail', async ({ params: [id] }) => {
        // Get the AppId
        const appId = id.AppId;

        // Generate the URL
        const generatedUrl = await generateConsentUrl(appId);

        // Return the ConsentURL with the encryptedid.
        return generatedUrl;
    })

})