const properties = {
  'SignatureSignedBy':{
    'title':'SignatureSignedBy',
    'type':'string',
    'examples':['tony']
  },
  'SignatureSignedDate':{
    'title':'SignatureSignedDate',
    'type':'string',
    'format': 'date',
    'examples':['2025-01-16']
  }
};

const applicationDetailSchema = {
  'title': 'Root',
  'type': 'object',
  'required': ['SignatureSignedBy', 'SignatureSignedDate'],
  'additionalProperties': false,
  'properties': properties
}

module.exports = { applicationDetailSchema };