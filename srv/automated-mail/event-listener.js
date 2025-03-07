const emitter = require('./emitter-initialize');
const {sendEmailHandler} = require('./send-email-handler');

emitter.on('Confirmation-email', (state)=>{
  sendEmailHandler(state);
});