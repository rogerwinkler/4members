const roles = require('./roles.json')
const RolesHelpers = require('../src/db/RolesHelpers')
const debugLoadRoles = require('debug')('4members.seed_roles.loadRoles')

module.exports = {
  async loadRoles() {
    debugLoadRoles('INPUT: (none)')
    await RolesHelpers.deleteAll()
    for (var i=0; i<roles.length; i++) {
      try {
        const result = await RolesHelpers.insert(roles[i].id, roles[i].name, roles[i].dsc, roles[i].active)
        debugLoadRoles('RETURNS: %o', result)
      } catch(e) {
        debugLoadRoles('RETURNS: error')
      }
    }
  }
}