const cds = require('@sap/cds');

module.exports = cds.service.impl(async function (srv){
    const {ApplicationDetail, BuildingDetail} = this.entities;
    srv.on('READ', 'Enrollment', async(req)=>{
        const appDetails = await SELECT.from(ApplicationDetail, appDetail=>{
            appDetail`.*`, appDetail.BuildingDetailRefId(buildDetail=>{
                buildDetail`.*`
            }), appDetail.AccountDetailRefId(siteDetail=>{
                siteDetail`.*`
            })
        })
        return appDetails;
    }),

    srv.on('READ', 'FOO', async(req)=>{
        const building = await SELECT.from(BuildingDetail);
        return building
    })

})