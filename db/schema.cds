namespace dteConsentApp;

entity ApplicationDetail{
    key AppId: UUID;
    ApplicationStatus : appStatus default 'New';
    NumberOfTenants : Decimal default 0;
    SignatureSignedBy : String not null;
    SignatureSignedDate : Date not null;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AccountDetailRefId : Association to one AccountDetail on AccountDetailRefId.AppRefId = $self;
    BuildingDetailRefId : Association to many BuildingDetail on BuildingDetailRefId.AppRefId = $self;
    ApplicationConsentRefId : Association to many ApplicationConsent on ApplicationConsentRefId.AppRefId = $self;
}

entity BuildingDetail {
    key BuildingId : UUID;
    BuildingName : String not null;
    AccountNumber : String not null;
    Address : String not null;
    City : String not null;
    State : String not null;
    Zipcode: String not null;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to one ApplicationDetail;
}

entity AccountDetail {
    key AccountDetailId : UUID;
    CompanyName : String not null;
    CompanyAddress : String not null;
    City : String not null;
    State : String not null;
    Zipcode : String not null;
    AcctMgrName : String;
    AcctMgrPhNo: String;
    EnergyPrgmParticipated : Boolean default false;
    FirstName : String not null;
    LastName : String not null;
    SiteContactTitle : String not null;
    SiteAddress : String not null;
    SiteCity : String not null;
    SiteState : String not null;
    SiteZipcode : String not null;
    SitePhoneNumber : String not null;
    EmailAddr : String not null;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to ApplicationDetail;
}

entity ApplicationConsent {
    key ApplicationConsentId : UUID;
    FirstName : String not null;
    LastName : String not null;
    SiteContactTitle : String;
    Address: String not null;
    City: String not null;
    State: String not null;
    Zipcode : String not null;
    AccountNumber : String not null;
    PhoneNumber : String;
    EmailAddr: String not null;
    AuthPersonName : String;
    AuthDate: Date;
    AuthTitle: String;
    AuthEmailAddr : String;
    ConsentStatus : consentStatus default 'New';
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to ApplicationDetail;
}

// aspects
type appStatus : String enum {
    New;
    Rejected;
    Accepted;
}

type consentStatus : String enum {
    New;
}