sap.ui.define([
  "dteenergyadminportal/controller/BaseController"
], (BaseController) => {
  "use strict";

  return BaseController.extend("dteenergyadminportal.controller.App", {
      onInit() {
      },

      // Handle the AvatarPress
      handleAvatarPress:function (oEvent){
        const oButton = oEvent.getSource();
        
        // Find the menu by its ID and open it relative to the avatar button
        const oMenu = this.byId('idAvatarMenu');
        oMenu.openBy(oButton);
      },

      /**
      * Handles the logout process.
      * Redirects the user to the application's logout endpoint.
      *
      * This function dynamically constructs the application URL prefix based on the current
      * window location and appends the "/do/logout" path to log the user out.
      *
      * @returns {Promise<void>} - A promise that resolves after the redirection to the logout URL.
      */
      handleLogout : async function (){
        // Get the origin of the current window (protocol + host)
        const origin = window.location.origin;

        // Get the first part of the path (app name)
        const pathName = window.location.pathname.split("/")[1];
      
        // Construct the application prefix URL

        const appPrefix = origin + "/" + pathName;

        // Redirect to the logout URL
        window.location.href = appPrefix + "/admin/do/logout"; 
      }

  });
});