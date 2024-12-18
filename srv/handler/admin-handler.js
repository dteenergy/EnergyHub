const cds = require('@sap/cds');

module.exports = cds.service.impl(async function (srv) {
    // Require the service entities
    const { ApplicationDetail } = this.entities;

    /**
     * Method to send the EnrollmentApplication Detail
     * returns EnrollmentApplicationDetail Array<Object> 
     * */ 
    srv.on('EnrollmentApplication', async(req)=>{
        // Query to get the ApplicationDetail, SiteDetail and BuildingDetail
        const appDetails = await SELECT.from(ApplicationDetail, appDetail => {
            appDetail`.*`, appDetail.BuildingDetailRefId(buildDetail => {
                buildDetail`.*`
            }), appDetail.AccountDetailRefId(siteDetail => {
                siteDetail`.*`
            })
        })

        return appDetails;
    })
})