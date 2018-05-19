const users = require('./users.json')
const UsersHelpers = require('../src/db/UsersHelpers')
const User = require('../src/models/User')
const debugLoadUsers = require('debug')('4members.seed_roles.loadUsers')

module.exports = {
  async loadUsers() {
    debugLoadUsers('INPUT: (none)')
    await UsersHelpers.deleteAll()
    for (var i=0; i<users.length; i++) {
      try {
        const user = new User(users[i].id, users[i].username, users[i].password, users[i].email, users[i].active)
        const result = await UsersHelpers.insert(user)
        debugLoadUsers('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadUsers('RETURNS: error=%s', e.message)
        return
      }
    }
    debugLoadUsers('RETURNS')
  }
}