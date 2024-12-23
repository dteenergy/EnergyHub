sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/comp/personalization/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
], (BaseController, PersonalizationController, Filter, FilterOperator) => {
  "use strict";

  return BaseController.extend("dteenergyadminportal.controller.EnrollmentApplicationPage", {
    onInit() {
      const { baseUrl } = this.getView().getViewData();
      console.log(this.getView().getViewData());
      
      this.baseUrl = baseUrl;
      console.log(this.baseUrl);
      

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
    onGenerateUrlPress: async function(oEvent) {
      var oButton = oEvent.getSource(); // Get the button
      var oListItem = oButton.getParent(); // Get the parent ColumnListItem

      if (!oListItem) {
        sap.m.MessageBox.error("Parent List Item is missing for this button.");
        return;
      }

      var oBindingContext = oListItem.getBindingContext("MainModel"); // Get the binding context

      if (!oBindingContext) {
        sap.m.MessageBox.error("Binding context is missing for this row.");
        return;
      }

      var sAppId = oBindingContext.getProperty("AppId"); // Fetch AppId
      console.log("AppId: ", sAppId);
      console.log(this.baseUrl+`admin/service/ApplicationDetail(${sAppId})/GenerateUrl`);
      

      const {data} = await axios.get(this.baseUrl+`admin/service/ApplicationDetail(${sAppId})/GenerateUrl`)
      console.log(data.value);
      const oInput = this.byId("linkInput");
      oInput.setText(data.value);

      // Open the dialog
      this.byId("linkDialog").open();
      

      // // Get the button's parent row binding context
      // var oButton = oEvent.getSource();
      // var oRowContext = oButton.getBindingContext("MainModel"); // Assuming "MainModel" is the model name

      // // Extract AppId from the row
      // var sAppId = oRowContext.getProperty("AppId");

      // // Check if AppId exists
      // if (!sAppId) {
      //   sap.m.MessageBox.error("AppId is missing for this row.");
      //   return;
      // }

      // // Bind the function with parameters
      // var oModel = this.getView().getModel("MainModel");
      
    },
    onCloseDialog: function() {
      // Close the dialog
      this.byId("linkDialog").close();
    },
    onCopyLink: function() {
      var oInput = this.byId("linkInput");
      var sLink = oInput.getValue();
  
      // Copy the link to clipboard
      navigator.clipboard.writeText(sLink).then(function() {
          sap.m.MessageToast.show("Link copied to clipboard!");
      }).catch(function(err) {
          sap.m.MessageToast.show("Failed to copy link.");
      });
    },
    onAfterRendering: function() {
      // Listen for any changes to the model and show success
      var oModel = this.getView().getModel("MainModel");
      oModel.attachRequestCompleted(function() {
          sap.m.MessageToast.show("Changes have been successfully saved.");
      });
    }
  });
});