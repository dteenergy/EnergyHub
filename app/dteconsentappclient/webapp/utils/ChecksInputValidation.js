sap.ui.define([
  "dteconsentappclient/variable/RegexAndMessage",
], function(RegexAndMessage){
  "use strict";

  return {

    /**
		 * Checks the given value is valid based on its type
		 * @param {Object} oControl 
		 * @param {String} sValue 
		 * @param {String} sType
		 * @returns {Boolean}
		 */
    isValid: function(oControl, sValue, sType){
      
      // If the given value is valid set the valueState to "None"
      if(RegexAndMessage.regex[sType].test(sValue)) {
        oControl.setValueState("None");
        return true;
      }else{
        // If the given value is invalid , set the value state to "Error" with an error message
        oControl.setValueState("Error");
        oControl.setValueStateText(RegexAndMessage.validationMessage[sType]);
        return false;
      }
    }

  }

});