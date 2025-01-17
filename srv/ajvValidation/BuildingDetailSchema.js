const properties = {
  'BuildingName':{
    'title':'BuildingName',
    'type':'string',
    'examples':['Castle']
  },
  'AccountNumber':{
    'title':'AccountNumber',
    'type':'string',
    'pattern':'^(91|92)[0-9]{10}$',
    'examples':['9234567864']
  },
  'Address':{
    'title':'Address',
    'type':'string',
    'examples':['510, ADAMS ST']
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
    'title':'BuildingZipcode',
    'type':'string',
    'pattern':'^(?!00000$)\\d{5}$',
    'examples':['98765']
  },
  'AddrLineTwo':{
    'title':'AddrLineTwo',
    'type':'string',
    'examples':['DTE 1', '']
  }
}

const buildingDetailSchema = {
  'title': 'Root',
  'type': 'array',
  'items': {
    'type':'object',
    'required':['BuildingName', 'AccountNumber', 'Address', 'City', 'State', 'Zipcode'],
    'additionalProperties':false,
    'properties':properties
  }
}

module.exports = { buildingDetailSchema };