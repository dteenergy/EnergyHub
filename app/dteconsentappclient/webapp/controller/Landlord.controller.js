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
            AccountDetail: {}
        };

        // Set the JSONModel with the correct name
        const oEnrollModel = new JSONModel(oEnrollFormData);
        this.getView().setModel(oEnrollModel, "enrollModel");

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
                oFragment.setModel(oModel, "locationMoel");
                oFragment.bindElement(`locationModel>/locations/${index}`);
                buildingmainContainer.addItem(oFragment);
            }).catch(function (err) {
                console.log(`Failed to load fragment:, ${err}`)
            });
        },

        handleSubmit: async function () {
            const {data} = await axios.get(`${this.SERVERHOST}service/DTEApplicationDetail`);

            
            console.log(data.value[0], 'While clicking submit');
        }
    });
});