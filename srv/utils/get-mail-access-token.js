const axios = require('axios');

/**
 * To get the access token
 * @returns {String} access token
 */
const getMailAccessToken = async (tokenUrl, clientId, clientSecret, scope) => {
  try {
    
    // Make a POST request to obtain the access token
    const {data} = await axios.post(
      tokenUrl,
      // Pass the required parameters in the body of the request
      new URLSearchParams({
        'grant_type':'client_credentials',
        'client_id': clientId,
        'client_secret': clientSecret,
        // 'scope':scope
        'scope': "https://outlook.office365.com/.default"
      }),

      {
        'headers':{
          'Content-Type':'application/x-www-form-urlencoded'
        }
      }
    );
    
    // Return the access token
    return data.access_token;
  } catch (error) {
    console.log(error);
    
    // Throw an error with the response data if available, otherwise the error message
    throw error?.response ? error.response.data : error;
  }
};

module.exports = {getMailAccessToken};