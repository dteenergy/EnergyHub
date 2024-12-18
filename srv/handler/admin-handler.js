const cds = require('@sap/cds');

module.exports = cds.service.impl(async function (srv){
    const {ApplicationDetail} = this.entities;
    srv.on('READ', ApplicationDetail, async(req)=>{
        const appDetails = await SELECT.from(ApplicationDetail, appDetail=>{
            appDetail`.*`, appDetail.BuildingDetailRefId(buildDetail=>{
                buildDetail`.*`
            }), appDetail.AccountDetailRefId(siteDetail=>{
                siteDetail`.*`
            })
        })
        return appDetails;
    })
})