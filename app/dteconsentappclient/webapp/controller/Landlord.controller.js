sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/library"
], (BaseController, Fragment, JSONModel, CoreLibrary) => {
    "use strict";

    let accountDetails, locationInfo, customerConsentData, customerAuthData;

    return BaseController.extend("dteconsentappclient.controller.Landlord", {
        onInit() {
        // Assign url and headers into this controller global scope
          const { url, headers } = this.getApiConfig();
          this.HEADERS = headers;
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
                "SiteFirstName": "",
                "SiteLastName": "",
                "SiteContactTitle":"",
                "SiteAddress":"",
                "SiteCity":"",
                "SiteState":"",
                "SiteZipcode": null,
                "SitePhoneNumber":"",
                "SiteEmailAddr":""
            },
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
                "ConsentEmailAddr":""
            }
        };

        // Set the JSONModel with the correct name
        const oEnrollModel = new JSONModel(oEnrollFormData);
        this.getView().setModel(oEnrollModel, "oEnrollModel");

        const oModel = new JSONModel({
            locations: [], // Array to hold all building location data
        });
        this.getView().setModel(oModel, "locationModel");

        this.onAddAnotherLocation();
        this.loadConsentForm();
        this.loadAuthAndRelease();
        },

        // Add additional location(Building) container
        onAddAnotherLocation: function(){
            const oView = this.getView();
            const oModel = oView.getModel("locationModel");
            const buildingmainContainer = this.byId("building_detail_main_container");
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
                console.log(`Failed to load fragment:, ${err}`)
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
            const oEnrollModel = oView.getModel("oEnrollModel");

            const enrollmentConsentContainer = this.byId("enrollment-consent-section");
            Fragment.load({
                name: "dteconsentappclient.fragment.Consentform",
                controller: this
            }).then(function (oFragment) {
                oFragment.setModel(oEnrollModel, "oEnrollModel");
                oFragment.bindElement('oEnrollModel');
                
                enrollmentConsentContainer.addItem(oFragment);
            }).catch(function (err) {
                console.log(`Failed to load fragment:, ${err}`)
            });
        },

        // Define model and load the Customer Auth and Release section fragment to the enrollment form
        loadAuthAndRelease: function(){
            const oAuthAndReleaseModel = new JSONModel({});
            this.getView().setModel(oAuthAndReleaseModel, "oAuthAndReleaseModel");

            const customerAuthAndReleaseContainer = this.byId("customer-auth-and-release-container");
            Fragment.load({
                name: "dteconsentappclient.fragment.AuthAndRelease",
                controller: this
            }).then(function (oFragment) {
                oFragment.setModel(oAuthAndReleaseModel, "oAuthAndReleaseModel");
                oFragment.bindElement('oAuthAndReleaseModel>/');
                
                customerAuthAndReleaseContainer.addItem(oFragment);
            }).catch(function (err) {
                console.log(`Failed to load fragment:, ${err}`)
            });
        },

				// Bind or unbind the data based on the checbox checked
        onConsentAndSiteSameSelected: function(oEvent){
					const isConsentAndSiteSame = oEvent.getParameters().selected;
					const oEnrollModel = this.getView().getModel("oEnrollModel");
					const enrollmentData = oEnrollModel.getData();
					const accountDetailsKeys = Object.keys(enrollmentData.AccountDetail);

					if(isConsentAndSiteSame){   
							
						accountDetailsKeys.map((key)=>{
							if(key.startsWith('Site')){
								const consentkey = key.replace('Site', 'Consent');
								oEnrollModel.setProperty(`/ConsentDetail/${consentkey}`, enrollmentData['AccountDetail'][key]);
							}
						});
									
					}else{
							oEnrollModel.setProperty('/ConsentDetail', {
								"FirstName": "",
								"LastName": "",
								"ConsentContactTitle":"",
								"ConsentAddress": "",
								"ConsentCity":"",
								"ConsentState": "",
								"ConsentZipcode": null,
								"ConsentAccountNumber":"",
								"ConsentPhoneNumber":"",
								"ConsentEmailAddr":""
							});
					}      
        },

        // Retrieve the all input data
        retrieveAllInputbindings: function(){
            accountDetails = this.getView().getModel("oEnrollModel").getData();
            console.log(accountDetails);

            locationInfo = this.getView().getModel("locationModel").getData();
            console.log(locationInfo);

            customerAuthData = this.getView().getModel("oAuthAndReleaseModel").getData();
            console.log(customerAuthData);
        },

        // Validate account details
        validateAccountDetails: function(){
            const accountInfoContainer = this.byId("account-info-container");

            accountInfoContainer.findAggregatedObjects(true, (control) => {
							if (control instanceof sap.m.Input) {
								console.log(control.mProperties);
								
								const bindingPath = control.getBinding('value').getPath();
								console.log(bindingPath);
									
							}
							
						});
            
        },

        handleSubmit: async function () {
            this.retrieveAllInputbindings();
            this.validateAccountDetails();
        },

    });
});