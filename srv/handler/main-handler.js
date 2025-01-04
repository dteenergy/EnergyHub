const cds = require('@sap/cds');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars')
const {Readable} = require ('stream');


const createEnrollmentFormDetail = require('./create-enrollment-form-action');
const createConsentFormDetail = require('./create-consent-form-action');
const { valueEncrypt, valueDecrypt } = require('./encrypt-and-decrypt-id');
const validateApplicationId = require('./validate-app-id');
const { verifyRecaptchaToken } = require('./verify-recaptcha-token');

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
			const res = req._.res;
			try {
				// Method to validate the app id.
				const validationRes = await validateApplicationId(req, this.entities);

				if(validationRes.statusCode != 200) {
					throw {statusCode: 500, error: 'Unexcept error happended'}
				}
				
				// Read consent form view XML file
				const fileName = 'ConsentForm.view.xml';
				const filePath = path.join(__dirname, '../view', fileName);
				const consentFormViewBuffer = fs.readFileSync(filePath).toString();
	
				// Templating
				const template = handlebars.compile(consentFormViewBuffer);
				const result = template();

				res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
				res.setHeader('Content-type', 'application/xml');

				return result;
			} catch (e) {
				if (e.statusCode) {
					res.status(e.statusCode)
					return e.message 
				}
				res.status(500);
				return e.message;
			}
		}),

		srv.on('CreateConsentFormDetail', async (req) => {
			const tx = cds.tx(req);
			try {
				// Method to validate the app id.
				const validationStatus = await validateApplicationId(req, this.entities);

				// If the Validation statusCode => 200
				if (validationStatus.statusCode === 200) {
					// Store the Encrypted Application Id
					const encryptedAppId = req?._.req?.query?.encrAppId;

					// Decrypt the AppId
					const decryptedAppId = await valueDecrypt(encryptedAppId);

					// Method to create the Consent Form details
					const consentResponse = await createConsentFormDetail(req, this.entities, tx, decryptedAppId);

					return consentResponse;

				}
				throw validationStatus;

			} catch (e) {
				if (e.statusCode) {
					return { statusCode: e.statusCode, message: e.message };
				} else
					return {
						statusCode: 500, message: e.message
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
		});

    // Get environment variable (Navigation page url and address validation url)
		srv.on('getEnvironmentVariables', (req) => {
			return {
				DTEAddressValidationUrl: process.env.DTE_ADDRESS_VALIDATION_URL,
				LandlordConfirmationPageUrl: process.env.LANDLORD_CONFIRMATION_PAGE_URL,
				TenantConfirmationPageUrl: process.env.TENANT_CONFIRMATION_PAGE_URL,
				ErrorPageUrl: process.env.ERROR_PAGE_URL,
				GoogleRecaptchaSiteKey: process.env.GOOGLE_RECAPTCHA_SITEKEY
			}
		});

		srv.on('verifyRecaptcha', async (req)=>{
			const recaptchaToken =  req._.req.query.response;

			try{
				const verifyTokenResponse = await verifyRecaptchaToken(recaptchaToken);

				return verifyTokenResponse;
			} catch(e){
				if (e.statusCode) {
					
					return { statusCode: e.statusCode, message: e.message };
				} else
					return {
						statusCode: 500, message: e.message
					}
			}
			
		})
})