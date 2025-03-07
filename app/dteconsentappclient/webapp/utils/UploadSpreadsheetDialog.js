sap.ui.define([
    "sap/m/Dialog",
    "sap/ui/unified/FileUploader",
	"sap/m/MessageBox"
], function (
    Dialog,
	FileUploader,
	MessageBox
) {
    "use strict";
    return {
        /**
         * Render upload spreadsheet dialog
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
                            that.oFileUploader = oEvent.getSource();

                            // Set error state with message
                            that.oFileUploader.setValueState("Error");
                            that.oFileUploader.setValueStateText("Only .xlsx files are allowed!");
                        },
                        change: function (oEvent) {
                            that.spreadsheet = oEvent.getParameter("files")[0];                          

                            // Reset value state on valid file selection
                            that.oFileUploader = oEvent.getSource();
                            that.oFileUploader.setValueState("None");
                        },
                        width: '100%'
                    }).addStyleClass("upload-dialog-file-uploader"),
                ]
            }) 

            // Customize content of the dialog for Upload Spreadsheet
            const dialogContent = new sap.m.FlexBox({
                width : '100%',
                items: [
                    new sap.m.FormattedText({ htmlText: "<p style='letter-spacing: .7px; font-size: 14px; font-weigt: 400; margin-bottom: 0;'> Please upload additional building information that may be needed once enrollment has been verified </p>" }),

                    fileUploadContainer,
                
                    // Upload buttton element
                    new sap.m.Button({
                        text: 'Upload',
                        type: sap.m.ButtonType.Emphasized,
                        press: function (oEvent) {  
                            that.oUploadBtn = oEvent.getSource(); 

                            //Allow upload press, only when spreadsheet file selected 
                            if (that.spreadsheet) {
                                that.getAttachment();
                                that.oUploadBtn.setBusy(true);
                            }
                        }
                    }).addStyleClass("dialog-submit-action")
                ],
            });

            // Add the class for the dialog content
            dialogContent.addStyleClass("confirmation-dialog-content upload-dialog-content");

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
                }).addStyleClass("dialog-main-container");
            }

            that.oUploadDialog.open();
        },

        /**
         * Read spreadsheet content
         * @param {Controller} that => Parent controller this instance
         */
        readFile: async function (that) {
            const reader = new FileReader();
            
            // Read spreadsheet to create attachment JSON
            reader.onload = (e) => {
                const content = e.target.result.split(",")[1]; // split base64 content
                that.attachment = {
                    fileName: that.spreadsheet.name,
                    fileType: that.spreadsheet.type,
                    fileContent: content
                };
                this.scanMalware(that)
            };
            reader.readAsDataURL(that.spreadsheet);
        },
        /**
         * Scan malware method
         * @param {Controller} that => Parent controller this instance
         */
        scanMalware : async function (that){
            try {
                const scanMalwareURL = that.SERVERHOST + 'service/ScanMalware';
                const reqBody = {
                    'Attachment' : that.attachment
                }
                
                // Scan malware.
                await axios.post(scanMalwareURL, reqBody);

                //Close upload spreadsheet pop-up
                that.oUploadDialog.close();
            } catch (error) {

                // Show malware error
                if(error?.response && error?.response?.status == '400'){
                    // Clear values
                    that.spreadsheet = undefined;
                    that.attachment = undefined;
                    
                     // Set error state with message
                     that.oFileUploader.focus();
                     that.oFileUploader.setValue();
                     that.oFileUploader.setValueState("Error");
                     that.oFileUploader.setValueStateText("Malware detected");

                     return;
                }
                
                MessageBox.error("Failed to scan attachment.");
            } finally{
                that.oUploadBtn.setBusy(false);
            }
        },
        /**
         * Download spreadsheet template
         * @param {Controller} that => Parent controller this instance
         */
        downloadSpreadsheetTemplate: async function (that) {
            try {
                // Url to get spreadsheet template
                const downloadSpreadsheetTemplateUrl = that.SERVERHOST + 'service/Attachment';

                // Get spreadsheet template.
                const { data } = await axios.get(downloadSpreadsheetTemplateUrl);
                
                if(data.value.length === 0) throw new Error('Content Not Found');

                // Download spreadsheet template
                const file =`data:${data.value[0].filetype};base64,${data.value[0].fileContent}`;
                const a = document.createElement('a');
                a.download = data.value[0].fileName;
                a.href = file;
                a.click();

            } catch (error) {
                MessageBox.error("Failed to download attachment.")
            }
        }
    };
});