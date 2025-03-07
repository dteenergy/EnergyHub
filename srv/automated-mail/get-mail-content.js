const cds = require('@sap/cds');

const getMailContent = async(templateName, formDetails)=>{
  try{
    const {EmailTemplate} = cds.entities;

    const query = SELECT.from(EmailTemplate).where({'Name': templateName}).columns('Content','Variables');

    const templateDetails = cds.run(query);

    if(templateName === 'Landlord') {
      
    }
  }catch(error){
    throw error;
  }
};

module.exports = {getMailContent};