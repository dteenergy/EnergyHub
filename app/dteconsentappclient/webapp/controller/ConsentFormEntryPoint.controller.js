sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView"
], (Controller, XMlView) => {
    "use strict";

    return Controller.extend("dteconsentappclient.controller.ConsentFormEntryPoint", {
        onInit () {
            // Get param from router path
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("ConsentForm").attachPatternMatched(this.getRouteParams, this)     
        },
        /**
         * Get router params from router
         * @param {Event} oEvent 
         */
        getRouteParams (oEvent) {
            const routeParam = oEvent.getParameter("arguments").appId;

            this.validateAppId(routeParam);
        },
        /**
         * Validate Application Id 
         * @param {string} appId 
         */
        validateAppId(appId){
            const isValidAppId = appId == "4322";

            /**
             * Check requested Application is valid
             * If true, then render Consent Form View 
             * Else navigate to 404 page.
             */
            if(isValidAppId){
                XMlView.create({
                    viewName: "dteconsentappclient.view.ConsentForm",
                }).then(function(oView) {
                    oView.placeAt("content")
                });
            }else{
                alert("Not permitted")
            }
        }

    });
});