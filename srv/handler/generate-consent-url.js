const { valueEncrypt } = require("./encrypt-and-decrypt-id");

/**
 * Method to generate the consent url with the encrypted appId
 * @param {String} appId 
 * @returns {String} consentEncrLink
 */
const generateConsentUrl = async (appId, ApplicationDetail) => {
  try {
    // Check if the appId is empty or not
    if (appId === "") throw { message: 'Application ID is required', code: 400 };

    // Get the application detail
    const appDetail = await SELECT.from(ApplicationDetail).columns('AppId').where({ 'AppId': appId });

    // If the length is empty
    if (appDetail?.length === 0) throw { message: 'Application Details for this Id is not found. Invalid Application ID', code: 400 }

    // Encrypt the appid
    const encrAppId = await valueEncrypt(appId);

    return encrAppId;

  } catch (e) {
    if (e) {
      throw { code: e?.code, message: e?.message };
    }
    throw { code: 500, message: 'Failed to generate the consent app url' }
  }
}

module.exports = {
  generateConsentUrl
}