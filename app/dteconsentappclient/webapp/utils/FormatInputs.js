sap.ui.define([], 
  function(){
  "use strict";

  return {

    /**
		 * To convert the date format
		 * @param {String} dateString MM/DD/YYYY
		 * @returns {String} date YYYY/MM/DD
		 */
		convertDateFormat: function(dateString) {
			// Split the input date by '/'
			const [month, day, year] = dateString.split('/');
	
			// Rearrange to 'YYYY-MM-DD' and return
			return `${year}-${month}-${day}`;
		},
  }

});