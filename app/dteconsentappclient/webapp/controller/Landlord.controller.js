sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], (BaseController, Fragment, JSONModel) => {
    "use strict";

    return BaseController.extend("dteconsentappclient.controller.Landlord", {
        onInit() {
        // Assign url and headers into this controller global scope
          const { url, headers } = this.getApiConfig();
          this.HEADERS = headers;
          this.SERVERHOST = url;

          let oEnrollFormData = {
            SignatureSignedBy: "",
            SignatureSignedDate: "",
            AccountDetail: {},
            ConsentDetail: {}
        };

        // Set the JSONModel with the correct name
        const oEnrollModel = new JSONModel(oEnrollFormData);
        this.getView().setModel(oEnrollModel, "oEnrollModel");

        const oModel = new JSONModel({
            locations: [], // Array to hold all building location data
        });
        this.getView().setModel(oModel, "locationModel");
        this.onAddAnotherLocation();
        },

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

            Fragment.load({
                name: "dteconsentappclient.fragment.Buildingdetail",
                controller: this
            }).then(function (oFragment) {
                let flexItems = []
                 // Create a new text label for Consumer Email Id
                if(index > 0){
                const buildingInfoLabel = new sap.m.Title({
                    text:  `Location ${index + 1}`,
                    titleStyle: 'H6'
                });
                buildingInfoLabel.addStyleClass("location-inner-title");
                    flexItems = [buildingInfoLabel]
                }
                oFragment.setModel(oModel, "locationMoel");
                oFragment.bindElement(`locationModel>/locations/${index}`);
                const wrapper = new sap.m.FlexBox({
                    items: [...flexItems, oFragment],
                    direction: 'Column',
                });
                if(index > 0) wrapper.addStyleClass('location-additional-container');
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

        handleSubmit: async function () {
            const enrollFormData = this.getView().getModel("oEnrollModel").getData(); // Use the same model name as above
            console.log(enrollFormData);

            let location = this.getView().getModel("locationModel").getData();
            console.log(location);
        }
    });
});