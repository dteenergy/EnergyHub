sap.ui.define([], function(){
  "use strict";

  return {

    /**
     * 
     * @param {String} sValue user input
     * @param {Object} oConsentModel consent model
     * @param {String} sDTEAddressValidationUrl address validation url
     */
    onConsentAddrSuggestion: function(sValue, oConsentModel, sDTEAddressValidationUrl){
      if (sValue.length > 3) {
        // Trigger API call after 3 characters
       fetchAddressSuggestions(sValue, oConsentModel, sDTEAddressValidationUrl);
     }

    },

    /**
     * 
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

          return {
            id: item.premiseId, // Unique identifier
            address: addr.houseNumber + ", " + addr.streetName,
            fullAddress: addr.houseNumber + ", " + addr.streetName + 
                  ", " + addr.city + ", " + addr.state + ", " + addr.zipCode
          };
        });

        // Set the suggestions array to the model
        oConsentModel.setProperty(`/ConsentDetail/suggestions`, aSuggestions);
      })
      .catch(function (error) {
        console.error("Error fetching suggestions : ", error);
      });

    },

    onConsentAddrSugSelected: function(oEvent, oConsentModel){
      const oInputControl = oEvent.getSource();
      console.log(oEvent);
      
        // Retrieve the bound path
        const sBasePath = oInputControl.getBinding('value')?.getContext()?.getPath();
        console.log(sBasePath);
        
        // Handle item selection
        const oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          const sKey = oSelectedItem.getKey(); // Unique ID (premiseId) of the selected address	

          // Access the suggestions array from the default model
          const aSuggestions = oModel.getProperty(`/ConsentDetail/suggestions`);

          // Find the selected address using the key
          const oSelectedAddress = aSuggestions.find(function (item, index) {
            return item.id === sKey; // Match the key (premiseId)
          });						

          if (oSelectedAddress) {
            // Extract the relevant address parts
            const oAddressParts = oSelectedAddress.fullAddress.split(",");

            const sShortAddress = oAddressParts[0].trim()+ ", " + oAddressParts[1].trim();
            
            oConsentModel.setProperty(`${sBasePath}/ConsentAddress`, sShortAddress);
            oConsentModel.setProperty(`${sBasePath}/ConsentCity`, oAddressParts[2].trim());
            oConsentModel.setProperty(`${sBasePath}/ConsentZipcode`, +oAddressParts[4]);
          }
        }
    }

  };

});