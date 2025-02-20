const fs = require('fs');
const path = require('path');

/**
 * Download landlord location spreadsheet template
 * @param {Request} req 
 * @returns {object}  
 */
const downloadLocationXSLTemplate = async (req) => {
    try {
        // Read location template spreadsheet
        const filePath = path.join(__dirname,'../../template/Location.xlsx');
        const templateFileContent = await fs.readFileSync(filePath,{encoding:'base64url'});

        return {
            'statusCode' : '200',
            'file' : templateFileContent
          }
    } catch (error) {
        return {
            'statusCode' : '500',
            'message' : error.message
          }
    }
}

module.exports = {
    downloadLocationXSLTemplate
}