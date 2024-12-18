using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
service DTEEnergyAdminPortal {

   entity ApplicationDetail as projection on db.ApplicationDetail;
   
    entity ApplicationWithBuilding as select from db.ApplicationDetail{
        *,
        BuildingDetailRefId.BuildingName, BuildingDetailRefId.BuildingId
    };

}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
