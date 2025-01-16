const Ajv = require('ajv'); 
const addFormat = require('ajv-formats');
const addKeywords = require('ajv-keywords');

const ajv = new Ajv({'allErrors':false});

// add ajv data formats like date, time
addFormat(ajv);
// add ajv additional keywords
addKeywords(ajv);

/**
 * AJV Validation
 * @param {object} JSONData => http request body data 
 * @param {schema} JSONSchema => data's JSON schema.
 * Use online JSON data to JSON schema generator https://extendsclass.com/json-schema-validator.html
 * @returns {object} => props - status,error 
 */
const ajvValidation = (JSONData, JSONSchema) => {
  try {
    const valid = ajv.validate(JSONSchema, JSONData);
    
    // If validate fails, return status : false and error
    if (!valid){
      throw ajv.errors;
    }

    return {'status':valid, 'error':null};
  } catch (err){
    throw err;
  }
};

module.exports = {
  ajvValidation
};