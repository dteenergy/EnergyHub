const cds = require('@sap/cds');
const { entities } = require('@sap/cds');

/**
 * Links multiple applications to a specified parent application by updating their LinkId.
 *
 * @param {Request} req - The request object containing data for linking applications.
 * @returns {Promise<Object>} A promise that resolves to an object containing a message and statusCode.
 */
const LinkApplications = async (req) => {
  // Destructure selectedAppNumber and selectedApplicationNumbers from the request data
  const {selectedAppNumber, selectedApplicationNumbers} = req.data;

  try {
    // Access the CDS entities
    const entity = entities;

    // Retrieve existing applications to check for already linked applications
    const existingApplications = await cds.run(
      SELECT.from(entity.ApplicationDetail)
        .columns(['ApplicationNumber', 'LinkId'])
        .where({ ApplicationNumber: { in: selectedApplicationNumbers } })
    );

    // Filter out applications that already have a LinkId assigned
    const alreadyLinkedApplications = existingApplications.filter(app => app.LinkId);

    // If any applications are already linked, return a warning message
    if (alreadyLinkedApplications.length > 0) {
      const linkedAppNumbers = alreadyLinkedApplications.map(app => app.ApplicationNumber).join(", ");
      return {
        message: `The following applications are already linked: ${linkedAppNumbers}. Please unlinked applications.`,
        statusCode: 400
      };
    };

    // Execute the update operation on the ApplicationDetail entity
    const result = await cds.run(
      UPDATE(entity.ApplicationDetail)
      .set({LinkId: selectedAppNumber})
      .where({ApplicationNumber: {in: selectedApplicationNumbers}})
    );

    // Check if any records were updated
    if(result === 0) return {message: 'No records found for the provided AppIds', statusCode: 404};

    return {message: 'Successfully updated!', statusCode: 200};
  } catch (error) {
    // Handle any errors that occurred during the update operation
    return { message: 'An error occurred while updating LinkId', statusCode: 500 };
  }
};

module.exports = { LinkApplications };