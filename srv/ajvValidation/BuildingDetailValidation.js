const properties = {
  'BuildingName':{
    'title':'BuildingName',
    'type':'',
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
    'examples':['EAST TAWAS']
  },
  'State':{
    'title':'State',
    'type':'string',
    'examples':['Michigan']
  },'Zipcode':{
    'title':'Zipcode',
    'type':'string',
    'examples':['98765']
  },
  'AddrLineTwo':{
    'title':'AddrLineTwo',
    'type':'string',
    'examples':['DTE 1']
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