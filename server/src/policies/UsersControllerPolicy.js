const Joi = require('joi')
const debug = require('debug')('4members.UsersControllerPolicy')
const debugRegister = require('debug')('4members.UsersControllerPolicy.register')

module.exports = {
  register (req, res, next) {
    debugRegister('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    const schema = {
      id      : Joi.number(),
      username: Joi.string().alphanum().min(2).max(30).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{8,60}$/).required(),
      fullname: Joi.string(),
      email   : Joi.string().email(),
      active  : Joi.boolean()
    }
    var retObj = {}
    const objToValidate = {
      id      : req.body.id,
      username: req.body.username,
      password: req.body.password,
      fullname: req.body.fullname,
      email   : req.body.email,
      active  : req.body.active,
    }

    const {error, value} = Joi.validate(objToValidate, schema)
    debugRegister('error=%o', error)
    debugRegister('value=%o', value)
   
    if (error) {
      switch(error.details[0].context.key) {
        case 'fullname':
          retObj = {
            status : 'error',
            code   : 1043,
            message: 'Full name must be of type string',
            detail : 'Full name must be a string set up of characters'
          }
          debugRegister('RETURNS: sending 400.. o%', retObj)
          return res.status(400).send(retObj)
          // break
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
      debugRegister('RETURNS: OK')
      next()
    }
  }
}