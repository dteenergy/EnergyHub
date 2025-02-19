const { valueDecrypt } = require("../../utils/encrypt-and-decrypt-id");

/**
 * Validate the Application Id
 * @param {object} req 
 * @param {entity} entity 
 * @returns {object} props => statusCode and message
 */
const validateApplicationId = async (req, entity) => {
	try {
		// Get the encrypted app id
		const encrAppId = req?._.req?.query?.encrAppId;

		// Decrypt the AppId
		const decryptedAppId = await valueDecrypt(encrAppId);

		if(!decryptedAppId) return decryptedAppId;
		
		// Fetch the application details by AppId and select only the AppId column
		const applicationDetail = await SELECT.from(entity.ApplicationDetail).where({ 'AppId': decryptedAppId }).columns(['AppId']);

		// If applicationDetail result is empty
		if (applicationDetail?.length === 0) throw { statusCode: 404, message: 'Application Detail not found for the Id' }

		return { statusCode: 200, message: 'Application Details are available.' }
	} catch(e){
		if(e.statusCode) {
			return {statusCode : e.statusCode, message: e.message}
		} else {
			return {statusCode: 500, message: e.message}
		}
	}
    
}

module.exports = validateApplicationId;