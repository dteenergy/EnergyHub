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

      // Handle the logout
      handleLogout : async function (){
        console.log("Handle Logout");
        
      }

  });
});