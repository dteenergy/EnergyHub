sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("dteconsentappclient.controller.ConsentForm", {
        onInit () {
             this.byId("idStillInContructionLabel").setText("Consent Form Contruction Ongoing.....");
        }
	});
});