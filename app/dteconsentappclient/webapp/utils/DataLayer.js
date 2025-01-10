sap.ui.define([], function(){
    "use strict";
  
    return {

			/**
			 * Push user interaction events to the datalayer
			 * @param {String} program_type 
			 * @param {String} program_step_name 
			 * @param {String} program_step_action 
			 * @param {Boolean} program_step 
			 */
			pushEventToDataLayer: function(program_type, program_step_name, program_step_action, program_step){
				let eventData = {
					'event': 'dh-form-interaction',
					'program_name': 'energy-data-hub',
					'program_type': program_type,
					'program_step_name': program_step_name,
					'program_step_action': program_step_action
				}

				if(program_step) eventData = {...eventData, "program_step": 1};
				
				dataLayer.push(eventData);
			}
    }
});
  