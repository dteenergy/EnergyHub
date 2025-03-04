sap.ui.define([
    "dteenergyadminportal/controller/BaseController",
    "dteenergyadminportal/utils/UploadSpreadsheetDialog",
    "sap/m/MessageBox",
], (BaseController,
	UploadSpreadsheetDialog,
	MessageBox) => {
    "use strict";

    return BaseController.extend("dteenergyadminportal.controller.SettingPage", {
        async onInit() {
            // Destructure view data properties
            const {
                baseUrl,
            } = this.getView().getViewData();
            // Set instance variables for later use
            this.baseUrl = baseUrl;

            this.uploadButton = this.byId("idUploadSpreadsheetTemplateButton");

            // Create an OData V4 model using the constructed service URL
            this.setModel();

            await this.handleUploadBtnEnable();
        },
        handleUploadBtnEnable : async function() {
            try {
                const url = `${this.baseUrl}admin/service/Attachment`;
                const result = await axios.get(url);
                console.log(result, !result?.data?.value || result.data.value.length === 0);
                // Disable upload button when Attachment has value
                if(result.status == 200 && result.data.value.length === 0)  this.uploadButton.setVisible(true);            
            } catch (error) {
                MessageBox.error("Unexcepted Error"); 
            }
        },        
        setModel: function () {
            try {
                // Create an OData V4 model using the constructed service URL
                this.model = new sap.ui.model.odata.v4.ODataModel({
                    serviceUrl: `${this.baseUrl}admin/service/`,
                    synchronizationMode: "None",
                    operationMode: "Server",
                });

                // Set the newly created model as the "MainModel" for this view
                this.getView().setModel(this.model, "MainModel");
            } catch (error) {
                MessageBox.error("Unexcepted Error");
            }
        },

        onUploadButtonPress: function (oEvent, sAttachmentId) {
            UploadSpreadsheetDialog.render(this);
           this.attachmentId = sAttachmentId;
            
        },
        getAttachment: function () {
            UploadSpreadsheetDialog.readFile(this);
        },
        /**
         * Upload SpreadSheet Template
         */
        handleUploadSpreadsheet: async function () {
            try {
                const url = `${this.baseUrl}admin/service/Attachment`;
                const attachment = this.attachment;
                console.log(url);

                let result = null;
                if(this.attachmentId){
                    result = await axios.put(`${url}(${this.attachmentId})`, attachment);  
                }else{
                    result = await axios.post(url, attachment);
                }
                console.log(result);
                
                if ([200, 201].includes(result.status)) {
                    MessageBox.success("Template upload successfully");
                    this.setModel();
                    this.uploadButton.setVisible(false);
                }
            } catch (error) {
                MessageBox.error("Failed to upload attachment.");
            }

        },

        onFileNameLinkPress : function (oEvent, sFileName, sFileType, sFileContent ) {
            this.fileName = sFileName;
            this.fileType = sFileType;
            this.fileContent = sFileContent;

            UploadSpreadsheetDialog.downloadSpreadsheetTemplate(this)
        }

    });
})