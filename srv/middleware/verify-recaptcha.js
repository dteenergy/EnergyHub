const axios= require('axios');

/**
 * Verify recatcha token
 * @param {} Http request 
 * @returns {Boolean}
 * 
 * @throws {Error}
 */
const verifyRecaptcha = async (req) => {
  
  const excludePaths = ["/service/getEnvironmentVariables", "/service/validateApplicationId"];
  const originalUrl = req.originalUrl;
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
  
    try{
      
      if(originalUrl.startsWith('/service') && !excludePaths.includes(originalUrl.split("?")[0])){
        const recaptchaToken = req.get("X-Recaptcha-Token");

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;

        const response = await axios.post(url);
        
        return !response.data?.success;
      } else true;

    } catch(err){
        throw err;
    }
};

module.exports = {verifyRecaptcha};