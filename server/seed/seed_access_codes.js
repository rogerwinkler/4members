const access_codes = require('./access_codes.json')
const AccessCodesHelpers = require('../src/db/AccessCodesHelpers')
const debugLoadAccessCodes = require('debug')('4members.seed_access_codes.loadAccessCodes')

module.exports = {
  async loadAccessCodes() {
    debugLoadAccessCodes('INPUT: (none)')
    await AccessCodesHelpers.deleteAll()
    for (var i=0; i<access_codes.length; i++) {
      try {
        const result = await AccessCodesHelpers.insert(access_codes[i].id, access_codes[i].name, access_codes[i].dsc, access_codes[i].active)
        debugLoadAccessCodes('RETURNS: %o', result)
      } catch(e) {
        debugLoadAccessCodes('RETURNS: error=%s', e.message)
      }
    }
  }
}