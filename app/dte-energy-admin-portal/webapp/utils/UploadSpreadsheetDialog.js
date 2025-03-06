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
         * Render upload spreadsheet Template dialog
         * @param {Controller} that => Parent controller this instance
         */
        render: function (that) {

            //File upload container
            const fileUploadContainer = new sap.m.FlexBox({
                direction:'Column',
                width: '100%',
                items: [
                    new sap.m.Text({
                        text: 'Select File',
                    }).addStyleClass('upload-dialog-file-uploader-lable'),


                     // File Uploader element
                     new FileUploader({
                        fileType: ['xlsx'],
                        buttonText: 'Browse',
                        typeMissmatch: function (oEvent) {
                            // Get the source FileUploader control
                            const oFileUploader = oEvent.getSource();

                            // Set error state with message
                            oFileUploader.setValueState("Error");
                            oFileUploader.setValueStateText("Only .xlsx files are allowed!");
                        },
                        change: function (oEvent) {
                            that.spreadsheet = oEvent.getParameter("files")[0];      
                            //Get attachment, only when spreadsheet file selected 
                            if (that.spreadsheet) {
                                // Reset value state on valid file selection
                                const oFileUploader = oEvent.getSource();
                                oFileUploader.setValueState("None");

                                that.getAttachment();
                            }
                        },
                        width: '100%'
                    }).addStyleClass("upload-dialog-file-uploader"),
                ]
            }) 

            // Customize content of the dialog for Upload Spreadsheet Template
            const dialogContent = new sap.m.FlexBox({
                direction:'Column',
                items: [
                    fileUploadContainer,
                
                    // Upload buttton element
                    new sap.m.Button({
                        text: 'Upload',
                        type: sap.m.ButtonType.Emphasized,
                        press: function () {  
                            //Allow upload press, only when spreadsheet file selected 
                            if (that.spreadsheet) {
                                that.oUploadDialog.close();
                                that.handleUploadSpreadsheet();
                            }                
                        }
                    }).addStyleClass("dialog-submit-action")
                ],
            });

            // Add the class for the dialog content
            dialogContent.addStyleClass("upload-dialog-content");

            // Custom header for the dialog
            const dialogTitle = new sap.m.Bar({
                contentMiddle: [
                    new sap.m.Text({
                        text: 'Upload Spreadsheet Template'
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

            // Open the upload spreadsheet Template dialog while submit pressed
            if (!that.oUploadDialog) {
                that.oUploadDialog = new Dialog({
                    customHeader: dialogTitle,
                    content: dialogContent
                }).addStyleClass("upload-template-main-container");
            }

            that.oUploadDialog.open();
        },

        /**
         * Read spreadsheet content
         * @param {Controller} that => Parent controller this instance
         */
        readFile: function (that) {
            const reader = new FileReader();
            
            // Read spreadsheet to create attachment JSON
            reader.onload = (e) => {
                const content = e.target.result.split(",")[1]; // split base64 content
                that.attachment = {
                    fileName: that.spreadsheet.name,
                    fileType: that.spreadsheet.type,
                    fileContent: content
                };
            };
            reader.readAsDataURL(that.spreadsheet);
        },
        /**
         * Download spreadsheet template
         * @param {Controller} that => Parent controller this instance
         */
        downloadSpreadsheetTemplate: async function (that) {
            try {
                // Save spreadsheet template in client system
                const file =`data:${that.fileType};base64,${that.fileContent}`;
    
                const a = document.createElement('a');
                a.download = that.fileName;
                a.href = file;
                a.click();

            } catch (error) {
                MessageBox.error("Failed to download attachment.")
            }
        }
    };
});