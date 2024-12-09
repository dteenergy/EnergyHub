const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

/**
 * Function: Create the Enrollment form details
 * req => String 
 * entity => function
 */
const createEnrollmentFormDetail = async (req, entity) => {
  const { SignatureSignedBy, SignatureSignedDate, AccountDetail, BuildingDetail, ApplicationConsent } = req.data;
  const tx = cds.tx(req);

  try {
    // Parse the AccountDetail string into an array
    // let accountDetailArray = [];
    let accountdetailJson;

    accountdetailJson = JSON.parse(AccountDetail);
    // accountDetailArray.push(accountdetailJson);

    // Parse the buildingDetail string into an array
    let buildingsArray;
    buildingsArray = JSON.parse(BuildingDetail);

    let applicationConsent;
    applicationConsent = JSON.parse(ApplicationConsent);

    // Generate a unique AppId using uuid
    const AppId = uuidv4();

    // Insert into ApplicationDetail with generated AppId
    await tx.run(
      INSERT.into(entity.ApplicationDetail).entries({
        AppId,
        SignatureSignedBy,
        SignatureSignedDate
      })
    );

    // Create the associated BuildingDetail entries
    const buildingEntries = buildingsArray.map(detail => ({
      BuildingName: detail.buildingName,
      AccountNumber: detail.accountNumber,
      Address: detail.locationAddress,
      City: detail.city,
      State: detail.state,
      Zipcode: detail.zipcode,
      AppRefId_AppId: AppId,
    }));

    // Insert all building details
    await tx.run(
      INSERT.into(entity.BuildingDetail)
        .columns(['BuildingId'])
        .entries(buildingEntries)
    );

    // If AccountDetail exists, create associated records
    accountdetailJson.AppRefId_AppId = AppId;

    // Check if EnergyPrgmParticipated exists in the account object
    if (!accountdetailJson.hasOwnProperty('EnergyPrgmParticipated')) {
      accountdetailJson.EnergyPrgmParticipated = false;
    } 

    // Insert account details
    await tx.run(INSERT.into(entity.AccountDetail).entries(accountdetailJson));

    // Retrieve the IDs of the newly inserted records
    await tx.run(
      SELECT.from(entity.AccountDetail)
        .where({ AppRefId_AppId: AppId })
        .orderBy('CreatedAt')
        .limit(accountdetailJson.length)
    );

    // ApplicationConsent Detail
    applicationConsent = applicationConsent.map(consent => ({
      ...consent,
      AppRefId_AppId: AppId
    }));

    await tx.run(INSERT.into(entity.ApplicationConsent).entries(applicationConsent));

    await tx.run(
      SELECT.from(entity.ApplicationConsent)
        .where({ AppRefId_AppId: AppId })
        .orderBy('CreatedAt')
    );

    // Commit transaction and return success response
    await tx.commit();
    return {
      statusCode: 201,
      Message: "Enrollment form created successfully."
    };
    // }
  } catch (error) {
    console.log("Enrollment Form Creation Error :", error);

    // Rollback transaction in case of failure
    await tx.rollback();
    return {
      statusCode: 500,
      error: error.message
    };
  }
};

module.exports = createEnrollmentFormDetail;