var business_units_users
if (process.env.NODE_ENV === 'test') {
  business_units_users = require('./test_business_units_users.json')
} else {
  business_units_users = require('./business_units_users.json')
}
const BusinessUnitsUsersHelpers = require('../src/db/BusinessUnitsUsersHelpers')
const BusinessUnitUser = require('../src/models/BusinessUnitUser')
const debugLoadBusinessUnitsUsers = require('debug')('4members.seed_business_units_users.loadBusinessUnitsUsers')

module.exports = {
  async loadBusinessUnitsUsers() {
    debugLoadBusinessUnitsUsers('INPUT: (none)')
    await BusinessUnitsUsersHelpers.deleteAll()
    for (var i=0; i<business_units_users.length; i++) {
      try {
        const businessUnitUser = new BusinessUnitUser(business_units_users[i].bu_id, business_units_users[i].user_id, business_units_users[i].active)
        const result = await BusinessUnitsUsersHelpers.insert(businessUnitUser)
        debugLoadBusinessUnitsUsers('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadBusinessUnitsUsers('IN FOR LOOP: error=%s', e.message)
        return
      }
    }
    debugLoadBusinessUnitsUsers('RETURNS: OK')
  }
}
