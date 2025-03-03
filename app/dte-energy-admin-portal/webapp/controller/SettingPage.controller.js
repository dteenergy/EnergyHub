sap.ui.define([
    "dteenergyadminportal/controller/BaseController",
    "dteenergyadminportal/utils/UploadSpreadsheetDialog"
], (BaseController,
	UploadSpreadsheetDialog) => {
    "use strict";

    return BaseController.extend("dteenergyadminportal.controller.SettingPage", {
        onInit() {

        },

        onUploadButtonPress: function() {
            UploadSpreadsheetDialog.render(this);
            
        },
        getAttachment : function() {
            UploadSpreadsheetDialog.readFile(this);

            console.log(this.attachment);
        }
    });
})