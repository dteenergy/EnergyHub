// This file contains Sharepoint APIs
const axios = require('axios');
const FormData = require('form-data');

//Sharepoint Config detail
const spClientID = process.env.SP_CLIENT_ID;
const spClientSecret = process.env.SP_CLIENT_SECRET;
const spTenantID =  process.env.SP_TENENT_ID
const spDomain = process.env.SP_DOMAIN 
const spresource = process.env.SP_RESOURCE;
const spFolderPath = process.env.SP_FOLDER_PATH;

/**
 * Get Sharepoint API access token
 * @returns {object} token
 */
const getAccessToken = async () => {
    try {
        //Request Body
        const data = new FormData();
        data.append('grant_type', 'client_credentials');
        data.append('client_id', spClientID);
        data.append('client_secret', spClientSecret);
        data.append('resource', spresource);

        //HTTP request config
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://accounts.accesscontrol.windows.net/${spTenantID}/tokens/OAuth/2/`,
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
 * @param {String} fileContent File Content Bas464
 * @param {String} fileName File Name
 * @returns {object}
 */
const uploadFile = async (fileContent, fileName) => {
    try {

        //Get access token
        const {token_type, access_token} = await getAccessToken();

        // Convert base64 to buffer
        const data = Buffer.from(fileContent,'base64');

        // Http request config
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://${spDomain}/sites/kosha/_api/web/GetFolderByServerRelativePath(decodedurl='${spFolderPath}')/Files/add(url='${fileName}', overwrite=true)`,
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


