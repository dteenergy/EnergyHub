// This file contains Sharepoint APIs
const axios = require('axios');
const FormData = require('form-data');

const malwareScanner = require('./malware-scanner');

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
 * Upload file to Sharepoint Folder
 * @param {object} attachment
 * @returns {object}
 */
const uploadFile = async (attachment) => {
    try {        
        //Get access token
        const {token_type, access_token} = await getAccessToken();

        // Convert base64 to buffer
        const data = Buffer.from(attachment.fileContent,'base64');

        await malwareScanner.scanfile(data.toString('binary'));


        // Http request config
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://${spConfig.domain}${spConfig.site}/_api/web/GetFolderByServerRelativePath(decodedurl='${spConfig.folderPath}')/Files/add(url='${attachment.fileName}', overwrite=true)`,
            headers: {
                'Authorization': `${token_type} ${access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/octet-stream'
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

/**
 * Get file from Sharepoint Folder
 * @param {String} attachmentURL
 * @returns {object} name, url => file
 */
const getFile = async (attachmentURL) => {
    try {        
        //Get access token
        const {token_type, access_token} = await getAccessToken();

        // Http request config
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            encoding: null,
            responseType: 'arraybuffer',
            url: `https://${spConfig.domain}${spConfig.site}/_api/web/GetFileByServerRelativePath(decodedurl='${attachmentURL}')/$value`,
            headers: {
                'Authorization': `${token_type} ${access_token}`,
                'Accept': 'application/json;odata=verbos',
                'Content-Type': 'application/octet-stream',
            }
        };
        
        // Call sharepoint's file API to retrive file
        const response = await axios.request(config);

        const fileBase64 = Buffer.from(response.data).toString('base64'); // Convert buffer into base64
        const fileURL = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileBase64}`; // Create file URL
        const fileName = `${attachmentURL}`.split('/').slice(-1)[0];  //Split file name

        return {
            name : fileName,
            url : fileURL
        };
    } catch (error) {
        console.error("Sharepoint Get File Error:", error.message);
        throw (error);
    }
}


module.exports = {
    getAccessToken,
    uploadFile,
    getFile
}


