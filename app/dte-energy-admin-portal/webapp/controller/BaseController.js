sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/base/util/UriParameters",
    "sap/m/MessageBox"
], function (Controller, UriParameters, MessageBox) {
  "use strict";

  return Controller.extend("dteenergyadminportal.controller.BaseController", {
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
  });
});