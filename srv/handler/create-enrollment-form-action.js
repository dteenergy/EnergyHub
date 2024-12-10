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

    // Get the payload from the req and variable declaration
    const { ApplicationDetail, BuildingDetail, AccountDetail, ConsentDetail } = req?.data;
    let consentDetailPayload, buildingDetailPayload, applicationDetailResult, buildingDetailResult, acccountDetailResult, consentDetailResult;
    
    // Parse the String Payload
    const applicationParsedData = JSON.parse(ApplicationDetail);
    const buildingParsedData = JSON.parse(BuildingDetail);
    const accountParsedData = JSON.parse(AccountDetail);
    const consentParsedData = JSON.parse(ConsentDetail);

    // Check the Object contains the empty check data and JSON object/arrays contain value or not
    const buildingParsedDataCheck = buildingParsedData?.some(e => 
      Object.values(e).includes("")
    ) ? [] : 'Building Details Contains the Valid data';
    
    if((Object.keys(applicationParsedData)?.length === 0) || (buildingParsedData?.length === 0) || 
    (buildingParsedDataCheck?.length === 0) || (Object.keys(accountParsedData)?.length === 0) || (consentParsedData?.length === 0))  
    return { 'status': 400, 'message': 'The data is invalid. Please review and correct the erroneous fields' }

    // Assign AppId to various parsed data objects and add AppRefId_AppId property where needed
    applicationParsedData.AppId = AppId
    
    buildingDetailPayload = buildingParsedData?.map(detail => ({
      ...detail,
      AppRefId_AppId: AppId,
    }));
    
    accountParsedData.AppRefId_AppId = AppId;    

    consentDetailPayload = consentParsedData.map(consent => ({
      ...consent,
      AppRefId_AppId: AppId
    }));    
    
    // Insert the applicationParsedData into the ApplicationDetail table using a transactional query
    applicationDetailResult = await tx.run(INSERT.into(entity?.ApplicationDetail).entries(applicationParsedData));

    // Insert the buildingDetailPayload into the BuildingDetails table using a transactional query
    buildingDetailResult = await tx.run(INSERT.into(entity?.BuildingDetail).entries(buildingDetailPayload));

    // Insert accountParsedData into the AccountDetail table using a transactional query
    acccountDetailResult = await tx.run(INSERT.into(entity?.AccountDetail).entries(accountParsedData));

    // Insert the consentDetailPayload into the ApplicationConsent table using a transactional query
    consentDetailResult = await tx.run(INSERT.into(entity?.ApplicationConsent).entries(consentDetailPayload));
      
    // Check if results were returned for all queries: ApplicationDetail, BuildingDetail, AccountDetail, and ApplicationConsent
    if((applicationDetailResult?.results?.length > 0) && (buildingDetailResult?.results?.length > 0)
    && (acccountDetailResult?.results?.length > 0) && (consentDetailResult?.results?.length > 0))
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