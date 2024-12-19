const { valueEncrypt } = require("./encrypt-and-decrypt-id");

const generateConsentUrl = async(appId) =>{
    // Get the Consent Service URL
    const url = process.env.CONSENT_APP_URL;
    if(appId === "") throw {message: 'AppId is empty', status: 400};
    
    // Encrypt the appid
    const encrAppId = await valueEncrypt(appId);

    // Update the consent url with the encrypted id.
    const updatedURL = url+encrAppId;

    return updatedURL;    
}

module.exports = {
    generateConsentUrl
}