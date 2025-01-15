sap.ui.define([], function(){
  "use strict";
  
 
    const regex = {
		  Email : /^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			PhoneNumber: /^(?!0000000000$)\d{10}$/,
      Zipcode: /^(?!00000$)\d{5}$/,
      AccountNumber: /^(91|92)[0-9]{10}$/,
      City: /^[a-zA-Z][a-zA-Z\s]{0,49}$/,
      Name: /^[a-zA-Z][a-zA-Z\s]{0,49}$/,
      Address: /^[a-zA-Z0-9][a-zA-Z0-9\s,./-]{0,49}$/,
      AddrLineTwo: /^[a-zA-Z0-9][a-zA-Z0-9\s,./-]{0,49}$/,
      Title: /^[a-zA-Z][a-zA-Z\s]{0,49}$/,
      SignedBy: /^[a-zA-Z][a-zA-Z\s]{0,49}$/,
		};

    const validationMessage = {
      Email: "Please provide a proper Email",
      PhoneNumber: "Please provide a proper Phone Number",
      Zipcode: "Please provide a proper Zip Code",
      AccountNumber: "Please provide a proper Account Number",
      City: "Please provide a valid city name",
      Name: "Please provide a valid Name",
      Address: "Plese provide a valid address",
      AddrLineTwo: "Plese provide a valid address",
      Title: "Plese provide proper Title",
      SignedBy: "Please provide a valid Name"
    }

  return {regex, validationMessage}
});