sap.ui.define([], function(){
  "use strict";

  return {

    /**
     * Get the input value while suggest
     * @param {String} sAddrValue user input
     * @param {Object} oConsentModel consent model
     * @param {String} sDTEAddressValidationUrl address validation url
     */
    onConsentAddrSuggestion: function(sAddrValue, oConsentModel, sDTEAddressValidationUrl){
      /**
       * Trigger API call after 3 characters
       * To get the suggestion address from DTE Address validation api
       */
      if (sAddrValue.length > 3) 
        this.fetchAddressSuggestions(sAddrValue, oConsentModel, sDTEAddressValidationUrl);
    },

    /**
     * To call the DTE Address validation api and bind the result with accoording model
     * @param {String} sQuery user input
     * @param {Object} oConsentModel consent model
     * @param {String} sDTEAddressValidationUrl address validation url
     */
    fetchAddressSuggestions: async function(sQuery, oConsentModel, sDTEAddressValidationUrl){
      // DTE address validation api
      await axios.get(`${sDTEAddressValidationUrl}?address=${sQuery}&maxResults=10`).then(function (response) {		
        
        // Construct the response as needed format 
        const aSuggestions = response.data.results.map(function (item) {
          const addr = item.serviceAddress;

          let addressLineTwo = null;
          // Check and concatenate secondaryCode and secondaryNumber
          if (addr.secondaryCode) addressLineTwo = (addressLineTwo || "") + addr.secondaryCode;
          if (addr.secondaryNumber) addressLineTwo = (addressLineTwo || "") + " " + addr.secondaryNumber;

          return {
            "id": item.premiseId, // Unique identifier
            "address": addr.houseNumber + ", " + addr.streetName,
						"addressLineTwo":  addressLineTwo,
            "fullAddress":`${addr.houseNumber}, ${addr.streetName}, 
								 ${addressLineTwo ? addressLineTwo + "," : ''} ${addr.city}, ${addr.state}, ${addr.zipCode}`
          };
        });

        // Set the suggestions array to the model
        oConsentModel.setProperty(`/ConsentDetail/suggestions`, aSuggestions);
      })
      .catch(function (error) {
        console.error("Error fetching suggestions : ", error);
      });

    },

    /**
     * Get the selected item from the suggestion list and binding with accoring field in the model
     * @param {Object} oEvent 
     * @param {Object} oConsentModel 
     */
    onConsentAddrSugSelected: function(oEvent, oConsentModel){
        
        // Handle item selection
        const oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          const sKey = oSelectedItem.getKey(); // Unique ID (premiseId) of the selected address	

          // Access the suggestions array from the default model
          const aSuggestions = oConsentModel.getProperty(`/ConsentDetail/suggestions`);

          // Find the selected address using the key
          const oSelectedAddress = aSuggestions.find(function (item, index) {
            return item.id === sKey; // Match the key (premiseId)
          });						

          if (oSelectedAddress) {
            // Extract the relevant address parts
            const oAddressParts = oSelectedAddress.fullAddress.split(",");
                        
            oConsentModel.setProperty(`/ConsentDetail/ConsentAddress`, oSelectedAddress.address);

            if(oSelectedAddress.addressLineTwo) {
              oConsentModel.setProperty(`/ConsentDetail/ConsentAddrLineTwo`, oSelectedAddress.addressLineTwo);
              oConsentModel.setProperty(`/ConsentDetail/ConsentCity`, oAddressParts[3].trim());
              oConsentModel.setProperty(`/ConsentDetail/ConsentZipcode`, +oAddressParts[5]);
            }else{
              oConsentModel.setProperty(`/ConsentDetail/ConsentAddrLineTwo`, "");
              oConsentModel.setProperty(`/ConsentDetail/ConsentCity`, oAddressParts[2].trim());
              oConsentModel.setProperty(`/ConsentDetail/ConsentZipcode`, +oAddressParts[4]);
            }
          }
        }
    }

  };

});