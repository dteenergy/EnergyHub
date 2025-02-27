sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/comp/personalization/Controller",
], (BaseController, PersonalizationController) => {
  "use strict";

  /**
   * Controller for the Building Detail Page.
   * Manages initialization, personalization, and navigation for building-related data.
   */
  return BaseController.extend("dteenergyadminportal.controller.BuildingDetailPage", {
    /**
     * Initializes the controller.
     * - Retrieves and sets view-specific data passed via viewData.
     * - Configures an OData V4 model for data binding.
     * - Applies a filter to show only building details related to the selected application ID.
     * - Initializes the personalization controller for the building table.
     *
     * @public
     */
    onInit: async function () {
      let sortedBuildingDetail = [];
      // Destructure view data properties
      const {
        baseUrl,
        AppId,
        ApplicationNumber,
        FirstName,
        LastName,
        filteredApplicationNumber,
        filteredApplicationStatus,
        filteredFirstName,
        filteredLastName,
        tenantConsentFormURL,
        filteredAppIds
       } = this.getView().getViewData();

      // Set instance variables for later use
      this.baseUrl = baseUrl;
      this.sAppNumber = filteredApplicationNumber;
      this.sFirstName = filteredFirstName;
      this.sLastName = filteredLastName;
      this.sApplicationStatus = filteredApplicationStatus;
      this.tenantConsentFormURL = tenantConsentFormURL;

      this.handleSessionExpiry(this.baseUrl);

      // Update UI with application number and landlord name
      this.byId("idAppNumberId").setText(ApplicationNumber);
      this.byId("idLandlordName").setText(FirstName+" "+LastName);

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

      // Apply a filter to display only relevant building details for the given AppId
      const oTable = this.byId("idBuildingTable");
      const oBinding = oTable.getBinding("items");

      // Apply filters to show only relevant AppIds
      const aFilters = filteredAppIds.map(appId => new sap.ui.model.Filter("AppId", sap.ui.model.FilterOperator.EQ, appId));

      // Apply filtering and sorting
      if (oBinding) oBinding.filter(new sap.ui.model.Filter({ filters: aFilters, and: false }));
    },
    /**
     * Opens the personalization dialog for the building table.
     * Allows users to customize table columns and settings.
     *
     * @public
     */
    setupPersonalization: function () {
      this.oPersonalizationController.openDialog();
    },
    /**
     * Formats the second address line by providing a default value if it's empty or undefined.
     *
     * If the provided second address line (`AddrLineTwo`) is empty, undefined, or null,
     * the function returns a value ("-"). Otherwise, it returns the original value.
     *
     * @param {string} AddrLineTwo - The second address line to be formatted.
     * @returns {string} The formatted second address line or a placeholder ("-") if empty.
     */
    formatAddrLineTwo: function (AddrLineTwo) {
      if(["", undefined, null].includes(AddrLineTwo)) return '-';
      else return AddrLineTwo;
    },
    /**
     * Navigates back to the Enrollment Application Page dynamically.
     * Clears the current content of the VBox and loads the Enrollment Application Page view.
     *
     * @public
     */
    navToApplication: function () {
      // Get the VBox id (EnrollmentApplicationPage)
      const oVBox = this.byId("idBuildingVBox");

      // Clear the existing content
      oVBox.destroyItems();

      // Dynamically create and add the Enrollment Application Page view
      sap.ui.core.mvc.XMLView.create({
        viewData: {
          baseUrl: this.baseUrl, filteredApplicationNumber: this.sAppNumber,
          filteredLastName: this.sLastName, filteredFirstName: this.sFirstName,
          filteredApplicationStatus: this.sApplicationStatus,
          tenantConsentFormURL: this.tenantConsentFormURL
        },
        viewName: `dteenergyadminportal.view.EnrollmentApplicationPage`
      }).then(function (oView) {
        // Add the newly created view to the VBox
        oVBox.addItem(oView);
      });
    }
  });
});