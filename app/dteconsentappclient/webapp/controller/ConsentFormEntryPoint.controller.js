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
                    // Render the created view into the App view
                    const oRootView = this.getOwnerComponent().getRootControl();
                    const oApp = oRootView.byId("app");

                    oApp.addPage(oView); // Add new view as a page
                    oApp.to(oView); // Navigate to that page
                    
                }.bind(this));
            } catch(error){
                alert("Not permitted")
            }
        }

    });
});