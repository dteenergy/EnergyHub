const axios = require('axios');
const xsenv = require('@sap/xsenv');

// Load environment variables
xsenv.loadEnv();
let service;

/**
 * To get the access token
 * @returns {String} access token
 */
const getDestinationServiceAccessToken = async () => {
  try {

    service = xsenv.getServices({'destination':'dteConsentAppPortal-destination-service'});
    
    // Make a POST request to obtain the access token
    const {data} = await axios.post(
      `${service.destination.url}/oauth/token`,

      // Pass the required parameters in the body of the request
      new URLSearchParams({
        'grant_type':'client_credentials',
        'client_id':service.destination.clientid,
        'client_secret':service.destination.clientsecret
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

    throw error;
  }
};

/**
 * Fetch destinations from the subaccount using destination service rest API
 * @param {string} accessToken - The access token for authorization
 * @returns {object} Destination details
 */
const getDestination = async (accessToken) => {
  try {
    // Determine the destination sevice Rest API to fetch destinations available in the subaccount
    const endpoint =`${service.destination.uri}/destination-configuration/v1/subaccountDestinations/sap_process_automation_mail`;

    // Make a GET request with the access token
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
    
    throw error;
  }
};

// Export the functions for use in other modules
module.exports = {getDestinationServiceAccessToken, getDestination};