const cds = require('@sap/cds');
const { generateConsentUrl } = require('./generate-consent-url');

module.exports = cds.service.impl(async function DTEEnergyAdminPortal(srv) {
  const { ApplicationConsent, ApplicationDetail } = this.entities;
  // Method to Generate the Consent URL
  srv.on('GenerateUrl', 'ApplicationDetail', async ({ params: [id] }) => {
    // Get the AppId
    const appId = id.AppId;

    try {
      // Generate the URL
      const generatedUrl = await generateConsentUrl(appId, ApplicationDetail);

      // Return the ConsentURL with the encryptedid.
      return { generatedUrl };
    } catch (e) {

      if (e?.code) {        
        return { message: e?.message, code: e?.code }
      } else {
        return { message: e?.message, code: '500' }
      }
    }

  }),

    // Method to add the NoOfConsentReceived Field.
    srv.after('READ', 'ApplicationDetail', async (data) => {
      try {
        // If data contains value
        if (Array.isArray(data)) {
          for (const e of data) {
            // Check the ReferenceId with the AppId
            const ConsentDetail = await cds.run(
              SELECT.from(ApplicationConsent)
                .where({ AppRefId_AppId: e.AppId })
            )
            e.NoOfConsentReceived = ConsentDetail?.length;
          }
        }
      } catch (e) {
        return {message:e?.message, code:500}
      }
    })

})