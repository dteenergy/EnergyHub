const axios = require('axios');
const xsenv = require('@sap/xsenv');

// Load environment variables
xsenv.loadEnv();

// Retrieve the destination service configuration
const services = xsenv.getServices({'destination':'dteConsentAppPortal-destination-service'});

/**
 * To get the access token
 * @returns {String} access token
 */
const getAccessToken = async () => {
  try {
    
    // Make a POST request to obtain the access token
    const {data} = await axios.post(
      `${services.destination.url}/oauth/token`,

      // Pass the required parameters in the body of the request
      new URLSearchParams({
        'grant_type':'client_credentials',
        'client_id':services.destination.clientid,
        'client_secret':services.destination.clientsecret
      }).toString(),

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

/**
 * Fetch destinations from the subaccount using destination service rest API
 * @param {string} accessToken - The access token for authorization
 * @returns {Array<object>} Destination details
 */
const getDestinations = async (accessToken) => {
  try {
    // Determine the destination sevice Rest API to fetch destinations available in the subaccount
    const endpoint =`${services.destination.uri}/destination-configuration/v1/subaccountDestinations/sap_process_automation_mail`;

    // Make a GET request with the access token in headers
    const destinationsResponse = await axios.get(
      endpoint,
      {
        'headers':{
          'Authorization':`Bearer ${accessToken}`
        }
      }
    );

    // Return the destination details from the response
    return destinationsResponse.data;
  } catch (error) {
    console.log(error);
    
    // Throw an error with the response data if available, otherwise the error message
    throw error.response ? error.response.data : error;
  }
};

// Export the functions for use in other modules
module.exports = {getAccessToken, getDestinations};