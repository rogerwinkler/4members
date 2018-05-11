const RolesHelpers = require('../db/RolesHelpers')
const ValidationHelpers = require('../db/ValidationHelpers')

const debug = require('debug')('4members.RolesController')
const debugGetAll = require('debug')('4members.RolesController.getAll')
const debugGet = require('debug')('4members.RolesController.get')
const debugInsert = require('debug')('4members.RolesController.insert')
const debugUpdate = require('debug')('4members.RolesController.update')


module.exports = {

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async getAll (req, res) {}
  //  Returns all objects of table roles.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: 
  //  res.status=201 success
  //    res.data={
  //      status: "success", 
  //      data: [{role1}, ...]
  //    }
  //
  //  res.status=400 bad request
  //    res.error={ error: {code, msg, dsc}}
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async getAll (req, res) {
    debugGetAll('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    var retObj = {}
     // select
    const result = await RolesHelpers.getAll()
    if (result.status=='error') {
      res.status(400).send(result)
      debugGetAll('RETURNS: error=%o', result)
    } else {
      res.status(200).send(result)
      debugGetAll('RETURNS: %o', result)
    }
  },

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async get (req, res) {}
  //  Returns an objects of table role.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //    req.body.id id of the role to be returned
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: 
  //  res.status=201 success
  //    res.data=[{role}]
  //
  //  res.status=404 not found
  //    res.error={ error: {code, msg, dsc}}
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async get (req, res) {
    debugGet('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    var retObj = {}
     // select
    const result = await RolesHelpers.get(req.params.id)
    if (result.status==='error') {
      res.status(404).send(result)
      debugGet('RETURNS: error=%o', result)
    } else {
      res.status(200).send(result)
      debugGet('RETURNS: %o', result)
    }
  },

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async insert (req, res) {}
  //  Inserts a role object contained in req.body into the database.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: 
  //  res.status=201 success
  //    res.data={
  //      status: "success", 
  //      data: [{id, name, dsc, active}]
  //    }
  //
  //  res.status=400 bad request
  //    res.error={ error: {code, msg, dsc}}
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async insert (req, res) {
    debugInsert('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    var retObj = {}

    // validate properties of query object in req.body
    const result1 = ValidationHelpers.checkObjectHasInvalidProperties(req.body, ['id','name','dsc','active'])
    if (result1.error) {
      debugInsert('RETURNS: %o', result1)
      res.status(400).send(result1)
      return
    }

    // check which properties of query object are provided and set accordingly
    const id = (req.body.id == undefined ? null : req.body.id)
    const name = (req.body.name == undefined ? null : req.body.name)
    const dsc = (req.body.dsc == undefined ? null : req.body.dsc)
    const active = (req.body.active == undefined ? null : req.body.active)

    // insert
    const result2 = await RolesHelpers.insert(id, name, dsc, active)
    if (result2.error) {
      res.status(400).send({error: result2.error})
      debugInsert('RETURNS: error=%o', result2.error)
    } else {
      retObj = {
        'status' : 'success',
        'data': result2.rows
      }
      res.status(201).send(retObj)
      debugInsert('RETURNS: %o', retObj)
    }
  },

  async update (req, res) {
    debugUpdate('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)

    // validate properties of query object in req.body
    const result1 = ValidationHelpers.checkObjectHasInvalidProperties(req.body, ['id','name','dsc','active'])
    if (result1.error) {
      debugUpdate('RETURNS: %o', result1)
      res.status(400).send(result1)
      return
    }

    // update
    const result = await RolesHelpers.update(req.params.id, req.body.name, req.body.dsc, req.body.active)
    if (result.error) {
      res.status(400).send({error: result.error})
      debugUpdate('RETURNS: error=%o', result.error)
    } else {
      res.status(200).send({
        'role': result.rows[0]
      })
      debugUpdate('RETURNS: send role=%o', result.rows[0])
    }
  } 
}
