using {dteConsentApp as db} from '../db/schema';

@impl: './handler/form/main-handler.js'
@path : '/service'
service DTEConsentAppPortal {
    // Entity Projections or Action configuration
    entity ApplicationDetail as projection on db.ApplicationDetail;
    entity AccountDetail as projection on db.AccountDetail;
    entity BuildingDetail as projection on db.BuildingDetail;
    entity ApplicationConsent as projection on db.ApplicationConsent;
    entity Attachment as projection on db.Attachment limit 1;
    
    // Create enrollment form action
    action CreateEnrollmentFormDetail(
        ApplicationDetail : ApplicationDetail @mandatory,
        BuildingDetail : array of BuildingDetail,
        AccountDetail : AccountDetail @mandatory,
        ConsentDetail : ApplicationConsent @mandatory,
        Attachment : Attachment
    ) returns String;

    // Create consent form action
    action CreateConsentFormDetail(
        ConsentDetail : ApplicationConsent @mandatory
    ) returns String;

    //Malware scanner
    action ScanMalware (
        Attachment : Attachment
    ) returns String;

    // Validate the Application Id
    function validateApplicationId () returns String;

    // Get environment variable (AEM Navigation page url and address validation url)
    function getEnvironmentVariables () returns String;

    
};