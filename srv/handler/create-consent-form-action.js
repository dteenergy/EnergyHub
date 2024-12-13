const { validateWithRegex } = require("./regex-and-error-message");

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

    // Parse the String Payload
    const consentDetailParsedData = JSON.parse(ConsentDetail);

    console.log(consentDetailParsedData);

    // Check the Consent details fields contains the empty value.
    const excludedFields = ['AuthTitle'];
    const consentDetailFieldCheck = Object.keys(consentDetailParsedData).filter((key=> !excludedFields.includes(key))).some(key => consentDetailParsedData[key] === '');
    if (consentDetailFieldCheck)
      throw { status: 400, message: 'Kindly fill all the required fields.' }

    // Validate the Sensitive field information from consentDetailParsedData.
    validateWithRegex(consentDetailParsedData?.EmailAddr, 'email');

    // Assign AppId to ApplicationConsent
    consentDetailParsedData.AppRefId_AppId = decrAppId;

    // Insert Consent Form details to database
    const consentDetailResponse = await tx.run(INSERT.into(entity.ApplicationConsent).entries(consentDetailParsedData));

    // Check Consent Form Details inserted successfully
    if (consentDetailResponse?.results?.length > 0)
      return { status: 200, message: 'Thank you! Your DTE Energy Data Hub consent is confirmed.'}
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