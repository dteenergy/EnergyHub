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

            this.getEnv();
        },
        /**
         * Get router params from router
         * @param {Event} oEvent 
         */
        getRouteParams (oEvent) {
            
            const routeParam = oEvent.getParameter("arguments")['?appId'];
            
            this.validateAppId(routeParam.appId);
        },

        // Get the env data (Navigation page url)
        getEnv:  async function(){
            const {TenantConfirmationPageUrl, ErrorPageUrl} = await this.getEnvironmentVariables();
            
            this.TenantConfirmationPageUrl = TenantConfirmationPageUrl;
            this.ErrorPageUrl = ErrorPageUrl;
        },

        /**
         * Validate Application Id 
         * @param {string} appId 
         */
        validateAppId: async function(appId){
          try{  
                const validationUrl = this.SERVERHOST + `service/validateApplicationId?encrAppId=${appId}`

                // Post request to create a tenant consent.
                const {data} = await axios.get(validationUrl);
                
                /**
                 * Check requested Application ID is valid
                 * If true, then render Consent Form View 
                 * Else navigate to AEM error page
                 */
                if(data.value.statusCode === 200){
                    XMlView.create({
                        viewName: "dteconsentappclient.view.ConsentForm",
                        viewData: {
                            applicationId: appId,
                            url: this.SERVERHOST,
                            TenantConfirmationPageUrl: this.TenantConfirmationPageUrl,
                            ErrorPageUrl: this.ErrorPageUrl
                        },
                    }).then(function(oView) {
                        // Render the created view into the App view
                        const oRootView = this.getOwnerComponent().getRootControl();
                        const oApp = oRootView.byId("app");

                        oApp.addPage(oView); // Add new view as a page
                        oApp.to(oView); // Navigate to that page
                        
                    }.bind(this));
                }else{
                    // Navigate to the error page
					window.open(this.ErrorPageUrl, '_self');
                }
            }catch(err){
                // Navigate to the error page
				window.open(this.ErrorPageUrl, '_self');
            }
        }

    });
});