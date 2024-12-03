sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], (Controller, Fragment) => {
    "use strict";

    return Controller.extend("dteconsentapp.controller.Landlord", {
        onInit() {
            const oModel = new sap.ui.model.json.JSONModel({
                locations: [] // Array to hold all building location data
            });
            this.getView().setModel(oModel, "locationModel");
            this.onAddAnotherLocation();
              
            const oAddressModel = new sap.ui.model.json.JSONModel({
                dqmAddress: [] // Array to hold the suggestion addresses
            });

            this.getView().setModel(oAddressModel, 'dqmAddressModel');
              
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
                name: "dteconsentapp.fragment.Buildingdetail",
                controller: this
            }).then(function(oFragment){
                oFragment.setModel(oModel, "locationMoel");
                oFragment.bindElement(`locationModel>/locations/${index}`);
                buildingmainContainer.addItem(oFragment);
            }).catch(function (err){
                console.log(`Failed to load fragment:, ${err}`)
            });
        },

        onbuildingLocationAddressChange: async function(oEvent){

          const oView = this.getView();
          const oAddModel = oView.getModel("dqmAddressModel");
          
          const newValue = oEvent.getParameter("value");
          const subscription_key = "FHSdLToNjfzJbP0DyZrAuSadyk3cv3433c5uggPL80yV60ZxQ1NCJQQJ99ALACYeBjFqbPoVAAAgAZMP4eHm&typeahead=true";

          const {data} = await axios.get(`https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&query=${newValue}&subscription-key=${subscription_key}&idxSet=POI,PAD`)
          // console.log(data.results);

          oAddModel.setProperty("/dqmAddress", data.results)
        },

        onsuggestionItemSelected: function(oEvent){
          console.log(oEvent);
            
          const addressField = oEvent.getSource();
          const oBindingContext = addressField.getBindingContext();
          console.log(oBindingContext);
          
          const selectedValue = oEvent.getParameter('selectedItem');
          console.log(selectedValue?.oPropagatedProperties?.oBindingContexts?.getPath()); 
        },

        onRemoveTrigger: function(oEvent){
          const oButton = oEvent.getSource();
          const oFragment = oButton.getParent();

          const buildingDetailmainContainer = this.byId("building_detail_main_container");
          buildingDetailmainContainer.removeItem(oFragment);
          oFragment.destroy();
        },

        onSubmit: function(){
            const oView = this.getView();
            const oModel = oView.getModel("locationModel");
            const aLocations = oModel.getProperty("/locations");
            console.log(aLocations);
        }
    });
});