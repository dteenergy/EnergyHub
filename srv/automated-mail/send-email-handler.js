const { sendEmail } = require('./send-mail');
const {getDestination, getDestinationServiceAccessToken} = require('./get-destination');
const {getMailAccessToken} = require('./get-mail-access-token');
const {getMailContent} = require('./get-mail-content');

const sendEmailHandler = async(state)=>{
  try{
    if(!state.destinationServiceAccessToken){
      state.destinationServiceAccessToken = await getDestinationServiceAccessToken();
    }

    if(!state.mailDestination){
      const destinationName = process.env.MAIL_DESTINATION;
      state.mailDestination = await getDestination(state.destinationServiceAccessToken, destinationName);
    }

    if(!state.mailAccessToken){
      const {tokenServiceURL, clientId, clientSecret, scope} = state.mailDestination;
      state.mailAccessToken = await getMailAccessToken(tokenServiceURL, clientId, clientSecret, scope);
    }

    if(!state.mailContent){
      await getMailContent(state.templateName, state.formDetails);
    }
    
    await sendEmail(state.mailDestination, state.mailContent);

  }catch(error){

  }
};

module.exports = {sendEmailHandler}