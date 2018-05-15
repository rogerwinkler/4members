const jwt = require('jsonwebtoken')
const config = require('../config/config')
const bcrypt = require('bcrypt-nodejs')
const debug = require('debug')('4members.AuthenticationHelpers')
const debugJwtSignUser = require('debug')('4members.AuthenticationHelpers.jwtSignUser')
const debugHashPassword = require('debug')('4members.AuthenticationHelpers.hashPassword')
const debugComparePasswords = require('debug')('4members.AuthenticationHelpers.comparePasswords')


module.exports = {
  jwtSignUser(user) {
    debugJwtSignUser('INPUT: user=%o', user)
    const ONE_WEEK = 60 * 60 * 24 * 7
    const token = jwt.sign(user, config.authentication.jwtSecret, {
      expiresIn: ONE_WEEK
    })
    debugJwtSignUser('RETURNS: token=%s', token)
    return token
  },

  hashPassword (password) {
    debugHashPassword('INPUT: password=%s', password)
    const SALT_FACTOR = 8
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR))
    debugHashPassword('RETURNS: hashedPassord=%s', hashedPassword)
    return hashedPassword
  },

  comparePasswords(pwd, encryptedPwd) {
    debugComparePasswords('INPUT: pwd=%s, encryptedPwd=', pwd, encryptedPwd)
    const passwordOK = bcrypt.compareSync(pwd, encryptedPwd)
    debugComparePasswords('RETURNS: passwordOK=%s', passwordOK)
  }

}
