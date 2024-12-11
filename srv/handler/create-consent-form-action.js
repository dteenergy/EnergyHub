/**
 * Function: Create the Consent form details
 * req => Object 
 * entity => function
 * tx => function
 */
const createConsentFormDetail = async (req, entity, tx) => {

  try {
    const { ConsentDetail } = req?.data;

    // Parse the String Payload
    let consentDetailParsedData = JSON.parse(ConsentDetail);

    // Check the Consent details fields contains the empty value
    const consentDetailFieldCheck = Object.values(consentDetailParsedData).some(value => value === '');

    if (consentDetailFieldCheck || !consentDetailParsedData.hasOwnProperty("AppId"))
      return { 'status': 400, 'message': 'The data is invalid. Please fix the errors and include the required field, AppId.' }

    // Check if the ApplicationDetail entity contains the AppId from the ConsentParsedData
    const applicationDetailResult = await tx.run(
      SELECT.from(entity.ApplicationDetail)
        .where({ AppId: consentDetailParsedData?.AppId })
        .columns(['AppId'])
    );

    // Return 404 if no ApplicationDetail found
    if (applicationDetailResult?.length === 0)
      return { statusCode: 404, Message: "Enrollment details not available for this AppId." }
    else {
      // Assign AppId and ConsentId to ApplicationConsent
      consentDetailParsedData.AppRefId_AppId = applicationDetailResult[0].AppId;

      // Remove the AppId from the Payload
      delete consentDetailParsedData.AppId;

      // Insert Consent Form details to database
      const consentDetailResponse = await tx.run(INSERT.into(entity.ApplicationConsent).entries(consentDetailParsedData));

      // Check Consent Form Details inserted successfully
      if (consentDetailResponse?.results?.length > 0) return { 'status': 200, 'message': 'Consent Form Created successfully' }
    }
  } catch (error) {
      return {
        statusCode: 500,
        error: error.message
      }
  }
}

module.exports = createConsentFormDetail;