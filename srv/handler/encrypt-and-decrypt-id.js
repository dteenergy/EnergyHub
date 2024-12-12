const cryptoJs = require('crypto-js');

/**
 * Encrypt the given data using AES encryption.
 * @param {string} data 
 * @returns string
 */
const valueEncrypt = async (data) => {
  if (!data) throw { status: 400, message: 'No data found' }
  try {
    // Perform AES encryption using the SECRET_KEY from environment variables
    const encrAppId = cryptoJs.AES.encrypt(data, process.env.SECRET_KEY).toString();
    
    return encrAppId;
  } catch (err) {
    throw { status: 500, message: 'Failed to encrypt the data' }
  }
}

/**
 * Decrypt the given data using AES decryption.
 * @param {string} data 
 * @returns string
 */
const valueDecrypt = async (data) => {
  if (!data) throw { status: 400, message: 'No data found' };
  try {
    // Replace and trim the data
    const parsedId = data.trim().replace(/ /g, '+');

    // Perform AES decryption using the SECRET_KEY from environment variables
    const decryptByte = cryptoJs.AES.decrypt(parsedId, process.env.SECRET_KEY);
  
    // Convert the decrypted data from bytes to a UTF-8 string
    const actualData = decryptByte.toString(cryptoJs.enc.Utf8);
    
    return actualData;
  } catch (err) {
      throw { status: 500, message: 'Failed to encrypt the data' }
  }
}

module.exports = { valueEncrypt, valueDecrypt }
