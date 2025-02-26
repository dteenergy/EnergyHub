const cds = require('@sap/cds');

const sharepoint = require('../../utils/sharepoint-api')

const downloadAttachment = async(req) =>{
    try {
      const {AppId} = req.params[0];
      const {ApplicationDetail} = cds.entities;

      // Get attachment URL for a application
      const [result] = await SELECT.from(ApplicationDetail).where({ 'AppId': AppId }).columns(['AttachmentURL']);
      if(!result?.AttachmentURL) throw ('Unexcepted Error');

      // Get file from sharepoint folder
      const response = await sharepoint.getFile(result.AttachmentURL);

      return ({statusCode: '200', message:response});
    } catch (error) {
      return({statusCode:500, message:error?.message})
    }
  }

module.exports = {
  downloadAttachment
}