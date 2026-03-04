module.exports = {
  parserPreset: {
    parserOpts: {
      headerCorrespondence: ['type', 'ticket', 'issue', 'subject'],
      headerPattern: /^\[(\w+)(\/\d+)?]( #[\w-]+)? (.*)$/,
    },
  },
  rules: {
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['BUILD', 'DOC', 'FAKE', 'FEAT', 'FIX', 'REFACTOR', 'TEST', 'UPGRADE'],
    ],
  },
}
