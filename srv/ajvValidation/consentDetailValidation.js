const properties = {
  'FirstName': {
    'title': 'FirstName',
    'type': 'string',
    'examples': ['Jack']
  },
  'LastName': {
    'title': 'LastName',
    'type': 'string',
    'examples': ['Sparrow']
  },
  'SiteContactTitle': {
    'title': 'SiteContactTitle',
    'type': 'string',
    'examples': ['Officer']
  },
  'Address': {
    'title': 'Address',
    'type': 'string',
    'examples': ['1, ENERGY PLZ']
  },
  'AddrLineTwo': {
    'title': 'AddrLineTwo',
    'type': 'string',
    'examples': ['STE 1', '']
  },
  'City': {
    'title': 'City',
    'type': 'string',
    'pattern': '^[a-zA-Z][a-zA-Z\\s]{0,99}$',
    'examples': ['DETROIT']
  },
  'State': {
    'title': 'State',
    'type': 'string',
    'examples': ['Michigan']
  },
  'Zipcode': {
    'title': 'ConsentZipcode',
    'type': 'string',
    'pattern': '^(?!00000$)\\d{5}$',
    'examples': ['48226']
  },
  'AccountNumber': {
    'title': 'AccountNumber',
    'type': 'string',
    'pattern': '^(91|92)[0-9]{10}$',
    'examples': ['927788789999']
  },
  'PhoneNumber': {
    'title': 'PhoneNumber',
    'type': 'string',
    "pattern": '^(?!0000000000$)\\d{10}$',
    'examples': ['6325412578']
  },
  'EmailAddr': {
    'title': 'EmailAddr',
    'type': 'string',
    'pattern': '^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    'examples': ['jack@gmail.com']
  },
  'AuthPersonName': {
    'title': 'AuthPersonName',
    'type': 'string',
    'examples': ['Jack Sparrow']
  },
  'AuthDate': {
    'title': 'AuthDate',
    'type': 'string',
    'format': 'date',
    'examples': ['2025-01-16']
  },
  'AuthTitle': {
    'title': 'AuthTitle',
    'type': 'string',
    'examples': ['Officer']
  }
};

const consentDetailSchema = {
  'title': 'Root',
  'type': 'array',
  'items': {
    'type': 'object',
    'required': [
      'FirstName', 'LastName', 'SiteContactTitle', 'Address', 'City',
      'State', 'Zipcode', 'AccountNumber', 'AuthPersonName', 'AuthDate'
    ],
    'additionalProperties': false,
    'properties': properties
  }
};

module.exports = { consentDetailSchema };