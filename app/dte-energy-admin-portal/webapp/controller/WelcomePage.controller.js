sap.ui.define([
  "dteenergyadminportal/controller/BaseController"
], (BaseController) => {
  "use strict";

  return BaseController.extend("dteenergyadminportal.controller.WelcomePage", {
    /**
     * Initializes the controller by setting up required configurations,]
     * subscribing to event bus topics, 
     * and dynamically loading the default HomePage view into the main content area.
     *
     * @public
     */
    onInit() {
      // Retrieve the API configuration and set the server host URL
      const { url } = this.getApiConfig();
      this.SERVERHOST = url;

      // Subscribe to the "setSelectedKeyEvent" event from the welcomePage
      const setSelectedKeyBus = sap.ui.getCore().getEventBus();
      setSelectedKeyBus.subscribe("welcomePage", "setSelectedKeyEvent", this.setSelectedKeyToConsent, this);


      this.getENV((envVariables)=>{
        this.tenantConsentFormURL = envVariables.tenantConsentFormURL;
      });

      // After getting the env load the enrollment form page view.
      this.loadHomePageView();

    },
    // Get the env data
    getENV: async function (callback) {
      const envVariables = await this.GetEnvironmentVariables();
      callback(envVariables);
    },

    loadHomePageView : function (){
       // Get the VBox id (mainContent)
       const oVBox = this.byId("mainContent");

       // Clear the existing content
       oVBox.destroyItems();

       // Dynamically create and add the new view for default HomePage
       sap.ui.core.mvc.XMLView.create({
        viewData: { baseUrl: this.SERVERHOST },
        viewName: `dteenergyadminportal.view.HomePage`
      }).then(function (oView) {
        oVBox.addItem(oView);
      });
    },
    
    /**
     * Updates the navigation list menu to set "ConsentsPage" as the selected key.
     * This ensures the navigation menu highlights the correct page
     * when navigating to the Consents page.
     *
     * @public
     */
    setSelectedKeyToConsent: function() {
      this.byId("idNavigationListMenu").setSelectedKey("ConsentsPage");
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
        viewData: { baseUrl: this.SERVERHOST, tenantConsentFormURL: this.tenantConsentFormURL },
        viewName: `dteenergyadminportal.view.${selectedKey}` // Example: Home, Profile, Preferences
      }).then(function (oView) {
        oVBox.addItem(oView);
      });
    }
  });
});