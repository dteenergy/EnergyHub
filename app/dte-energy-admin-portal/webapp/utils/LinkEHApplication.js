sap.ui.define([
  "sap/m/MessageToast",
  "dteenergyadminportal/controller/BaseController"
], function (MessageToast, BaseController) {
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

      // Create a local JSON model with selected rows only
      const oSelectedRowsModel = new sap.ui.model.json.JSONModel(aSelectedData);
      that._aSelectedRows = aSelectedData;

      // Set the created JSON model to the dialog for data binding
      that.byId('idLinkDialog').setModel(oSelectedRowsModel, "SelectedRowsModel");

      // Open the dialog to allow the user to link the selected applications
      that.byId('idLinkDialog').open();
    },
    /**
     * Handles the confirmation action for linking selected applications to a parent application.
     * This function gathers selected application IDs, sends them to the server for linking
     *
     * @async
     * @function
     * @param {sap.ui.core.mvc.Controller} that - The current controller instance.
     */
    onConfirmLink: async function (that) {
      const oDialog = that.byId("idLinkDialog");
      const oSelect = that.byId("idParentSelect");
      const sParentAppNumber = oSelect.getSelectedItem().getText();

      // Map the selected rows to extract their application IDs
      const selectedApplicationNumbers = that._aSelectedRows.map(row => row.ApplicationNumber);
      // Prepare the linking information to be sent to the server
      const linkingInfo = {selectedAppNumber: sParentAppNumber, selectedApplicationNumbers: selectedApplicationNumbers};

      // Send the linking info to the server using a POST request
      await axios.post(that.baseUrl+`admin/service/Link`, linkingInfo)
        .then(res => res.data)
        .then(data => {
          MessageToast.show(data?.value?.message);
          that.onInit(); // Reinitialize the view to reflect changes

          // Clear selections in the application table
          const oTable = that.byId("idApplicationTable");
          oTable.removeSelections(true);
        })
        .catch(error => BaseController.errorHandler(error))

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