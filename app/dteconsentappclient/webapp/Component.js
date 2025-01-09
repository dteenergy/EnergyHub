const { c } = require("@sap/cds/lib/utils/tar");

sap.ui.define([
    "sap/ui/core/UIComponent",
    "dteconsentappclient/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("dteconsentappclient.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            
            // Attach a route matched event to change the title
            const oRouter = this.getRouter();
            oRouter.attachRouteMatched(function (oEvent) {
                const sRouteName = oEvent.getParameter("name");
                let sTitle = "DTE Energy Data Hub";

                // Dynamically set the title based on the route
                if (["Home", "Enrollment"].includes(sRouteName)) {
                    sTitle = "DTE Energy Data Hub Landlord Enrollment Application";
                } else if (sRouteName === "ConsentForm") {
                    sTitle = "DTE Energy Data Hub Tenant Consent Form";
                }

                document.title = sTitle;
            });

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
        
    });
});