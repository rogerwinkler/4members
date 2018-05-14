const Joi = require('joi')
const debug = require('debug')('4members.AuthenticationControllerPolicy')
const debugRegister = require('debug')('4members.AuthenticationControllerPolicy.register')

module.exports = {
  register (req, res, next) {
    debugRegister('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    const schema = {
      username: Joi.string().alphanum().min(2).max(30).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{8,60}$/),
      email   : Joi.string().email()
    }
    var retObj = {}

    const {error, value} = Joi.validate(req.body, schema)

    if (error) {
      switch(error.details[0].context.key) {
        case 'username':
          retObj = {
            status : 'error',
            code   : 1020,
            message: 'Not a valid username',
            detail : 'Username must consist of characters and numbers only, length from 2 to 30'
          }
          debugRegister('RETURNS: sending 400.. o%', retObj)
          return res.status(400).send(retObj)
          // break
        case 'email':
          retObj = {
            status : 'error',
            code   : 1021,
            message: 'Not a valid email address',
            detail : 'Email address must have a format of some.one@some.domain'            
          }
          debugRegister('RETURNS: sending 400.. o%', retObj)
          return res.status(400).send(retObj)
          // break
        case 'password':
          retObj = {
            status : 'error',
            code   : 1022,
            message: 'Not a valid password',
            detail : 'Password must consist of characters and numbers only, length from 8 to 60'            
          }
          debugRegister('RETURNS: sending 400.. o%', retObj)
          return res.status(400).send(retObj)
          // break
        default:         
          retObj = {
            status : 'error',
            code   : 1023,
            message: 'Invalid registration information',
            detail : 'Registration validation failed'            
          }
          debugRegister('RETURNS: sending 400.. o%', retObj)
          return res.status(400).send(retObj)
      }
    } else {
      next()
    }
  }
}