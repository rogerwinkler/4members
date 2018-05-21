const { Pool } = require('pg')
const QueryBuildHelpers = require('./QueryBuildHelpers')
const debug = require('debug')('4members.DevShortcutsHelpers')
const debugGetAll = require('debug')('4members.DevShortcutsHelpers.getAll')
const debugGet = require('debug')('4members.DevShortcutsHelpers.get')
const debugInsert = require('debug')('4members.DevShortcutsHelpers.insert')
const debugUpdate = require('debug')('4members.DevShortcutsHelpers.update')
const debugDelete = require('debug')('4members.DevShortcutsHelpers.delete')
const debugDeleteAll = require('debug')('4members.DevShortcutsHelpers.deleteAll')

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
    const text = 'SELECT * FROM dev_shortcuts'
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
    const text = 'SELECT * FROM dev_shortcuts where id=$1'
    const values = [id]
    var retObj = {}    
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) {
        retObj = {
          status  : 'error',
          code    : 1031,
          message : 'Development shortcut not found',
          detail  : 'Development shortcut of given id not found in table "dev_shortcuts"'
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
  // METHOD: async insert (devShortcut) {}
  //  Inserts an object into the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  devShortcut : Development shortcut object (see src/models/Development shortcut.js) with properties...
  //    id:         [INT>0], id of object. If id is null, then
  //                MAX(id)+1 is taken.
  //    shortcut:   [STRING<=8, UNIQUE, NOT NULL]
  //    name:       [STRING<=32, UNIQUE, NOT NULL] 
  //    active:     [BOOL, DEFAULTS TO TRUE]
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

  async insert (devShortcut) {
    debugInsert('INPUT: devShortcut=%o', devShortcut)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   nextId = null
    var   retObj = {}

    // active defaults to true if not explicitly set to false
    const calcActive = ((devShortcut.active != false) ? true : false)

    // db contraints check, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - shortcut is unique and not null
    //  - name is unique and not null
    //  - active is not null

    // find next id if id is not specified
    if (devShortcut.id === null || devShortcut.id === undefined) {
      text = 'SELECT max(id)+1 AS nextid FROM dev_shortcuts'
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
      nextId = devShortcut.id
    }

    text = 'INSERT INTO dev_shortcuts(id, shortcut, name, active) VALUES($1, $2, $3, $4) RETURNING *'
    values = [nextId, devShortcut.shortcut, devShortcut.name, calcActive]
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
  // METHOD: async update (devShortcut) {}
  //  Updates the object of the given devShortcut.id
  // -----------------------------------------------------------------
  // PARAMS:  
  //  devShortcut: Development shortcut (see src/models/DevShortcut.js) with properties...
  //    id:         [INT>0], id of object. If id is null, then
  //                MAX(id)+1 is taken.
  //    shortcut:   [STRING<=8, if UNDEFINED=>NOT_UPDATED]
  //    name:       [STRING<=32, if UNDEFINED=>NOT_UPDATED] 
  //    active:     [BOOLEAN, if UNDEFINED=>NOT_UPDATED]
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

  async update (devShortcut) {
    debugUpdate('INPUT: devShortcut=%o', devShortcut)
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
    values = [devShortcut.id]
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (devShortcut.shortcut!==undefined) {
      properties.push('shortcut')
      values.push(devShortcut.shortcut)
    }
    if (devShortcut.name!==undefined) { 
      properties.push('name')
      values.push(devShortcut.name)
    }
    if (devShortcut.active!==undefined) {
      properties.push('active')
      values.push(devShortcut.active)
    }

    text = QueryBuildHelpers.createUpdateStatement('dev_shortcuts', primeKeys, properties)
    debugUpdate('Query: text="%s"', text)
    debugUpdate('Query: values=%o', values)
    // update
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to update does not exist
        retObj = {
          status  : 'error',
          code    : 1033,
          message : 'Development shortcut of id "' + id + '" not found, id is not defined',
          detail  : 'Development shortcut to be updated does not exist', 
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
    var   text = 'DELETE FROM dev_shortcuts WHERE id=$1 RETURNING *'
    var   values = [id]
    var   retObj = {}
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to delete does not exist
        retObj = {
          status  : 'error',
          code    : 1032,
          message : 'Development shortcut of id "' + id + '" not found',
          detail  : 'Development shortcut to be deleted does not exist', 
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
    var   text = 'DELETE FROM dev_shortcuts RETURNING *'
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