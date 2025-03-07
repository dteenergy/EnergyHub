const cds = require('@sap/cds');

const { generateConsentUrl } = require('./generate-consent-url');
const { linkApplications } = require('./link-applications');
const { readApplicationDetail } = require('./read-application-detail');
const { unLinkApplications } = require('./unlink-applications');
const { downloadAttachment } = require('./download-attachment');

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

  // Handler to download attachment
  srv.on('DownloadAttachment', 'ApplicationDetail', downloadAttachment);

  // Method to read the Applications
  srv.on('READ', 'ApplicationDetail', readApplicationDetail),

  // Register the 'Link' event handler with the LinkApplications function
  srv.on('Link', linkApplications),

  // Register the 'UnLink' event handler with the UnLinkApplications function
  srv.on('UnLink', unLinkApplications);

  // Method to add the NoOfConsentReceived Field.
  srv.after('READ', 'ApplicationDetail', async (data) => {
    try {
      // If data contains value
      if (Array.isArray(data)) {
        for (const el of data) {
          el.hasAttachment = false;
          // Check the ReferenceId with the AppId and ConsentStatus
          const ConsentDetail = await cds.run(
            SELECT.from(ApplicationConsent)
              .where({ AppId: el.AppId, ConsentStatus: ['New', 'Accepted'], ConsentByTenantFlag: true })
          );
          el.NoOfConsentReceived = ConsentDetail?.length;
   
          if(el.AttachmentURL) el.hasAttachment = true;

          delete el.AttachmentURL;
        }
      }

    } catch (e) {
      console.log('Read Application Error', e);
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