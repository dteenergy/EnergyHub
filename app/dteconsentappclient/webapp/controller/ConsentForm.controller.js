sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
	"dteconsentappclient/variable/GlobalInputValues"
], function(
	BaseController,
	Fragment,
	JSONModel,
	GlobalInputValues
) {
	"use strict";

	let validationFlags = {
		tenantInformationValidation: true,
		consentAuthDetailValidation: true
	}

	return BaseController.extend("dteconsentappclient.controller.ConsentForm", {
        onInit () {

					let oConsentData = {
						ConsentDetail: {
							"ConsentFirstName": "",
							"ConsentLastName": "",
							"ConsentAddress": "",
							"ConsentCity":"",
							"ConsentState": "",
							"ConsentZipcode": null,
							"ConsentAccountNumber":"",
							"ConsentEmailAddr":"",
							"AuthPersonName":"",
							"AuthDate":"",
							"AuthTitle":""
						}
					};

					// Model to store the tenant consent detail
					const oConsentModel = new JSONModel(oConsentData);
					this.getView().setModel(oConsentModel, "oConsentModel");

					// Model to set the list of US states
					const ostateValuesModel = new JSONModel(GlobalInputValues);
					this.getView().setModel(ostateValuesModel, "ostateValuesModel");

					// Model to hold the visibility status of error message
					const oErrorVisibilityModel = new JSONModel({
						"isInputInValid":false,
						"isTermsAndConditionVerifiedStatus":false
					});

					this.getView().setModel(oErrorVisibilityModel, "oErrorVisibilityModel");
					
					this.loadAuthAndRelease();
			},

        // Define model and load the Customer Auth and Release section fragment to the enrollment form
        loadAuthAndRelease: function(){
					const oConsentModel = this.getView().getModel("oConsentModel");

					const customerAuthAndReleaseContainer = this.byId("tenant-auth-and-release-container-id");
					Fragment.load({
							name: "dteconsentappclient.fragment.AuthAndRelease",
							controller: this
					}).then(function (oFragment) {
							oFragment.setModel(oConsentModel, "oConsentModel");
							oFragment.bindElement('oConsentModel');
							
							customerAuthAndReleaseContainer.addItem(oFragment);
					}).catch(function (err) {
							console.log(`Failed to load fragment: ${err}`)
					});
			},

			// Check the input on live change and remove the error state
			onLiveChange: function(oEvent){
				const oControl = oEvent.getSource();
				
				const userInput = oEvent.getParameter("value") || oEvent.getParameter("selectedKey");

				// Validates if a field has value, if it is remove the error state
				if(userInput?.trim() !== "" && oControl?.mProperties['required']) {
					oControl.setValueState("None");
				}else{
					oControl.setValueState("Error");
				}
			},

			/** 
	 		* Validate tenant form details
			* @param {String} sContainerId Container Id
			* @param {Boolean} isShowError Have to add value state or not
			* @param {Object} model model with bind with the container
			* @param {String} validationStatus
			*/
		 validateFormDetails: function(sContainerId, isShowError, model, validationStatus){
			const oModel = this.getView().getModel(model);
			const container = this.byId(sContainerId);

			validationFlags[validationStatus] = true;
			 
			// To get the aggregated objects from the given container
			container.findAggregatedObjects(true, (control) => {
					 
				// Filtered the input and combobox controls
				if (control instanceof sap.m.Input && !control.getId().includes("-popup-input") || control instanceof sap.m.ComboBox || control instanceof sap.m.MaskInput) {

						// Get the binding path from the control
						const bindingPath = control.getBinding('value')?.getPath() || control.getBinding("selectedKey")?.getPath();
						
						if(bindingPath){
							 
							const userInput = oModel.getProperty(bindingPath);
							
							// Validates that all required fields are filled; if a field is empty, marks it with an error state to indicate validation failure.
							if((!userInput || userInput?.trim() === "") && control?.mProperties['required']) {
								if(isShowError){
									control.setValueState("Error");
								}
								validationFlags[validationStatus] = false
							}else{
								control.setValueState("None");
							}
						 }		
					 }		
				 });
		 },

		 validateTermsAndConditionIsVerified: function(sContainerId){
			const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");

			const container = this.byId(sContainerId);

			// To get the aggregated objects from the given container
			container.findAggregatedObjects(true, (control) => {
					
					// Filtered the input and combobox controls
					if (control instanceof sap.m.CheckBox) {
						const inputvalue = control.getSelected();
						console.log(inputvalue);
						
						const innerDiv = control.$().find(".sapMCbBg");
						
					if(inputvalue) {
						oErrorVisibilityModel.setProperty('/isTermsAndConditionVerifiedStatus', false);
						innerDiv.removeClass("checkbox-error-view");
					}
					else {
						oErrorVisibilityModel.setProperty('/isTermsAndConditionVerifiedStatus', true);	
						innerDiv.addClass("checkbox-error-view");
					}		
				}
				});
		},

		convertDateFormat: function(dateString) {
			// Split the input date by '/'
			const [day, month, year] = dateString.split('/');
	
			// Rearrange to 'YYYY-MM-DD' and return
			return `${year}-${month}-${day}`;
		},

		setErrorMessageTripVisibility: function(){
			const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");
			console.log(Object.values(validationFlags));

			if(Object.values(validationFlags).includes(false)) 
				oErrorVisibilityModel.setProperty('/isInputInValid', true);
			else oErrorVisibilityModel.setProperty('/isInputInValid', false);
		},

		 handleTermsAndConditionVerified: function(oEvent){
			const oControl = oEvent.getSource();
			
			const isVerified = oEvent.getParameters().selected;
			const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");

			const innerDiv = oControl.$().find(".sapMCbBg");

			if(isVerified){
				innerDiv.removeClass("checkbox-error-view");
				oErrorVisibilityModel.setProperty('/isTermsAndConditionVerifiedStatus', false);
			}else{
				innerDiv.addClass("checkbox-error-view");
				oErrorVisibilityModel.setProperty('/isTermsAndConditionVerifiedStatus', true);
			}
		},

			submitTenantConsentForm: function(){
				const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");
          const oErrorVisibilityModelData = oErrorVisibilityModel.getData();
					
					if(!oErrorVisibilityModelData?.isInputInValid && !oErrorVisibilityModelData?.isTermsAndConditionVerifiedStatus){

						// Url to create the enrollment application
						const enrollmentCreateUrl = this.SERVERHOST + 'service/CreateEnrollmentFormDetail';
					}

			},

			onSubmit: function(){
				this.validateFormDetails("tenant-consent-form-container-id", true, "oConsentModel", "tenantInformationValidation");
				this.validateFormDetails("tenant-auth-and-release-container-id", true, "oConsentModel", "consentAuthDetailValidation");
				this.validateTermsAndConditionIsVerified("tenant-auth-and-release-container-id");
				this.setErrorMessageTripVisibility();

				this.submitTenantConsentForm();
			}
	});
});