const { sendMail } = require("@sap-cloud-sdk/mail-client");
const { getDestination } =  require('@sap-cloud-sdk/connectivity');

 /**
 * Method to send a mail
 * @returns {object} - Returns a response after sending mail
 */
const sendEmail = async(req, res)=>{

  try{
  
    const mailConfig = {
      to: 'kokila.sivakumar@dteenergy.com',
      subject: 'Test mail service',
      // text: 'Testing mail service! Thanks.',
      html:  `<html>
                <style>
                  .main-content{color:red;}
                </style>
                <body>
                  <p>This is a Test mail.</p>
                </body>
              </html>`
    };

    const destination = await getDestination('sap_process_automation_mail');
    console.log(destination, "Destination");
    

  // Calling the sendMail method to send email through the configured destination  
  // const response = await sendMail(
  //   { destinationName: "ssiTimeSheetMailDestination" },
  //    [mailConfig]
  //   );
  
  // log the response for debugging purpose
  // console.log(response);  

  // if (!response) throw 'Failed to send mail notification';
  
  res.json({"Message": "Mail send successfully"});

  }catch(err){
    res.json({"Message": err.message});
  }

};

module.exports = {sendEmail};


// * @param {Array<string>} to 
// * @param {string} subject 
// * @param {string} text