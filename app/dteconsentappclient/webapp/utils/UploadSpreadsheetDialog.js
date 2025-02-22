sap.ui.define([
    "sap/m/Dialog",
    "sap/ui/unified/FileUploader"
], function (
    Dialog,
    FileUploader
) {
    "use strict";
    return {
        /**
         * Render upload spreadsheet dialog
         * @param {this} that 
         */
        render: function (that) {

            // Customize content of the dialog for Upload Spreadsheet
            const dialogContent = new sap.m.FlexBox({
                items: [
                    new sap.m.FormattedText({ htmlText: "<p style='letter-spacing: .7px; font-size: 14px; font-weigt: 400; margin-bottom: 0;'> Lorem Ipsum has been the industry's standard dummy text ever since  </p>" }),

                    // File Uploader element
                    new FileUploader({
                        fileType: ['xlsx'],
                        typeMissmatch: function (oEvent) {
                            // Get the source FileUploader control
                            const oFileUploader = oEvent.getSource();

                            // Set error state with message
                            oFileUploader.setValueState("Error");
                            oFileUploader.setValueStateText("Only .xlsx files are allowed!");
                        },
                        change: function (oEvent) {
                            that.spreadsheet = oEvent.getParameter("files")[0];

                            // Reset value state on valid file selection
                            const oFileUploader = oEvent.getSource();
                            oFileUploader.setValueState("None");
                        }
                    }),

                    // Upload buttton element
                    new sap.m.Button({
                        text: 'Upload',
                        type: sap.m.ButtonType.Emphasized,
                        press: function () {
                            //Allow upload press, only when spreadsheet file selected 
                            if(that.spreadsheet){
                                that.oUploadDialog.close();
                                that.getAttachment();
                            }
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
                        text: 'Upload Spreadsheet'
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

            // Add the class for the dialog content
            dialogTitle.addStyleClass("confirmation-dialog-title");

            // Open the upload spreadsheet dialog while submit pressed
            if (!that.oUploadDialog) {
                that.oUploadDialog = new Dialog({
                    customHeader: dialogTitle,
                    content: dialogContent
                }).addStyleClass("alert-dialog-main-container")
            }

            that.oUploadDialog.open();
        },

        /**
         * Read spreadsheet content
         * @param {this} that 
         */
        readFile: function (that) {
            console.log(that.spreadSheet);
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(e.target.result.split(",")[1]);
                const content = e.target.result.split(",")[1];
                that.attachment = {
                    fileName: that.spreadSheet.name,
                    fileType: that.spreadSheet.type,
                    fileContent: content
                };
            };
            reader.readAsDataURL(that.spreadSheet);
        }
    };
});