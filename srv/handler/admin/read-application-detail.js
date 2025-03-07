const cds = require('@sap/cds');

/**
 * Read and sort the ApplicationDetail records by hierarchy.
 * - SortKey: Groups related applications (LinkId or ApplicationNumber).
 * - Parenting: Identifies parents (1) and children (0).
 * - Sorting: First by SortKey (asc), then by Parenting (desc).
 *
 * @param {Request} req - CDS request object.
 * @returns {Promise<Array<Object>>} - Sorted application details.
 */
const readApplicationDetail = async (req) => {
  // Clone the original query
  const query = req.query;

  try {
    // Add columns as a * in the array when it is removed from SELECT.
    if(!query.SELECT.columns) query.SELECT.columns=['*'];

    // Add a computed column 'SortKey' to determine the sorting order of applications
    query.SELECT.columns.push({
      xpr: [
        'case',
        'when', { ref: ['LinkId'] }, 'is', 'null', // If 'LinkId' is NULL, use 'ApplicationNumber' as the sort key
        'then', { ref: ['ApplicationNumber'] },
        'else', { ref: ['LinkId'] }, // Otherwise, use 'LinkId' to maintain hierarchical sorting
        'end'
      ],
      as: 'SortKey' // Assign alias 'SortKey' to the computed column
    });

    // Add another computed column 'Parenting' to differentiate parent applications from child applications
    query.SELECT.columns.push({
      xpr: [
        'case',
        'when', { ref: ['LinkId'] }, '=', { ref: ['ApplicationNumber'] }, // If 'LinkId' matches 'ApplicationNumber', it is a parent application
        'then', '1', // Mark parent applications with '1'
        'else', '0', // Otherwise, it is a child application
        'end'
      ],
      as: 'Parenting' // Assign alias 'Parenting' to the computed column
    });

    /**
     * Apply sorting:
     * First, sort by 'SortKey' in ascending order to group related applications together
     * Then, sort by 'Parenting' in descending order to ensure parents appear before children
     */
    query.SELECT.orderBy = [{ ref: ['SortKey'], sort: 'asc' }, { ref: ['Parenting'], sort: 'desc' }];

    // Execute the modified query and return the results
    return await cds.tx(req).run(query);
  } catch (error) {
    console.log(error);
    return {message: 'error'}
  }
};

module.exports = { readApplicationDetail }