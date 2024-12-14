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
            
            const routeParam = oEvent.getParameter("arguments")['?appId'];
            console.log(routeParam);
            
            this.validateAppId(routeParam.appId);
        },
        /**
         * Validate Application Id 
         * @param {string} appId 
         */
        validateAppId: async function(appId){
            
            const validationUrl = this.SERVERHOST + `service/validateApplicationId?encrAppId=${appId}`

            // Post request to create a tenant consent.
			const {data} = await axios.get(validationUrl);
            
            /**
             * Check requested Application ID is valid
             * If true, then render Consent Form View 
             * Else navigate to 404 page.
             */
            if(data.value.status === 200){
                XMlView.create({
                    viewName: "dteconsentappclient.view.ConsentForm",
                    viewData: {applicationId: appId, url: this.SERVERHOST, router: this.getOwnerComponent().getRouter()},
                }).then(function(oView) {
                    const oRootView = this.getOwnerComponent().getRootControl();
                    const oApp = oRootView.byId("app");

                    oApp.addPage(oView); // Add new view as a page
                    oApp.to(oView);
                    
                }.bind(this));
            }else{
                alert("Not permitted")
            }
        }

    });
});