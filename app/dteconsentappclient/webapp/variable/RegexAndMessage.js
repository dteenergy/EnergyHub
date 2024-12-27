sap.ui.define([], function(){
  "use strict";
  
 
    const regex = {
		  Email : /^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			PhoneNumber: /^\d{10}$/
		};

    const validationMessage = {
      Email: "Please provide a proper Email",
      PhoneNumber: "Please provide a proper Phone Number"
    }

  return {regex, validationMessage}
});