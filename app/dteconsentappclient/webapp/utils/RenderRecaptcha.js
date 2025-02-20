sap.ui.define([], 
  function(){
  "use strict";

  return {

    /**
     * To render recaptcha component and get verification token
     * @param {string} RecaptchaSiteKey 
     * @param {string} recaptchaToken 
     * @param {string} isRecatchaVerified 
     */  
    renderRecaptcha: function(that){
      
      const id = that.byId("recaptcha-container")?.getDomRef()?.id;
        
      grecaptcha.ready(()=>{
        grecaptcha.render(id, {
          "sitekey": that.RecaptchaSiteKey,
          "theme": "light",
          
          "callback": (token) => {
            that.recaptchaToken = token;
            that.isRecaptchaVerified = true;
            that.errorVisibilityModel.setProperty('/recaptchaErrorMessageVisibilityStatus', false);
          }, // Callback for success

          "expired-callback": () => {
            that.isRecaptchaVerified = false;
            that.recaptchaToken = null;
          }
        })
      });
    }
  }
});