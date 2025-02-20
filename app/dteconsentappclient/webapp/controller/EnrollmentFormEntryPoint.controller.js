sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/mvc/XMLView"
], (BaseController, XMlView) => {
    "use strict";

    return BaseController.extend("dteconsentappclient.controller.EnrollmentFormEntryPoint", {
        onInit () {
					// Get the base url and assign into this controller global scope
					const { url } = this.getApiConfig();
					this.SERVERHOST = url;

					// To get the navigation url from the env variables
					this.getEnv((envVariables)=>{
						this.LandlordConfirmationPageUrl = envVariables.LandlordConfirmationPageUrl;
						this.ErrorPageUrl = envVariables.ErrorPageUrl;
						this.DTEAddressValidationUrl = envVariables.DTEAddressValidationUrl;
						this.RecaptchaSiteKey = envVariables.RecaptchaSiteKey;

						// After getting the env load the enrollment form page view.
						this.loadEnrollmentView();
					});
        },

				// Get the navigation page url and address validation url
			  getEnv:  async function(callback){
					const envVariables = await this.getEnvironmentVariables();
					callback(envVariables);
				},

        // Load the enrollment form page
        loadEnrollmentView: function(){

					XMlView.create({
							type: 'XML',
							viewName: 'dteconsentappclient.view.Enrollment',
							viewData: {serverHost: this.SERVERHOST, envVariables:{
								LandlordConfirmationPageUrl: this.LandlordConfirmationPageUrl,
								ErrorPageUrl: this.ErrorPageUrl,
								DTEAddressValidationUrl: this.DTEAddressValidationUrl,
								RecaptchaSiteKey: this.RecaptchaSiteKey
							}}
					}).then(function(oView) {
							// Render the created view into the App view
							const oRootView = this.getOwnerComponent().getRootControl();
							const oApp = oRootView.byId("app");

							oApp.addPage(oView); // Add new view as a page
							oApp.to(oView); // Navigate to that page    
					}.bind(this));
        },
    });
});