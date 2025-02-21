const cds = require('@sap/cds');
const { entities } = require('@sap/cds');

/**
 * Updates the LinkId of multiple applications in the ApplicationDetail entity.
 * Sets the LinkId to the provided parent application number for all applications
 * whose AppId is included in the selectedApplicationNumbers array.
 *
 * @async
 * @function
 * @param {string} selectedAppNumber - The parent application number to set as LinkId.
 * @param {string[]} selectedApplicationNumbers - An array of application IDs to be updated.
 * @returns {Promise<Object>} An object containing a message and a status code.
 */
const LinkApplications = async (selectedAppNumber, selectedApplicationNumbers) => {
  // Access the CDS entities
  const entity = entities;

  try {
    // Execute the update operation on the ApplicationDetail entity
    const result = await cds.run(
      UPDATE(entity.ApplicationDetail)
      .set({LinkId: selectedAppNumber})
      .where({ApplicationNumber: {in: selectedApplicationNumbers}})
    );

    // Check if any records were updated
    if(result === 0) return {message: 'No records found for the provided AppIds', statusCode: 404};
    else return {message: 'Successfully updated!', statusCode:200};
  } catch (error) {
    // Log the error and return a failure message
    console.error('Error updating LinkId:', error);
    return { message: 'An error occurred while updating LinkId', statusCode: 500 };
  }
};

module.exports = { LinkApplications };