const UsersHelpers = require('../db/UsersHelpers')
const BusinessUnitsHelpers = require('../db/BusinessUnitsHelpers')
const ValidationHelpers = require('../db/ValidationHelpers')
const AuthenticationHelpers = require('../db/AuthenticationHelpers')
const User = require('../models/User')
const BusinessUnit = require('../models/BusinessUnit')
const debug          = require('debug')('4members.UsersController')
const debugGetAll    = require('debug')('4members.UsersController.getAll')
const debugGet       = require('debug')('4members.UsersController.get')
const debugInsert    = require('debug')('4members.UsersController.insert')
const debugUpdate    = require('debug')('4members.UsersController.update')
const debugDelete    = require('debug')('4members.UsersController.delete')
const debugDeleteAll = require('debug')('4members.UsersController.deleteAll')
const debugRegister  = require('debug')('4members.UsersController.register')
const debugLogin     = require('debug')('4members.UsersController.login')


module.exports = {

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async getAll (req, res) {}
  //  Returns all objects of the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: The found object in the standard structure in the body
  //  of the http response:
  //
  //  in case of success: 200         in case of an error: 400
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj}]              code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async getAll (req, res) {
    debugGetAll('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    const result = await UsersHelpers.getAll()
    if (result.status=='error') {
      debugGetAll('RETURNS: sending 400... %o', result)
      return res.status(400).json(result)
    } else {
      // result.authData = req.authData
      debugGetAll('RETURNS: sending 200... %o', result)
      return res.status(200).json(result)
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async get (req, res) {}
  //  Returns an object from the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //    req.params.id: [INT>0, NOT  NULL] id of the object to be returned
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: The found object in the standard structure in the body
  //  of the http response:
  //
  //  in case of success: 200         in case of an error: 404
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj}]              code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async get (req, res) {
    debugGet('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    const result = await UsersHelpers.get(req.params.id)
    if (result.status==='error') {
      debugGet('RETURNS: sending 404... %o', result)
      return res.status(404).send(result)
    } else {
      debugGet('RETURNS: sending 200... %o', result)
      return res.status(200).send(result)
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async insert (req, res) {}
  //  Inserts an object into the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //    req.body: {obj} object to be inserted
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: The inserted object in the standard structure in the body
  //  of the http response:
  //
  //  in case of success: 201         in case of an error: 400
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj}]              code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async insert (req, res) {
    debugInsert('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    var retObj = {}

    // validate properties of query object in req.body
    const result1 = ValidationHelpers.checkObjectHasOnlyValidProperties(req.body, ['id','username','password', 'fullname', 'email','active'])
    if (result1.status == 'error') {
      debugInsert('RETURNS: sending 400... %o', result1)
      return res.status(400).send(result1)
    }

    // check which properties of query object are provided and set accordingly
    var user = new User(
      (req.body.id === undefined       ? null : req.body.id      ),
      (req.body.username === undefined ? null : req.body.username),
      (req.body.password === undefined ? null : req.body.password),
      (req.body.fullname === undefined ? null : req.body.fullname),
      (req.body.email === undefined    ? null : req.body.email   ),
      (req.body.active === undefined   ? null : req.body.active  )
    )

    // insert
    const result2 = await UsersHelpers.insert(user)
    if (result2.status === 'error') {
      debugInsert('RETURNS: sending 400... %o', result2)
      return res.status(400).send(result2)
    } else {
      debugInsert('RETURNS: sending 201... %o', result2)
      return res.status(201).send(result2)
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async update (req, res) {}
  //  Updates an object in the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //    req.params.id: id of the object to be updated.
  //    req.body: {obj} object properties to be updated.
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: The found object in the standard structure in the body
  //  of the http response:
  //
  //  in case of success: 200         in case of an error: 404
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj}]              code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------

  async update (req, res) {
    debugUpdate('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    // validate: is there an id
    if (!req.params.id) {
      const retObj = {
        status : 'error',
        code   : 1010,
        message: 'Id missing in request parameter', 
        detail : 'Missing parameter "id" in http request PUT /:id'
      }
      debugUpdate('RETURNS: sending 404... %o', retObj)
      return res.status(404).send(retObj)
    }
    // check if body is empty object
    if (Object.keys(req.body).length === 0) {
      const retObj = {
        status : 'error',
        code   : 1012,
        message: 'No properties in body of http request PUT /:id', 
        detail : 'Http request body must contain at least one property'
      }
      debugUpdate('RETURNS: sending 404... %o', retObj)
      return res.status(404).send(retObj)
    }
    // validate properties of query object in req.body
    const result1 = ValidationHelpers.checkObjectHasOnlyValidProperties(req.body, ['username','password','fullname','email','active'])
    if (result1.status == 'error') {
      debugUpdate('RETURNS: sending 404... %o', result1)
      return res.status(404).send(result1)
    }
    // update
    const user = new User(req.params.id, req.body.username, req.body.password, req.body.fullname, req.body.email, req.body.active)
    const result2 = await UsersHelpers.update(user)
    if (result2.status == 'error') {
      debugUpdate('RETURNS: sending 404... %o', result2)
      return res.status(404).send(result2)
    } else {
      debugUpdate('RETURNS: sending 200... %o', result2)
      return res.status(200).send(result2)
    }
  }, 

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async deleteAll (req, res) {}
  //  Method not allowed!!!
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: Allways an error in the standard structure in the body
  //  of the http response:
  //
  //  {
  //    status : "error",
  //    code:  : 1014
  //    message: "Method not allowed"
  //    detail : "Avoid unconciously deleting all objects"
  //  }
  // -----------------------------------------------------------------

  async deleteAll (req, res) {
    debugDeleteAll('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    const retObj = {
      status  : 'error',
      code    : 1014,
      message : 'Method not allowed',
      detail  : 'Avoid unconciously deleting all objects'
    }
    debugDeleteAll('RETURNS: sending 405... %o', retObj)
    return res.status(405).send(retObj)
  }, 


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async delete (req, res) {}
  //  Deletes an object from the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //    req.params.id: id of the object to be updated.
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: The deleted object in the standard structure in the body
  //  of the http response:
  //
  //  in case of success: 200         in case of an error: 404
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj}]              code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------

  async delete (req, res) {
    debugDeleteAll('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    // validate: is there an id
    if (!req.params.id) {
      const retObj = {
        status : 'error',
        code   : 1013,
        message: 'Id missing in request parameter', 
        detail : 'Missing parameter "id" in http request DELETE /:id'
      }
      debugUpdate('RETURNS: sending 404... %o', retObj)
      return res.status(404).send(retObj)
    }
    const result = await UsersHelpers.delete(req.params.id)
    if (result.status == 'error') {
      debugDeleteAll('RETURNS: sending 404... %o', result)
      return res.status(404).send(result)
    } else {
      debugDeleteAll('RETURNS: sending 200... %o', result)
      return res.status(200).send(result)
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async register (req, res) {}
  //  Registers a new user
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //    req.body.organization: name of organization who's members are to be managed
  //    req.body.fullname    : full name of registrar
  //    req.body.email       : user's email
  //    req.body.username    : user's username
  //    req.body.password1   : user's password
  //    req.body.password2   : user's repeat password to identify mistypings.
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: The inserted user in the standard structure in the body
  //  of the http response:
  //
  //  in case of success: 201         in case of an error: 400
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj}]              code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------

  async register (req, res) {
    debugRegister('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    // validate properties in req.body
    const result1 = ValidationHelpers.checkObjectHasOnlyValidProperties(req.body, ['organization','fullname','email','username','password'])
    if (result1.status == 'error') {
      debugRegister('RETURNS: sending 400... %o', result1)
      return res.status(400).send(result1)
    }
    const bu = new BusinessUnit( null, req.body.organization, null, true)
    const user = new User(null, null, req.body.username, req.body.password, req.body.fullname, req.body.email, true)
    const result = await UsersHelpers.register(bu, user)
    if (result.status == 'error') {
      debugRegister('RETURNS: sending 400... %o', result)
      return res.status(400).send(result)
    } else {
      debugRegister('result=%o', result)
      const retObj = {
        status : "success",
        data   : [{
          user : {
            user_id  : result.data.user_id,
            username : result.data.username,
            password : result.data.password,
            fullname : result.data.fullname,
            email    : result.data.email,
            bu_id    : result.data.bu_id,
            bu_name  : result.data.bu_name
          },
          token : AuthenticationHelpers.jwtSignUser({
            user: {
              id       : result.data.user_id,
              username : result.data.username
            }
          })
        }]
      }
      debugRegister('RETURNS: sending 201... %o', retObj)
      return res.status(201).send(retObj)
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async login (req, res) {}
  //  Logs a user in
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //    req.body.username: user's username
  //    req.body.password: user's password
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: The inserted user in the standard structure in the body
  //  of the http response:
  //
  //  in case of success: 200         in case of an error: 404
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj}]              code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------

  async login (req, res) {
    debugLogin('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    var retObj = {}
    // check if username and password are there
    if (!req.body.username || !req.body.password) {
      retObj = {
        status : 'error',
        code   : 1028,
        message: 'Username and password required',
        detail : 'Login failed, username and password must be present'
      }
      debugLogin('RETURNS: sending 404... %o', retObj)
      return res.status(404).send(retObj)
    }
    // check that ONLY username and password are there
    if (Object.keys(req.body).length>2) {
      retObj = {
        status : 'error',
        code   : 1029,
        message: 'Wrong property provided, only username and password allowed',
        detail : 'Login failed, wrong property, only username and password allowed'
      }
      debugLogin('RETURNS: sending 404... %o', retObj)
      return res.status(404).send(retObj)
    } 
    const user = new User(null, req.body.username, req.body.password, null, null, null)
    const result = await UsersHelpers.login(user)
    if (result.status == 'error') {
      debugLogin('RETURNS: sending 404... %o', result)
      return res.status(404).send(result)
    } else {
      debugLogin('RETURNS: sending 200... %o', result)
      return res.status(200).send(result)
    }
  }

}
