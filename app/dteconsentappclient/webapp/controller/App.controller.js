sap.ui.define([
  "dteconsentappclient/controller/BaseController",
  "sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("dteconsentappclient.controller.App", {
      onInit() {
      },

      // Header logo press event
      onLogoPress: function(){
        // Open the link in the new tab
        window.open("https://www.dteenergy.com/", '_blank');
      }
  });
});