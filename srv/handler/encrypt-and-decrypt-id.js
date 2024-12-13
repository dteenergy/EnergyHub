const cryptoJs = require('crypto-js');

/**
 * Encrypt the given data using AES encryption.
 * @param {string} data 
 * @returns string
 */
const valueEncrypt = async (data) => {
  if ((!data) || (data === '""')) throw { status: 400, message: 'Cannot proceed with an empty AppId' }
  try {     
    // Perform AES encryption using the CRYPTOJS_SECRET_KEY from environment variables
    const encryptedData = cryptoJs.AES.encrypt(data, process.env.CRYPTOJS_SECRET_KEY).toString();

    return encryptedData;
  } catch (e) {
    if(e){
      throw {status : e.status, message: e.message};
    }
    throw { status: 500, message: 'Failed to encrypt the AppId' }
  }
}

/**
 * Decrypt the given data using AES decryption.
 * @param {string} data 
 * @returns string
 */
const valueDecrypt = async (data) => {
  if (!data) throw { status: 400, message: 'Cannot proceed with an empty AppId' };
  try {
    // Replace and trim the data
    const formattedEncrData = data.trim().replace(/ /g, '+');

    // Perform AES decryption using the CRYPTOJS_SECRET_KEY from environment variables
    const decryptedByte = cryptoJs.AES.decrypt(formattedEncrData, process.env.CRYPTOJS_SECRET_KEY);

    // Convert the decrypted data from bytes to a UTF-8 string
    const decryptedStr = decryptedByte.toString(cryptoJs.enc.Utf8);

    // If the decryptedStr is Empty
    if (decryptedStr === "") throw { status: 400, message: 'Data decryption failed due to an incorrect signed key.' };

    return decryptedStr;
  } catch (e) {
    if (e) {
      throw { status: e.status, message: e.message };
    }
    else {
      throw { status: 500, message: 'Failed to Decrypt the AppId' }
    }
  }
}

module.exports = { valueEncrypt, valueDecrypt }
