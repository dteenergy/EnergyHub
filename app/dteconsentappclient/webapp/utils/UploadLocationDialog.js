sap.ui.define([
    "sap/m/Dialog",
	"sap/ui/unified/FileUploader"
], function (
    Dialog,
	FileUploader
) {
    "use strict";
    return {
        render: function (that) {

            // Customize content of the dialog for additional location alert
            const dialogContent = new sap.m.FlexBox({
                items: [
                    new sap.m.FormattedText({ htmlText: "<p style='letter-spacing: .7px; font-size: 14px; font-weigt: 400; margin-bottom: 0;'> Lorem Ipsum has been the industry's standard dummy text ever since  </p>" }),

                    new FileUploader({
                        fileType : ['xlsx'],
                        change : function (oEvent){
                            that.locationXLSFile = oEvent.getParameter("files")[0];
                        }
                    }),

                    new sap.m.Button({
                        text: 'Upload',    
                        type: sap.m.ButtonType.Emphasized,
                        press: function () {
                            that.oUploadDialog.close();
                            that.getAttachment();
                        }
                    }).addStyleClass("dialog-submit-action")
                ],
            });

            // Add the class for the dialog content
            dialogContent.addStyleClass("confirmation-dialog-content");

            // Custom header for the dialog
            const dialogTitle = new sap.m.Bar({
                contentMiddle: [
                    new sap.m.Text({
                        text: 'Additional Location Alert'
                    }).addStyleClass("alert-title")
                ],
                contentRight: [
                    new sap.ui.core.Icon({
                        src: 'sap-icon://decline',
                        decorative: false,
                        press: function () {
                            that.oUploadDialog.close();
                        }
                    }).addStyleClass("alert-close-icon")
                ]
            });

            // // Add the class for the dialog content
            dialogTitle.addStyleClass("confirmation-dialog-title");

            // Open the additional location alert dialog while submit pressed
            if (!that.oUploadDialog) {
                that.oUploadDialog = new Dialog({
                    customHeader: dialogTitle,
                    content: dialogContent
                }).addStyleClass("alert-dialog-main-container")
            }

            that.oUploadDialog.open();
        },

        readFile : function (that) {
            console.log(that.locationXLSFile);
            const reader = new FileReader();
            reader.onload = (e) =>{
                console.log(e.target.result.split(",")[1]);
                const content = e.target.result.split(",")[1];
                that.attachment = {
                    fileName : that.locationXLSFile.name,
                    fileType : that.locationXLSFile.type,
                    fileContent : content
                };
            };
            reader.readAsDataURL(that.locationXLSFile);
        }
    };
});