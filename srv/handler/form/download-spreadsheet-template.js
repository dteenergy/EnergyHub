const cds = require('@sap/cds');

/**
 * Download landlord spreadsheet template
 * @param {Request} req 
 * @returns {object}  
 */
const downloadSpreadsheetTemplate = async (req) => {
    try {
        const {Attachment} = cds.entities;

        // get spreadsheet template 
        const templateFile = await SELECT.one.from(Attachment);
        console.log(templateFile, Attachment);
        

        return {
            'statusCode' : '200',
            'file' : templateFile
          }
    } catch (error) {
        req.error({
            'statusCode' : '500',
            'message' : error.message
          });
    }
}

module.exports = {
    downloadSpreadsheetTemplate
}