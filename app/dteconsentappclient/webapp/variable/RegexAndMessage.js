sap.ui.define([], function(){
  "use strict";
  
 
    const regex = {
		  Email : /^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			PhoneNumber: /^(?!0000000000$)\d{10}$/,
      Zipcode: /^(?!00000$)\d{5}$/,
      AccountNumber: /^(91|92)[0-9]{10}$/,
      City: /^[a-zA-Z][a-zA-Z\s]{0,48}[a-zA-Z]$/,
      Name: /^[a-zA-Z][a-zA-Z\s]{0,48}[a-zA-Z]$/,
      Address: /^[a-zA-Z0-9][a-zA-Z0-9\s,./-]{0,48}[a-zA-Z0-9,/.-]$/,
      AddrLineTwo: /^[a-zA-Z0-9][a-zA-Z0-9\s,./-]{0,48}[a-zA-Z0-9,/.-]$/,
      Title: /^[a-zA-Z][a-zA-Z\s]{0,48}[a-zA-Z]$/,
      SignedBy: /^[a-zA-Z][a-zA-Z\s]{0,48}[a-zA-Z]$/,
		};

    const validationMessage = {
      Email: "Please provide a proper Email",
      PhoneNumber: "Please provide a proper Phone Number",
      Zipcode: "Please provide a proper Zip Code",
      AccountNumber: "Please provide a proper Account Number",
      City: "Please provide a proper city name",
      Name: "Please provide a proper Name",
      Address: "Please provide a proper address",
      AddrLineTwo: "Please provide a proper address",
      Title: "Please provide proper Title",
      SignedBy: "Please provide a proper Name"
    }

  return {regex, validationMessage}
});