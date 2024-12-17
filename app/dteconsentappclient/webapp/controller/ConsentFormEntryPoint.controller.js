sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/mvc/View"
], (BaseController, View) => {
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
            
            const routeParam = oEvent.getParameter("arguments")['?appId'];
            
            this.validateAppId(routeParam.appId);
        },
        /**
         * Validate Application Id 
         * @param {string} appId 
         */
        validateAppId: async function(appId){
            
            const validationUrl = this.SERVERHOST + `service/validateApplicationId?encrAppId=${appId}`

           try {
                // Post request to create a tenant consent.
			    const {data} = await axios.get(validationUrl);

                // Create consent form view
                View.create({
                    type: 'XML',
                    definition: data.value,
                    viewData: {applicationId: appId, url: this.SERVERHOST, router: this.getOwnerComponent().getRouter()},
                }).then(function(oView) {
                    oView.placeAt("content")
                }); 
           } catch (error) {
                console.error(error);
                
           }
        }

    });
});