using {dteConsentApp as db} from '../db/schema';

@path : '/service'
service DTEConsentAppPortal {
    // Entity Projections or Action configuration
    entity DTEApplicationDetail as projection on db.ApplicationDetail;

};