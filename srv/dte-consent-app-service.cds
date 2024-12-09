using {dteConsentApp as db} from '../db/schema';

@impl: './handler/main-handler.js'
@path : '/service'
service DTEConsentAppPortal {
    // Entity Projections or Action configuration
    entity ApplicationDetail as projection on db.ApplicationDetail;
    entity AccountDetail as projection on db.AccountDetail;
    entity BuildingDetail as projection on db.BuildingDetail;
    entity ApplicationConsent as projection on db.ApplicationConsent;
    
    action CreateEnrollmentFormDetail(
        Enrollment : String
    ) returns String;
};