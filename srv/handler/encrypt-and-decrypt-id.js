const cryptoJs = require('crypto-js');
const { emptyField } = require('./regex-and-error-message');

/**
 * Encrypt the given data using AES encryption.
 * @param {string} data 
 * @returns string
 */
const valueEncrypt = async (data) => {
  if ((!data) || (data === '""')) throw { status: 400, message: 'No data found' }
  try {     
    // Perform AES encryption using the ENCRYPT_APPID_SECRET_KEY from environment variables
    const encryptedData = cryptoJs.AES.encrypt(data, process.env.ENCRYPT_APPID_SECRET_KEY).toString();

    return encryptedData;
  } catch (e) {
    if(e){
      throw {status : e.status, message: e.message};
    }
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
    const formattedEncrData = data.trim().replace(/ /g, '+');

    // Perform AES decryption using the ENCRYPT_APPID_SECRET_KEY from environment variables
    const decryptedByte = cryptoJs.AES.decrypt(formattedEncrData, process.env.ENCRYPT_APPID_SECRET_KEY);

    // Convert the decrypted data from bytes to a UTF-8 string
    const decryptedStr = decryptedByte.toString(cryptoJs.enc.Utf8);

    // If the decryptedStr is Empty
    if (decryptedStr === "") throw { status: 400, message: 'Failed to decrypt the data incorrect signed key' };

    return decryptedStr;
  } catch (e) {
    if (e) {
      throw { status: e.status, message: e.message };
    }
    else {
      throw { status: 500, message: 'Failed to encrypt the data' }
    }
  }
}

module.exports = { valueEncrypt, valueDecrypt }
