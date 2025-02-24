const cds = require('@sap/cds');
const { entities } = require('@sap/cds');

/**
 * Links multiple applications to a specified parent application by updating their LinkId.
 *
 * @param {Object} req - The request object containing data for linking applications.
 * @returns {Promise<Object>} A promise that resolves to an object containing a message and statusCode.
 */
const LinkApplications = async (req) => {
  // Destructure selectedAppNumber and selectedApplicationNumbers from the request data
  const {selectedAppNumber, selectedApplicationNumbers} = req.data;

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
    // Handle any errors that occurred during the update operation
    return { message: 'An error occurred while updating LinkId', statusCode: 500 };
  }
};

module.exports = { LinkApplications };