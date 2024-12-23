using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
@impl : './handler/admin-handler.js'
service DTEEnergyAdminPortal {

  entity ApplicationDetail as projection on db.ApplicationDetail actions{
    function GenerateUrl() returns String;
    action UpdateAppDetail(AppId: String, NoOfTenants: Integer, AppStatus: String) returns String;
  };
  
  entity ApplicationConsent as projection on db.ApplicationConsent;
  entity BuildingDetail as projection on db.BuildingDetail;
  entity AccountDetail as projection on db.AccountDetail;
  
}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
