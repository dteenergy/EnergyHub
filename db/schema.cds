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
    AccountNumber : AccountNumber not null @mandatory;
    Address : String not null @mandatory;
    City : City not null @mandatory;
    State : String not null @mandatory;
    Zipcode: Zipcode not null @mandatory;
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
    City : City not null @mandatory;
    State : String not null @mandatory;
    Zipcode : Zipcode not null @mandatory;
    AcctMgrName : String;
    AcctMgrPhNo: PhoneNumber;
    EnergyPrgmParticipated : Boolean default false;
    FirstName : String not null @mandatory; 
    LastName : String not null @mandatory; 
    SiteContactTitle : String not null @mandatory;
    SiteAddress : String not null @mandatory;
    SiteAddrLineTwo: String;
    SiteCity : City not null @mandatory;
    SiteState : String not null @mandatory;
    SiteZipcode : Zipcode not null @mandatory;
    SitePhoneNumber : PhoneNumber not null @mandatory;
    EmailAddr : Email not null @mandatory;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to ApplicationDetail;
}

// Application Consent Entity
entity ApplicationConsent {
    key ApplicationConsentId : UUID;
    FirstName : String not null @mandatory;
    LastName : String not null @mandatory;
    SiteContactTitle : String;
    Address: String not null @mandatory;
    AddrLineTwo: String;
    City: City not null @mandatory;
    State: String not null @mandatory;
    Zipcode : Zipcode not null @mandatory;
    AccountNumber : AccountNumber not null @mandatory;
    PhoneNumber : PhoneNumber;
    EmailAddr: Email @mandatory;
    AuthPersonName : String @mandatory;
    AuthDate: Date @mandatory;
    AuthTitle: String;
    ConsentStatus : consentStatus default 'New';
    ConsentByTenantFlag: Boolean default true;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;

    AppRefId : Association to ApplicationDetail;
}

entity Attachment{
    fileName: String @assert.format : '\.xlsx$' @mandatory;
    fileType: String @mandatory;
    fileContent : LargeBinary @mandatory;
}

//Defining Unique Number
@assert.unique: {
    ApplicationNumber: [ApplicationNumber],
}

// Defining Custom Data types
type Email : String @assert.format : '^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
type PhoneNumber : String @assert.format : '^(?!0000000000$)\d{10}$';
type City : String @assert.format : '^[a-zA-Z][a-zA-Z\s]{0,99}$';
type Zipcode : String @assert.format : '^(?!00000$)\d{5}$';
type AccountNumber : String @assert.format : '^(91|92)[0-9]{10}$';
type appStatus : String enum {
    New;
    Rejected;
    Accepted;
}
type consentStatus : String enum {
    New;
}





