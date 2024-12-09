namespace dteConsentApp;

// Entity for Storing Application details.
entity ApplicationDetail{
    key AppRefNo : UUID;
    ApplicationStatus: appStatus default 'New';  
    NumberOfTenants: Integer;
    SignatureSignedBy: String;
    SignatureSignedDate: Date;
    CreatedAt: Timestamp @cds.on.insert: $now;
    UpdatedAt: Timestamp @cds.on.insert: $now  @cds.on.update: $now;
}

type appStatus : String enum
{   
    New;
    Approved;
    Rejected;
}