sap.ui.define([
  "sap/m/MessageToast",
  "sap/m/MessageBox",
], function (MessageToast, MessageBox) {
  return {
    /**
     * Handles the unlinking process of selected applications in the table.
     * 
     * @param {sap.ui.core.mvc.Controller} that - The current controller instance.
     */
    handleUnLinkPress: async function (that) {
      const oModel = that.getView().getModel('MainModel');

      // Retrieve the table control by its ID
      const oTable = that.getView().byId('idApplicationTable');

      // Get the selected items (rows) from the table
      const aSelectedRows = oTable.getSelectedItems();

      // Extract data from selected rows and filter out those without LinkId
      const aSelectedData = aSelectedRows.map(function (oItem) {
        return oItem.getBindingContext("MainModel").getObject();
      }).filter(function (oData) {
        return oData.LinkId; // Only keep rows where LinkId is present
      });

      // Validate selection: Ensure at least one linked application is selected
      if(aSelectedData.length === 0 || (aSelectedRows.length !== aSelectedData.length)) {
        MessageBox.warning(`Please select only linked application to unlink.`);
        return;
      };

      // Separate parent applications from child applications
      const parentApp = aSelectedData.filter(item => item.LinkId === item.ApplicationNumber);
      const childApp = aSelectedData.filter(item => item.LinkId !== item.ApplicationNumber);

      // Confirm unlinking action from the user
      MessageBox['confirm'](`Are you sure you want to unlink the selected applications ?`, {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.YES,
        onClose: async function (oAction) {
          if(oAction === MessageBox.Action.YES) {
            // Bind to the backend function 'UnLink'
            const oFunctionContext = oModel.bindContext('/UnLink(...)');

            // If a parent application is selected, set it as the unlink target
            if(parentApp.length > 0)
              oFunctionContext.setParameter('selectedAppNumber', parentApp[0].ApplicationNumber);

            // Otherwise, unlink selected child applications
            else
              oFunctionContext.setParameter('selectedApplicationNumbers', childApp.map(appNums => appNums.ApplicationNumber));

            try {
              // Execute the function call
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
              } else if(oResponse.value.statusCode === 400)
                MessageBox.warning(oResponse.value.message); // Show warning if status is 400
            } catch (error) {
              // Handle errors
              that.errorHandler(error);
            };
          };
        }.bind(that)
      });
    },
  };
});