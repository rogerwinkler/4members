const { Pool } = require('pg')
const QueryBuildHelpers = require('./QueryBuildHelpers')
const AuthenticationHelpers = require('./AuthenticationHelpers')
const debug = require('debug')('4members.UsersHelpers')
const debugGetAll = require('debug')('4members.UsersHelpers.getAll')
const debugGet = require('debug')('4members.UsersHelpers.get')
const debugFindByName = require('debug')('4members.UsersHelpers.findByName')
const debugFindById = require('debug')('4members.UsersHelpers.findById')
const debugInsert = require('debug')('4members.UsersHelpers.insert')
const debugUpdate = require('debug')('4members.UsersHelpers.update')
const debugUpdateName = require('debug')('4members.UsersHelpers.updateName')
const debugUpdateDsc = require('debug')('4members.UsersHelpers.updateDsc')
const debugDelete = require('debug')('4members.UsersHelpers.delete')
const debugDeleteAll = require('debug')('4members.UsersHelpers.deleteAll')
const debugActivate = require('debug')('4members.UsersHelpers.activate')
const debugInactivate = require('debug')('4members.UsersHelpers.inactivate')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async getAll () {}
  //  Returns all objects in the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  (none)
  // -----------------------------------------------------------------
  // RETURNS: All objects of the table in the standard structure in
  //  the body of the http response:
  //
  //  in case of success:             in case of an error:
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj1, ...}]        code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
 
  async getAll () {
    debugGetAll('INPUT: (none)')
    const pool = new Pool()
    const text = 'SELECT * FROM users'
    var retObj = {}    
    try {
      const { rows } = await pool.query(text)
      retObj = {
        status: 'success', 
        data  : rows
      } 
    } catch (e) {
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
    } finally {
      pool.end()
      debugGetAll('RETURNS: %o', retObj)
      return retObj
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async get (id) {}
  //  Returns the object with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id: [INT>0, NOT NULL] id of the record that is to be returned.
  // -----------------------------------------------------------------
  // RETURNS: The found object in the standard structure in the body
  //  of the http response:
  //
  //  in case of success:             in case of an error:
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
 
  async get (id) {
    debugGet('INPUT: id=%d', id)
    const pool = new Pool()
    const text = 'SELECT * FROM users where id=$1'
    const values = [id]
    var retObj = {}    
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) {
        retObj = {
          status  : 'error',
          code    : 1008,
          message : 'User not found',
          detail  : 'User of given id not found in table "users"'
        }
      } else {
        retObj = {
          status: 'success', 
          data  : rows
        } 
      }
    } catch (e) {
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
    } finally {
      pool.end()
      debugGet('RETURNS: %o', retObj)
      return retObj
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async insert (id, username, password, email, active) {}
  //  Inserts an object into the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id      : [INT>0], id of object. If id is null, then
  //            MAX(id)+1 is taken.
  //  username: [STRING, UNIQUE, NOT NULL], username. 
  //  password: [STRING, NOT NULL], password.
  //  email   : [STRING], email address
  //  active  : [BOOL, DEFAULTS TO TRUE]
  // -----------------------------------------------------------------
  // RETURNS: The inserted object in the standard structure in the 
  //  body of the http response:
  //
  //  in case of success:             in case of an error:
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

  async insert (user) {
    debugInsert('INPUT: user=%o', user)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   nextId = null
    var   retObj = {}

    // active defaults to true if not explicitly set to false
    const calcActive = ((user.active != false) ? true : false)

    // db contraints check, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - username is unique and not null, 
    //  - active is not null

    // find next id if id is not specified
    if (user.id === null || user.id === undefined) {
      text = 'SELECT max(id)+1 AS nextid FROM users'
      try {
        const { rows } = await pool.query(text)
        nextId = rows[0].nextid || 1
      } catch(e) {
        pool.end()
        retObj = {
          status  : 'error',
          code    : 'PostgreSQL-' + e.code,
          message : e.message,
          detail  : e.detail
        }
        debugInsert('RETURNS: %o', retObj)
        return retObj
      }
    } else {
      nextId = user.id
    }

    text = 'INSERT INTO users(id, username, password, email, active) VALUES($1, $2, $3, $4, $5) RETURNING *'
    values = [nextId, user.username, AuthenticationHelpers.hashPassword(user.password), user.email, calcActive]
    try {
      const { rows } = await pool.query(text, values)
      retObj = {
        status: 'success', 
        data  : rows
      }
    } catch(e) {
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
    } finally {
      pool.end()
      debugInsert('RETURNS: %o', retObj)
      return retObj
    }
  },
  
  
  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async update (id, name, dsc, active) {}
  //  Updates the object of the given id.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id:     [INT>0, NOT NULL], id of object.
  //  name:   [STRING, UNIQUE, NOT NULL, NOT EMPTY], new name of object. 
  //  dsc:    [STRING, if UNDEFINED=>NOT_UPDATED], description of object
  //  active: [BOOLEAN, if UNDEFINED=>NOT_UPDATED]
  // -----------------------------------------------------------------
  // RETURNS: The updated object in the standard structure in the 
  //  body of the http response:
  //
  //  in case of success:             in case of an error:
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

  async update (id, name, dsc, active) {
    debugUpdate('INPUT: id=%d, name="%s", dsc="%s", active=%s', id, name, dsc, active)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   retObj = {}
  
    // db contraints check, so we don't have to:
    //  - data types
    //  - id is unique and not null
    //  - name is unique and not null
    //  - active ist not null

    // remove properties that are undefined
    var primeKeys = ['id']
    values = [id]
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (name!==undefined) { 
      properties.push('name')
      values.push(name)
    }
    if (dsc!==undefined) {
      properties.push('dsc')
      values.push(dsc)
    }
    if (active!==undefined) {
      properties.push('active')
      values.push(active)
    }

    text = QueryBuildHelpers.createUpdateStatement('users', primeKeys, properties)
    debugUpdate('Query: text="%s"', text)
    debugUpdate('Query: values=%o', values)
    // update
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to update does not exist
        retObj = {
          status  : 'error',
          code    : 1006,
          message : 'User of id "' + id + '" not found',
          detail  : 'Record of user to be updated does not exist', 
        }
      } else {
        retObj = {
          status  : 'success',
          data    : rows
        }
      }
    } catch(e) {
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
    } finally {
      pool.end()
      debugUpdate('RETURNS: %o', retObj)
      return retObj      
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD:  async delete(id) {}
  //  Deletes the object with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id: [INT>0, NOT NULL], id of object to delete
  // -----------------------------------------------------------------
  // RETURNS: The deleted object in the standard structure in the 
  //  body of the http response:
  //
  //  in case of success:             in case of an error:
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

  async delete (id) {
    debugDelete('INPUT: id=' + id)
    const pool = new Pool()
    var   text = 'DELETE FROM users WHERE id=$1 RETURNING *'
    var   values = [id]
    var   retObj = {}
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to delete does not exist
        retObj = {
          status  : 'error',
          code    : 1009,
          message : 'User of id "' + id + '" not found',
          detail  : 'Record of user to be deleted does not exist', 
        }
      } else {
        retObj = {
          status  : 'success',
          data    : rows
        }
      }
    } catch(e) {
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
    } finally {
      pool.end()
      debugDelete('RETURNS: %o', retObj)
      return retObj
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD:  async deleteAll() {}
  //  Deletes all objects of a table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  (none)
  // -----------------------------------------------------------------
  // RETURNS: The deleted objects in the standard structure in the 
  //  body of the http response:
  //
  //  in case of success:             in case of an error:
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : [{obj1}, ...]        code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async deleteAll () {
    debugDeleteAll('INPUT: (none)')
    const pool = new Pool()
    var   text = 'DELETE FROM users RETURNING *'
    var   retObj = {}
    try {
      const { rows } = await pool.query(text)
      retObj = {
        status  : 'success',
        data    : rows
      }
    } catch(e) {
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
    } finally {
      pool.end()
      debugDeleteAll('RETURNS: %o', retObj)
      return retObj
    }
  }

}