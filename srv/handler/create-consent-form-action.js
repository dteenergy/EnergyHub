const { validateWithRegex } = require("./regex-and-error-message");

/**
 * Function: Create the Consent form details
 * req => Object 
 * entity => function
 * tx => function
 */
const createConsentFormDetail = async (req, entity, tx, encryptedAppId) => {

  try {
    const { ConsentDetail } = req?.data;

    // Parse the String Payload
    let consentDetailParsedData = JSON.parse(ConsentDetail);

    // Check the Consent details fields contains the empty value.
    const consentDetailFieldCheck = Object.values(consentDetailParsedData).some(value => value === '');
    if (consentDetailFieldCheck)
      throw { status: 400, message: 'Kindly fill all the required fields.' }

    // Validate the Sensitive field information from consentDetailParsedData.
    validateWithRegex(consentDetailParsedData?.EmailAddr, 'email');
    validateWithRegex(consentDetailParsedData?.PhoneNumber, 'phoneNumber');

    // Assign AppId to ApplicationConsent
    consentDetailParsedData.AppRefId_AppId = encryptedAppId;

    // Insert Consent Form details to database
    const consentDetailResponse = await tx.run(INSERT.into(entity.ApplicationConsent).entries(consentDetailParsedData));

    // Check Consent Form Details inserted successfully
    if (consentDetailResponse?.results?.length > 0)
      return { status: 200, message: 'Consent Form Created successfully' }
    // }
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