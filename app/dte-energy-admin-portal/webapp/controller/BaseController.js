sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/base/util/UriParameters",
    "sap/m/MessageBox"
], function (Controller, UriParameters, MessageBox) {
  "use strict";

  return Controller.extend("dteenergyadminportal.controller.BaseController", {
    /**
     * Determines the API configuration based on the current environment.
     * @returns {object} An object containing the API url and headers.
     */
    getApiConfig: function() {
      // Get router configuration from manifest
      const oConfig = this.getOwnerComponent().getManifestEntry("/sap.ui5/config/routerConfig");
      const sHostname = window.location.hostname;
      
      // Check if running in Business Application Studio
      const bIsBAS = sHostname.includes("applicationstudio.cloud.sap");
      
      /**
       * Determine if running in a local environment
       * Set bIsLocal as true, if the hostname is localhost, or in BAS, or 'local=true' in URL parameters
       */
      const bIsLocal = sHostname === "localhost" || bIsBAS || UriParameters.fromQuery(window.location.search).get("local") === "true";
      
      if (bIsLocal) {
          // Return local API configuration
          return {
              url: oConfig.localApi.uri
          };
      } else {
          /**
           * Return production API configuration
           * Use the base path from the manifest for the URL
           */
          return {
              url: this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path,
              headers: {}
          };
      }
    },
    /**
    * Handles error and display it to users
    * @param {Error} error 
    */
    errorHandler : function (error) {
      
      let errorCode = 500;
      let errorMessage = error.message;
        
      // If error send from authentication server
      if(typeof(error?.response?.data) === 'string') {
        errorCode = error.response.status;
        errorMessage =error.response.data;
      } else if(error?.response){                // If error send from server
        const errorResponse = error.response.data;
        const errorResponseType = Object?.keys(errorResponse)[0];
        
        errorCode = error.response.status;
        errorMessage =`${errorResponseType}: ${errorResponse[errorResponseType]}`;
      }

      MessageBox.error(`${errorCode}, ${errorMessage}`);
    },
    // Get environment variable
    GetEnvironmentVariables: async function(){
      try{
        const {url} = this.getApiConfig();

        // construct the url to get the environment variables
        const urlToGetEnvironmentVariables = url + 'admin/service/GetEnvironmentVariables';

        const response = await axios.get(urlToGetEnvironmentVariables);

        return response?.data?.value;
      }catch(err){
        this.errorHandler(err);
      }
    }
  }); 
});