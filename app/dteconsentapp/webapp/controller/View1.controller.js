sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("dteconsentapp.controller.View1", {
        onInit() {
        },

        handleSubmit: async function(){
            const {data} = await axios.get('https://port4004-workspaces-ws-b66tw.us20.applicationstudio.cloud.sap/service/DTEApplicationDetail')

            
            console.log(data.value[0], 'While clicking submit');
            // MessageToast.show("Form Submitted Successfully", {
            //     duration: 3000,
            //     width: "15em"
            // });

            return data.value[0];
        },
    });
});