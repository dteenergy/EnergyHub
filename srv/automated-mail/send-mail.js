const nodemailer = require('nodemailer');

 /**
 * Method to send a mail
 * @returns {object} - Returns a response after sending mail
 */
 const sendEmail = async(state)=>{
  try{

  // Mail transporter configuration
  const transporterConfig = {
    host: state.mailDestination['mail.smtp.host'],
    port: state.mailDestination['mail.smtp.port'],
    secure: false,
    auth: {
      type: 'OAuth2',
      user: state.mailDestination['User'],
      // pass: state.mailDestination['Password'],
      accessToken: state.mailAccessToken
    }
  };

  // Mail content configuration 
  const mailConfig = {
    from: state.mailDestination['mail.smtp.from'],
    to: state.toAddress,
    subject: state.subject,
    html: state.content
  };

  const transporter = nodemailer.createTransport(transporterConfig);

  // Calling the sendMail method
  const mailResponse = await transporter.sendMail(mailConfig);

  return mailResponse;
  }catch(error){
    throw error;
  }
};

module.exports = {sendEmail};
