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
    let ApplicationDetailData = enrollmentDetail?.ApplicationDetail;

    // Store the AccountDetail
    let accountdetailJson;
    accountdetailJson = enrollmentDetail?.AccountDetail;

    // Store the buildingDetail string into an array
    let buildingsArray;
    buildingsArray = enrollmentDetail?.BuildingDetail;

    // Store the parsed ApplicationConsent
    let applicationConsent;
    applicationConsent = enrollmentDetail.ApplicationConsent;
    
    // Condition to check whether the JSON object contain value or not
    if((applicationConsent?.length === 0) || (accountdetailJson?.length === 0) || 
    (ApplicationDetailData?.length === 0) || (buildingsArray?.length === 0)) 
      throw new Error('Failed to create the Enrollment form detail');

    // Application Detail  
    ApplicationDetailData.AppId = AppId

    // Create the associated BuildingDetail entries
    const buildingEntries = buildingsArray?.map(detail => ({
      ...detail,
      AppRefId_AppId: AppId,  
    }));

    // ApplicationConsent Detail
    applicationConsent = applicationConsent.map(consent => ({
      ...consent,
      AppRefId_AppId: AppId
    }));  

    // Append the AppRefId_AppId field in the Accountdetail
    accountdetailJson.AppRefId_AppId = AppId;

    // Check if EnergyPrgmParticipated exists in the account object
    if (!accountdetailJson.hasOwnProperty('EnergyPrgmParticipated')) {
      accountdetailJson.EnergyPrgmParticipated = false;
    }    

    // Insert into ApplicationDetail with generated AppId
    await tx.run(INSERT.into(entity?.ApplicationDetail).entries(ApplicationDetailData));

    // Insert all BuildingDetails
    await tx.run(
      INSERT.into(entity?.BuildingDetail)
        .columns(['BuildingId'])
        .entries(buildingEntries)
    );

    // Insert AccountDetails
    await tx.run(INSERT.into(entity.AccountDetail).entries(accountdetailJson));

    // Create the ApplicationConsent details
    await tx.run(INSERT.into(entity?.ApplicationConsent).entries(applicationConsent));

    return {
      statusCode: 201,
      Message: "Enrollment form created successfully."
    };
  } catch (error) {
    console.log("Enrollment Form Creation Error :", error);
    return {
      statusCode: 500,
      error: error.message
    };
  }
};

module.exports = createEnrollmentFormDetail;