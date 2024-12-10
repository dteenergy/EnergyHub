sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("dteconsentappclient.controller.App", {
      onInit() {
        const oSocialMediaModel = new JSONModel({
          sMediaDetails: [
            {'path': 'images/Facebook.png', 'alt':'Facebook', 'src':''},
            {'path': 'images/X-Twitter.png', 'alt':'X-Twitter', 'src':''},
            {'path': 'images/Instagram.png', 'alt':'Instagram', 'src':''},
            {'path': 'images/YouTube.png', 'alt':'Youtube', 'src':''},
            {'path': 'images/LinkedIn.png', 'alt':'LinkedIn', 'src':'https://en.wikipedia.org/wiki/Heello'}
          ]
        });

        this.getView().setModel(oSocialMediaModel, 'socialMediaModel')
        
      },

      onSocialMedia: function(oEvent){
        const mediaDetails = this.getView().getModel('socialMediaModel').getData();
        
        const salt = oEvent.getSource().getAlt();
        const filteredData = mediaDetails?.sMediaDetails.filter((mediaDetail)=> mediaDetail.alt === salt);
        
        window.open(filteredData[0]['src'], '_blank');
      }
  });
});