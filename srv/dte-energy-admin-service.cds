using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
@impl : './handler/admin-handler.js'
service DTEEnergyAdminPortal {

  entity ApplicationDetail as projection on db.ApplicationDetail {
    AppId,
    AccountDetailRefId.FirstName,
    AccountDetailRefId.LastName,
    AccountDetailRefId.CompanyName,
    AccountDetailRefId.CompanyAddress,
    AccountDetailRefId.CompanyAddrLineTwo,
    AccountDetailRefId.City,
    AccountDetailRefId.State,
    AccountDetailRefId.EmailAddr,
    NumberOfTenants,
    ApplicationStatus,
    NoOfConsentReceived,
    ApplicationNumber,
    SignatureSignedBy,
    CreatedAt as AppCreatedAt
  } order by AppCreatedAt desc
  actions{
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
    AppRefId.AppId,
    AppRefId.ApplicationNumber,
    CreatedAt as AppCreatedAt
  } order by AppCreatedAt desc;

  entity BuildingDetail as projection on db.BuildingDetail {
    BuildingId,
    BuildingName,
    AccountNumber,
    Address,
    AddrLineTwo,
    City,
    State,
    Zipcode,
    AppRefId.AppId,
    AppRefId.AccountDetailRefId.FirstName,
    AppRefId.AccountDetailRefId.LastName,
  };

  entity AccountDetail as projection on db.AccountDetail;
  
}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
