sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/comp/personalization/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "dteenergyadminportal/utils/LinkEHApplication",
  "dteenergyadminportal/utils/UnLinkEHApplication"
], (BaseController, PersonalizationController, Filter, FilterOperator, MessageBox, MessageToast, LinkEHApplication, UnLinkEHApplication) => {
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
      const { baseUrl, filteredApplicationNumber, filteredApplicationStatus,
        filteredFirstName, filteredLastName, filteredAssignedTo,
        tenantConsentFormURL, filteredStartDate, filteredEndDate } = this.getView().getViewData();
      this.baseUrl = baseUrl;
      this.sAppNumber = filteredApplicationNumber;
      this.sFirstName = filteredFirstName;
      this.sLastName = filteredLastName;
      this.sAssignedTo = filteredAssignedTo;
      this.sApplicationStatus = filteredApplicationStatus;
      this.tenantConsentFormURL = tenantConsentFormURL;
      this.sStartDate = filteredStartDate;
      this.sEndDate = filteredEndDate;

      this.handleSessionExpiry(this.baseUrl);

      // Populate the filters with initial values if they are defined
      if(!["", undefined].includes(this.sAppNumber)) this.byId("idAppNumberFilter").setValue(this.sAppNumber);
      if(!["", undefined].includes(this.sFirstName)) this.byId("idFirstNameFilter").setValue(this.sFirstName);
      if(!["", undefined].includes(this.sLastName)) this.byId("idLastNameFilter").setValue(this.sLastName);
      if(!["", undefined].includes(this.sAssignedTo)) this.byId("idAssignedToSearch").setValue(this.sAssignedTo);
      if(!["", undefined].includes(this.sApplicationStatus)) this.byId("idApplicationStatusFilter").setSelectedKey(this.sApplicationStatus);
      if(!["", undefined].includes(this.sStartDate)) this.byId("idStartDatePicker").setValue(this.sStartDate);
      if(!["", undefined].includes(this.sEndDate)) this.byId("idEndDatePicker").setValue(this.sEndDate);
      
      // Create an OData V4 model using the constructed service URL
      this.model = new sap.ui.model.odata.v4.ODataModel({
        serviceUrl: `${this.baseUrl}admin/service/`,
        synchronizationMode: "None",
        operationMode: "Server",
      });

      // Set the newly created model as the "MainModel" for this view
      this.getView().setModel(this.model, "MainModel");

      // Initialize the Personalization Controller for the application table
      this.oPersonalizationController = new PersonalizationController({
        table: this.byId("idApplicationTable")
      });

      // Apply initial filters
      this.onFilterChange();
    },
    /**
     * Fetches all application detail records from the MainModel.
     *
     * @returns {Promise<Array<Object>>} - A promise that resolves 
     * to an array of application detail records.
     */
    getAllApplicationDetailRecords: async function () {
      const oModel = this.getView().getModel("MainModel");

      // Retrieve binding contexts for all records in the ApplicationDetail entity
      const aData = await oModel.bindList("/ApplicationDetail").requestContexts();

      // Extract and return the actual data objects from the retrieved contexts
      const aAllRecords = await Promise.all(aData.map(ctx => ctx.requestObject()));

      return aAllRecords;
    },
    /**
     * Determines the CSS class for an application row based on its LinkId and ApplicationNumber.
     *
     * @param {string} LinkId - The ID to which the application is linked.
     * @param {string} ApplicationNumber - The unique identifier of the current application.
     * @returns {string} - The CSS class name to apply for indentation styling.
     */
    getIndentClass: function(LinkId, ApplicationNumber) {
      if(LinkId && (LinkId !== ApplicationNumber))
        return 'indentRow';
      else if(LinkId && (LinkId === ApplicationNumber))
        return 'parentApp';
      else '';
    },
    /**
     * Formats the ApplicationNumber by wrapping it in a span with a dynamic CSS class.
     * The function helps in visually distinguishing parent and child applications in the UI.
     *
     * @param {string} LinkId - The ID to which the application is linked.
     * @param {string} ApplicationNumber - The unique identifier of the current application.
     * @returns {string} - An HTML string with the formatted ApplicationNumber wrapped in a span.
     */
    formatApplicationNumber: function (LinkId, ApplicationNumber) {
      const sClass = this.getIndentClass(LinkId, ApplicationNumber);
      const sText = ApplicationNumber || ''; // Fallback to empty string if ApplicationNumber is undefined
      return '<span class="'+sClass+'">' + sText + '</span>';
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
    onFilterChange: async function () {
      this.handleSessionExpiry(this.baseUrl);
      
      // Retrieve the binding of the application table's items aggregation
      const oApplicationTable = this.byId("idApplicationTable");
      const oBinding = oApplicationTable.getBinding("items");

      // Validate the binding
      if (!oBinding) {
        console.error("Table binding not found!")
        return;
      }

      // Collect filter values from input fields
      this.sAppNumber = this.byId("idAppNumberFilter").getValue(); // Application Number Filter
      this.sFirstName = this.byId("idFirstNameFilter").getValue(); // First Name Filter
      this.sLastName = this.byId("idLastNameFilter").getValue(); // Last Name Filter
      this.sAssignedTo = this.byId("idAssignedToSearch").getValue(); // Updated By Search
      this.sApplicationStatus = this.byId("idApplicationStatusFilter").getSelectedKey(); // Application Status Filter
      this.sStartDate = this.byId("idStartDatePicker").getValue();
      this.sEndDate = this.byId("idEndDatePicker").getValue();

      // Create an array for filters
      const aFilters = [];

      /**
       * Filter with child application when search with parent ApplicationNumber
       * Otherwise it does filter with ApplicationNumber only
       */
      if (this.sAppNumber) {
        const aAllRecords = await this.getAllApplicationDetailRecords();
        const filteredIds = aAllRecords
            .filter(oApp => oApp.LinkId === this.sAppNumber)
            .map(item => item.ApplicationNumber);

        filteredIds.push(this.sAppNumber); // Include searched ApplicationNumber
        const uniqueFilteredIds = [...new Set(filteredIds)]; // Remove duplicates

        // Use 'Contains' instead of 'EQ' to allow partial searches
        const aApplicationFilters = uniqueFilteredIds.map(appNum =>
            new Filter("ApplicationNumber", FilterOperator.Contains, appNum, false)
        );

        // Use 'OR' logic (AND: false) to match any of the application numbers
        const oApplicationFilter = new Filter({
            filters: aApplicationFilters,
            and: false 
        });
      }

      if (this.sFirstName)
        aFilters.push(new Filter({path: "FirstName", operator: FilterOperator.Contains, value1: this.sFirstName, caseSensitive: false}));

      if (this.sLastName)
        aFilters.push(new Filter({path: "LastName", operator: FilterOperator.Contains, value1: this.sLastName, caseSensitive: false}));

      if (this.sAssignedTo)
        aFilters.push(new Filter({path: "AssignedTo", operator: FilterOperator.Contains, value1: this.sAssignedTo, caseSensitive: false}));

      if (this.sApplicationStatus) aFilters.push(new Filter("ApplicationStatus", FilterOperator.EQ, this.sApplicationStatus));

      if (this.sStartDate && this.sEndDate)
        aFilters.push(new Filter("AppCreatedAt", FilterOperator.BT, this.sStartDate, this.sEndDate));
      else if (this.sStartDate)
        aFilters.push(new Filter("AppCreatedAt", FilterOperator.GE, this.sStartDate));
      else if (this.sEndDate)
        aFilters.push(new Filter("AppCreatedAt", FilterOperator.LE, this.sEndDate));

      // Combine filters with AND logic
      const oCombinedFilter = new Filter({
        filters: aFilters,
        and: true
      });

      // Apply the combined filter or clear filters
      oBinding.filter(aFilters.length > 0 ? oCombinedFilter : []);
    },
    /**
     * Handles the press event for linking applications.
     * Delegates the action to the LinkEHApplication's handleLinkPress method.
     */
    handleLinkPress: function () {
      const that = this;
      LinkEHApplication.handleLinkPress(that);
    },
    handleUnLinkPress: function () {
      const that = this;
      UnLinkEHApplication.handleUnLinkPress(that);
    },
    /**
     * Handles the confirmation action for linking applications.
     * Delegates the action to the LinkEHApplication's onConfirmLink method.
     */
    onConfirmLink: function () {
      const that = this;
      LinkEHApplication.onConfirmLink(that);
    },
    /**
     * Handles the action to close the link dialog.
     * Delegates the action to the LinkEHApplication's onLinkCloseDialog method.
     */
    onLinkCloseDialog: function () {
      const that = this;
      LinkEHApplication.onLinkCloseDialog(that);
    },
    /** 
     * Generates a URL for the selected application and displays it in a dialog.
     *
     * @param {sap.ui.base.Event} oEvent - The event triggered by button press.
     * @public
     */
    onGenerateUrlPress: async function(oEvent) {
      this.handleSessionExpiry(this.baseUrl);

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
     * Handles Attachment button's press event
     * @param {event} oEvent 
     * @returns 
     */
    onDownloadAttachmentPress : async function (oEvent) {
      this.handleSessionExpiry(this.baseUrl);

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
        // Make an API call to download attachment
        const {data} = await axios.get(this.baseUrl+`admin/service/ApplicationDetail(${appId})/DownloadAttachment`);        

         // Save spreadsheet template in client system
         const a = document.createElement('a');
         a.download = data.value.file.name;
         a.href = data.value.file.url;
         a.click();
      } catch (error) {
        MessageBox.error("Failed to download attachment.")
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
      const linkInputBox = this.byId("linkInput");
      const sLink = linkInputBox.getText();
  
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

      this.handleSessionExpiry(this.baseUrl);

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
      const selectedLinkId = oContext.getProperty("LinkId");

      // Get all ApplicationDetail records
      const aAllRecords = await this.getAllApplicationDetailRecords();

      // Ensure data exists
      if (!aAllRecords || aAllRecords.length === 0) {
        console.error("No data retrieved from OData model.");
        return;
      }

      /**
       *  Call the filterRecords function to get the filtered list of AppIds 
       *  based on the selected LinkId and ApplicationNumber.
       */
      const filteredAppId = this.filterRecords(aAllRecords, AppId, selectedLinkId, ApplicationNumber);

      // Get the VBox id (EnrollmentApplicationPage)
      const oVBox = this.byId("idApplicationVBox");

      // Clear the existing content
      oVBox.destroyItems();

      // Dynamically create and add the new view for building detail page
      sap.ui.core.mvc.XMLView.create({
        viewData: {
          baseUrl: this.baseUrl, AppId: AppId, ApplicationNumber: ApplicationNumber,
          FirstName: FirstName, LastName: LastName, filteredApplicationNumber: this.sAppNumber,
          filteredApplicationStatus: this.sApplicationStatus, filteredFirstName: this.sFirstName,
          filteredLastName: this.sLastName, filteredAssignedTo: this.sAssignedTo,
          filteredStartDate: this.sStartDate, filteredEndDate: this.sEndDate,
          tenantConsentFormURL : this.tenantConsentFormURL, filteredAppIds: filteredAppId
        },
        viewName: `dteenergyadminportal.view.BuildingDetailPage`
      }).then(function (oView) {
        oVBox.addItem(oView);
      });
    },
    /**
     * Filters application records based on the selected application and its link status.
     *
     * @param {Array<Object>} aAllRecords - The complete list of application records.
     * @param {string} AppId - The ID of the selected application.
     * @param {string} selectedLinkId - The LinkId of the selected application.
     * @param {string} ApplicationNumber - The ApplicationNumber of the selected application.
     * @returns {Array<string>} - An array of AppIds that are linked to the selected application, 
     *                            or the selected AppId if no linked applications are found.
     */
    filterRecords: function (aAllRecords, AppId, selectedLinkId, ApplicationNumber) {
      if (!selectedLinkId) return [AppId]; // Return AppId if no LinkId

      /**
       * - If the selected row is the parent row
       *   then return the all AppIds linked to this application from the all records
       * 
       * - If the selected row is not a linked application or is a child row,
       *   then only the selected AppId will be returned.
       */
      let aFilteredAllRecords = aAllRecords
          .filter(item => item.LinkId === selectedLinkId && item.LinkId === ApplicationNumber)
          .map(item => item.AppId);

      return aFilteredAllRecords.length ? aFilteredAllRecords : [AppId];
    },
    /**
     * Navigates to the Consent Page dynamically, based on the selected application's AppId.
     * Clears the existing content of the VBox and loads the Consent Page view.
     *
     * @param {sap.ui.base.Event} oEvent - The event triggered by the button press.
     * @public
     */
    navToConsentPage: async function(oEvent) {
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
      const ApplicationNumber = oBindingContext.getProperty("ApplicationNumber");
      const selectedLinkId = oBindingContext.getProperty("LinkId");

      // Get all ApplicationDetail records
      const aAllRecords = await this.getAllApplicationDetailRecords();

      // Ensure data exists
      if (!aAllRecords || aAllRecords.length === 0) {
        console.error("No data retrieved from OData model.");
        return;
      }

      /**
       *  Call the filterRecords function to get the filtered list of AppIds 
       *  based on the selected LinkId and ApplicationNumber.
       */
      const filteredAppId = this.filterRecords(aAllRecords, appId, selectedLinkId, ApplicationNumber);

      // Get the VBox id (EnrollmentApplicationPage)
      const oVBox = this.byId("idApplicationVBox");

      // Clear the existing content
      oVBox.destroyItems();

      // Dynamically create and add the view for consent page
      sap.ui.core.mvc.XMLView.create({
        viewData: { baseUrl: this.baseUrl, AppId: appId, filteredAppIds: filteredAppId},
        viewName: `dteenergyadminportal.view.ConsentsPage`
      }).then(function (oView) {
        oVBox.addItem(oView);
      });
    }
  });
});