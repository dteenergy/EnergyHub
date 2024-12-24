sap.ui.define([
    "dteenergyadminportal/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
     "sap/ui/comp/personalization/Controller",
     "sap/m/MessageBox",
], (BaseController, Filter, FilterOperator, MessageToast, PersonalizationController, MessageBox) => {
    "use strict";

    return BaseController.extend("dteenergyadminportal.controller.ConsentsPage", {
        onInit() {
            // Set the MainModel for the view
            this.getView().setModel("MainModel");

            this.oPersonalizationController = new PersonalizationController({
                table: this.byId("idApplicationConsentTable")
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
        onFilterChange : function(){
            // Retrieve the application consent table and its binding
            const oTable = this.byId("idApplicationConsentTable")
            const oBinding = oTable.getBinding("items");

            // Validate the binding
            if(!oBinding){
                MessageBox.error("Binding for the table is not found");
                
                return;
            }

            /**
             *  Get values from the filters inputs
             *  Firstname, Lastname and Consentstatus
             */
            const firstName = this.byId("idFilterFirstName").getValue();
            const lastName = this.byId("idFilterLastName").getValue();
            const consentStatus = this.byId("idConsentStatusFilter").getSelectedKey();

            // Array for filter
            const filterData = [];

            // Handle the filters value
            if(firstName) filterData.push(new Filter({path: "FirstName", operator: FilterOperator.Contains, value1: firstName, caseSensitive: false}));
            if(lastName) filterData.push(new Filter({path: "LastName", operator: FilterOperator.Contains, value1: lastName, caseSensitive: false}));
            if(consentStatus) filterData.push(new Filter("ConsentStatus", FilterOperator.EQ, consentStatus));

            // Combine filter logic.
            const combinedFilter = new Filter({
                filters: filterData,
                and: true
            })

            // Bind the combined filter or clear filter.
            oBinding.filter(filterData.length > 0 ? combinedFilter : [])
            
        },

         /**
         * Submits batch updates to the backend for saving changes to the application consent fields.
         * And display the message(success/error).
         *
         * @public
         */
        handleResponse : function(){
        const updateModel = this.getView().getModel("MainModel");

        updateModel.submitBatch('CustomGroupId')
        .then(() => MessageToast.show("Updated successfully!"))
        .catch((err) => MessageToast.show("Updation failed : ", err))
        }
    });
});