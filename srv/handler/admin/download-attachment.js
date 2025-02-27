const cds = require('@sap/cds');

const sharepoint = require('../../utils/sharepoint-api')

/**
 * Download Attachment Method
 * @param {Request} req 
 * @returns {object}
 */
const downloadAttachment = async(req) =>{
    try {
      const {AppId} = req.params[0];
      const {ApplicationDetail} = cds.entities;

      // Get attachment URL for a application
      const [result] = await SELECT.from(ApplicationDetail).where({ 'AppId': AppId }).columns(['AttachmentURL']);
      if(!result?.AttachmentURL) throw ('Unexcepted Error');
      
      // Get file from sharepoint folder
      const file = await sharepoint.getFile(result.AttachmentURL);

      return ({statusCode: '200', file });
    } catch (error) {
      return({statusCode:500, message:error?.message})
    }
  }

module.exports = {
  downloadAttachment
}