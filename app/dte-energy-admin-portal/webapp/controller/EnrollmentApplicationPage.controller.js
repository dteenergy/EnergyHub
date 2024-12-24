sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/comp/personalization/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], (BaseController, PersonalizationController, Filter, FilterOperator, MessageBox, MessageToast) => {
  "use strict";

  return BaseController.extend("dteenergyadminportal.controller.EnrollmentApplicationPage", {
    /**
     * Initializes the controller and
     * sets up the personalization controller for the table.
     * Sets the base URL and initializes the MainModel.
     *
     * @public
     */
    onInit() {
      // Retrieve the base URL from the view data
      const { baseUrl } = this.getView().getViewData();
      this.baseUrl = baseUrl;
      
      const model = new sap.ui.model.odata.v4.ODataModel({
        serviceUrl: `${this.baseUrl}admin/service/`,
        synchronizationMode: "None",
        operationMode: "Server",
      });

      this.getView().setModel(model, "MainModel");

      // Initialize the Personalization Controller for the application table
      this.oPersonalizationController = new PersonalizationController({
        table: this.byId("idApplicationTable")
      });
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
      // Retrieve the application table and its binding
      const oApplicationTable = this.byId("idApplicationTable");
      const oBinding = oApplicationTable.getBinding("items");

      // Validate the binding
      if (!oBinding) {
        MessageBox.error("Table binding not found!")
        return;
      }

      // Get values from the filters inputs
      const sFirstName = this.byId("idFirstNameFilter").getValue(); // First Name Filter
      const sLastName = this.byId("idLastNameFilter").getValue(); // Last Name Filter
      const sApplicationStatus = this.byId("idApplicationStatusFilter").getSelectedKey(); // Application Status Filter

      // Create an array for filters
      const aFilters = [];

      // Add filters if values are not empty
      if (sFirstName)
        aFilters.push(new Filter({path: "AccountDetailRefId/FirstName", operator: FilterOperator.Contains, value1: sFirstName, caseSensitive: false}));

      if (sLastName)
        aFilters.push(new Filter({path: "AccountDetailRefId/LastName", operator: FilterOperator.Contains, value1: sLastName, caseSensitive: false}));

      if (sApplicationStatus) aFilters.push(new Filter("ApplicationStatus", FilterOperator.EQ, sApplicationStatus));

      // Combine filters with AND logic
      const oCombinedFilter = new Filter({
        filters: aFilters,
        and: true
      });

      // Apply the combined filter or clear filters
      oBinding.filter(aFilters.length > 0 ? oCombinedFilter : []);
    },
    /**
     * Generates a URL for the selected application and displays it in a dialog.
     *
     * @param {sap.ui.base.Event} oEvent - The event triggered by button press.
     * @public
     */
    onGenerateUrlPress: async function(oEvent) {
      // Get the button and its parent list item
      const oButton = oEvent.getSource();
      const oListItem = oButton.getParent();

      // Validate the list item
      if (!oListItem) {
        MessageBox.error("Parent List Item is missing for this button.");
        return;
      }

      // Retrieve the binding context for the selected row
      const oBindingContext = oListItem.getBindingContext("MainModel"); // Get the binding context

      if (!oBindingContext) {
        MessageBox.error("Binding context is missing for this row.");
        return;
      }

      // Extract application ID from the binding context
      const appId = oBindingContext.getProperty("AppId");

      try {
        // Call the API to generate the URL
        const {data} = await axios.get(this.baseUrl+`admin/service/ApplicationDetail(${appId})/GenerateUrl`);

        // Set the generated URL to the input box
        const linkInputBox = this.byId("linkInput");
        linkInputBox.setText(data.value.generatedUrl);

        // Open the dialog to display the generated URL
        this.byId("linkDialog").open();
      } catch (error) {
        MessageBox.error("Failed to generate the URL.");
      }
    },
    /**
     * Closes the dialog - displaying the generated link.
     *
     * @public
     */
    onCloseDialog: function() {
      // Close the link dialog
      this.byId("linkDialog").close();
    },
    /**
     * Copies the generated link to the clipboard and displays a confirmation message.
     *
     * @public
     */
    onCopyLink: function() {
      // Get the link from the input box
      var linkInputBox = this.byId("linkInput");
      var sLink = linkInputBox.getText();
  
      // Copy the link to clipboard
      navigator.clipboard.writeText(sLink).then(function() {
        MessageToast.show("Link copied to clipboard!");
      }).catch(function(err) {
        MessageToast.show("Failed to copy link.");
      });
    },
    /**
     * Submits batch updates to the backend for saving changes to the application fields.
     * And display the message(success/error).
     *
     * @public
     */
    onUpdateField: async function() {
      const updateModel = this.getView().getModel("MainModel");

      updateModel.submitBatch('CustomGroupId')
        .then(() => MessageToast.show("Updated successfully!"))
        .catch((err) => MessageToast.show("Updation failed : ", err))
    }
  });
});