const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

const sharepoint = require('../../utils/sharepoint-api');
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
    
    // Array empty validation
    if(BuildingDetail.length === 0) return {statusCode :'400', message:'At least one BuildingDetail is required.'}
    
    //Avoid too many consent detail creation request.
    if(Array.isArray(ConsentDetail)) return {statusCode :'400', message:'Too many consent details'};

    // Generate Application number
    const applicationNumber = await generateAppNumber(entity);
    ApplicationDetail.ApplicationNumber = applicationNumber;

     //Upload attachment to sharepoint
    if(Attachment && Attachment.fileContent){
      Attachment.fileName = `${applicationNumber}-${Attachment.fileName}`; //Append application to file name
      const response = await sharepoint.uploadFile(Attachment);
      ApplicationDetail.AttachmentURL = response.ServerRelativeUrl; // insert attachment loaction in Application Detail entity
    }

    // Assign AppId to Application Detail, Building Detail, Account Detail and Application Consent 
    const AppId = uuidv4();

    ApplicationDetail.AppId = AppId;
    BuildingDetail?.map(detail => detail.AppRefId_AppId = AppId);
    AccountDetail.AppRefId_AppId = AppId;
    ConsentDetail.AppRefId_AppId = AppId;
    ConsentDetail.ConsentByTenantFlag = false;
      
    // Insert Enrollment Form details to database
    const applicationDetailResult = await tx.run(INSERT.into(entity?.ApplicationDetail).entries(ApplicationDetail));
    const buildingDetailResult = await tx.run(INSERT.into(entity?.BuildingDetail).entries(BuildingDetail));
    const accountDetailResult = await tx.run(INSERT.into(entity?.AccountDetail).entries(AccountDetail));
    const consentDetailResult = await tx.run(INSERT.into(entity?.ApplicationConsent).entries(ConsentDetail));

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