sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/mvc/XMLView"
], (BaseController, XMlView) => {
    "use strict";

    return BaseController.extend("dteconsentappclient.controller.ConsentFormEntryPoint", {
        onInit () {
            // Get param from router path
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("ConsentForm").attachPatternMatched(this.getRouteParams, this);     

            // Get the url
            const { url } = this.getApiConfig();
            this.SERVERHOST = url;
        },
        /**
         * Get router params from router
         * @param {Event} oEvent 
         */
        getRouteParams (oEvent) {
            console.log(oEvent);
            
            const routeParam = oEvent.getParameter("arguments")['?appId'];
            console.log(routeParam);
            
            this.validateAppId(routeParam.appId);
        },
        /**
         * Validate Application Id 
         * @param {string} appId 
         */
        validateAppId: async function(appId){
            console.log(appId);
            
            const validationUrl = this.SERVERHOST + `service/validateApplicationId?encrAppId=${appId}`

            // Post request to create a tenant consent.
			const {data} = await axios.get(validationUrl);
            console.log(data);
            
            /**
             * Check requested Application ID is valid
             * If true, then render Consent Form View 
             * Else navigate to 404 page.
             */
            // const data = {value:{status: 200}};
            if(data.value.status === 200){
                XMlView.create({
                    viewName: "dteconsentappclient.view.ConsentForm",
                    viewData: {applicationId: appId, url: this.SERVERHOST},
                }).then(function(oView) {

                    oView.placeAt("content")
                });
            }else{
                alert("Not permitted")
            }
        }

    });
});