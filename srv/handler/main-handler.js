const cds = require('@sap/cds');

const createEnrollmentFormDetail = require('./create-enrollment-form-action');
const createConsentFormDetail = require('./create-consent-form-action');
const { valueEncrypt, valueDecrypt } = require('./encrypt-and-decrypt-id');
const validateApplicationId = require('./validate-app-id');

module.exports = cds.service.impl(async function (srv) {
	srv.on('CreateEnrollmentFormDetail', async (req) => {
		// Initialize the transaction
		const tx = cds.tx(req);
		try {
			// Method to create the Enrollment Form details
			const res = createEnrollmentFormDetail(req, this.entities, tx)

			return res;
		} catch (e) {
			return { 'error': 'Failed to create Enrollment Form' }
		}
	}),

		// Validate the Application Id
		srv.on('validateApplicationId', async (req) => {
			try {
				// Method to validate the app id.
				const validationStatus = validateApplicationId(req, this.entities);

				return validationStatus;
			} catch (e) {
				if (e.status) {
					return { status: e.status, message: e.message }
				}
				return { status: 500, 'error': 'Failed to verify the App ID.' }
			}
		}),

		srv.on('CreateConsentFormDetail', async (req) => {
			const tx = cds.tx(req);
			try {
				// Method to validate the app id.
				const validationStatus = await validateApplicationId(req, this.entities);

				// If the Validation status => 200
				if (validationStatus.status === 200) {
					// Store the Encrypted Application Id
					const encryptedAppId = req?._.req?.query?.encrAppId;

					// Decrypt the AppId
					const decryptedAppId = await valueDecrypt(encryptedAppId);

					// AppId decrypted successfully.
					if (decryptedAppId) {
						// Method to create the Consent Form details
						const consentResponse = await createConsentFormDetail(req, this.entities, tx, decryptedAppId);

						return consentResponse;
					}

					return decryptedAppId;

				}
				return validationStatus;

			} catch (e) {
				if (e.status) {
					return { status: e.status, message: e.message };
				} else
					return {
						status: 500, error: e.message
					}
			}
		}),

		// Testing Purpose
		srv.on('AppIdEncrypt', async (req) => {
			const encrAppId = req._.req.query.encrAppId;
			// Encrypt the AppId
			const encryptedData = await valueEncrypt(encrAppId);

			// Decrypt the AppId
			const decryptedData = await valueDecrypt(encryptedData);

			return { "Encrypted": encryptedData, "Decrypted": decryptedData }
		})
})