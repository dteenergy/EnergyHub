const cds = require('@sap/cds');
const { generateConsentUrl } = require('./generate-consent-url');
const { updateLinkId } = require('../../utils/update-linkId');

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
        return { message: e?.message, code: 500 }
      }
    }

  }),

  /**
   * Event handler for the 'UpdateLinkId' event.
   * This handler updates the LinkId of multiple applications based on the provided data.
   *
   * @param {string} req.data.selectedAppNumber - The parent application number to set as LinkId.
   * @param {string[]} req.data.selectedApplication - An array of application IDs to be updated.
   * @returns {Promise<Object>} A promise that resolves to an object containing a message and a status code.
   */
  srv.on('UpdateLinkId', async (req) => {
    // Destructure the necessary data from the request object
    const {selectedAppNumber, selectedApplication} = req.data;

    try {
      // Call the updateLinkId function to perform the update operation
      const updateLinkedId = await updateLinkId(selectedAppNumber, selectedApplication);
      return updateLinkedId; // Return the result of the update operation
    } catch (error) {
      // Handle any errors that occur during the update operation
      if(error?.code) return {message: error?.message, code: error?.code};
      else return {message: e?.message, code: 500};
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
        // Sorting logic: First by ApplicationNumber, then by LinkId
        data.sort((a, b) => {
          if (a.ApplicationNumber === b.ApplicationNumber) {
            return (a.LinkId || "").localeCompare(b.LinkId || "");
          }
          return a.ApplicationNumber.localeCompare(b.ApplicationNumber);
        })
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