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
    ApplicationStatus,
    NoOfConsentReceived,
    ApplicationNumber
  } actions{
    function GenerateUrl() returns String;
  };
  
  entity ApplicationConsent as projection on db.ApplicationConsent {
    FirstName,
    LastName,
    EmailAddr,
    AuthDate,
    AuthTitle,
    ConsentStatus,
    AppRefId.AppId,
    AppRefId.ApplicationNumber
  };

  entity BuildingDetail as projection on db.BuildingDetail {
    BuildingName,
    Address,
    AddrLineTwo,
    City,
    State,
    Zipcode,
    AppRefId.AccountDetailRefId.FirstName,
    AppRefId.AccountDetailRefId.LastName
  };
  entity AccountDetail as projection on db.AccountDetail;
  
}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
