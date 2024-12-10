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
    const { ApplicationDetail, BuildingDetail, AccountDetail, ConsentDetail } = req?.data;
    
    // Parse the String ApplicationDetail
    let applicationParsedData = JSON.parse(ApplicationDetail);
    
    // Parse the String BuildingDetail
    let buildingParsedData = JSON.parse(BuildingDetail);
    
    // Check the Object contains the Valid data.
    const buildingParsedDataCheck = buildingParsedData?.some(e => 
      Object.values(e).includes("")
    ) ? [] : 'Building Details Contains the Valid data';

    // Parse the String AccountDetail
    let accountParsedData = JSON.parse(AccountDetail);

    // Parse the String ConsentDetail
    let consentParsedData = JSON.parse(ConsentDetail);
    let consentDetailPayload;
    
    // Condition to check whether the JSON object/arrays contain value or not
    if((Object.keys(applicationParsedData)?.length === 0) || (buildingParsedData?.length === 0) || 
    (buildingParsedDataCheck?.length === 0) || (Object.keys(accountParsedData)?.length === 0) || (consentParsedData?.length === 0))  
    return { 'status': 400, 'message': 'The data is invalid. Please review and correct the erroneous fields' }

    // Set AppId to applicationParsedData
    applicationParsedData.AppId = AppId

    // Add AppRefId_AppId to each building entry in buildingParsedData
    const buildingDetailPayload = buildingParsedData?.map(detail => ({
      ...detail,
      AppRefId_AppId: AppId,
    }));

    // Assign the value of AppId to the AppRefId_AppId property of accountParsedData
    accountParsedData.AppRefId_AppId = AppId;    

    // Add AppRefId_AppId to each consent entry in consentParsedData
    consentDetailPayload = consentParsedData.map(consent => ({
      ...consent,
      AppRefId_AppId: AppId
    }));    

    // Insert the applicationParsedData into the ApplicationDetail table using a transactional query
    let appDetailResult = await tx.run(INSERT.into(entity?.ApplicationDetail).entries(applicationParsedData));

    // Insert the buildingDetailPayload into the BuildingDetails table using a transactional query
    let buildingDetailResult = await tx.run(
      INSERT.into(entity?.BuildingDetail)
        .entries(buildingDetailPayload)
    );

    // Insert accountParsedData into the AccountDetail table using a transactional query
    let acccountDetailResult = await tx.run(INSERT.into(entity?.AccountDetail).entries(accountParsedData));

    // Insert the consentDetailPayload into the ApplicationConsent table using a transactional query
    let consentDetailResult = await tx.run(INSERT.into(entity?.ApplicationConsent).entries(consentDetailPayload));
      
    // Check if results were returned for all queries: ApplicationDetail, BuildingDetail, AccountDetail, and ApplicationConsent
    if((appDetailResult?.results?.length > 0) && (buildingDetailResult?.results?.length > 0)
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