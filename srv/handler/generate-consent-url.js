const { valueEncrypt } = require("./encrypt-and-decrypt-id");

/**
 * Method to generate the consent url with the encrypted appId
 * @param {String} appId 
 * @returns {String} consentEncrLink
 */
const generateConsentUrl = async(appId, ApplicationDetail) =>{
    // Get the Consent Service URL
    const url = process.env.TENANT_CONSENT_FORM_URL;
    if(appId === "") throw {message: 'Application ID is required', code: 400};
        
    // Get the application detail
    const appDetail = await SELECT.from(ApplicationDetail).columns('AppId').where({'AppId': appId});
    
    // If the length is empty
    if(appDetail.length === 0) throw {message:'Application Details for this Id is not found. Invalid Application ID', code:400}

    // Encrypt the appid
    const encrAppId = await valueEncrypt(appId);

    // Update the consent url with the encrypted id.
    const consentFormLink = url+encrAppId;

    return consentFormLink;    
}

module.exports = {
    generateConsentUrl
}