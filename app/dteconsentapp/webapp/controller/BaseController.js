sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/util/UriParameters",
      "sap/m/MessageBox"
  ], function (Controller, UriParameters, MessageBox) {
    "use strict";

    return Controller.extend("dteconsentapp.controller.BaseController", {
        getApiConfig: function(){
            const oConfig = this.getOwnerComponent().getManifestEntry("/sap.ui5/config/routerConfig");
            const serverHost = window.location.hostname;

            
        }
    })

  })  