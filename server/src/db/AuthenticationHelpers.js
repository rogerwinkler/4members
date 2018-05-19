const jwt = require('jsonwebtoken')
const config = require('../config/config')
const bcrypt = require('bcrypt-nodejs')
const debug = require('debug')('4members.AuthenticationHelpers')
const debugJwtSignUser = require('debug')('4members.AuthenticationHelpers.jwtSignUser')
const debugHashPassword = require('debug')('4members.AuthenticationHelpers.hashPassword')
const debugComparePasswords = require('debug')('4members.AuthenticationHelpers.comparePasswords')
const debugVerifyToken = require('debug')('4members.AuthenticationHelpers.verifyToken')

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
    return passwordOK
  },

  verifyToken(req, res, next) {
    debugVerifyToken('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    var retObj = {}

    // FORMAT OF TOKEN
    // Authorization: Bearer <access_token>

    // get auth header value
    const bearerHeader = req.headers['authorization']
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      // split at the space
      const bearer = bearerHeader.split(' ')
      // get token from array
      const bearerToken = bearer[1]
      // set the token
      req.token = bearerToken
      // verify token
      jwt.verify(req.token, config.authentication.jwtSecret, (err, authData) => {
        if (err) {
          retObj = {
            status : 'error',
            code   : 1030,
            message: 'Token could not be verified',
            detail : 'Token verification failed'
          }
          debugVerifyToken('RETURNS: sending 403... %o', retObj)
          res.status(403).send(retObj)
        } else {
          req.authData = authData
        }
      })
      // next middleware
      debugVerifyToken('RETURNS: OK => next(), next middleware')
      next()
    } else {
      // Forbidden
      retObj = {
        status : 'error',
        code   : 1029,
        message: 'Invalid token',
        detail : 'Must provide a valid token in the authorization header'
      }
      debugVerifyToken('RETURNS: sending 403... %o', retObj)
      res.status(403).send(retObj)
    }
  }

}
