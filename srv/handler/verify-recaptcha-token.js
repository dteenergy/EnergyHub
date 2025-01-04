const { message } = require("@sap/cds/lib/log/cds-error");
const axios = require('axios');

const verifyRecaptchaToken = async (token) =>{
    try{
        console.log("Function");
        
        if(token === "") throw { message: 'Token is required', code:400 };
        const verifyToken = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.GOOGLE_RECAPTCHA_SECURITYKEY,
                response: token
            }
        });
        if (verifyToken.data.success) {
            return { message: true, statusCode: 200 }; // Token is valid
        } else {
            return { message: false, statusCode: 200 }; // Token is invalid
        }
    }  catch (e) {
        console.log(e);
        
        if (e) {
          throw { statusCode: e?.statusCode, message: e?.message };
        }
        throw { statusCode: 500, message: 'Failed to generate the consent app url' }
      }
}

module.exports = {
    verifyRecaptchaToken
}