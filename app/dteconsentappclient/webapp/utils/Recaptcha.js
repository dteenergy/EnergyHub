sap.ui.define([
    "sap/ui/core/Control"
  ], function (Control) {
    "use strict";
  
    return Control.extend("utils.Recaptcha", {
      metadata: {
        properties: {
          siteKey: { type: "string", defaultValue: "" } // Google reCAPTCHA site key
        }
      },
  
      onAfterRendering: function () {
        // Ensure Google reCAPTCHA library is loaded
        if (!window.grecaptcha) {
          const script = document.createElement("script");
          script.src = "https://www.google.com/recaptcha/api.js";
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
  
          script.onload = this._renderRecaptcha.bind(this); // Render reCAPTCHA after script loads
        } else {
          this._renderRecaptcha(); // If library is already loaded, render directly
        }
      },
  
      _renderRecaptcha: function () {
        const domId = this.getId(); // Unique ID for the control DOM element
        const siteKey = this.getSiteKey(); // Retrieve the site key
  
        if (domId && siteKey) {
          // Render the reCAPTCHA widget inside the control DOM element
          window.grecaptcha.render(domId, {
            sitekey: siteKey
          });
        }
      }
    });
  });
  