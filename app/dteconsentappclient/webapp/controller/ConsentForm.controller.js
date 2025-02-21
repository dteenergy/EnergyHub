sap.ui.define([
	"dteconsentappclient/controller/BaseController",
	"sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
	"dteconsentappclient/variable/GlobalInputValues",
	"dteconsentappclient/variable/RegexAndMessage",
	"dteconsentappclient/utils/ConsentAddressSuggestion",
	"dteconsentappclient/utils/ChecksInputValidation",
	"dteconsentappclient/utils/FormatInputs",
	"dteconsentappclient/utils/RenderRecaptcha",
	"dteconsentappclient/utils/DataLayer"
], function(
	BaseController,
	Fragment,
	JSONModel,
	GlobalInputValues,
	RegexAndMessage,
	ConsentAddressSuggestion,
	ChecksInputValidation,
	FormatInputs,
	RenderRecaptcha,
	DataLayer
) {
	"use strict";

	let validationFlags = {
		tenantInformationValidation: true,
		consentAuthDetailValidation: true
	};

	let isFirstInteraction = true;

	return BaseController.extend("dteconsentappclient.controller.ConsentForm", {
        onInit () {

					const {
								applicationId,
								url, 
								TenantConfirmationPageUrl, 
								ErrorPageUrl, 
								DTEAddressValidationUrl,
								RecaptchaSiteKey
							} = this.getView().getViewData();
					
					// Get the required properties from the parent view
					this.applicationId = applicationId;
					this.SERVERHOST = url;
					this.TenantConfirmationPageUrl = TenantConfirmationPageUrl;
					this.ErrorPageUrl = ErrorPageUrl;	
					this.DTEAddressValidationUrl = DTEAddressValidationUrl;
					this.RecaptchaSiteKey = RecaptchaSiteKey;
					
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
						"isTermsAndConditionVerifiedStatus":false,
						"recaptchaErrorMessageVisibilityStatus":false
					});
					this.getView().setModel(oErrorVisibilityModel, "oErrorVisibilityModel");
					this.errorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");

					this.recaptchaErrorStrip = this.byId("tenant-recaptcha-error-strip");
				},

				// After ConsentForm view is rendered, load and render the reCAPTCHA component 
				onAfterRendering: function(){
					// To render recaptcha and obtain varification token
					RenderRecaptcha.renderRecaptcha(this);
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

				// Push the "form_engaged" event to the dataLayer while the first interaction.
				if(isFirstInteraction) DataLayer.pushEventToDataLayer("tenant_form", "form_engaged", "first touch", false);

				const oControl = oEvent.getSource();
				
				const userInput = oEvent.getParameter("value") || oEvent.getParameter("selectedKey");
				
				// Checks the containers all input are get valid
				if(Object.values(validationFlags).includes(false)) this.validate();
				
				// Validates if a field has value, if it is remove the error state
				if(userInput?.trim() === "" || !userInput && oControl?.mProperties['required']) {
					oControl.setValueState("Error");
				}else{
					oControl.setValueState("None");
					
					// Retrieve the bindingpath from the control.
					const bindingPath =  oControl?.getBindingPath("value");

					// If the binding path contains one of the listed regex keyword, validate the user input against the regex.
					const matchedKey = Object.keys(RegexAndMessage.regex).find((key)=> bindingPath?.includes(key));
					if(matchedKey) ChecksInputValidation.isValid(oControl, userInput, matchedKey);	
				}

				isFirstInteraction = false;
			},


			/** 
	 		* Validate tenant form details
			* @param {String} sContainerId Container Id
			* @param {Boolean} isShowError Have to add value state or not
			* @param {String} validationFlag 
			*/
		 validateFormDetails: function(sContainerId, isShowError, validationFlag){

			const container = this.byId(sContainerId);
			validationFlags[validationFlag] = true;
			 
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
									validationFlags[validationFlag] = false;
								}
							}else{
								control.setValueState("None");
								
								// Retrieve the bindingpath from the control.
								const bindingPath = control?.getBindingPath("value");
								
								/**
								 * If the binding path contains one of the listed regex keyword, validate the user input against the regex.
								 * If the user input is invalid, set the corresponding validation flag to `false`.
								 */
								const matchedKey = Object.keys(RegexAndMessage.regex).find((key)=> bindingPath?.includes(key));
								if(userInput && matchedKey) {
									if(!ChecksInputValidation.isValid(control, userInput, matchedKey)) validationFlags[validationFlag] = false;
								}	
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

				// Push the "accept_tc" event to the dataLayer while "terms & condition" was accepted. 
				DataLayer.pushEventToDataLayer("tenant_form", "accept_tc", "tc accepted", false);
			}else{
				innerDiv.addClass("checkbox-error-view");
				oErrorVisibilityModel.setProperty('/isTermsAndConditionVerifiedStatus', true);
			}
		},

			submitTenantConsentForm: async function(){
				const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");
        const oErrorVisibilityModelData = oErrorVisibilityModel.getData();
					
				const consentDetails = this.getView().getModel("oConsentModel").getData()?.ConsentDetail;
					
				/**
				 * Checks if the error message strip was in inVisible state
				 * If it is all inputs are valid, proceed to recaptcha verification
				 */
				if(!oErrorVisibilityModelData?.isInputInValid && !oErrorVisibilityModelData?.isTermsAndConditionVerifiedStatus){

					// If recaptcha is not verified display the error message and stop the further process.
					if(!this.isRecaptchaVerified) {
						this.errorVisibilityModel.setProperty('/recaptchaErrorMessageVisibilityStatus', true);
						this.recaptchaErrorStrip.setText("Please verify the Recaptcha to continue");
						return;
					}

						// Push the "form_submit" event to the dataLayer
						DataLayer.pushEventToDataLayer("tenant_form", "form_submit", "form_submit", false);

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
					const headers = { 'X-Recaptcha-Token': this.recaptchaToken };  // Pass the recaptcha token in headers.
					const {data} = await axios.post(tenantConsentCreateUrl, tenantConsentFormDetails, {headers});
						
					if(data.value.statusCode === 200){
						// Navigate to the tenant confirmation page
						window.open(this.TenantConfirmationPageUrl, '_self');
					}else{
						// Navigate to the error page
						window.open(this.ErrorPageUrl, '_self');
					}
				}catch(err){

					/**
					  * If reCAPTCHA verification fails:
						* - Reset the reCAPTCHA widget
						* - Mark reCAPTCHA as not verified
						* - Display an error message strip to inform the user
					 */
					if(err?.response?.status === 403) {
						grecaptcha.reset();
						this.isRecaptchaVerified = false;
						this.errorVisibilityModel.setProperty('/recaptchaErrorMessageVisibilityStatus', true);
						this.recaptchaErrorStrip.setText("ReCATCHA verfication failed. Please try again.")

					} else window.open(this.ErrorPageUrl, '_self'); // Navigate to the error page
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