const fs = require('fs');
const path = require('path');

/**
 * Download landlord spreadsheet template
 * @param {Request} req 
 * @returns {object}  
 */
const downloadSpreadsheetTemplate = async (req) => {
    try {
        // Read spreadsheet template 
        const filePath = path.join(__dirname,'../../template/Data.xlsx');
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
    downloadSpreadsheetTemplate
}