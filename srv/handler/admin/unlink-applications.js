const { entities } = require('@sap/cds');

/**
 * Unlinks applications by setting their LinkId to null based on the provided application numbers.
 * 
 * @param {string} req.data.selectedAppNumber - The parent application number to check for unlinking.
 * @param {string[]} req.data.selectedApplicationNumbers - Array of application numbers to be unlinked.
 * 
 * @returns {Promise<Object>} - A response message with the status of the unlink operation.
 */
const unLinkApplications = async (req) => {
  // Destructure selectedAppNumber and selectedApplicationNumbers from the request data
  const {selectedAppNumber, selectedApplicationNumbers} = req.data;

  try {
    let linkId = null; // Variable to store the LinkId that needs to be unlinked
    const {ApplicationDetail} = entities; // Access the CDS entities

    // Validate input: Ensure at least one application is selected for unlinking
    if (!selectedAppNumber && (!selectedApplicationNumbers || selectedApplicationNumbers.length === 0))
      return {message: "No applications selected for unlinking.", statusCode: 400};

    // If a parent application is selected, fetch its LinkId
    if (selectedAppNumber) {
      const selectedApp = await SELECT.one.from(ApplicationDetail)
          .where({ ApplicationNumber: selectedAppNumber }).columns(['LinkId']);

      // Store the LinkId to be unlinked
      if (selectedApp && selectedApp.LinkId) linkId = selectedApp.LinkId;
    }

    // If multiple application numbers are selected, determine if all linked apps should be unlinked
    if(selectedApplicationNumbers && selectedApplicationNumbers.length > 0) {
      const selectedApp = await SELECT.from(ApplicationDetail)
          .where({ ApplicationNumber: {in: selectedApplicationNumbers} });

    // Fetch all applications that share the same LinkId
      const linkedApps = await SELECT.from(ApplicationDetail)
          .where({LinkId: selectedApp[0].LinkId});

      // Consdition for if the number of selected applications matches the total linked applications, unlink all
      if((selectedApp.length+1) === linkedApps.length) linkId = selectedApp[0].LinkId;
    }

    // If a valid LinkId is found, unlink all associated applications
    if (linkId) {
      await UPDATE(ApplicationDetail)
          .set({ LinkId: null })
          .where({ LinkId: linkId });

      return {message: `Successfully unlinked all applications with LinkId: ${linkId}`, statusCode: 200}
    }

    // If specific applications were selected, unlink only those
    else if (selectedApplicationNumbers && selectedApplicationNumbers.length > 0) {
      await UPDATE(ApplicationDetail)
          .set({ LinkId: null })
          .where({ ApplicationNumber: {in : selectedApplicationNumbers} });

      return {message: `Successfully unlinked selected applications: ${selectedApplicationNumbers.join(", ")}`, statusCode: 200};
    }

    // If no valid LinkId is found, return an error message
    else return {message: "No valid LinkId found, and no applications to unlink.", statusCode: 400};

  } catch (error) {
    // Handle any errors that occurred during the unlink application
    return { message: 'An error occurred while unlink the application', statusCode: 500 };
  }
};

module.exports = {unLinkApplications};