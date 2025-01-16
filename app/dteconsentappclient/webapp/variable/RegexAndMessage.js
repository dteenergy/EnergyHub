sap.ui.define([], function(){
  "use strict";
  
 
    const regex = {
		  Email : /^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			PhoneNumber: /^(?!0000000000$)\d{10}$/,
      Zipcode: /^(?!00000$)\d{5}$/,
      AccountNumber: /^(91|92)[0-9]{10}$/,
      City: /^[a-zA-Z][a-zA-Z\s]{0,99}$/
		};

    const validationMessage = {
      Email: "Please provide a proper Email",
      PhoneNumber: "Please provide a proper Phone Number",
      Zipcode: "Please provide a proper Zip Code",
      AccountNumber: "Please provide a proper Account Number",
      City: "Please provide a proper city name"
    }

  return {regex, validationMessage}
});