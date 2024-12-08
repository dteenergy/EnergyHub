sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("dteconsentappclient.controller.App", {
      onInit() {
        const oSocialMediaModel = new JSONModel({
          sMediaDetails: [
            {'path': 'images/Facebook.png', alt:'Facebook'},
            {'path': 'images/X-Twitter.png', alt:'X-Twitter'},
            {'path': 'images/Instagram.png', alt:'Instagram'},
            {'path': 'images/YouTube.png', alt:'Youtube'},
            {'path': 'images/LinkedIn.png', alt:'LinkedIn'}
          ]
        });

        this.getView().setModel(oSocialMediaModel, 'socialMediaModel')
        
      }
  });
});