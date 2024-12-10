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
    // Generate a unique AppId using uuid
    const AppId = uuidv4();

    // Get the payload from the req
    const { Enrollment } = req?.data;

    // Parse the String Enrollment String
    let enrollmentDetail = JSON.parse(Enrollment);

    // Store the parsed ApplicationDetail
    let applicationDetailData = enrollmentDetail?.ApplicationDetail;

    // Store the AccountDetail
    let accountDetailData = enrollmentDetail?.AccountDetail;

    // Store the buildingDetail string into an array
    let buildingsArray;
    buildingsArray = enrollmentDetail?.BuildingDetail;

    // Store the parsed ApplicationConsent
    let applicationConsent;
    applicationConsent = enrollmentDetail.ApplicationConsent;

    // Condition to check whether the JSON object contain value or not
    if ((applicationConsent?.length === 0) || (accountDetailData?.length === 0) ||
      (applicationDetailData?.length === 0) || (buildingsArray?.length === 0))
      return { 'status': 400, 'message': 'The data is invalid. Please review and correct the erroneous fields' }

    // Set AppId to applicationDetailData
    applicationDetailData.AppId = AppId

    // Add AppRefId_AppId to each building entry
    const buildingDetailData = buildingsArray?.map(detail => ({
      ...detail,
      AppRefId_AppId: AppId,
    }));

    // Add AppRefId_AppId to each consent
    applicationConsent = applicationConsent.map(consent => ({
      ...consent,
      AppRefId_AppId: AppId
    }));

    // Assign the value of AppId to the AppRefId_AppId property of accountDetailData
    accountDetailData.AppRefId_AppId = AppId;

    // Check if EnergyPrgmParticipated exists in the account object
    if (!accountDetailData.hasOwnProperty('EnergyPrgmParticipated')) {
      accountDetailData.EnergyPrgmParticipated = false;
    }

    // Insert the applicationDetailData into the ApplicationDetail table using a transactional query
    let applicationDetailRes = await tx.run(INSERT.into(entity?.ApplicationDetail).entries(applicationDetailData));

    // Insert the buildingDetailData into the BuildingDetails table using a transactional query
    let buildingDetailRes = await tx.run(
      INSERT.into(entity?.BuildingDetail)
        .columns(['BuildingId'])
        .entries(buildingDetailData)
    );

    // Insert accountDetailData into the AccountDetail table using a transactional query
    let acccountDetailRes = await tx.run(INSERT.into(entity.AccountDetail).entries(accountDetailData));

    // Insert the applicationConsent into the ApplicationConsent table using a transactional query
    let applicationConsentRes = await tx.run(INSERT.into(entity?.ApplicationConsent).entries(applicationConsent));

    // Check if results were returned for all queries: ApplicationDetail, BuildingDetail, AccountDetail, and ApplicationConsent
    if (applicationDetailRes.results.length > 0 && buildingDetailRes.results.length > 0
      && acccountDetailRes.results.length > 0 && applicationConsentRes.results.length > 0)
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