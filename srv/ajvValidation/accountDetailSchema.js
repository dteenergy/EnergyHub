const properties = {
  'CompanyName':{
    'title':'CompanyName', 
    'type':'string',
    'examples':['DTE Head Office']
  },
  'CompanyAddress':{
    'title':'CompanyAddress',
    'type':'string',
    'examples':['1 Energy Plaza, Detroit, Michigan']
  },
  'CompanyAddrLineTwo':{
    'title':'CompanyAddrLineTwo',
    'type':'string',
    'examples':['STE 1']
  },
  'City':{
    'title':'City',
    'type':'string',
    'pattern':'^[a-zA-Z][a-zA-Z\\s]{0,99}$',
    'examples':['DETROIT']
  },
  'State':{
    'title':'State',
    'type':'string',
    'examples':['Alabama']
  },
  'Zipcode':{
    'title':'AccountZipcode',
    'type':'string',
    'pattern':'^(?!00000$)\\d{5}$',
    'examples':['98765']
  },
  'EnergyPrgmParticipated':{
    'title':'EnergyPrgmParticipated',
    'type':'boolean',
    'examples':[true]
  },
  'AcctMgrName':{
    'title':'AcctMgrName',
    'type':'string',
    'examples':['Kokila']
  },
  'AcctMgrPhoneNumber':{
    'title':'AcctMgrPhoneNumber',
    "type": ['string', 'null'],
    "pattern": '^(?!0000000000$)\\d{10}$',
    'examples':['9876543213', null]
  },
  'SiteFirstName':{
    'title':'SiteFirstName',
    'type':'string',
    'examples':['Matt']
  },
  'SiteLastName':{
    'title':'SiteLastName',
    'type':'string',
    'examples':['Damon']
  },
  'SiteContactTitle':{
    'title':'SiteContactTitle',
    'type':'string',
    'examples':['Officer']
  },
  'SiteAddress':{
    'title':'SiteAddress',
    'type':'string',
    'examples':['1 Energy Plaza']
  },
  'SiteAddrLineTwo':{
    'title':'SiteAddrLineTwo',
    'type':'string',
    'examples':['DTE 1', '']
  },
  'SiteCity':{
    'title':'SiteCity',
    'type':'string',
    'pattern':'^[a-zA-Z][a-zA-Z\\s]{0,99}$',
    'examples':['DETROIT']
  },
  'SiteState':{
    'title':'SiteState',
    'type':'string',
    'examples':['Alabama']
  },
  'SiteZipcode':{
    'title':'SiteZipcode',
    'type':'string',
    'pattern':'^(?!00000$)\\d{5}$',
    'examples':['98765']
  },
  'SitePhoneNumber':{
    'title':'SitePhoneNumber',
    'type':'string',
    'pattern':'^(?!0000000000$)\\d{10}$',
    'examples':['9876543213']
  },
  'SiteEmailAddr':{
    'title':'SiteEmailAddr',
    'type':'string',
    'pattern':'^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    'examples':['abc@gmail.com']
  },
  'FirstName':{
    'title':'FirstName',
    'type':'string',
    'examples':['Tony']
  },
  'LastName':{
    'title':'LastName',
    'type':'string',
    'examples':['Soprano']
  },
  'EmailAddr':{
    'title':'EmailAddr',
    'type':'string',
    'pattern':'^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    'examples':['tony.soprano@gmail.com']
  },
  'AcctMgrPhNo':{
    'title':'AcctMgrPhNo',
    "type": ['string', 'null'],
    "pattern": '^(?!0000000000$)\\d{10}$',
    'examples':['9876543213', null]
  }
}

const accountDetailSchema = {
  'title':'Root',
  'type':'object',
  'required':['CompanyName', 'CompanyAddress', 'City', 'State', 'Zipcode', 'EnergyPrgmParticipated',
    'SiteFirstName', 'SiteLastName', 'SiteContactTitle', 'SiteAddress', 'SiteCity', 'SiteState',
    'SiteZipcode', 'SitePhoneNumber', 'SiteEmailAddr', 'FirstName', 'LastName', 'EmailAddr', 'AcctMgrPhNo'],
  'additionalProperties':false,
  'properties':properties
}

module.exports = { accountDetailSchema };