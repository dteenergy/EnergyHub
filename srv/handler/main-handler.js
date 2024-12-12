const cds = require('@sap/cds');

const createEnrollmentFormDetail = require('./create-enrollment-form-action');
const createConsentFormDetail = require('./create-consent-form-action');
const { valueEncrypt, valueDecrypt } = require('./encrypt-and-decrypt-id');

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

		srv.on('Application', async (req) => {
			const { ApplicationDetail } = this.entities;
			// Get the encrypted app reference id
			const encrAppId = req?._.req?.query?.encrAppId;

			// Decrypt the AppId
			const decryptedData = await valueDecrypt(encrAppId);

			// Fetch the application details by AppId and select only the AppId column
			const applicationDetail = await SELECT.from(ApplicationDetail).where({ 'AppId': decryptedData }).columns(['AppId']);

			// If applicationDetail result is empty
			if (applicationDetail?.length === 0) throw { status: 404, message: 'Application Detail not found for the Id' }
			else return { status: 200, message: 'Application Details are available.' }

		}),

		srv.on('CreateConsentFormDetail', async (req) => {
			const tx = cds.tx(req);
			try {
				// Method to create the Consent Form details
				const consentResponse = await createConsentFormDetail(req, this.entities, tx);

				return consentResponse;
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