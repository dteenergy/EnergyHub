sap.ui.define([
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "dteenergyadminportal/controller/BaseController"
], function (MessageToast, MessageBox, BaseController) {
  return {
    /**
     * Handles the press event of a link, opening a dialog to link selected applications.
     * Ensures that at least two applications are selected before proceeding.
     * 
     * @async
     * @function
     * @param {sap.ui.core.mvc.Controller} that - The current controller instance.
     */
    handleLinkPress: async function (that) {
      // Retrieve the table control by its ID
      const oTable = that.getView().byId('idApplicationTable');

      // Get the selected items (rows) from the table
      const aSelectedRows = oTable.getSelectedItems();

      // Check if fewer than two rows are selected
      if (aSelectedRows.length < 2) {
        // Show a message toast to inform the user to select at least two applications
        MessageToast.show("Please select at least two application.");
        return;
      }

      // Map the selected rows to their corresponding data objects
      const aSelectedData = aSelectedRows.map(function (oItem) {
        return oItem.getBindingContext("MainModel").getObject();
      });

      // Check if any selected application already has a LinkId
      const aLinkedApplications = aSelectedData.filter(function (oData) {
        return oData.LinkId; // Assuming LinkId is a truthy value when present
      });

      if (aLinkedApplications.length > 0) {
        // Construct a message listing the linked application numbers
        const sLinkedAppNumbers = aLinkedApplications.map(function (oData) {
          return oData.ApplicationNumber;
        }).join(", ");

        // Show a warning message toast
        MessageBox.warning(`The following applications are already linked: ${sLinkedAppNumbers}. Please unlink the applications to perform further actions.`);
        return;
      }

      // Create a local JSON model with selected rows only
      const oSelectedRowsModel = new sap.ui.model.json.JSONModel(aSelectedData);
      that._aSelectedRows = aSelectedData;

      // Set the created JSON model to the dialog for data binding
      that.byId('idLinkDialog').setModel(oSelectedRowsModel, "SelectedRowsModel");

      // Open the dialog to allow the user to link the selected applications
      that.byId('idLinkDialog').open();
    },
    /**
     * Handles the confirmation of linking selected applications to a parent application.
     * This function is triggered when the user clicks the "Confirm" button in the linking dialog.
     *
     * @async
     * @function
     * @param {sap.ui.core.mvc.Controller} that - Reference to the current controller instance.
     */
    onConfirmLink: async function (that) {
      const oModel = that.getView().getModel('MainModel');
      const oDialog = that.byId("idLinkDialog");
      const oSelect = that.byId("idParentSelect");
      const sParentAppNumber = oSelect.getSelectedItem().getText();

      // Map the selected rows to extract their application IDs
      const selectedApplicationNumbers = that._aSelectedRows.map(row => row.ApplicationNumber);

      // Bind the context to the 'Link' function import with the specified parameters
      const oFunctionContext = oModel.bindContext('/Link(...)');
      oFunctionContext.setParameter("selectedAppNumber", sParentAppNumber);
      oFunctionContext.setParameter( "selectedApplicationNumbers", selectedApplicationNumbers);

      try {
        // Execute the function import to perform the linking operation
        await oFunctionContext.execute();

        // Get the response from the backend
        const oResponse = oFunctionContext.getBoundContext().getObject();

        // Check the response message and handle accordingly
        if (oResponse.value.statusCode === 200) {
          MessageToast.show(oResponse.value.message); // Show success message
          that.onInit(); // Reinitialize the view to reflect changes

          // Clear selections in the application table
          const oTable = that.byId("idApplicationTable");
          oTable.removeSelections(true);
        } else if(oResponse.value.statusCode === 400) {
          MessageBox.warning(oResponse.value.message); // Show warning if status is not 200
        }
      } catch (error) {
        BaseController.errorHandler(error)
      }

      oDialog.close();
    },
    /**
     * Closes the link dialog and clears any selections in the application table.
     *
     * @param {sap.ui.core.mvc.Controller} that - The current controller instance.
     */
    onLinkCloseDialog: function (that) {
      const oDialog = that.byId("idLinkDialog");
      const oTable = that.byId("idApplicationTable");
      oTable.removeSelections(true);
      oDialog.close();
    }
  }
})