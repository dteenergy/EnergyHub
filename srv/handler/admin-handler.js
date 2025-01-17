const cds = require('@sap/cds');
const { generateConsentUrl } = require('./generate-consent-url');

module.exports = cds.service.impl(async function DTEEnergyAdminPortal(srv) {
  const { ApplicationConsent, ApplicationDetail } = this.entities;

  // Event handler for the 'UPDATE' operation on the 'ApplicationDetail' entity
  srv.on('UPDATE', 'ApplicationDetail', (req) => {
    // Define the allowed application statuses
		const allowedAppStatuses = ['New', 'Rejected', 'Accepted'];

    // Extract the 'ApplicationStatus' from the request data
		const { ApplicationStatus } = req.data;

    // Validate the 'ApplicationStatus' field
		if (['', null, undefined].includes(ApplicationStatus) && !allowedAppStatuses.includes(ApplicationStatus)) {
      // If the status is invalid, return an error response with status code 400
      req.error(400, 'ApplicationStatus is invalid!')
		}
	});

  // Event handler for the 'UPDATE' operation on the 'ApplicationConsent' entity
  srv.on('UPDATE', 'ApplicationConsent', (req) => {
    // Define the allowed application statuses
		const allowedAppStatuses = ['New', 'Rejected', 'Accepted'];

    // Extract the 'ConsentStatus' from the request data
		const { ConsentStatus } = req.data;

    // Validate the 'ConsentStatus' field
		if (['', null, undefined].includes(ConsentStatus) && !allowedAppStatuses.includes(ConsentStatus)) {
      // If the status is invalid, return an error response with status code 400
      req.error(400, 'ConsentStatus is invalid!')
		}
	});

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
        return { message: e?.message, code: 500 }
      }
    }

  }),

  // Method to add the NoOfConsentReceived Field.
  srv.after('READ', 'ApplicationDetail', async (data) => {
    try {
      // If data contains value
      if (Array.isArray(data)) {
        for (const el of data) {
          // Check the ReferenceId with the AppId and ConsentStatus
          const ConsentDetail = await cds.run(
            SELECT.from(ApplicationConsent)
              .where({ AppId: el.AppId, ConsentStatus: ['New', 'Accepted'], ConsentByTenantFlag: true })
          )
          
          el.NoOfConsentReceived = ConsentDetail?.length;
        }
      }
    } catch (e) {
      return {message:e?.message, code:500}
    }
  });

  // Get environment variable
  srv.on('GetEnvironmentVariables', (req) => {
    return {
      tenantConsentFormURL: process.env.TENANT_CONSENT_FORM_URL
    }
  });
})