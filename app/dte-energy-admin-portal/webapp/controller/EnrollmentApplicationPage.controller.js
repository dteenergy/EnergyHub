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
    onInit: function() {
      // Retrieve the base URL and filter data from the view's data
      const { baseUrl, filteredApplicationNumber, filteredApplicationStatus, filteredFirstName, filteredLastName, tenantConsentFormURL} = this.getView().getViewData();
      this.baseUrl = baseUrl;
      this.sAppNumber = filteredApplicationNumber;
      this.sFirstName = filteredFirstName;
      this.sLastName = filteredLastName;
      this.sApplicationStatus = filteredApplicationStatus;
      this.tenantConsentFormURL = tenantConsentFormURL;

      // Populate the filters with initial values if they are defined
      if(!["", undefined].includes(this.sAppNumber)) this.byId("idAppNumberFilter").setValue(this.sAppNumber);
      if(!["", undefined].includes(this.sFirstName)) this.byId("idFirstNameFilter").setValue(this.sFirstName);
      if(!["", undefined].includes(this.sLastName)) this.byId("idLastNameFilter").setValue(this.sLastName);
      if(!["", undefined].includes(this.sApplicationStatus)) this.byId("idApplicationStatusFilter").setSelectedKey(this.sApplicationStatus);
      
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
        table: this.byId("idApplicationTable")
      });

      // Apply initial filters
      this.onFilterChange();
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
     * Handles changes in the filter fields and
     * applies the corresponding filters to the table.
     *
     * @public
     */
    onFilterChange: function () {
      // Retrieve the binding of the application table's items aggregation
      const oApplicationTable = this.byId("idApplicationTable");
      const oBinding = oApplicationTable.getBinding("items");

      // Validate the binding
      if (!oBinding) {
        MessageBox.error("Table binding not found!")
        return;
      }

      // Collect filter values from input fields
      this.sAppNumber = this.byId("idAppNumberFilter").getValue(); // Application Number Filter
      this.sFirstName = this.byId("idFirstNameFilter").getValue(); // First Name Filter
      this.sLastName = this.byId("idLastNameFilter").getValue(); // Last Name Filter
      this.sApplicationStatus = this.byId("idApplicationStatusFilter").getSelectedKey(); // Application Status Filter

      // Create an array for filters
      const aFilters = [];

      // Add filters if values are not empty
      if (this.sAppNumber)
        aFilters.push(new Filter({path: "ApplicationNumber", operator: FilterOperator.Contains, value1: this.sAppNumber, caseSensitive: false}));

      if (this.sFirstName)
        aFilters.push(new Filter({path: "FirstName", operator: FilterOperator.Contains, value1: this.sFirstName, caseSensitive: false}));

      if (this.sLastName)
        aFilters.push(new Filter({path: "LastName", operator: FilterOperator.Contains, value1: this.sLastName, caseSensitive: false}));

      if (this.sApplicationStatus) aFilters.push(new Filter("ApplicationStatus", FilterOperator.EQ, this.sApplicationStatus));

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
      // Retrieve the button and its parent list item
      const oButton = oEvent.getSource();
      const oListItem = oButton.getParent();

      // Validate the list item
      if (!oListItem) {
        console.error("Parent List Item is missing for this button.");
        return;
      }

      // Retrieve the binding context for the selected row
      const oBindingContext = oListItem.getBindingContext("MainModel"); // Get the binding context

      // Get the binding context of the selected row
      if (!oBindingContext) {
        console.error("Binding context is missing for this row.");
        return;
      }

      // Extract application ID from the binding context
      const appId = oBindingContext.getProperty("AppId");

      try {
        // Make an API call to generate the URL
        const {data} = await axios.get(this.baseUrl+`admin/service/ApplicationDetail(${appId})/GenerateUrl`);        

        // Set the generated URL to the input box
        const linkInputBox = this.byId("linkInput");
        linkInputBox.setText(`${this.tenantConsentFormURL}${data.value.generatedUrl}`);

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
    },
    /**
     * Formats the company address into a single string based on the provided components.
     *
     * This function checks if the second address line (`CompanyAddrLineTwo`) is empty,
     * undefined, or null. If it is, the formatted address excludes the second line.
     * Otherwise, it includes all address components.
     *
     * @param {string} CompanyAddress - The primary address line of the company.
     * @param {string} CompanyAddrLineTwo - The optional second address line of the company.
     * @param {string} City - The city where the company is located.
     * @param {string} State - The state where the company is located.
     * @returns {string} A formatted address string that includes all non-empty components.
     */
    formatCompanyAddress: function (CompanyAddress, CompanyAddrLineTwo, City, State) {
      if(["", undefined, null].includes(CompanyAddrLineTwo)) return `${CompanyAddress}, ${City}, ${State}`;
      else return `${CompanyAddress}, ${CompanyAddrLineTwo}, ${City}, ${State}`;
    },
    /**
     * Navigates to the building detail page dynamically based on the selected row's data.
     *
     * @param {sap.ui.base.Event} oEvent - The event triggered by selection.
     * @public
     */
    navToBuildingDetailPage: async function (oEvent) {
      // Get the selected row's binding context
      const oSelectedItem = oEvent.getSource();
      const oContext = oSelectedItem.getBindingContext("MainModel");
      const AppId = oContext.getProperty("AppId"); // Retrieve the AppId from the context
      const FirstName = oContext.getProperty("FirstName");
      const LastName = oContext.getProperty("LastName");
      const ApplicationNumber = oContext.getProperty("ApplicationNumber");

      // Get the VBox id (EnrollmentApplicationPage)
      const oVBox = this.byId("idApplicationVBox");

      // Clear the existing content
      oVBox.destroyItems();

      // Dynamically create and add the new view for building detail page
      sap.ui.core.mvc.XMLView.create({
        viewData: {
          baseUrl: this.baseUrl, AppId: AppId, ApplicationNumber: ApplicationNumber,
          FirstName: FirstName, LastName: LastName, filteredApplicationNumber: this.sAppNumber,
          filteredApplicationStatus: this.sApplicationStatus,
          filteredFirstName: this.sFirstName, filteredLastName: this.sLastName
        },
        viewName: `dteenergyadminportal.view.BuildingDetailPage`
      }).then(function (oView) {
        oVBox.addItem(oView);
      });
    },
    /**
     * Navigates to the Consent Page dynamically, based on the selected application's AppId.
     * Clears the existing content of the VBox and loads the Consent Page view.
     *
     * @param {sap.ui.base.Event} oEvent - The event triggered by the button press.
     * @public
     */
    navToConsentPage: function(oEvent) {
      // Retrieve the button and its parent list item
      const oButton = oEvent.getSource();
      const oListItem = oButton.getParent();

      // Validate the list item
      if (!oListItem) {
        console.error("Parent List Item is missing for this button.");
        return;
      }

      // Retrieve the binding context for the selected row
      const oBindingContext = oListItem.getBindingContext("MainModel"); // Get the binding context

      // Get the binding context of the selected row
      if (!oBindingContext) {
        console.error("Binding context is missing for this row.");
        return;
      }

      // Extract application ID from the binding context
      const appId = oBindingContext.getProperty("AppId");

      // Get the VBox id (EnrollmentApplicationPage)
      const oVBox = this.byId("idApplicationVBox");

      // Clear the existing content
      oVBox.destroyItems();

      // Dynamically create and add the view for consent page
      sap.ui.core.mvc.XMLView.create({
        viewData: { baseUrl: this.baseUrl, AppId: appId },
        viewName: `dteenergyadminportal.view.ConsentsPage`
      }).then(function (oView) {
        oVBox.addItem(oView);
      });
    }
  });
});