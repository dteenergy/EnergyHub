using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
@impl : './handler/admin-handler.js'
service DTEEnergyAdminPortal {

   entity ApplicationDetail as projection on db.ApplicationDetail;
   entity BuildingDetail as projection on db.BuildingDetail;
   entity AccountDetail as projection on db.AccountDetail;
}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
