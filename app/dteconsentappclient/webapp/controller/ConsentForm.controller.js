sap.ui.define([
	"dteconsentappclient/controller/BaseController",
	"sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
	"dteconsentappclient/variable/GlobalInputValues",
	"dteconsentappclient/utils/ConsentAddressSuggestion",
	"dteconsentappclient/utils/ChecksInputValidation",
	"dteconsentappclient/utils/FormatInputs"
], function(
	BaseController,
	Fragment,
	JSONModel,
	GlobalInputValues,
	ConsentAddressSuggestion,
	ChecksInputValidation,
	FormatInputs
) {
	"use strict";

	let validationFlags = {
		tenantInformationValidation: true,
		consentAuthDetailValidation: true
	};

	return BaseController.extend("dteconsentappclient.controller.ConsentForm", {
        onInit () {

					const {
								applicationId,
								url, 
								TenantConfirmationPageUrl, 
								ErrorPageUrl, 
								DTEAddressValidationUrl
							} = this.getView().getViewData();
					
					// Get the required properties from the parent view
					this.applicationId = applicationId;
					this.SERVERHOST = url;
					this.TenantConfirmationPageUrl = TenantConfirmationPageUrl;
					this.ErrorPageUrl = ErrorPageUrl;	
					this.DTEAddressValidationUrl = DTEAddressValidationUrl
					
					//Initialize Model for this view
					this.initializeModel();

					// Load the AuthAndRelease fragement
					this.loadAuthAndRelease();
			},

				initializeModel: function(){
					
					let oConsentData = {
						ConsentDetail: {
							"ConsentFirstName": "",
							"ConsentLastName": "",
							"ConsentAddress": "",
							"ConsentAddrLineTwo":"",
							"ConsentCity":"",
							"ConsentState": "Michigan",
							"ConsentZipcode": null,
							"ConsentAccountNumber":"",
							"ConsentEmailAddr":"",
							"AuthPersonName":"",
							"AuthDate": FormatInputs.dateToDisplay(),
							"AuthTitle":"",
							"suggestions": []
						}
					};

					// Model to store the tenant consent detail
					const oConsentModel = new JSONModel(oConsentData);
					this.getView().setModel(oConsentModel, "oConsentModel");

					// Model to set the list of US states
					const ostateValuesModel = new JSONModel(GlobalInputValues.usStates);
					this.getView().setModel(ostateValuesModel, "ostateValuesModel");

					// Model to set the location available state list 
					const oLocationStateModel = new JSONModel(GlobalInputValues.locationStates);
					this.getView().setModel(oLocationStateModel, "oLocationStateModel");

					// Model to hold the visibility status of error message
					const oErrorVisibilityModel = new JSONModel({
						"isInputInValid":false,
						"isTermsAndConditionVerifiedStatus":false
					});
					this.getView().setModel(oErrorVisibilityModel, "oErrorVisibilityModel");
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

			/**
			 * Get the value while suggest
			 * @param {Object} oEvent 
			 */
			onConsentAddrSuggest: function(oEvent){
				// Get the entered value from input
				const sAddrValue = oEvent.getParameter("suggestValue");

				// Get the bound model
				const oConsentModel = this.getView().getModel("oConsentModel");

				// To checks the condition and call the DTE address End point to get the suggestion list
				ConsentAddressSuggestion.onConsentAddrSuggestion(sAddrValue, oConsentModel, this.DTEAddressValidationUrl);
			},

			// To get the selected item from the suggestion list
			onConsentAddrSugSelected: function(oEvent){
			
				// Get the bound model
			const oConsentModel = this.getView().getModel("oConsentModel");
			
			// To get the selected item from the suggestion list and binding with according field in the model
			ConsentAddressSuggestion.onConsentAddrSugSelected(oEvent, oConsentModel);
			
			// Validate the form fields 
			if(!validationFlags["tenantInformationValidation"]) this.validateFormDetails("tenant-consent-form-container-id", true, "tenantInformationValidation")
			},

			// Check the input on live change and remove the error state
			onLiveChange: function(oEvent){
				const oControl = oEvent.getSource();
				
				const userInput = oEvent.getParameter("value") || oEvent.getParameter("selectedKey");
				
				// Checks the containers all input are get valid
				if(Object.values(validationFlags).includes(false)) this.validate();
				
				// Validates if a field has value, if it is remove the error state
				if(userInput?.trim() === "" || !userInput && oControl?.mProperties['required']) {
					oControl.setValueState("Error");
				}else{
					oControl.setValueState("None");
					
					// If the input control's type is "Email", validate the user input to ensure it is in a valid email format.
					if(oControl?.mProperties["type"] === "Email") ChecksInputValidation.isValid(oControl, userInput, "Email");
					
					// If the input control's binding path containes "Zipcode", validate the user input to ensure it is in a valid Zipcode format.
					if(oControl?.getBindingPath("value")?.includes("Zipcode")) ChecksInputValidation.isValid(oControl, userInput, "Zipcode");

				}
			},


			/** 
	 		* Validate tenant form details
			* @param {String} sContainerId Container Id
			* @param {Boolean} isShowError Have to add value state or not
			* @param {String} validationStatus 
			*/
		 validateFormDetails: function(sContainerId, isShowError, validationStatus){

			const container = this.byId(sContainerId);
			validationFlags[validationStatus] = true;
			 
			// To get the aggregated objects from the given container
			container.findAggregatedObjects(true, (control) => {
					 
				// Filtered the input and combobox controls
				if (control instanceof sap.m.Input && !control.getId().includes("-popup-input") || 
						control instanceof sap.m.ComboBox) {

						// Get the binding path from the control
						const bindingPath = control.getBinding('value')?.getPath() || control.getBinding("selectedKey")?.getPath();
						
						if(bindingPath){
							 
							const userInput = control.getValue();
							
							// Validates that all required fields are filled; if a field is empty, marks it with an error state to indicate validation failure.
							if((!userInput || userInput?.trim() === "") && control?.mProperties['required']) {
								if(isShowError){
									control.setValueState("Error");
									validationFlags[validationStatus] = false;
								}
							}else{
								control.setValueState("None");
								/** If the input control's type is "Email", validate the user input to ensure it is in a valid email format.
								 *  If the email is invalid, set the corresponding validation flag to `false`.
								 * */
								if(control?.mProperties["type"] === "Email")
									if(!ChecksInputValidation.isValid(control, userInput, "Email")) validationFlags[validationStatus] = false;

								/** If the binding path contains "Zipcode", validate the user input to ensure it is in a valid Zipcode format.
								 *  If the Zipcode is invalid, set the corresponding validation flag to `false`.
								 * */
								if(userInput && control?.getBindingPath("value")?.includes("Zipcode"))
									if(!ChecksInputValidation.isValid(control, userInput, "Zipcode")) validationFlags[validationStatus] = false;	
							}
						 }		
					 }		
				 });

				 // To update the error message visility status
				 this.setErrorMessageTripVisibility();
		 },

		 /**
			* Update the error message visibility for terms and condition verified status while click the submit button.
			* @param {String} sContainerId 
			*/
		 validateTermsAndConditionIsVerified: function(sContainerId){
			const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");

			const container = this.byId(sContainerId);

			// To get the aggregated objects from the given container
			container.findAggregatedObjects(true, (control) => {
					
					// Filtered the input and combobox controls
					if (control instanceof sap.m.CheckBox) {
						const inputvalue = control.getSelected();
						
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

		// To update the error message visibility status
		setErrorMessageTripVisibility: function(){
			const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");

			if(Object.values(validationFlags).includes(false)) 
				oErrorVisibilityModel.setProperty('/isInputInValid', true);
			else oErrorVisibilityModel.setProperty('/isInputInValid', false);
		},

		 // Update the error message visibility for terms and condition verified status while on change.
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

			submitTenantConsentForm: async function(){
				const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");
        const oErrorVisibilityModelData = oErrorVisibilityModel.getData();
					
				const consentDetails = this.getView().getModel("oConsentModel").getData()?.ConsentDetail;
					
					if(!oErrorVisibilityModelData?.isInputInValid && !oErrorVisibilityModelData?.isTermsAndConditionVerifiedStatus){

						// Url to create the enrollment application
						const tenantConsentCreateUrl = this.SERVERHOST + `service/CreateConsentFormDetail?encrAppId=${this.applicationId}`;

						const tenantConsentFormDetails = {
							ConsentDetail: JSON.stringify({
								"FirstName": consentDetails['ConsentFirstName'],
								"LastName": consentDetails['ConsentLastName'],
								"Address": consentDetails['ConsentAddress'],
								"AddrLineTwo": consentDetails['ConsentAddrLineTwo'],
								"City": consentDetails['ConsentCity'],
								"State": consentDetails['ConsentState'],
								"Zipcode": consentDetails['ConsentZipcode'],
								"AccountNumber": consentDetails['ConsentAccountNumber'],
								"EmailAddr": consentDetails['ConsentEmailAddr'],
								"AuthPersonName": consentDetails['AuthPersonName'],
								"AuthDate": FormatInputs.convertDateFormat(consentDetails['AuthDate']),
								"AuthTitle": consentDetails['AuthTitle'],
							})
						}
				
				try{		
					// Post request to create a tenant consent.
					const {data} = await axios.post(tenantConsentCreateUrl, tenantConsentFormDetails);
						
					if(data.value.statusCode === 200){
						// Navigate to the tenant confirmation page
						window.open(this.TenantConfirmationPageUrl, '_self');
					}else{
						// Navigate to the error page
						window.open(this.ErrorPageUrl, '_self');
					}
				}catch(err){
					// Navigate to the error page
					window.open(this.ErrorPageUrl, '_self');
				}	
			}
		},

		// To validate the all form fields 
		validate: function(){
			this.validateFormDetails("tenant-consent-form-container-id", true, "tenantInformationValidation");
			this.validateFormDetails("tenant-auth-and-release-container-id",true,"consentAuthDetailValidation");
			this.validateTermsAndConditionIsVerified("tenant-auth-and-release-container-id");
		},

			onSubmit: function(){
				// Validate form details 
				this.validate();

				// Update the error message visibility status.
				this.setErrorMessageTripVisibility();

				// To call the backend service and store the consent data
				this.submitTenantConsentForm();
			}
	});
});