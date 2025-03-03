using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
@impl : './handler/admin/admin-handler.js'
service DTEEnergyAdminPortal {

  entity ApplicationDetail  @(restrict: [{
    grant: ['READ', 'UPDATE', 'GenerateUrl', 'GetEnvironmentVariables','DownloadAttachment'], 
    to: 'Administrator'
    }]) as projection on db.ApplicationDetail {
    AppId,
    AccountDetailRefId.FirstName,
    AccountDetailRefId.LastName,
    AccountDetailRefId.CompanyName,
    AccountDetailRefId.CompanyAddress,
    AccountDetailRefId.CompanyAddrLineTwo,
    AccountDetailRefId.City,
    AccountDetailRefId.State,
    AccountDetailRefId.Zipcode,
    AccountDetailRefId.AcctMgrName,
    AccountDetailRefId.AcctMgrPhNo,
    AccountDetailRefId.EnergyPrgmParticipated,
    AccountDetailRefId.SiteContactTitle,
    AccountDetailRefId.SiteAddress,
    AccountDetailRefId.SiteAddrLineTwo,
    AccountDetailRefId.SiteCity,
    AccountDetailRefId.SiteState,
    AccountDetailRefId.SiteZipcode,
    AccountDetailRefId.SitePhoneNumber,
    AccountDetailRefId.EmailAddr,
    AccountDetailRefId.CreatedAt as AccCreatedAt,
    AccountDetailRefId.UpdatedAt as AccUpdatedAt,
    NumberOfTenants,
    ApplicationStatus,
    NoOfConsentReceived,
    ApplicationNumber,
    LinkId,
    Comment,
    AssignedTo,
    UpdatedBy,
    hasAttachment,
    AttachmentURL,
    SignatureSignedBy,
    SignatureSignedDate,
    UpdatedAt as AppUpdatedAt,
    CreatedAt as AppCreatedAt
  }
  actions{
    function GenerateUrl() returns String;
    function DownloadAttachment () returns String;
  } function GetEnvironmentVariables() returns String;

  entity ApplicationConsent @(restrict: [{
    grant: ['READ', 'UPDATE'], 
    to: 'Administrator'
    }]) as projection on db.ApplicationConsent {
    ApplicationConsentId,
    FirstName,
    LastName,
    EmailAddr,
    AuthDate,
    AuthTitle,
    ConsentStatus,
    SiteContactTitle,
    Address,
    AddrLineTwo,
    City,
    State,
    Zipcode,
    AccountNumber,
    PhoneNumber,
    AuthPersonName,
    ConsentByTenantFlag,
    UpdatedAt as AppUpdatedAt,
    AppRefId.AppId,
    AppRefId.ApplicationNumber,
    CreatedAt as AppCreatedAt
  } order by AppCreatedAt desc;

  entity BuildingDetail @(restrict: [{
    grant: ['READ'], 
    to: 'Administrator'
    }]) as projection on db.BuildingDetail {
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
    AppRefId.ApplicationNumber
  };

  entity AccountDetail @(restrict: [{
    grant: ['READ'], 
    to: 'Administrator'
    }]) as projection on db.AccountDetail;

  entity Attachment as projection on db.Attachment;

  /** 
   * Action to link applications together
   * and returns a success message or an error message.
   */
  action Link(
    selectedAppNumber: String,
    selectedApplicationNumbers: array of String
  ) returns String;

  /** 
   * Action to unlink applications from a parent application
   * and returns a success message or an error message.
   */
  action UnLink(
    selectedAppNumber: String,
    selectedApplicationNumbers: array of String
  ) returns String;
  
}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user',
  'Administrator'
];
