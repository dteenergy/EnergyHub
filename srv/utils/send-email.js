const nodemailer = require('nodemailer');

const {getDestination, getDestinationServiceAccessToken} = require('../automated-mail/get-destination');
const {getMailAccessToken} = require('../automated-mail/get-mail-access-token');

 /**
 * Method to send a mail
 * @returns {object} - Returns a response after sending mail
 */
const sendEmail = async(req, res)=>{

  try{

    // To get the destination service access_token 
    const access_token = await getDestinationServiceAccessToken();
    
    // Retrieve the destination from SAP BTP
    const destinationResponse = await getDestination(access_token);  

    const {tokenServiceURL, clientId, clientSecret, scope} = destinationResponse;    

    // Using the destination's auth credentials,get the access token
    const mailAccessToken = await getMailAccessToken(tokenServiceURL, clientId, clientSecret, scope);

    // Mail transporter configuration
    const transporterConfig = {
      host: destinationResponse['mail.smtp.host'],
      port: destinationResponse['mail.smtp.port'],
      secure: false,
      auth: {
        type: 'OAuth2',
        user: destinationResponse['User'],
        // pass: destinationResponse['Password'],
        accessToken: mailAccessToken
      }
    }
    
    // Mail content configuration 
    const mailConfig = {
      from: destinationResponse['mail.smtp.from'],
      to: 'kokila.sivakumar@dteenergy.com',
      subject: 'Test mail service',
      html:  `<html>
                <style>
                  .main-content{color:red;}
                </style>
                <body>
                  <p>This is a Test mail.</p>
                </body>
              </html>`
    };

   
  const transporter = nodemailer.createTransport(transporterConfig);

  // Calling the sendMail method
  const mailResponse = await transporter.sendMail(mailConfig);
    
  console.log(mailResponse);  

  if (!mailResponse) throw 'Failed to send mail notification';
  
  res.json({"Message": "Mail send successfully"});

  }catch(err){
    console.log(err);
    
    res.json({"Message": err?.message});
  }

};

module.exports = {sendEmail};