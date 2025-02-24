const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

const sharepoint = require('../../utils/sharepoint-api');
const { emptyField } = require("../../utils/regex-and-error-message");
const { generateAppNumber } = require('../../utils/generate-application-number');
const { entities } = require('@sap/cds');

/**
 * Create landlord Enrollment Form 
 * @param {Request} req 
 * @param {cds.entity} entity 
 * @param {cds.tx} tx 
 * @returns {object} Message
 */
const createEnrollmentFormDetail = async (req) => {

  try {
    // Initialize the transaction
    const tx = cds.tx(req);
    const entity = entities;

    const { ApplicationDetail, BuildingDetail, AccountDetail, ConsentDetail, Attachment } = req?.data;

    // Parse the String Payload
    const applicationParsedData = JSON.parse(ApplicationDetail);
    const buildingParsedData = JSON.parse(BuildingDetail);
    const accountParsedData = JSON.parse(AccountDetail);
    const consentParsedData = JSON.parse(ConsentDetail);

    // Generate Application number
    const applicationNumber = await generateAppNumber(entity);
    applicationParsedData.ApplicationNumber = applicationNumber;

     //Upload to sharepoint
    if(Attachment){
      const response = await sharepoint.uploadFile(Attachment, `${applicationNumber}.xlsx`);
      applicationParsedData.AttachmentURL = response.ServerRelativeUrl;
    }

    // Check the building details fields contains the empty value
    const excludedFields = ['AddrLineTwo'];

    const buildingDetailFieldCheck = buildingParsedData?.map(buildingDetail => {
      return Object.keys(buildingDetail)
        .filter(key => !excludedFields.includes(key))
        .some(key => buildingDetail[key] === "");
    });

    const isEmpty = (Object.keys(applicationParsedData)?.length === 0) || (buildingParsedData?.length === 0) ||
      (buildingDetailFieldCheck.includes(true)) || (Object.keys(accountParsedData)?.length === 0) ||
      (consentParsedData?.length === 0);
    if (isEmpty) return { 'statusCode': 400, 'message': emptyField?.message };

    // Assign AppId to Application Detail, Building Detail, Account Detail and Application Consent 
    const AppId = uuidv4();

    applicationParsedData.AppId = AppId;
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
    const isInsertSuccessfull = (applicationDetailResult?.results?.length > 0) && (buildingDetailResult?.results?.length > 0) &&
      (accountDetailResult?.results?.length > 0) && (consentDetailResult?.results?.length > 0)
    if (isInsertSuccessfull) return { "statusCode": 200, "message": "Thank you! Your DTE Energy Data Hub enrollment is confirmed.", "applicationNumber": applicationNumber};

  } catch (error) {
    console.log("Enrollment Form Creation Error :", error);
    return {
      statusCode: 500,
      message: error.message
    };
  }
};

module.exports = createEnrollmentFormDetail;