/**
 * Function: Create the Consent form details
 * req => Object 
 * entity => function
 * tx => function
 * decrAppId => string
 */
const createConsentFormDetail = async (req, entity, tx, decrAppId) => {

  try {
    const { ConsentDetail } = req?.data;

    //Avoid too many consent detail creation request.
    if(Array.isArray(ConsentDetail)) return {statusCode :'400', message:'Too many consent details'};

    // Assign AppId to ApplicationConsent
    ConsentDetail.AppRefId_AppId = decrAppId;

    // Insert Consent Form details to database
    const consentDetailResponse = await tx.run(INSERT.into(entity.ApplicationConsent).entries(ConsentDetail));

    // Check Consent Form Details inserted successfully
    if (consentDetailResponse?.results?.length > 0)
      return { statusCode: 200, message: 'Thank you! Your DTE Energy Data Hub consent is confirmed.'}
    } catch (error) {
    if (error.statusCode) {
      return { statusCode: error.statusCode, message: error.message };
    } else
        return {
          statusCode: 500, message: error.message
        }
  }
}

module.exports = createConsentFormDetail;