sap.ui.define([
	"dteconsentappclient/controller/BaseController",
	"sap/ui/core/mvc/XMLView"
], (BaseController, XMlView) => {
	"use strict";

	return BaseController.extend("dteconsentappclient.controller.EnrollmentFormEntryPoint", {
			onInit () {
				this.loadEnrollmentView();
			},

			// Load the enrollment form page
			loadEnrollmentView: function(){
				const that = this;

				XMlView.create({
						type: 'XML',
						viewName: 'dteconsentappclient.view.Enrollment'
				}).then(function(oView) {
						// Render the created view into the App view
						const oRootView = that.getOwnerComponent().getRootControl();
						const oApp = oRootView.byId("app");
					console.log(oApp);
					
						oApp.addPage(oView); // Add new view as a page
						oApp.to(oView); // Navigate to that page    
				});
			},
	});
});