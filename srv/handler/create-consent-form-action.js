const { validateWithRegex } = require("./regex-and-error-message");

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

    // Check the Consent details fields contains the empty value.
    const consentDetailFieldCheck = Object.values(consentDetailParsedData).some(value => value === '');
    if (consentDetailFieldCheck)
      throw { status: 400, message: "Please fill in all required fields." }
    if (!consentDetailParsedData.hasOwnProperty("AppId"))
      throw { status: 400, message: 'The AppId field is required.Please provide the necessary value.' }

    // Validate the Emailid and Phonenumber from consentDetailParserdData
    validateWithRegex(consentDetailParsedData?.EmailAddr, 'email');
    validateWithRegex(consentDetailParsedData?.PhoneNumber, 'phoneNumber');

    // Check if the ApplicationDetail entity contains the AppId from the ConsentParsedData
    const applicationDetailResult = await tx.run(
      SELECT.from(entity.ApplicationDetail)
        .where({ AppId: consentDetailParsedData?.AppId })
        .columns(['AppId'])
    );

    console.log(applicationDetailResult);
    
    // Return 404 if no ApplicationDetail found
    if (applicationDetailResult?.length === 0)
      throw { status: 404, message: "Enrollment details not available for this AppId." }
    else {
      // Assign AppId and ConsentId to ApplicationConsent
      consentDetailParsedData.AppRefId_AppId = applicationDetailResult[0].AppId;

      // Remove the AppId from the Payload
      delete consentDetailParsedData.AppId;

      // Insert Consent Form details to database
      const consentDetailResponse = await tx.run(INSERT.into(entity.ApplicationConsent).entries(consentDetailParsedData));

      // Check Consent Form Details inserted successfully
      if (consentDetailResponse?.results?.length > 0) 
        return { status: 200, message: 'Consent Form Created successfully' }
    }
  } catch (error) {
    if (error.status) {
      return { status: error.status, message: error.message };
    } else
      return {
        status: 500, error: error.message
      }
  }
}

module.exports = createConsentFormDetail;