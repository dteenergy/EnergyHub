namespace dteConsentApp;

//Application Detail Entity
entity ApplicationDetail{
    key AppId: UUID;
    ApplicationStatus : appStatus default 'New';
    NumberOfTenants : Integer;
    SignatureSignedBy : String not null @mandatory;
    SignatureSignedDate : Date not null @mandatory;
    ApplicationNumber : String not null;
    AttachmentURL : String;
    Comment : String;
    AssignedTo : String;
    LinkId: String;
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
    BuildingName : String not null @mandatory;
    AccountNumber : String not null @mandatory;
    Address : String not null @mandatory;
    City : String not null @mandatory;
    State : String not null @mandatory;
    Zipcode: String not null @mandatory;
    AddrLineTwo: String;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to one ApplicationDetail;
}

// Account Detail Entity
entity AccountDetail {
    key AccountDetailId : UUID;
    CompanyName : String not null @mandatory;
    CompanyAddress : String not null @mandatory;
    CompanyAddrLineTwo: String;
    City : String not null @mandatory;
    State : String not null @mandatory;
    Zipcode : String not null @mandatory;
    AcctMgrName : String;
    AcctMgrPhNo: String;
    EnergyPrgmParticipated : Boolean default false;
    FirstName : String not null @mandatory; 
    LastName : String not null @mandatory; 
    SiteContactTitle : String not null @mandatory;
    SiteAddress : String not null @mandatory;
    SiteAddrLineTwo: String;
    SiteCity : String not null @mandatory;
    SiteState : String not null @mandatory;
    SiteZipcode : String not null @mandatory;
    SitePhoneNumber : String not null @mandatory;
    EmailAddr : String not null @mandatory;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to ApplicationDetail;
}

// Application Consent Entity
entity ApplicationConsent {
    key ApplicationConsentId : UUID;
    FirstName : String not null @mandatory;
    LastName : String not null @mandatory;
    SiteContactTitle : String @mandatory;
    Address: String not null @mandatory;
    AddrLineTwo: String;
    City: String not null @mandatory;
    State: String not null @mandatory;
    Zipcode : String not null @mandatory;
    AccountNumber : String not null @mandatory;
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

entity Attachment{
    fileName: String @mandatory;
    fileType: String @mandatory;
    fileContent : LargeBinary @mandatory;
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


