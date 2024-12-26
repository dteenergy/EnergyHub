sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/comp/personalization/Controller",
], (BaseController, PersonalizationController) => {
  "use strict";

  return BaseController.extend("dteenergyadminportal.controller.BuildingDetailPage", {
    onInit() {
      const { baseUrl, AppId } = this.getView().getViewData();
      this.baseUrl = baseUrl;
      console.log(AppId);
      
      this.byId("idAppId").setText(AppId);

      // Create an OData V4 model using the constructed service URL
      const model = new sap.ui.model.odata.v4.ODataModel({
        serviceUrl: `${this.baseUrl}admin/service/`,
        synchronizationMode: "None",
        operationMode: "Server",
      });

      // Set the newly created model as the "MainModel" for this view
      this.getView().setModel(model, "MainModel");

      // Initialize the Personalization Controller for the application table
      this.oPersonalizationController = new PersonalizationController({
        table: this.byId("idBuildingTable")
      });

      const oTable = this.byId("idBuildingTable"); // Ensure this ID matches your XML table ID

      // Apply a filter to fetch only BuildingDetail entries related to the selected AppId
      const oBinding = oTable.getBinding("items");
      const oFilter = new sap.ui.model.Filter("AppId", "EQ", AppId);

      if (oBinding) {
        oBinding.filter([oFilter]);
      }
    },
    // onAfterRendering: async function () {
    //   const oModel = this.getView().getModel("MainModel");
    //   const aData = await oModel.requestObject("/BuildingDetail");
    //   console.log(aData);
      
    // },
    /**
     * Opens the personalization dialog for the application table.
     *
     * @public
     */
    setupPersonalization: function () {
      this.oPersonalizationController.openDialog();
    },
  });
});