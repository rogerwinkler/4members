const roles = require('./roles.json')
const RolesHelpers = require('../src/db/RolesHelpers')
const Role = require('../src/models/Role')
const debugLoadRoles = require('debug')('4members.seed_roles.loadRoles')

module.exports = {
  async loadRoles() {
    debugLoadRoles('INPUT: (none)')
    await RolesHelpers.deleteAll()
    for (var i=0; i<roles.length; i++) {
      try {
        const role = new Role(roles[i].id, roles[i].name, roles[i].dsc, roles[i].active)
        const result = await RolesHelpers.insert(role)
        debugLoadRoles('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadRoles('IN FOR LOOP: error=%s', e.message)
        return
      }
    }
    debugLoadRoles('RETURNS')
  }
}
