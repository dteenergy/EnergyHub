sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
		"dteconsentappclient/variable/GlobalInputValues"
], (BaseController, Fragment, JSONModel, GlobalInputValues) => {
    "use strict";

    let accountDetails, 
				locationInfo, 
				validationFlags = {
				accountDetailsValidation: true, 
				siteDetailsValidation: true,
				customerAuthDetailValidation: true,
				locationDetailsValidation: true,
				consentDetailValidation: true,
				consentAuthDetailValidation: true
				}


    return BaseController.extend("dteconsentappclient.controller.Enrollment", {
        onInit() {
					
        // Assign url and headers into this controller global scope
          const { url } = this.getApiConfig();
          this.SERVERHOST = url;

          let oEnrollFormData = {
            SignatureSignedBy: "",
            SignatureSignedDate: "",
            AccountDetail: {
                "CompanyName": "",
                "CompanyAddress": "",
                "City":"",
                "State": "",
                "Zipcode":"",
								"EnergyPrgmParticipated": true,
                "SiteFirstName": "",
                "SiteLastName": "",
                "SiteContactTitle":"",
                "SiteAddress":"",
                "SiteCity":"",
                "SiteState":"",
                "SiteZipcode": null,
                "SitePhoneNumber":"",
                "SiteEmailAddr":""
            }
        };

        // Set the JSONModel with the correct name
        const oEnrollModel = new JSONModel(oEnrollFormData);
        this.getView().setModel(oEnrollModel, "oEnrollModel");

			let oConsentData = {
				ConsentDetail: {
					"ConsentFirstName": "",
					"ConsentLastName": "",
					"ConsentContactTitle":"",
					"ConsentAddress": "",
					"ConsentCity":"",
					"ConsentState": "",
					"ConsentZipcode": null,
					"ConsentAccountNumber":"",
					"ConsentPhoneNumber":"",
					"ConsentEmailAddr":"",
					"AuthPersonName":"",
					"AuthDate":"",
					"AuthTitle":""
        }
			};

			// Set the JSONModel with the correct name
			const oConsentModel = new JSONModel(oConsentData);
			this.getView().setModel(oConsentModel, "oConsentModel");

        const oModel = new JSONModel({
            locations: [], // Array to hold all building location data
        });
        this.getView().setModel(oModel, "locationModel");

				// Model to hold the visibility status of error message
				const oErrorVisibilityModel = new JSONModel({
					"isInputInValid":false,
					"isTermsAndConditionVerifiedStatus":false
				});

				this.getView().setModel(oErrorVisibilityModel, "oErrorVisibilityModel");

				// Model to set the list of US states
				const ostateValuesModel = new JSONModel(GlobalInputValues);
				this.getView().setModel(ostateValuesModel, "ostateValuesModel");

        this.onAddAnotherLocation();
        this.loadConsentForm();
        this.loadAuthAndRelease();
        },

        // Add additional location(Building) container
        onAddAnotherLocation: function(){
            const oView = this.getView();
            const oModel = oView.getModel("locationModel");
            const buildingmainContainer = this.byId("building-detail-main-container");
            const locations = oModel.getProperty("/locations");

            locations.push({
                buildingName: "",
                accountNumber: "",
                locationAddress: "",
                city: "",
                state: "Michigan",
                zipcode: ""
            });
            oModel.setProperty("/locations", locations);

            const index = locations.length - 1;

            // Load the location(Building) fragment in the enrollment form 
            Fragment.load({
                name: "dteconsentappclient.fragment.Buildingdetail",
                controller: this
            }).then(function (oFragment) {
                let flexItems = []
                 
                // Add the label for additional buildings
                if(index > 0){
                const buildingInfoLabel = new sap.m.Title({
                    text:  `Location ${index + 1}`,
                    titleStyle: 'H6'
                });
                buildingInfoLabel.addStyleClass("location-inner-title");
                    flexItems = [buildingInfoLabel]
                }

                // Set and bind the model with the fragment
                oFragment.setModel(oModel, "locationMoel");
                oFragment.bindElement(`locationModel>/locations/${index}`);
                const wrapper = new sap.m.FlexBox({
                    items: [...flexItems, oFragment],
                    direction: 'Column',
                });

                // Add the fragment to the according container
                buildingmainContainer.addItem(wrapper);
            }).catch(function (err) {
                console.log(`Failed to load fragment: ${err}`)
            });
        },

          // Define the event handler in your controller
          onRadioButtonSelect: function (oEvent) {
            // Get the selected button's text
            let sSelectedText = oEvent.getSource().getSelectedButton().getText();
            let sSelectedVal = false;

            if(sSelectedText === 'Yes') sSelectedVal = true;
            else sSelectedVal; 
            
            // Get the model
            let oEnrollModel = this.getView().getModel("oEnrollModel");

            // Update the model with the selected value
            oEnrollModel.setProperty("/AccountDetail/EnergyPrgmParticipated", sSelectedVal);
        },
        
        // Define model and load the Customer consent form fragment to the enrollment form
        loadConsentForm: function(){
            const oView = this.getView();
            const oConsentModel = oView.getModel("oConsentModel");

            const enrollmentConsentContainer = this.byId("enrollment-consent-section");
            Fragment.load({
                name: "dteconsentappclient.fragment.Consentform",
                controller: this
            }).then(function (oFragment) {
                oFragment.setModel(oConsentModel, "oConsentModel");
                oFragment.bindElement('oConsentModel');
                
                enrollmentConsentContainer.addItem(oFragment);
            }).catch(function (err) {
                console.log(`Failed to load fragment: ${err}`)
            });
        },

        // Define model and load the Customer Auth and Release section fragment to the enrollment form
        loadAuthAndRelease: function(){
            const oConsentModel = this.getView().getModel("oConsentModel");

            const customerAuthAndReleaseContainer = this.byId("customer-auth-and-release-container");
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

				// Bind or unbind the data based on the checbox checked
        onConsentAndSiteSameSelected: function(oEvent){
					const isConsentAndSiteSame = oEvent.getParameters().selected;
					const oEnrollModel = this.getView().getModel("oEnrollModel");
					const enrollmentData = oEnrollModel.getData();

					const oConsentModel = this.getView().getModel("oConsentModel");
					const consentData = oConsentModel.getData();
					
					const accountDetailsKeys = Object.keys(enrollmentData.AccountDetail);

					/**
					 * Checks, is consent release check box is checked,
					 * If it is, consent and site information will be same
					 * So have to bind the data from site details to consent details
					 */
					if(isConsentAndSiteSame){   
							
						accountDetailsKeys.map((key)=>{
							if(key.startsWith('Site')){
								const consentkey = key.replace('Site', 'Consent');
								oConsentModel.setProperty(`/ConsentDetail/${consentkey}`, enrollmentData['AccountDetail'][key]);
							}
						});
						this.validateFormDetails("enrollment-consent-section", false, "oConsentModel", "consentDetailValidation");		
					}else{
						oConsentModel.setProperty('/ConsentDetail', {
								"FirstName": "",
								"LastName": "",
								"ConsentContactTitle":"",
								"ConsentAddress": "",
								"ConsentCity":"",
								"ConsentState": "",
								"ConsentZipcode": null,
								"ConsentAccountNumber":"",
								"ConsentPhoneNumber":"",
								"ConsentEmailAddr":"",
								"AuthPersonName": consentData['ConsentDetail']['AuthPersonName'],
								"AuthDate": consentData['ConsentDetail']['AuthPersonName'],
								"AuthTitle": consentData['ConsentDetail']['AuthPersonName']
							});
					}      
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

        // Retrieve the all input data
        retrieveAllInputbindings: function(){
					accountDetails = this.getView().getModel("oEnrollModel").getData();
					console.log(accountDetails);

					const consentDetail = this.getView().getModel("oConsentModel").getData();
					console.log(consentDetail);

					locationInfo = this.getView().getModel("locationModel").getData();
					console.log(locationInfo);
        },

        /**
				 * Validate account details site and auth details
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

									if(bindingPath === "/ConsentDetail/ConsentAccountNumber"){
										console.log(oModel.getProperty(bindingPath));
										console.log(oModel.getData());
										
									}
									
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

				// Validate the building information
				validateBuildingDetails: function(sContainerId){
					const olocationModel = this.getView().getModel("locationModel");
					const container = this.byId(sContainerId);
					validationFlags["locationDetailsValidation"] = true;

					/**
					 * Building info have a list of items(one or more buildings)
					 * So, get the all items from the container 
					 */
					container.getItems().forEach((wrapper, index)=>{
						
						wrapper.findAggregatedObjects(true, (control)=>{
							
							// Filtered the input and combobox controls
							if (control instanceof sap.m.Input && !control.getId().includes("-popup-input") || control instanceof sap.m.ComboBox) {
                            
								const bindingPath = control.getBinding('value')?.getPath() || control.getBinding("selectedKey")?.getPath();
								
								if(bindingPath){
									const userInput = olocationModel.getProperty(`/locations/${index}/${bindingPath}`);
									
									if((!userInput || userInput?.trim() === "") && control?.mProperties['required']) {
										control.setValueState("Error");
										validationFlags["locationDetailsValidation"] = false;
									}
								}		
							}
						})
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
								
								const innerDiv = control.$().find(".sapMCbBg");
								
							if(inputvalue) {
								oErrorVisibilityModel.setProperty('/isTermsAndConditionVerifiedStatus', false);
								innerDiv.removeClass("checkbox-error-view");
							}
							else oErrorVisibilityModel.setProperty('/isTermsAndConditionVerifiedStatus', true);	
								innerDiv.addClass("checkbox-error-view");
							}		
            });
				},

				setErrorMessageTripVisibility: function(){
					const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");
					console.log(Object.values(validationFlags), validationFlags);

					if(Object.values(validationFlags).includes(false)) 
						oErrorVisibilityModel.setProperty('/isInputInValid', true);
					else oErrorVisibilityModel.setProperty('/isInputInValid', false);
				},

				submitAction: function(){
					const oErrorVisibilityModel = this.getView().getModel("oErrorVisibilityModel");
          const oErrorVisibilityModelData = oErrorVisibilityModel.getData();

					console.log(oErrorVisibilityModelData);
					

					if(!oErrorVisibilityModelData?.isInputInValid && !oErrorVisibilityModelData?.isTermsAndConditionVerifiedStatus){
						// axios call
						console.log('axios call to create');
						
					}
				},

        handleSubmit: async function () {
					this.retrieveAllInputbindings();
					this.validateFormDetails("account-info-container", true, "oEnrollModel", "accountDetailsValidation");
					this.validateFormDetails("site-contact-info-container", true, "oEnrollModel", "siteDetailsValidation");
					this.validateBuildingDetails("building-detail-main-container");
					this.validateFormDetails("auth-info-container", true, "oEnrollModel", "customerAuthDetailValidation");
					this.validateFormDetails("enrollment-consent-section", true, "oConsentModel", "consentDetailValidation");
					this.validateFormDetails("customer-auth-and-release-container", true, "oConsentModel", "consentAuthDetailValidation");
					this.validateTermsAndConditionIsVerified("customer-auth-and-release-container");
					this.setErrorMessageTripVisibility();

					this.submitAction();
        },

    });
});