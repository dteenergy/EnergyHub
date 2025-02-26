sap.ui.define([
  "sap/m/Dialog",
  "sap/m/Text",
  "sap/m/Button",
  "sap/m/Bar",
  "sap/m/FlexBox",
  "sap/m/FormattedText",
  "sap/m/library"
], function(Dialog, Text, Button, Bar, FlexBox,FormattedText, Library){
  "use strict";

  const ButtonType = Library.ButtonType;

  return {

    /**
     * Displays a confirmation dialog based on the user type (Landlord or Tenant).
     * @param {object} that - Calling context
     * @param {string} userType - Type of user, either "Landlord" or "Tenant".
     */
    showConfirmationDialog: function (that, userType){
          
      const confirmationMessages = {
      "Landlord": {"dialogTitle": "Confirmation","message":`<p style='letter-spacing: .7px; font-size: 14px; font-weigt: 400; margin-bottom: 0;'> 
        Thank you for your applying for access to DTE’s Energy Data Hub. Your application <span style='font-weight: 600; font-size: 14px;'>${that.applicationNumber}</span> 
        has been received and an email including the application number will be sent to you shortly for your records.</p>`, "thankyouPageURL": that.LandlordConfirmationPageUrl},
      "Tenant": {"dialogTitle": "Confirmation","message": `<p style='letter-spacing: .7px; font-size: 14px; font-weigt: 400; margin-bottom: 0;'> 
        Thank you for submitting the tenant consent form for the DTE Energy Data Hub. Your submission has been received. A confirmation email will be sent to you shortly. </p>`,
        "thankyouPageURL": that.TenantConfirmationPageUrl}
    }

     // Extract the appropriate dialog details based on the userType
    const {dialogTitle, message, thankyouPageURL} = confirmationMessages[userType];

    if(!that.oConfirmationDialog){

      // Custom dialog header with a title and a close icon.
      const dialogHeaderContainer = new Bar({
        contentMiddle: [
          new Text({ 
            text: dialogTitle
          }).addStyleClass("alert-title")
        ],
        contentRight: [
            new sap.ui.core.Icon({
                src: 'sap-icon://decline',
                decorative: false,
                press: function () {	
                  that.oConfirmationDialog.close();
                  // Navigate to corresponding  thank you page.
                  window.location.href = thankyouPageURL;
                }
            }).addStyleClass("alert-close-icon")
        ]
      }).addStyleClass("confirmation-dialog-title");

      // Dialog content to display a confirmation message with OK button.
      const dialogContentContainer = new FlexBox({
        items: [
          new FormattedText({ htmlText: message }),
          
          new Button({
            type: ButtonType.Emphasized,
            text: "OK",
            press: function () {
              that.oConfirmationDialog.close();
              // Navigate to corresponding thank you page.
              window.location.href = thankyouPageURL;
            }
          }).addStyleClass("dialog-submit-action")
        ]
      }).addStyleClass("confirmation-dialog-content");

      // Initialize the confirmation dialog.
      that.oConfirmationDialog = new Dialog({

        customHeader: dialogHeaderContainer,      
        content: dialogContentContainer

      }).addStyleClass("dialog-main-container");

    } 

    // Open the dialog.
    that.oConfirmationDialog.open();
  },
  }
});