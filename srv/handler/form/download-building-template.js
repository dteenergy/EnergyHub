const fs = require('fs');
const path = require('path');

const downloadBuildingTemplate = async (req) => {
    try {
        const res = req._.res;

        const filePath = path.join(__dirname,'../../template/BuildingDetail.xlsx');
        const templateFileContent = await fs.readFileSync(filePath,{encoding:'base64url'});

        return {
            'statusCode' : '00',
            'file' : templateFileContent
          }
    } catch (error) {
        return {
            'statusCode' : '500',
            'message' : error.message
          }
    }
}

module.exports = {
    downloadBuildingTemplate
}