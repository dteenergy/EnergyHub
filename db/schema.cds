namespace dteConsentApp;

// Entity for testing.
entity ApplicationDetail{
    key UniqueReference : String;
    ApplicationStatus : appStatus default 'Rejected';
    Date: Date;
}

type appStatus : String enum
{
    Approved;
    Rejected;
}