using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
@impl : './handler/admin-handler.js'
service DTEEnergyAdminPortal {

  entity ApplicationDetail as projection on db.ApplicationDetail {
    AppId,
    AccountDetailRefId.FirstName,
    AccountDetailRefId.LastName,
    AccountDetailRefId.CompanyName,
    NumberOfTenants,
    ApplicationStatus
  } actions{
    function GenerateUrl() returns String;
  };
  
  entity ApplicationConsent as projection on db.ApplicationConsent {
    ApplicationConsentId,
    FirstName,
    LastName,
    EmailAddr,
    AuthDate,
    AuthTitle,
    ConsentStatus,
    AppRefId.AppId
  };
  entity BuildingDetail as projection on db.BuildingDetail;
  entity AccountDetail as projection on db.AccountDetail;
  
}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
