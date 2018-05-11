const roles = require('./roles.json')
const RolesHelpers = require('../src/db/RolesHelpers')
const debugLoadRoles = require('debug')('4members.seed_roles.loadRoles')

module.exports = {
  async loadRoles() {
    debugLoadRoles('INPUT: (none)')
    await RolesHelpers.deleteAll()
    for (var i=0; i<roles.length; i++) {
      try {
        const res = await RolesHelpers.insert(roles[i].id, roles[i].name, roles[i].dsc, roles[i].active)
        if (res.error) {
          debugLoadRoles('RETURNS: %o', res.error)
        } else {
          debugLoadRoles('RETURNS: "success"')
        }
      } catch(e) {
        console.log(e.stack)
      }
    }
  }
}