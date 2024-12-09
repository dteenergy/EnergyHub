const { v4: uuidv4 } = require('uuid');

/**
 * Function: Create the Enrollment form details
 * req => String 
 * entity => function
 */
const createEnrollmentFormDetail = async (req, entity) => {
    const { SignatureSignedBy, SignatureSignedDate, AccountDetail, BuildingDetail, ApplicationConsent } = req.data;
    const tx = cds.tx(req);

    // Parse the AccountDetail string into an array
    let accountDetailArray = [];
    let accountdetailJson;
    try {
        accountdetailJson = JSON.parse(AccountDetail);
        accountDetailArray.push(accountdetailJson);
    } catch (error) {
        return {
            statusCode: 400,
            error: 'Invalid AccountDetail JSON string'
        };
    }

    try {
        // Generate a unique AppId using uuid
        const AppId = uuidv4();

        // Insert into ApplicationDetail with generated AppId
        const application = await tx.run(
            INSERT.into(entity.ApplicationDetail).entries({
                AppId,
                SignatureSignedBy,
                SignatureSignedDate
            })
        );

        // Check if the record was successfully created
        if (!application || application === 0) {
            throw new Error('Failed to create ApplicationDetail');
        }

        // Parse the buildingDetail string into an array
        let buildingsArray;
        try {
            buildingsArray = JSON.parse(BuildingDetail);
        } catch (error) {
            throw new Error('Invalid BuildingDetail JSON string');
        }

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
        const buildingRes = await tx.run(
            INSERT.into(entity.BuildingDetail)
                .columns(['BuildingId'])
                .entries(buildingEntries)
        );

        if (!buildingRes || buildingRes.length === 0) {
            throw new Error('Failed to create BuildingDetail');
        }

        // If AccountDetail exists, create associated records
        if (accountDetailArray.length > 0) {
            const accountDetails = accountDetailArray.map(account => {
                // Check if EnergyPrgmParticipated exists in the account object
                if (!account.hasOwnProperty('EnergyPrgmParticipated')) {
                    account.EnergyPrgmParticipated = false;
                }
                return {
                    AppRefId_AppId: AppId,
                    ...account
                };
            });

            // Insert account details
            const accountRes = await tx.run(INSERT.into(entity.AccountDetail).entries(accountDetails));

            if (!accountRes || accountRes.length === 0) {
                throw new Error('Failed to create AccountDetail');
            }

            // Retrieve the IDs of the newly inserted records
            const insertedRecords = await tx.run(
                SELECT.from(entity.AccountDetail)
                    .where({ AppRefId_AppId: AppId })
                    .orderBy('CreatedAt')
                    .limit(accountDetails.length)
            );

            let applicationConsent;

            try {
                applicationConsent = JSON.parse(ApplicationConsent);
            } catch (error) {
                throw new Error('Invalid ApplicationConsent Data');
            }

            // ApplicationConsent Detail
            applicationConsent = applicationConsent.map(consent => ({
                ...consent,
                AppRefId_AppId: AppId
            }));

            const consentRes = await tx.run(INSERT.into(entity.ApplicationConsent).entries(applicationConsent));

            if (!consentRes || consentRes.length === 0) {
                throw new Error('Failed to create ApplicationConsent');
            }

            const appConsentInserted = await tx.run(
                SELECT.from(entity.ApplicationConsent)
                    .where({ AppRefId_AppId: AppId })
                    .orderBy('CreatedAt')
            );

            // Commit transaction and return success response
            await tx.commit();
            return {
                statusCode: 201,
                Message: "Application and associated AccountDetails created successfully",
                AppId: AppId,
                Account: insertedRecords[0].AccountDetailId,
                Consent: appConsentInserted[0].ApplicationConsentId
            };
        }
    } catch (error) {
        console.log("Inside the catch block", error);

        // Rollback transaction in case of failure
        await tx.rollback();
        return {
            statusCode: 500,
            error: error.message
        };
    }
};

module.exports = createEnrollmentFormDetail;