namespace dteConsentApp;

//Application Detail Entity
entity ApplicationDetail{
    key AppId: UUID;
    ApplicationStatus : appStatus default 'New';
    NumberOfTenants : Integer;
    SignatureSignedBy : String not null;
    SignatureSignedDate : Date not null;
    ApplicationNumber : String not null;
    AttachmentURL : String;
    Comment : String;
    AssignedTo : String;
    UpdatedBy : String  @cds.on.insert: $user @cds.on.update: $user;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    virtual NoOfConsentReceived : Integer;

    AccountDetailRefId : Association to one AccountDetail on AccountDetailRefId.AppRefId = $self;
    BuildingDetailRefId : Association to many BuildingDetail on BuildingDetailRefId.AppRefId = $self;
    ApplicationConsentRefId : Association to many ApplicationConsent on ApplicationConsentRefId.AppRefId = $self;
}

// Building Detail Entity
entity BuildingDetail {
    key BuildingId : UUID;
    BuildingName : String not null;
    AccountNumber : String not null;
    Address : String not null;
    City : String not null;
    State : String not null;
    Zipcode: String not null;
    AddrLineTwo: String;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to one ApplicationDetail;
}

// Account Detail Entity
entity AccountDetail {
    key AccountDetailId : UUID;
    CompanyName : String not null;
    CompanyAddress : String not null;
    CompanyAddrLineTwo: String;
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
    SiteAddrLineTwo: String;
    SiteCity : String not null;
    SiteState : String not null;
    SiteZipcode : String not null;
    SitePhoneNumber : String not null;
    EmailAddr : String not null;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to ApplicationDetail;
}

// Application Detail Entity
entity ApplicationConsent {
    key ApplicationConsentId : UUID;
    FirstName : String not null;
    LastName : String not null;
    SiteContactTitle : String;
    Address: String not null;
    AddrLineTwo: String;
    City: String not null;
    State: String not null;
    Zipcode : String not null;
    AccountNumber : String not null;
    PhoneNumber : String;
    EmailAddr: String;
    AuthPersonName : String;
    AuthDate: Date;
    AuthTitle: String;
    ConsentStatus : consentStatus default 'New';
    ConsentByTenantFlag: Boolean default true;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to ApplicationDetail;
}

//Defining Unique Number
@assert.unique: {
    ApplicationNumber: [ApplicationNumber],
}

// Defining Custom Data types
type appStatus : String enum {
    New;
    Rejected;
    Accepted;
}

type consentStatus : String enum {
    New;
}
