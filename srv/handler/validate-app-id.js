const { valueDecrypt } = require("./encrypt-and-decrypt-id");

const validateApplicationId = async(req, entity) => {
    // Get the encrypted app id
	const encrAppId = req?._.req?.query?.encrAppId;

    // Decrypt the AppId
	const decryptedAppId = await valueDecrypt(encrAppId);

	// Fetch the application details by AppId and select only the AppId column
	const applicationDetail = await SELECT.from(entity.ApplicationDetail).where({ 'AppId': decryptedAppId }).columns(['AppId']);

    // If applicationDetail result is empty
	if (applicationDetail?.length === 0) throw { status: 404, message: 'Application Detail not found for the Id' }
	
    return { status: 200, message: 'Application Details are available.' }
}

module.exports = validateApplicationId;