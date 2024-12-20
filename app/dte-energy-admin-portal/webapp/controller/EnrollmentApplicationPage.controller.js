sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/comp/personalization/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
], (BaseController, PersonalizationController, Filter, FilterOperator) => {
  "use strict";

  return BaseController.extend("dteenergyadminportal.controller.EnrollmentApplicationPage", {
    onInit() {
      this.getView().setModel("MainModel");

      // Initialize the Personalization Controller
      this._oPersonalizationController = new PersonalizationController({
        table: this.byId("idApplicationTable"), // Your table ID
        // afterP13nModelDataChange: this.onPersonalizationChange.bind(this),
      });
    },
    setupPersonalization: function () {
      this._oPersonalizationController.openDialog();
    },
    onFilterChange: function () {
      const oTable = this.byId("idApplicationTable");
      const oBinding = oTable.getBinding("items");

      if (!oBinding) {
        console.error("Table binding not found!");
        return;
      }

      // Get values from the filters
      const sFirstName = this.byId("idFirstNameFilter").getValue(); // Assuming an Input field
      const sLastName = this.byId("idLastNameFilter").getValue(); // Assuming an Input field
      const sApplicationStatus = this.byId("idApplicationStatusFilter").getSelectedKey(); // Assuming a ComboBox

      // Create filter array
      const aFilters = [];

      // Add filters if the values are not empty
      if (sFirstName)
        aFilters.push(new Filter({path: "AccountDetailRefId/FirstName", operator: FilterOperator.Contains, value1: sFirstName, caseSensitive: false}));

      if (sLastName)
        aFilters.push(new Filter({path: "AccountDetailRefId/LastName", operator: FilterOperator.Contains, value1: sLastName, caseSensitive: false}));

      if (sApplicationStatus) aFilters.push(new Filter("ApplicationStatus", FilterOperator.EQ, sApplicationStatus));

      // Combine filters with AND logic
      const oCombinedFilter = new Filter({
        filters: aFilters,
        and: true // Both conditions must be met
      });

      // Apply combined filter to the table
      oBinding.filter(aFilters.length > 0 ? oCombinedFilter : []);
    },
    onApplicationStatusChange(oEvent) {
      // const sSelectedKey = oEvent.getParameter("selectedItem").getKey();
      // const oContext = oEvent.getSource().getBindingContext("MainModel");
      // const oModel = oContext.getModel("MainModel");
      // const sPath = oContext.getPath(); // Relative path to the item in the model

      // // Perform the OData update
      // oModel.update(sPath, { ApplicationStatus: sSelectedKey }, {
      // 		success: () => {
      // 				sap.m.MessageToast.show("Application status updated successfully.");
      // 		},
      // 		error: (oError) => {
      // 				sap.m.MessageBox.error("Failed to update application status.");
      // 				console.error("Update Error:", oError);
      // 		}
      // });



      // const sSelectedKey = oEvent.getParameter("selectedItem").getKey();
      // const oContext = oEvent.getSource().getBindingContext("MainModel");

      // console.log(sSelectedKey);
      // console.log(oContext);
      // console.log(oContext.getPath().slice(1) + "/ApplicationStatus");


      // // Update the model with the new status
      // oContext.getModel("MainModel").setProperty(oContext.getPath().slice(1) + "/ApplicationStatus", sSelectedKey);

      // // Log or perform additional actions if necessary
      // console.log("Application Status updated to:", sSelectedKey);



      // Get the selected value from the ComboBox
      const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

      // Get the context of the row where the change occurred
      const oContext = oEvent.getSource().getBindingContext("MainModel");
      const sPath = oContext.getPath(); // Relative path to the item in the model

      // Get the OData model
      const oModel = oContext.getModel("MainModel");

      console.log(oModel instanceof sap.ui.model.odata.v2.ODataModel);
      
      if (oModel instanceof sap.ui.model.odata.v2.ODataModel) {
        // Create an object to update the ApplicationStatus
        const oUpdatedData = {
          ApplicationStatus: sSelectedKey
        };

        // Perform the OData update
        oModel.update(sPath, oUpdatedData, {
          success: () => {
            sap.m.MessageToast.show("Application Status updated successfully.");
          },
          error: (oError) => {
            sap.m.MessageBox.error("Failed to update application status.");
            console.error("Update Error:", oError);
          }
        });
      }
    },
  });
});