const email = {
    "regex": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "message": "Please enter a valid Email Id"
}

const phoneNumber = {
    "regex": /^(?:\+1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/,
    "message" : "Please enter a valid phone number"
}

/**
 * Function to validate the field value
 * @param {string} value 
 * @param {string} fieldName
 * @returns return error if invalid
 */
const validateWithRegex = (value, fieldName) =>{
    
    // Mapping field names to their corresponding regex objects
    const regexFieldName = {
        email,
        phoneNumber
    }

    // Get the validation object for the corresponding field
    const fieldValidator = regexFieldName[fieldName];

    // If the value is invalid, throw an error with the corresponding message
    if(!fieldValidator?.regex?.test(value)) throw { status: 400, message: fieldValidator?.message }    
    return null;
}

module.exports = {
    validateWithRegex
}