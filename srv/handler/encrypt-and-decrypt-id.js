const cryptoJs = require('crypto-js');

/**
 * Encrypt the given data using AES encryption.
 * @param {string} data 
 * @returns string
 */
const valueEncrypt = async (data) => {
  if (!data) throw { status: 400, message: 'No data found' }
  try {
    // Perform AES encryption using the ENCRYPT_APPID_SECRET_KEY from environment variables
    const  encryptedData = cryptoJs.AES.encrypt(data, process.env.ENCRYPT_APPID_SECRET_KEY).toString();
    
    return  encryptedData;
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

    // Perform AES decryption using the ENCRYPT_APPID_SECRET_KEY from environment variables
    const decryptedByte = cryptoJs.AES.decrypt(parsedId, process.env.ENCRYPT_APPID_SECRET_KEY);
  
    // Convert the decrypted data from bytes to a UTF-8 string
    const decryptedStr = decryptedByte.toString(cryptoJs.enc.Utf8);
    
    return decryptedStr;
  } catch (err) {
      throw { status: 500, message: 'Failed to encrypt the data' }
  }
}

module.exports = { valueEncrypt, valueDecrypt }
