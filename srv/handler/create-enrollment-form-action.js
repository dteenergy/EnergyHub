const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

const sharepoint = require('../utils/sharepoint-api');
const { emptyField } = require("./regex-and-error-message");


/**
 * Function: Create the Enrollment form details
 * req => Object 
 * entity => function
 * tx => function
 */
const createEnrollmentFormDetail = async (req, entity, tx) => {

  try {
    const { ApplicationDetail, BuildingDetail, AccountDetail, ConsentDetail, Attachment } = req?.data;
    
    // Get the flag and prefix for the application number from environment variables
    const prefixFlag = process.env.APPNUM_PREFIX_ENABLED;
    const appNumPrefix = process.env.APPNUM_PREFIX;
 
    // Define the base query
    let query = SELECT.from(entity.ApplicationDetail)
      .columns('ApplicationNumber')
      .orderBy('ApplicationNumber desc')
      .limit(1);
    
    // Add a condition for the prefix if prefixFlag is "Y"
    if (prefixFlag === "Y" && appNumPrefix) {
      query = query.where({ ApplicationNumber: { like: `${appNumPrefix}%` } });
    }
    
    // Fetch the last ApplicationNumber based on the query
    const applicationDetail = await cds.run(query);
 
    // Store the application number
    let applicationNumber;
    
    // Check if the recent application number exists
    if (applicationDetail?.length > 0) {
      const lastAppNumber = applicationDetail[0]?.ApplicationNumber;
    
      // Extract the numeric part by removing the prefix
      const numericPart = lastAppNumber.replace(appNumPrefix, "");
      const parsedNumber = parseInt(numericPart, 10) || 0;
    
      // Increment the numeric part
      const incrementedNumber = parsedNumber + 1;
    
      // Pad the incremented number with leading zeros
      const incrementedNumberStr = incrementedNumber.toString().padStart(numericPart.length, '0');
    
      // Generate the new application number with or without prefix
      applicationNumber = prefixFlag === 'Y' ? appNumPrefix.concat(incrementedNumberStr) : incrementedNumberStr;
    } else {
      // If no previous application number, start from 1 with or without the prefix
      const incrementedNumberStr = '000000001';
      applicationNumber = prefixFlag === 'Y' ? appNumPrefix.concat(incrementedNumberStr) : incrementedNumberStr;
    }

    //Upload to sharepoint
    const response = await sharepoint.uploadFile(Attachment, `${applicationNumber}.xlsx`);

    console.log('Sharepoint', response);
    

    // Generate a unique AppId using uuid
    const AppId = uuidv4();

    // Parse the String Payload
    const applicationParsedData = JSON.parse(ApplicationDetail);
    const buildingParsedData = JSON.parse(BuildingDetail);
    const accountParsedData = JSON.parse(AccountDetail);
    const consentParsedData = JSON.parse(ConsentDetail);

    const excludedFields = ['AddrLineTwo'];

    // Check the building details fields contains the empty value
    const buildingDetailFieldCheck = buildingParsedData?.map(buildingDetail => {
      return Object.keys(buildingDetail).filter(key => !excludedFields.includes(key)).some(key => buildingDetail[key] === "");
    });

    if ((Object.keys(applicationParsedData)?.length === 0) || (buildingParsedData?.length === 0) ||
      (buildingDetailFieldCheck.includes(true)) || (Object.keys(accountParsedData)?.length === 0) || (consentParsedData?.length === 0))
      return { 'statusCode': 400, 'message': emptyField?.message }

    // Assign AppId to Application Detail, Building Detail, Account Detail and Application Consent 
    applicationParsedData.AppId = AppId;
    applicationParsedData.ApplicationNumber = applicationNumber;
    buildingParsedData?.map(detail => detail.AppRefId_AppId = AppId);
    accountParsedData.AppRefId_AppId = AppId;
    consentParsedData.map(consent => {
      consent.AppRefId_AppId = AppId;
      consent.ConsentByTenantFlag = false;
      return consent;
    });

    // Insert Enrollment Form details to database
    const applicationDetailResult = await tx.run(INSERT.into(entity?.ApplicationDetail).entries(applicationParsedData));
    const buildingDetailResult = await tx.run(INSERT.into(entity?.BuildingDetail).entries(buildingParsedData));
    const accountDetailResult = await tx.run(INSERT.into(entity?.AccountDetail).entries(accountParsedData));
    const consentDetailResult = await tx.run(INSERT.into(entity?.ApplicationConsent).entries(consentParsedData));

    // Check Enrollment Form Details inserted successfully.
    if ((applicationDetailResult?.results?.length > 0) && (buildingDetailResult?.results?.length > 0)
      && (accountDetailResult?.results?.length > 0) && (consentDetailResult?.results?.length > 0))
      return { statusCode: 200, message: "Thank you! Your DTE Energy Data Hub enrollment is confirmed. " };

  } catch (error) {
    console.log("Enrollment Form Creation Error :", error);
    return {
      statusCode: 500,
      message: error.message
    };
  }
};

module.exports = createEnrollmentFormDetail;