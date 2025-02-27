// This file contains Sharepoint APIs
const cdsTypes = require('@sap/cds');
const axios = require('axios');
const FormData = require('form-data');

//Sharepoint Config detail
const spConfig = {
    tenantId :  process.env.SP_TENENT_ID,
    clientId :`${process.env.SP_CLIENT_ID}@${process.env.SP_TENENT_ID}`,
    clientSecret : process.env.SP_CLIENT_SECRET,
    domain : process.env.SP_DOMAIN,
    resource : `${process.env.SP_RESOURCE_ID}/${process.env.SP_DOMAIN }@${process.env.SP_TENENT_ID}`,
    site : process.env.SP_SITE,
    folderPath : `${process.env.SP_SITE}/${process.env.SP_SITE_CONTENT_LIST}/${process.env.SP_FOLDER_NAME}`
};

console.log(JSON.stringify(spConfig));

/**
 * Get Sharepoint API access token
 * @returns {Object} token
 */
const getAccessToken = async () => {
    try {
        //Request Body
        const data = new FormData();
        data.append('grant_type', 'client_credentials');
        data.append('client_id', spConfig.clientId);
        data.append('client_secret', spConfig.clientSecret);
        data.append('resource', spConfig.resource);

        //HTTP request config
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://accounts.accesscontrol.windows.net/${spConfig.tenantId}/tokens/OAuth/2/`,
            headers: {
                ...data.getHeaders()
            },
            data: data
        };
    
        // Call sharepoint OAuth API to get access token
        const response = await axios.request(config)

        return response.data;
    } catch (error) {
        console.error("Sharepoint Get Access Token Error:", error.message);
        throw (error);
    }
}

/**
 * Upload file to Sharepoint
 * @param {object} attachment
 * @returns {object}
 */
const uploadFile = async (attachment) => {
    try {        
        //Get access token
        const {token_type, access_token} = await getAccessToken();

        // Convert base64 to buffer
        const data = Buffer.from(attachment.fileContent,'base64');

        // Http request config
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://${spConfig.domain}${spConfig.site}/_api/web/GetFolderByServerRelativePath(decodedurl='${spConfig.folderPath}')/Files/add(url='${attachment.fileName}', overwrite=true)`,
            headers: {
                'Authorization': `${token_type} ${access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            },
            data: data
        };
        
        //Call sharepoint file upload API
        const response = await axios.request(config)

        return response.data
    } catch (error) {
        console.error("Sharepoint File Upload Error:", error.message);
        throw (error);
    }
}

module.exports = {
    getAccessToken,
    uploadFile
}


