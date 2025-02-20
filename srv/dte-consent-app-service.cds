using {dteConsentApp as db} from '../db/schema';

@impl: './handler/form/main-handler.js'
@path : '/service'
service DTEConsentAppPortal {
    // Entity Projections or Action configuration
    entity ApplicationDetail as projection on db.ApplicationDetail;
    entity AccountDetail as projection on db.AccountDetail;
    entity BuildingDetail as projection on db.BuildingDetail;
    entity ApplicationConsent as projection on db.ApplicationConsent;
    
    action CreateEnrollmentFormDetail(
        ApplicationDetail : String,
        BuildingDetail : String,
        AccountDetail : String,
        ConsentDetail : String,
        Attachment : LargeBinary
    ) returns String;

    action CreateConsentFormDetail(
        ConsentDetail : String
    ) returns String;

    // Validate the Application Id
    function validateApplicationId () returns String;

    // Get environment variable (AEM Navigation page url and address validation url)
    function getEnvironmentVariables () returns String;

    // Download landlord location template spreadsheet template
    function DownloadLocationXSLTemplate () returns LargeBinary;
};