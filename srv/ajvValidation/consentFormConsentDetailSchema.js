const properties = {
  'FirstName':{
    'title':'FirstName',
    'type':'string',
    'examples':['Tony']
  },
  'LastName':{
    'title':'LastName',
    'type':'string',
    'examples':['Sporano']
  },
  'Address':{
    'title':'Address',
    'type':'string',
    'examples':['510, ADAMS ST']
  },
  'AddrLineTwo':{
    'title':'AddrLineTwo',
    'type':'string',
    'examples':['DTE 1', '']
  },
  'City':{
    'title':'City',
    'type':'string',
    'pattern':'^[a-zA-Z][a-zA-Z\\s]{0,99}$',
    'examples':['EAST TAWAS']
  },
  'State':{
    'title':'State',
    'type':'string',
    'examples':['Michigan']
  },
  'Zipcode':{
    'title':'Zipcode',
    'type':'string',
    'pattern':'^(?!00000$)\\d{5}$',
    'examples':['98765']
  },
  'AccountNumber':{
    'title':'AccountNumber',
    'type':'string',
    'pattern':'^(91|92)[0-9]{10}$',
    'examples':['9234567864']
  },
  'EmailAddr':{
    'title':'EmailAddr',
    'type':'string',
    'pattern':'^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    'examples':['tony@gmail.com']
  },
  'AuthPersonName':{
    'title':'AuthPersonName',
    'type':'string',
    'examples':['Jack']
  },
  'AuthDate':{
    'title':'AuthDate',
    'type':'string',
    'format': 'date',
    'examples':['2025-01-17']
  },
  'AuthTitle':{
    'title':'AuthTitle',
    'type':'string',
    'examples':['Auth Title']
  }
};

const consentFormConsentDetailSchema = {
  'title': 'Root',
  'type': 'object',
  'required': [
    'FirstName', 'LastName', 'Address', 'AddrLineTwo', 'City', 'State',
    'Zipcode', 'AccountNumber', 'EmailAddr', 'AuthPersonName', 'AuthDate'
  ],
  'additionalProperties': false,
  'properties': properties
};

module.exports = { consentFormConsentDetailSchema };