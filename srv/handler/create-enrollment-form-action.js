const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

/**
 * Function: Create the Enrollment form details
 * req => Object 
 * entity => function
 * tx => function
 */
const createEnrollmentFormDetail = async (req, entity, tx) => {

  try {
    const { ApplicationDetail, BuildingDetail, AccountDetail, ConsentDetail } = req?.data;

    // Generate a unique AppId using uuid
    const AppId = uuidv4();

    // Parse the String Payload
    const applicationParsedData = JSON.parse(ApplicationDetail);
    const buildingParsedData = JSON.parse(BuildingDetail);
    const accountParsedData = JSON.parse(AccountDetail);
    const consentParsedData = JSON.parse(ConsentDetail);

    // Check the build details fields contains the empty value
    const buildingDetailFieldCheck = buildingParsedData?.some(e =>
      Object.values(e).includes("")
    ) ? [] : 'Building Details Contains the Valid data';

    if ((Object.keys(applicationParsedData)?.length === 0) || (buildingParsedData?.length === 0) ||
      (buildingDetailFieldCheck?.length === 0) || (Object.keys(accountParsedData)?.length === 0) || (consentParsedData?.length === 0))
      return { 'status': 400, 'message': 'The data is invalid. Please review and correct the erroneous fields' }

    // Assign AppId to Application Detail, Building Detail, Account Detail and Application Consent 
    applicationParsedData.AppId = AppId
    buildingParsedData?.map(detail => detail.AppRefId_AppId = AppId);
    accountParsedData.AppRefId_AppId = AppId;
    consentParsedData.map(consent => consent.AppRefId_AppId = AppId);

    // Insert Enrollment Form details to database
    const applicationDetailResult = await tx.run(INSERT.into(entity?.ApplicationDetail).entries(applicationParsedData));
    const buildingDetailResult = await tx.run(INSERT.into(entity?.BuildingDetail).entries(buildingParsedData));
    const accountDetailResult = await tx.run(INSERT.into(entity?.AccountDetail).entries(accountParsedData));
    const consentDetailResult = await tx.run(INSERT.into(entity?.ApplicationConsent).entries(consentParsedData));

    // Check Enrollment Form Details inserted successfully.
    if ((applicationDetailResult?.results?.length > 0) && (buildingDetailResult?.results?.length > 0)
      && (accountDetailResult?.results?.length > 0) && (consentDetailResult?.results?.length > 0))
      return { statusCode: 200, Message: "Enrollment form created successfully." };

  } catch (error) {
      console.log("Enrollment Form Creation Error :", error);
      return {
        statusCode: 500,
        error: error.message
      };  
  }
};

module.exports = createEnrollmentFormDetail;