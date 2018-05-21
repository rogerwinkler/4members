var access_codes
if (process.env.NODE_ENV === 'test') {
  access_codes = require('./test_access_codes.json')
} else {
  access_codes = require('./access_codes.json')
}
const AccessCodesHelpers = require('../src/db/AccessCodesHelpers')
const AccessCode = require('../src/models/AccessCode')
const debugLoadAccessCodes = require('debug')('4members.seed_access_codes.loadAccessCodes')

module.exports = {
  async loadAccessCodes() {
    debugLoadAccessCodes('INPUT: (none)')
    await AccessCodesHelpers.deleteAll()
    for (var i=0; i<access_codes.length; i++) {
      try {
        const accessCode = new AccessCode(access_codes[i].id, access_codes[i].name, access_codes[i].dsc, access_codes[i].active)
        const result = await AccessCodesHelpers.insert(accessCode)
        debugLoadAccessCodes('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadAccessCodes('IN FOR LOOP: error=%s', e.message)
        return
      }
    }
    debugLoadAccessCodes('RETURNS')
  }
}