const cds = require('@sap/cds');
const { entities } = require('@sap/cds');

const readBuildingDetail = async (req) => {
  // Access the CDS entities
  const entity = entities;

  // const query = req.query;

  const { parentAppId, childAppIds } = req.data;
  console.log(parentAppId, 1);
  console.log(childAppIds, 2);

  // const sortedAppIds = 

  // const query = req.query;
  let query = SELECT.from(entity.BuildingDetail)
        .columns(
            'BuildingId', 
            'BuildingName', 
            'AccountNumber', 
            'Address', 
            'City', 
            'State', 
            'Zipcode', 
            'AddrLineTwo', 
            'CreatedAt', 
            'UpdatedAt',
            { ref: ['AppRefId_AppId'] } // Fetch associated ApplicationNumber
        );

  query.SELECT.columns.push({
    xpr: [
      'case',
      'when', {ref: ['AppRefId_AppId']}, '=', {val: parentAppId},
      'then', '1',
      'else', '0',
      'end'
    ],
    as: 'ParentBuildingDetail'
  });

  query.SELECT.orderBy = [{ref: ['ParentBuildingDetail'], sort: 'desc'}]

  return await cds.tx(req).run(query);
}; 

module.exports = {readBuildingDetail};