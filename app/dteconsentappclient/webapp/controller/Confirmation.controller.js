sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("dteconsentappclient.controller.Confirmation", {
        onInit() {
             // Access the router of this page and calling the function to get parameter data
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("Confirmation").attachPatternMatched(this.getParams, this);
          
        },

         /**
         * Callback function to get the navigation parameter
         * @param {object} oEvent
         */
         getParams: function (oEvent) {
          
         const { StatusCode, Message } = oEvent.getParameter("arguments");
            console.log(StatusCode, Message);
            
        // Set the JSONModel with the correct name
        const oConfirmationMessageModel = new JSONModel({Message});
        this.getView().setModel(oConfirmationMessageModel, "oConfirmationMessageModel");
         }
    });
});