sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/ui/comp/personalization/Controller"
], (BaseController, Filter, FilterOperator, MessageToast, PersonalizationController) => {
  "use strict";

  return BaseController.extend("dteenergyadminportal.controller.ConsentsPage", {
    /**
     * Initializes the controller for the view.
     * - Retrieves the base URL and application ID from the view data.
     * - Creates and sets up the OData V4 model for the view.
     * - Configures the personalization controller for the application consent table.
     * - Publishes an event to set the selected key for the welcome page.
     * - Filters the consent table items based on the provided application ID.
     *
     * @public
     */
    onInit() {
      // Retrieve the base URL from the view data
      const { baseUrl, AppId } = this.getView().getViewData();
      this.baseUrl = baseUrl;
      this.AppId = AppId;

      this.handleSessionExpiry(this.baseUrl);

      // Create an OData V4 model using the constructed service URL
      const model = new sap.ui.model.odata.v4.ODataModel({
        serviceUrl: `${this.baseUrl}admin/service/`,
        synchronizationMode: "None",
        operationMode: "Server",
      });

      // Set the newly created model as the "MainModel" for this view
      this.getView().setModel(model, "MainModel");

      this.oPersonalizationController = new PersonalizationController({
        table: this.byId("idApplicationConsentTable")
      });

      // If AppId is available, publish an event and apply a filter to the table items.
      if(this.AppId) {
        const setSelectedKeyBus = sap.ui.getCore().getEventBus();
        setSelectedKeyBus.publish("welcomePage", "setSelectedKeyEvent");

        // Get the table and its binding
        const oTable = this.byId("idApplicationConsentTable");
        const oBinding = oTable.getBinding("items");

        if (!oBinding) {
            console.error("Binding for the table is not found.");
            return;
        }

        // Create a filter for AppId
        const oFilter = new Filter({ path: "AppId", operator: FilterOperator.EQ, value1: this.AppId });

        // Apply the filter
        oBinding.filter([oFilter]);
      }
    },

    /**
     * Opens the personalization dialog for the application table.
    *
    * @public
    */
    setupPersonalization: function () {
      this.oPersonalizationController.openDialog();
    },

    /**
    * Handles filter changes for the application table and
    * applies the corresponding filters.
    *
    * @public
    */
    onFilterChange: function () {
      this.handleSessionExpiry(this.baseUrl);
      
      // Retrieve the application consent table and its binding
      const oTable = this.byId("idApplicationConsentTable")
      const oBinding = oTable.getBinding("items");

      // Validate the binding
      if (!oBinding) {
        console.error("Binding for the table is not found");
        return;
      }

      /**
       *  Get values from the filters inputs
       *  Firstname, Lastname and Consentstatus
       */
      const firstName = this.byId("idFilterFirstName").getValue();
      const lastName = this.byId("idFilterLastName").getValue();
      const appNumber = this.byId("idFilterAppNumber").getValue();
      const consentStatus = this.byId("idConsentStatusFilter").getSelectedKey();

      // Array for filter
      const filterData = [];

      // Handle the filters value
      if (this.AppId) filterData.push(new Filter({ path: "AppId", operator: FilterOperator.Contains, value1: this.AppId }))
      if (firstName) filterData.push(new Filter({ path: "FirstName", operator: FilterOperator.Contains, value1: firstName, caseSensitive: false }));
      if (lastName) filterData.push(new Filter({ path: "LastName", operator: FilterOperator.Contains, value1: lastName, caseSensitive: false }));
      if (appNumber) filterData.push(new Filter({ path: "ApplicationNumber", operator: FilterOperator.Contains, value1: appNumber, caseSensitive: false }));
      if (consentStatus) filterData.push(new Filter({path: "ConsentStatus", operator: FilterOperator.EQ, value1: consentStatus}));

      // Combine filter logic.
      const combinedFilter = new Filter({
        filters: filterData,
        and: true
      });

      // Bind the combined filter or clear filter.
      oBinding.filter(filterData.length > 0 ? combinedFilter : [])
    },

    /**
     * Handles the update of application status triggered by a ComboBox selection.
     *
     * @param {sap.ui.base.Event} oEvent - The event object triggered by the ComboBox selection.
     */
    handleResponse: function (oEvent) {
      const oSource = oEvent.getSource(); // The ComboBox triggering the event
      const sNewValue = oSource.getSelectedKey(); // Get the new selected key
      const oContext = oSource.getBindingContext("MainModel"); // Get the row context
      const updateModel = this.getView().getModel("MainModel"); // Get the OData V4 model

      if (!sNewValue) {
        // If no value is selected, set the ComboBox to an error state
        oSource.setValueState("Error");
        oSource.setValueStateText("Please select a valid Application Status.");
        return; // Stop further processing
      }
    
      // Clear any previous error state
      oSource.setValueState("None");

      // Update the backend with the new value
      oContext.setProperty("ApplicationStatus", sNewValue); // Set the property locally

      // Submit the changes to the backend
      updateModel.submitBatch("batchGroupId").then(() => {
        sap.m.MessageToast.show("Consent status updated successfully!");
      }).catch((oError) => {
        // Parse and display the error from the backend
        const sErrorMessage = JSON.parse(oError.responseText).error.message;
        oSource.setValueState("Error");
        oSource.setValueStateText(sErrorMessage);
        sap.m.MessageBox.error(sErrorMessage);
      });
    }
  });
});