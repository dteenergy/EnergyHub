using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
service DTEEnergyAdminPortal {

   entity ApplicationDetail as projection on db.ApplicationDetail;

}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
