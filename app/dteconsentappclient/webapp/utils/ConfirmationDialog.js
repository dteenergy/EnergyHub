sap.ui.define([
  "sap/m/Dialog",
  "sap/m/Text",
  "sap/m/Button",
  "sap/m/Bar",
  "sap/m/FlexBox",
  "sap/m/library"
], function(Dialog, Text, Button, Bar, FlexBox, Library){
  "use strict";

  const ButtonType = Library.ButtonType;

  return {

    finalPopup: function (that, persona){
    const popupContent = {
      "Landlord": {"title": "Confirmation","text": `Thank you for your applying for access to DTE’s Energy Data Hub. 
        Your application ${that.applicationNumber} has been received and an email including the 
        application number will be sent to you shortly for your records.`, "thankyouPage": that.LandlordConfirmationPageUrl},
      "Tenant": {"title": "Confirmation","text": `Thank you for submitting the tenant consent form for 
        the DTE Energy Data Hub. Your submission has been received. A confirmation email will be 
        sent to you shortly.`, "thankyouPage": that.TenantConfirmationPageUrl}
    }

    const {title, text, thankyouPage} = popupContent[persona];

    if(!that.confirmationPopup){

      // Custom header for the dialog
					const dialogTitle = new Bar({
						contentMiddle: [
							new Text({ 
								text:  popupContent[persona]["title"]
							}).addStyleClass("alert-title")
						],
						contentRight: [
								new sap.ui.core.Icon({
										src: 'sap-icon://decline',
										decorative: false,
										press: function () {
											that.confirmationPopup.close();
                      
                      // Navigate to according thank you page.
                      window.open(popupContent[persona]["thankyouPage"], "_self");
										}
								}).addStyleClass("alert-close-icon")
						]
				}).addStyleClass("confirmation-dialog-title");

        const dialogContent = new FlexBox({
          items: [
            new Text ({ text: popupContent[persona]["text"]}),
            
            new Button({
              type: ButtonType.Emphasized,
              text: "OK",
              press: function () {
                that.confirmationPopup.close();
                // Navigate to according thank you page.
                // window.location.href = popupContent[persona]["thankyouPage"];
                window.open(popupContent[persona]["thankyouPage"], "_self");
              }
            })
          ]
        }).addStyleClass("confirmation-dialog-content");

     that.confirmationPopup = new Dialog({

      customHeader: dialogTitle,      
      content: dialogContent

     }).addStyleClass("alert-dialog-main-container")
    } 

    that.confirmationPopup.open();
  },
  }
});