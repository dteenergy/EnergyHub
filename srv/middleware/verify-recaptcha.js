const axios= require('axios');

/**
 * To verify reCAPTCHA token
 * @param {Request} req 
 * @param {Response} res
 * @param {Function} next
 * @returns {void} proceed to the next function
 * 
 * @throws {Error} Returns error for verification failed or unexpected error
 */
const verifyReCAPTCHA = async (req, res, next) => {
  
  // List of paths that should pypass the reCAPTCHA verification process
  const excludePaths = ["/service/getEnvironmentVariables", "/service/validateApplicationId", "/service/DownloadSpreadsheetTemplate", "/service/CreateEnrollmentFormDetail"];
  
  const originalUrl = req.originalUrl;
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

  try{

    /**
     * Checks the request route is in excluded list OR the request is not for the form service,
     * If it is, it should pypass the recaptcha verification.
     * */
    if(!originalUrl.startsWith("/service") || excludePaths.includes(originalUrl.split("?")[0])) return next();
    
    const recaptchaToken = req.get("X-Recaptcha-Token");

    if(!recaptchaToken) return res.status(403).json({"message": "Forbidden"});
    
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;

    // Request to reCATCHA server to verify the user response.
    const response = await axios.post(url);
    
    if(!response.data?.success) return res.status(403).json({"message":"ReCAPTCHA verification failed"});
    next();
  
  } catch(err){
    res.status(500).json({"message":"Internal server error"});
  }
};

module.exports = {verifyReCAPTCHA};