sap.ui.define([], function(){
  "use strict";
  
 
    const regex = {
		  Email : /^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			PhoneNumber: /^\d{10}$/,
      Date: /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/
		};

    const validationMessage = {
      Email: "Please provide a proper Email",
      PhoneNumber: "Please provide a proper Phone Number",
      Date: "Please enter the date in MM/DD/YYYY format."
    }

  return {regex, validationMessage}
});