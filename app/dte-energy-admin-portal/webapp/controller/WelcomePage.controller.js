sap.ui.define([
    "dteenergyadminportal/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("dteenergyadminportal.controller.WelcomePage", {
        /**
         * Initializes the controller by dynamically loading the default view (`HomePage`) into the VBox container.
         * Clears any existing content in the VBox before adding the default view.
         *
         * @public
         */
        onInit() {
            const { url } = this.getApiConfig();
            this.SERVERHOST = url;

            // Get the VBox id (mainContent)
            const oVBox = this.byId("mainContent");

            // Clear the existing content
            oVBox.destroyItems();

            // Dynamically create and add the new view for default HomePage
            sap.ui.core.mvc.XMLView.create({
                viewData: {baseUrl: this.SERVERHOST},
                viewName: `dteenergyadminportal.view.HomePage`
            }).then(function (oView) {
                oVBox.addItem(oView);
            });
        },

        /**
         * Handles the event triggered when a menu item is selected.
         * Dynamically loads the corresponding view based on the selected key and adds it to the VBox container.
         * Clears any existing content in the VBox before adding the selected view.
         *
         * @param {sap.ui.base.Event} oEvent - The event object containing the selected item's details.
         * @public
         */
        selectedItem: function (oEvent) {
            // Get the selected key
            const selectedKey = oEvent.getParameter("item").getKey();

            // Get the VBox id (mainContent)
            const oVBox = this.byId("mainContent");

            // Clear the existing content
            oVBox.destroyItems();

            // Dynamically create and add the new view as per click the menu
            sap.ui.core.mvc.XMLView.create({
                viewData: {baseUrl: this.SERVERHOST},
                viewName: `dteenergyadminportal.view.${selectedKey}` // Example: Home, Profile, Preferences
            }).then(function (oView) {
                oVBox.addItem(oView);
            });
        }
    });
});