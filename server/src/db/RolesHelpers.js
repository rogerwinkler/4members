const { Pool } = require('pg')
const QueryBuildHelpers = require('./QueryBuildHelpers')
const debug = require('debug')('4members.RolesHelpers')
const debugGetAll = require('debug')('4members.RolesHelpers.getAll')
const debugGet = require('debug')('4members.RolesHelpers.get')
const debugFindByName = require('debug')('4members.RolesHelpers.findByName')
const debugFindById = require('debug')('4members.RolesHelpers.findById')
const debugInsert = require('debug')('4members.RolesHelpers.insert')
const debugUpdate = require('debug')('4members.RolesHelpers.update')
const debugUpdateName = require('debug')('4members.RolesHelpers.updateName')
const debugUpdateDsc = require('debug')('4members.RolesHelpers.updateDsc')
const debugDelete = require('debug')('4members.RolesHelpers.delete')
const debugDeleteAll = require('debug')('4members.RolesHelpers.deleteAll')
const debugActivate = require('debug')('4members.RolesHelpers.activate')
const debugInactivate = require('debug')('4members.RolesHelpers.inactivate')

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
    const text = 'SELECT * FROM roles'
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
    const text = 'SELECT * FROM roles where id=$1'
    const values = [id]
    var retObj = {}    
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) {
        retObj = {
          status  : 'error',
          code    : 1008,
          message : 'Role not found',
          detail  : 'Role of given id not found in table "roles"'
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
  // METHOD: async insert (role) {}
  //  Inserts an object into the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  role    : Role object (see src/models/Role.js) with properties...
  //    id:     [INT>0], id of object. If id is null, then
  //            MAX(id)+1 is taken.
  //    name:   [STRING, UNIQUE, NOT NULL], name of object to be inserted. 
  //    dsc:    [STRING], description of object to be inserted.
  //    active: [BOOL, DEFAULTS TO TRUE]
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

  async insert (role) {
    debugInsert('INPUT: role=%o', role)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   nextId = null
    var   retObj = {}

    // active defaults to true if not explicitly set to false
    const calcActive = ((role.active != false) ? true : false)

    // db contraints check, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - name is unique and not null, 
    //  - active is not null

    // find next id if id is not specified
    if (role.id === null || role.id === undefined) {
      text = 'SELECT max(id)+1 AS nextid FROM roles'
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
      nextId = role.id
    }

    text = 'INSERT INTO roles(id, name, dsc, active) VALUES($1, $2, $3, $4) RETURNING *'
    values = [nextId, role.name, role.dsc, calcActive]
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
  //  role: Role object (see src/models/Role.js) with properties...
  //    id:     [INT>0, NOT NULL], id of object.
  //    name:   [STRING, UNIQUE, NOT NULL, NOT EMPTY], new name of object. 
  //    dsc:    [STRING, if UNDEFINED=>NOT_UPDATED], description of object
  //    active: [BOOLEAN, if UNDEFINED=>NOT_UPDATED]
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

  async update (role) {
    debugUpdate('INPUT: role=%o', role)
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
    values = [role.id]
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (role.name!==undefined) { 
      properties.push('name')
      values.push(role.name)
    }
    if (role.dsc!==undefined) {
      properties.push('dsc')
      values.push(role.dsc)
    }
    if (role.active!==undefined) {
      properties.push('active')
      values.push(role.active)
    }

    text = QueryBuildHelpers.createUpdateStatement('roles', primeKeys, properties)
    debugUpdate('Query: text="%s"', text)
    debugUpdate('Query: values=%o', values)
    // update
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to update does not exist
        retObj = {
          status  : 'error',
          code    : 1006,
          message : 'Role of id "' + id + '" not found, id is not defined',
          detail  : 'Record of role to be updated does not exist', 
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
  //  id: [INT>0, NOT NULL], id of object to be deleted.
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
    var   text = 'DELETE FROM roles WHERE id=$1 RETURNING *'
    var   values = [id]
    var   retObj = {}
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to delete does not exist
        retObj = {
          status  : 'error',
          code    : 1009,
          message : 'Role of id "' + id + '" not found',
          detail  : 'Record of role to be deleted does not exist', 
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
    var   text = 'DELETE FROM roles RETURNING *'
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





  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async findByName(name) {}
  //  Looks up a role of a given name in the db.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  name: [STRING, NOT NULL, NOT EMPTY], name of role to look up.
  // -----------------------------------------------------------------
  // RETURNS: 
  //  An object with an error object and a rows array containing 
  //  the found record. NOTE: Since name is UNIQUE only one
  //  record should be returned. If no error occured, error is 
  //  null. If an error occured the returned rows array is 
  //  empty ([]).
  //  
  //  The structure of the returned object is:
  //  {
  //    error : { code, msg, dsc},
  //    rows  : [{id, name, dsc, active}]
  //  }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
 
  // async findByName (name) {
  //   debugFindByName('INPUT: name="' + name + '"')
  //   const pool = new Pool()
  //   const text = 'SELECT * FROM roles WHERE name=$1'
  //   const values = [name]
  //   var retObj = {}    
  //   try {
  //     const { rows } = await pool.query(text, values)
  //     retObj = {'error': null, 'rows': rows} 
  //     return retObj
  //   } catch (e) {
  //     const error = {
  //       'code': 'PostgreSQL-' + e.code,
  //       'msg' : e.message,
  //       'dsc' : e.detail
  //     } 
  //     retObj = {'error': error, 'rows': []}
  //     return retObj
  //   } finally {
  //     debugFindByName('RETURNS: %o', retObj)
  //     pool.end()
  //   }
  // },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async findById(id) {}
  //  Looks up a role of a given id in the db.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id: [POSITIV INTEGER, NOT NULL], id of object to look up.
  // -----------------------------------------------------------------
  // RETURNS: 
  //  An object with an error object and a rows array containing 
  //  the found record. NOTE: Since id is UNIQUE just one
  //  single record should be returned. If no error occured 
  //  error is null. If an error occured the rows array is
  //  empty ([]).
  //
  //  The structure of the returned object is:
  //  {
  //    error : { code, msg, dsc},
  //    rows  : [{id, name, dsc, active}]
  //  }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  // async findById (id) {
  //   debugFindById('INPUT: id=' + id)
  //   const pool = new Pool()
  //   const text = 'SELECT * FROM roles WHERE id=$1'
  //   const values = [id]
  //   var retObj = {}
  //   try {
  //     const { rows } = await pool.query(text, values)
  //     retObj = {'error': null, 'rows': rows}
  //     return retObj
  //   } catch (e) {
  //     const error = {
  //       'code': 'PostgreSQL-' + e.code,
  //       'msg' : e.message,
  //       'dsc' : e.detail
  //     } 
  //     retObj = {'error': error, 'rows': []}
  //     return retObj
  //   } finally {
  //     debugFindById('RETURNS: %o', retObj)
  //     pool.end()
  //   }
  // }

}