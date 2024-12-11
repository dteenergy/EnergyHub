sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], (BaseController, Fragment, JSONModel) => {
    "use strict";

    return BaseController.extend("dteconsentappclient.controller.Landlord", {
        onInit() {

            
            let oEnrollFormData = {
                SignatureSignedBy: "",
                SignatureSignedDate: "",
                AccountDetail: {}
            };

            // Set the JSONModel with the correct name
            const oEnrollModel = new JSONModel(oEnrollFormData);
            this.getView().setModel(oEnrollModel, "oEnrollModel");


            const oModel = new sap.ui.model.json.JSONModel({
                locations: [], // Array to hold all building location data
                // oData : oData
            });
            this.getView().setModel(oModel, "locationModel");
            this.onAddAnotherLocation();

            const oAddressModel = new sap.ui.model.json.JSONModel({
                dqmAddress: [] // Array to hold the suggestion addresses
            });

            // this.getView().setModel(oEnrollFormData, "enrollFormData")
            this.getView().setModel(oAddressModel, 'dqmAddressModel');

            // Assign url and headers into this controller global scope
            const { url, headers } = this.getApiConfig();
            this.HEADERS = headers;
            this.SERVERHOST = url;
        },
        // Define the event handler in your controller
        onRadioButtonSelect: function (oEvent) {
            // Get the selected button's text
            let sSelectedText = oEvent.getSource().getSelectedButton().getText();
            let sSelectedVal = false;
            console.log(sSelectedText);

            if(sSelectedText === 'Yes') sSelectedVal = true;
            else sSelectedVal; 
            
            // Get the model
            let oEnrollModel = this.getView().getModel("oEnrollModel");

            // Update the model with the selected value
            oEnrollModel.setProperty("/AccountDetail/EnergyPrgmParticipated", sSelectedVal);
        },


        handleSubmit: async function () {

            // const { data } = await axios.get(`${this.SERVERHOST}service/DTEApplicationDetail`);
            // Retrieve the model and its data
            const enrollFormData = this.getView().getModel("oEnrollModel").getData(); // Use the same model name as above
            console.log(enrollFormData);

            let location = this.getView().getModel("locationModel").getData();
            console.log(JSON.stringify(location));
            
            // Construct the payload
            const payload = {
                SignatureSignedBy: enrollFormData.SignatureSignedBy,
                SignatureSignedDate: enrollFormData.SignatureSignedDate,
                AccountDetail: JSON.stringify(enrollFormData.AccountDetail),
                BuildingDetail : JSON.stringify(location.locations)
            };

            console.log("Payload to send:", payload.AccountDetail);

            try {
                const response = await axios.post(`${this.SERVERHOST}service/CreateEnrollmentFormDetail`, payload);
                console.log(response);
            } catch (error) {
                console.error("Error:", error);
                MessageBox.error("An error occurred while submitting the form. Please try again later.");
            }


        },

      onAddAnotherLocation: function () {
            const oView = this.getView();
            const oModel = oView.getModel("locationModel");
            const buildingmainContainer = this.byId("building_detail_main_container");
            const aLocations = oModel.getProperty("/locations");

            aLocations.push({
                buildingName: "",
                accountNumber: "",
                locationAddress: "",
                city: "",
                state: "",
                zipcode: ""
            });
            oModel.setProperty("/locations", aLocations);

            const index = aLocations.length - 1;

            Fragment.load({
                name: "dteconsentappclient.fragment.Buildingdetail",
                controller: this
            }).then(function (oFragment) {
                oFragment.setModel(oModel, "locationMoel");
                oFragment.bindElement(`locationModel>/locations/${index}`);
                buildingmainContainer.addItem(oFragment);
            }).catch(function (err) {
                console.log(`Failed to load fragment:, ${err}`)
            });
        },

        onbuildingLocationAddressChange: async function (oEvent) {


            const oView = this.getView();
            const oAddModel = oView.getModel("dqmAddressModel");
            const locationModel = oView.getModel("locationModel");


            const newValue = oEvent.getParameter("value");
            const subscription_key = "FHSdLToNjfzJbP0DyZrAuSadyk3cv3433c5uggPL80yV60ZxQ1NCJQQJ99ALACYeBjFqbPoVAAAgAZMP4eHm&typeahead=true";

            //   const {data} = await axios.get(`https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&query=${newValue}&subscription-key=${subscription_key}&idxSet=POI,PAD`)

            // oAddModel.setProperty("/dqmAddress", data.results);
            // Addess validation service.
            const dteData = await axios.get("https://test.api.customer.sites.dteenergy.com/public/qa/premises/?address=8550%20HAGG&maxResults=50");

            // Get the array of address details.
            const firstListData = dteData.data.results;


            // Set the oModel property with the Address detail
            oAddModel.setProperty("/dqmAddress", firstListData);
        },

        onsuggestionItemSelected: function (oEvent) {
            const oView = this.getView();
            const locationModel = oView.getModel("locationModel");

            console.log(locationModel);

            // Get the selected item
            const oSelectedItem = oEvent.getParameter("selectedItem");

            if (oSelectedItem) {
                const addressText = oSelectedItem.getText();
                console.log(addressText);
                
                const addressParts = addressText.split(",");

                // Ensure the array has enough parts to extract the city, zipcode
                if (addressParts.length > 4) {
                    const city = addressParts[4].trim();
                    const state = addressParts[5].trim();
                    const zipCode = addressParts[6].trim();

                    // Get the location index from the binding context
                    const buildingIndex = oEvent.getSource().getBindingContext("locationModel").getPath().split("/")[2];
                    console.log(buildingIndex, "Index");


                    // Update the 'city' in the corresponding location in 'aLocations'
                    const aLocations = locationModel.getProperty("/locations");
                    if (aLocations[buildingIndex]) {
                        aLocations[buildingIndex].city = city; // Update city,zipcode for the specific location
                        aLocations[buildingIndex].state = state;
                        aLocations[buildingIndex].zipcode = zipCode;
                        aLocations[buildingIndex].locationAddress = addressText;

                        locationModel.setProperty("/locations", aLocations); // Refresh the model
                    }
                }
            }
        },
        onRemoveTrigger: function (oEvent) {
            const oButton = oEvent.getSource();
            const oFragment = oButton.getParent();

            const buildingDetailmainContainer = this.byId("building_detail_main_container");
            buildingDetailmainContainer.removeItem(oFragment);
            oFragment.destroy();
        },

        onSubmit: function () {
            const oView = this.getView();
            const oModel = oView.getModel("locationModel");
            const aLocations = oModel.getProperty("/locations");
            console.log(aLocations);
        }
    });
});