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

            this.dqmAddresses = [
                {
                  "formattedAddress": "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
                  "address": {
                    "houseNumber": "1600",
                    "streetName": "Amphitheatre Pkwy",
                    "city": "Mountain View",
                    "state": "California",
                    "postalCode": "94043",
                    "country": "United States",
                    "countryCode": "US"
                  }
                },
                {
                  "formattedAddress": "1 Infinite Loop, Cupertino, CA 95014, USA",
                  "address": {
                    "houseNumber": "1",
                    "streetName": "Infinite Loop",
                    "city": "Cupertino",
                    "state": "California",
                    "postalCode": "95014",
                    "country": "United States",
                    "countryCode": "US"
                  }
                },
                {
                  "formattedAddress": "350 5th Ave, New York, NY 10118, USA",
                  "address": {
                    "houseNumber": "350",
                    "streetName": "5th Ave",
                    "city": "New York",
                    "state": "New York",
                    "postalCode": "10118",
                    "country": "United States",
                    "countryCode": "US"
                  }
                },
                {
                  "formattedAddress": "221B Baker St, London NW1 6XE, UK",
                  "address": {
                    "houseNumber": "221B",
                    "streetName": "Baker St",
                    "city": "London",
                    "state": "England",
                    "postalCode": "NW1 6XE",
                    "country": "United Kingdom",
                    "countryCode": "GB"
                  }
                },
                {
                  "formattedAddress": "Eiffel Tower, Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
                  "address": {
                    "houseNumber": "",
                    "streetName": "Champ de Mars, 5 Av. Anatole France",
                    "city": "Paris",
                    "state": "Île-de-France",
                    "postalCode": "75007",
                    "country": "France",
                    "countryCode": "FR"
                  }
                },
                {
                  "formattedAddress": "10 Downing St, London SW1A 2AA, UK",
                  "address": {
                    "houseNumber": "10",
                    "streetName": "Downing St",
                    "city": "London",
                    "state": "England",
                    "postalCode": "SW1A 2AA",
                    "country": "United Kingdom",
                    "countryCode": "GB"
                  }
                },
                {
                  "formattedAddress": "500 Terry A Francois Blvd, San Francisco, CA 94158, USA",
                  "address": {
                    "houseNumber": "500",
                    "streetName": "Terry A Francois Blvd",
                    "city": "San Francisco",
                    "state": "California",
                    "postalCode": "94158",
                    "country": "United States",
                    "countryCode": "US"
                  }
                }
              ];

              
            const oAddressModel = new sap.ui.model.json.JSONModel({
                dqmAddress: this.dqmAddresses
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

        onsuggestionItemSelected: function(oEvent){  
            const selectedValue = oEvent.getParameter('selectedItem');
            console.log(selectedValue); 
        },

        onRemoveTrigger: function(oEvent){
          console.log('Check Button trigger', oEvent);
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