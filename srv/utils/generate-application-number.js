
const generateAppNumber = async (entity) => {
    try {
        // Get the flag and prefix for the application number from environment variables
        const prefixFlag = process.env.APPNUM_PREFIX_ENABLED;
        const appNumPrefix = process.env.APPNUM_PREFIX;

        // Define the base query
        let query = SELECT.from(entity.ApplicationDetail)
            .columns('ApplicationNumber')
            .orderBy('ApplicationNumber desc')
            .limit(1);

        // Add a condition for the prefix if prefixFlag is "Y"
        if (prefixFlag === "Y" && appNumPrefix) {
            query = query.where({ ApplicationNumber: { like: `${appNumPrefix}%` } });
        }

        // Fetch the last ApplicationNumber based on the query
        const applicationDetail = await cds.run(query);

        // Check if the recent application number exists
        let applicationNumber;
        if (applicationDetail?.length > 0) {
            const lastAppNumber = applicationDetail[0]?.ApplicationNumber;

            // Extract the numeric part by removing the prefix
            const numericPart = lastAppNumber.replace(appNumPrefix, "");
            const parsedNumber = parseInt(numericPart, 10) || 0;

            // Increment the numeric part
            const incrementedNumber = parsedNumber + 1;

            // Pad the incremented number with leading zeros
            const incrementedNumberStr = incrementedNumber.toString().padStart(numericPart.length, '0');

            // Generate the new application number with or without prefix
            applicationNumber = prefixFlag === 'Y' ? appNumPrefix.concat(incrementedNumberStr) : incrementedNumberStr;
        } else {
            // If no previous application number, start from 1 with or without the prefix
            const incrementedNumberStr = '000000001';
            applicationNumber = prefixFlag === 'Y' ? appNumPrefix.concat(incrementedNumberStr) : incrementedNumberStr;
        }

        return applicationNumber;
    } catch (error) {
        console.log('Generate Application Number Error :', error.message);
        throw error;
    }
}

module.exports = {
    generateAppNumber
}