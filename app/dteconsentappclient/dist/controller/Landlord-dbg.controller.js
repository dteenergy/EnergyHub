sap.ui.define([
    "dteconsentappclient/controller/BaseController",
    "sap/ui/core/Fragment"
], (BaseController, Fragment) => {
    "use strict";

    return BaseController.extend("dteconsentappclient.controller.Landlord", {
        onInit() {
        // Assign url and headers into this controller global scope
          const { url, headers } = this.getApiConfig();
          this.HEADERS = headers;
          this.SERVERHOST = url;
        },

        handleSubmit: async function () {
            const {data} = await axios.get(`${this.SERVERHOST}service/DTEApplicationDetail`);

            
            console.log(data.value[0], 'While clicking submit');
        }
    });
});