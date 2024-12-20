using {dteConsentApp as db} from '../db/schema';

@path : '/admin/service'
@impl : './handler/admin-handler.js'
service DTEEnergyAdminPortal {

  entity ApplicationDetail as projection on db.ApplicationDetail;
  entity AccountDetail as projection on db.AccountDetail;
  entity BuildingDetail as projection on db.BuildingDetail;

  // Get the EnrollmentApplication Detail
  function EnrollmentApplication() returns String;
}

annotate DTEEnergyAdminPortal with @requires: [
  'authenticated-user'
];
