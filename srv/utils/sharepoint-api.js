// This file contains Sharepoint APIs
const axios = require('axios');
const FormData = require('form-data');

const getAccessToken = async () => {
    try {
       
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://accounts.accesscontrol.windows.net/8e61d5fe-7749-4e76-88ee-6d8799ae8143/tokens/OAuth/2/',
            headers: {
                // 'Cookie': 'esctx=PAQABBwEAAABVrSpeuWamRam2jAF1XRQErpxuVR_f9h0-tECnUvA-uWKQYbuNuaHiQEeeptk785U7IeVCDnkY8U-7btMaSdC1_nQveJZI03C6DK0R6uOCBjhlrbHAIksS17fg4SupMfGWNa-b1VQ55RwI3Lh_bpjn3O5mKwMJ_a2uL4cxDf1n5Me5y8o2g4qU28dBEHRhRB4gAA; fpc=Apjsce9O8bRFrWA4m2W6O_4xGIqcAQAAABdCRt8OAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd',
                ...data.getHeaders()
            },
            data: data
        };

        const response = await axios.request(config)

        return response.data;
    } catch (error) {
        console.error("Sharepoint Get Access Token Error:", error.message);
        throw (error);
    }
}

/**
 * 
 * @param {*} fileContent 
 * @param {*} fileName 
 * @returns 
 */
const uploadFile = async (fileContent, fileName) => {
    try {

        const {token_type, access_token} = await getAccessToken();

        const data = Buffer.from(fileContent,'base64');

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://dteenergy.sharepoint.com/sites/kosha/_api/web/GetFolderByServerRelativePath(decodedurl=\'/sites/kosha/Shared%20Documents/Test\')/Files/add(url='${fileName}', overwrite=true)`,
            headers: {
                'Authorization': `${token_type} ${access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            },
            data: data
        };

        console.log(config);
        

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


