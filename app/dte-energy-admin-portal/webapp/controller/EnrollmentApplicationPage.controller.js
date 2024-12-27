sap.ui.define([
  "dteenergyadminportal/controller/BaseController",
  "sap/ui/comp/personalization/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  'sap/m/p13n/MetadataHelper',
  'sap/m/p13n/Engine',
  'sap/m/p13n/SelectionController',
], (BaseController, PersonalizationController, Filter, FilterOperator, MessageBox, MessageToast, MetadataHelper, Engine, SelectionController) => {
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
      // Retrieve the base URL and filter data from the view's data
      const { baseUrl, filteredApplicationStatus, filteredFirstName, filteredLastName } = this.getView().getViewData();
      this.baseUrl = baseUrl;
      this.sFirstName = filteredFirstName;
      this.sLastName = filteredLastName;
      this.sApplicationStatus = filteredApplicationStatus;

      // Populate the filters with initial values if they are defined
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

      this._registerForP13n();

      // Apply initial filters
      this.onFilterChange();
    },
    _registerForP13n: function() {
			const oTable = this.byId("idApplicationTable");

			this.oMetadataHelper = new MetadataHelper([{
					key: "firstName_col",
					label: "First Name",
					path: "FirstName"
				},
				{
					key: "lastName_col",
					label: "Last Name",
					path: "LastName"
				},
				{
					key: "appNumber_col",
					label: "Application Number",
					path: "ApplicationNumber"
				},
				{
					key: "signBy_col",
					label: "Signature SignedBy",
					path: "SignatureSignedBy"
				}
			]);

			Engine.getInstance().register(oTable, {
				helper: this.oMetadataHelper,
				controller: {
					Columns: new SelectionController({
						targetAggregation: "columns",
						control: oTable
					})
				}
			});

			// Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
		},
    /**
     * Opens the personalization dialog for the application table.
     *
     * @public
     */
    setupPersonalization: function (oEvt) {
      // this.oPersonalizationController.openDialog();
      this._openPersoDialog(["Columns"], oEvt.getSource());
      console.log("helo");

      this._oPersonalizationDialog = new sap.m.P13nDialog({
        initialView: "Columns",
        // panels: [oColumnsPanel],
        showReset: true,
        ok: function () {
          Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
          // this._applyPersonalization();
          this._oPersonalizationDialog.close();
        }.bind(this),
        cancel: function () {
          this._oPersonalizationDialog.close();
        }.bind(this)
      });
    },
    _openPersoDialog: function(aPanels, oSource) {
			var oTable = this.byId("idApplicationTable");

			Engine.getInstance().show(oTable, aPanels, {
				// contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
				// contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
				source: oSource || oTable
			});
      console.log("hai");
		},
    // _getKey: function(oControl) {
		// 	return oControl.data("p13nKey");
		// },
    _applyPersonalization: function () {
      
      oState.Columns.forEach((oProp, iIndex) => {
        const oCol = oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oProp.key);
        oCol.setVisible(true);

        oTable.removeColumn(oCol);
        oTable.insertColumn(oCol, iIndex);
      });
    },

		handleStateChange: function(oEvt) {
			// const oTable = this.byId("idApplicationTable");
			const oState = oEvt.getParameter("state");

			// if (!oState) {
			// 	return;
			// }

			//Update the columns per selection in the state
			this.updateColumns(oState);

			//Create Filters & Sorters
			// const aFilter = this.createFilters(oState);
			// const aGroups = this.createGroups(oState);
			// const aSorter = this.createSorters(oState, aGroups);

			// const aCells = oState.Columns.map(function(oColumnState) {
			// 	return new Text({
			// 		text: "{" + this.oMetadataHelper.getProperty(oColumnState.key).path + "}"
			// 	});
			// }.bind(this));

			// //rebind the table with the updated cell template
			// oTable.bindItems({
			// 	templateShareable: false,
			// 	path: '/items',
			// 	// sorter: aSorter.concat(aGroups),
			// 	// filters: aFilter,
			// 	template: new ColumnListItem({
			// 		cells: aCells
			// 	})
			// });

		},

		// createFilters: function(oState) {
		// 	const aFilter = [];
		// 	Object.keys(oState.Filter).forEach((sFilterKey) => {
		// 		const filterPath = this.oMetadataHelper.getProperty(sFilterKey).path;

		// 		oState.Filter[sFilterKey].forEach(function(oConditon) {
		// 			aFilter.push(new Filter(filterPath, oConditon.operator, oConditon.values[0]));
		// 		});
		// 	});

		// 	this.byId("filterInfo").setVisible(aFilter.length > 0);

		// 	return aFilter;
		// },

		// createSorters: function(oState, aExistingSorter) {
		// 	const aSorter = aExistingSorter || [];
		// 	oState.Sorter.forEach(function(oSorter) {
		// 		const oExistingSorter = aSorter.find(function(oSort) {
		// 			return oSort.sPath === this.oMetadataHelper.getProperty(oSorter.key).path;
		// 		}.bind(this));

		// 		if (oExistingSorter) {
		// 			oExistingSorter.bDescending = !!oSorter.descending;
		// 		} else {
		// 			aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
		// 		}
		// 	}.bind(this));

		// 	oState.Sorter.forEach((oSorter) => {
		// 		const oCol = this.byId("persoTable").getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
		// 		if (oSorter.sorted !== false) {
		// 			oCol.setSortIndicator(oSorter.descending ? coreLibrary.SortOrder.Descending : coreLibrary.SortOrder.Ascending);
		// 		}
		// 	});

		// 	return aSorter;
		// },

		// createGroups: function(oState) {
		// 	const aGroupings = [];
		// 	oState.Groups.forEach(function(oGroup) {
		// 		aGroupings.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
		// 	}.bind(this));

		// 	oState.Groups.forEach((oSorter) => {
		// 		const oCol = this.byId("persoTable").getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
		// 		oCol.data("grouped", true);
		// 	});

		// 	return aGroupings;
		// },

		updateColumns: function(oState) {
			const oTable = this.byId("idApplicationTable");

			// oTable.getColumns().forEach((oColumn, iIndex) => {
			// 	oColumn.setVisible(false);
			// 	// oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
			// 	// oColumn.setSortIndicator(coreLibrary.SortOrder.None);
			// 	// oColumn.data("grouped", false);
			// });
      
			oState.Columns.forEach((oProp, iIndex) => {
				const oCol = oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oProp.key);
				oCol.setVisible(true);

				oTable.removeColumn(oCol);
				oTable.insertColumn(oCol, iIndex);
			});
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
      this.sFirstName = this.byId("idFirstNameFilter").getValue(); // First Name Filter
      this.sLastName = this.byId("idLastNameFilter").getValue(); // Last Name Filter
      this.sApplicationStatus = this.byId("idApplicationStatusFilter").getSelectedKey(); // Application Status Filter

      // Create an array for filters
      const aFilters = [];

      // Add filters if values are not empty
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
        viewData: {baseUrl: this.baseUrl, AppId: AppId, ApplicationNumber: ApplicationNumber,
          FirstName: FirstName, LastName: LastName, filteredApplicationStatus: this.sApplicationStatus,
          filteredFirstName: this.sFirstName, filteredLastName: this.sLastName},
        viewName: `dteenergyadminportal.view.BuildingDetailPage`
      }).then(function (oView) {
        oVBox.addItem(oView);
      });
    }
  });
});