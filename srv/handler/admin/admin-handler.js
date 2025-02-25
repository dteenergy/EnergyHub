const cds = require('@sap/cds');
const { generateConsentUrl } = require('./generate-consent-url');
const { LinkApplications } = require('../../utils/link-applications');

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

  // Method to sort the Applications
  srv.on('READ', 'ApplicationDetail', async (req) => {
    // Clone the original query
    const query = req.query;

    // Add a computed column 'SortKey' to determine the sorting order of applications
    query.SELECT.columns.push({
      xpr: [
        'case',
        'when', { ref: ['LinkId'] }, 'is', 'null', // If 'LinkId' is NULL, use 'ApplicationNumber' as the sort key
        'then', { ref: ['ApplicationNumber'] },
        'else', { ref: ['LinkId'] }, // Otherwise, use 'LinkId' to maintain hierarchical sorting
        'end'
      ],
      as: 'SortKey' // Assign alias 'SortKey' to the computed column
    });

    // Add another computed column 'Parenting' to differentiate parent applications from child applications
    query.SELECT.columns.push({
      xpr: [
        'case',
        'when', { ref: ['LinkId'] }, '=', { ref: ['ApplicationNumber'] }, // If 'LinkId' matches 'ApplicationNumber', it is a parent application
        'then', '1', // Mark parent applications with '1'
        'else', '0', // Otherwise, it is a child application
        'end'
      ],
      as: 'Parenting' // Assign alias 'Parenting' to the computed column
    });

    /**
     * Apply sorting:
     * First, sort by 'SortKey' in ascending order to group related applications together
     * Then, sort by 'Parenting' in descending order to ensure parents appear before children
     */
    query.SELECT.orderBy = [{ ref: ['SortKey'], sort: 'asc' }, { ref: ['Parenting'], sort: 'desc'  }];

    // Execute the modified query and return the results
    return await cds.tx(req).run(query);
  }),

  // Register the 'Link' event handler with the LinkApplications function
  srv.on('Link', LinkApplications),

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