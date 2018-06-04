const BusinessUnitsUsersHelpers = require('../db/BusinessUnitsUsersHelpers')
const ValidationHelpers = require('../db/ValidationHelpers')
const BusinessUnitUser = require('../models/BusinessUnitUser')

const debug          = require('debug')('4members.BusinessUnitsUsersController')
// const debugGetAll    = require('debug')('4members.BusinessUnitsUsersController.getAll')
const debugGet       = require('debug')('4members.BusinessUnitsUsersController.get')
const debugInsert    = require('debug')('4members.BusinessUnitsUsersController.insert')
const debugUpdate    = require('debug')('4members.BusinessUnitsUsersController.update')
const debugDelete    = require('debug')('4members.BusinessUnitsUsersController.delete')
const debugDeleteAll = require('debug')('4members.BusinessUnitsUsersController.deleteAll')


module.exports = {

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
    const result = await BusinessUnitsUsersHelpers.get(req.body)
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
    const result1 = ValidationHelpers.checkObjectHasOnlyValidProperties(req.body, ['bu_id','user_id','active'])
    if (result1.status == 'error') {
      debugInsert('RETURNS: sending 400... %o', result1)
      return res.status(400).send(result1)
    }

    // check which properties of query object are provided and set accordingly
    const businessUnitUser = new BusinessUnitUser (
      (req.body.bu_id === undefined   ? null : req.body.bu_id  ),
      (req.body.user_id === undefined ? null : req.body.user_id),
      (req.body.active === undefined  ? null : req.body.active )
    )

    // insert
    const result2 = await BusinessUnitsUsersHelpers.insert(businessUnitUser)
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
    const result1 = ValidationHelpers.checkObjectHasOnlyValidProperties(req.body, ['name','dsc','active'])
    if (result1.status == 'error') {
      debugUpdate('RETURNS: sending 404... %o', result1)
      return res.status(404).send(result1)
    }
    // update
    const businessUnitUser = new BusinessUnitUser(req.params.id, req.body.name, req.body.dsc, req.body.active)
    const result2 = await BusinessUnitsUsersHelpers.update(businessUnitUser)
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
  //    req.params.id: id of the object to be deleted.
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
    const result = await BusinessUnitsUsersHelpers.delete(req.params.id)
    if (result.status == 'error') {
      debugDeleteAll('RETURNS: sending 404... %o', result)
      return res.status(404).send(result)
    } else {
      debugDeleteAll('RETURNS: sending 200... %o', result)
      return res.status(200).send(result)
    }
  } 

}
