sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], (Controller, Fragment) => {
    "use strict";

    return Controller.extend("dteconsentappclient.controller.Landlord", {
        onInit() {

        },

        handleSubmit: async function () {
            const {data} = await axios.get('/service/DTEApplicationDetail')

            
            console.log(data.value[0], 'While clicking submit');
        }
    });
});