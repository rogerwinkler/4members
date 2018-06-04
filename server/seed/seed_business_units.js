var business_units
if (process.env.NODE_ENV === 'test') {
  business_units = require('./test_business_units.json')
} else {
  business_units = require('./business_units.json')
}
const BusinessUnitsHelpers = require('../src/db/BusinessUnitsHelpers')
const BusinessUnit = require('../src/models/BusinessUnit')
const debugLoadBusinessUnits = require('debug')('4members.seed_business_units.loadBusinessUnits')

module.exports = {
  async loadBusinessUnits() {
    debugLoadBusinessUnits('INPUT: (none)')
    await BusinessUnitsHelpers.deleteAll()
    for (var i=0; i<business_units.length; i++) {
      try {
        const businessUnit = new BusinessUnit(business_units[i].id, business_units[i].name, business_units[i].dsc, business_units[i].active)
        const result = await BusinessUnitsHelpers.insert(businessUnit)
        debugLoadBusinessUnits('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadBusinessUnits('IN FOR LOOP: error=%s', e.message)
        return
      }
    }
    debugLoadBusinessUnits('RETURNS: OK')
  }
}
