sap.ui.define([
    "dteenergyadminportal/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], (BaseController, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("dteenergyadminportal.controller.ConsentsPage", {
        onInit() {},

        onFilterChange : function(){
            console.log("Handle the Filter change");
            const oTable = this.byId("idApplicationConsentTable")
            const oBinding = oTable.getBinding("items");

            if(!oBinding){
                console.log("Binding for the table is not found");
                
                return;
            }

            const firstName = this.byId("idFilterFirstName").getValue();
            const lastName = this.byId("idFilterLastName").getValue();
            const applicationStatus = this.byId("idFilterAppStatus").getValue();

            const filterData = [];

            if(firstName) filterData.push(new Filter({path: "AccountDetailRefId/FirstName", operator: FilterOperator.Contains, value1: firstName, caseSensitive: false}));
            if(lastName) filterData.push(new Filter({path: "AccountDetailRefId/LastName", operator: FilterOperator.Contains, value1: lastName, caseSensitive: false}));
            if(applicationStatus) filterData.push(new Filter("ApplicationStatus", FilterOperator.EQ, applicationStatus));

            const combinedFilter = new Filter({
                filters: filterData,
                and: true
            })

            oBinding.filter(filterData.length > 0 ? combinedFilter : [])
            
        },
        handleResponse : function(){
            const oModel = this.getView().getModel("MainModel");
            oModel.submitBatch("CustomGroupId").then(()=>sap.m.MessageToast.show("Application Status Updated Successfully")).catch(()=>sap.m.MessageToast.show("Application Status Failed to Update."))

        }
    });
});