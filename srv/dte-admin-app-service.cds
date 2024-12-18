using {dteConsentApp as db} from '../db/schema';

@path: '/admin/service'
service DTEAdminPortal {
    // entity ApplicationDetail as projection on db.ApplicationDetail;
    entity AccountDetail as projection on db.AccountDetail;
    entity BuildingDetail as projection on db.BuildingDetail;
    entity ApplicationWithBuilding as select from db.ApplicationDetail{
        *,
        BuildingDetailRefId.BuildingName as BuidlingDetails
    };

}