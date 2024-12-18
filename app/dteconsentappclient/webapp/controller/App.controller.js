sap.ui.define([
  "dteconsentappclient/controller/BaseController",
  "sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("dteconsentappclient.controller.App", {
      onInit() {
        const oSocialMediaModel = new JSONModel({
          sMediaDetails: [
            {'path': 'images/Facebook.png', 'alt':'Facebook', 'src':'https://www.facebook.com/dteenergy'},
            {'path': 'images/X-Twitter.png', 'alt':'X-Twitter', 'src':'https://x.com/dte_energy'},
            {'path': 'images/Instagram.png', 'alt':'Instagram', 'src':'https://www.instagram.com/dte_energy_official/'},
            {'path': 'images/YouTube.png', 'alt':'Youtube', 'src':'https://www.youtube.com/user/DTEEnergyCompany'},
            {'path': 'images/LinkedIn.png', 'alt':'LinkedIn', 'src':'https://www.linkedin.com/company/dte-energy'}
          ]
        });

        this.getView().setModel(oSocialMediaModel, 'socialMediaModel')
        
      },
  });
});