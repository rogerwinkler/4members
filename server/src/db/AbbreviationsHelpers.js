const { Pool } = require('pg')
const QueryBuildHelpers = require('./QueryBuildHelpers')
const debug = require('debug')('4members.AbbreviationsHelpers')
const debugGetAll = require('debug')('4members.AbbreviationsHelpers.getAll')
const debugGet = require('debug')('4members.AbbreviationsHelpers.get')
const debugInsert = require('debug')('4members.AbbreviationsHelpers.insert')
const debugUpdate = require('debug')('4members.AbbreviationsHelpers.update')
const debugDelete = require('debug')('4members.AbbreviationsHelpers.delete')
const debugDeleteAll = require('debug')('4members.AbbreviationsHelpers.deleteAll')

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
    const text = 'SELECT * FROM abbreviations'
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
    const text = 'SELECT * FROM abbreviations where id=$1'
    const values = [id]
    var retObj = {}    
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) {
        retObj = {
          status  : 'error',
          code    : 1031,
          message : 'Abbreviation not found',
          detail  : 'Abbreviation of given id not found in table "abbreviations"'
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
  // METHOD: async insert (abbreviation) {}
  //  Inserts an object into the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  abbreviation : Development abbr object (see src/models/Development abbr.js) with properties...
  //    id:         [INT>0], id of object. If id is null, then
  //                MAX(id)+1 is taken.
  //    abbr:       [STRING<=8, UNIQUE, NOT NULL]
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

  async insert (abbreviation) {
    debugInsert('INPUT: abbreviation=%o', abbreviation)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   nextId = null
    var   retObj = {}

    // active defaults to true if not explicitly set to false
    const calcActive = ((abbreviation.active != false) ? true : false)

    // db contraints check, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - abbr is unique and not null
    //  - name is unique and not null
    //  - active is not null

    // find next id if id is not specified
    if (abbreviation.id === null || abbreviation.id === undefined) {
      text = 'SELECT max(id)+1 AS nextid FROM abbreviations'
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
      nextId = abbreviation.id
    }

    text = 'INSERT INTO abbreviations(id, abbr, name, active) VALUES($1, $2, $3, $4) RETURNING *'
    values = [nextId, abbreviation.abbr, abbreviation.name, calcActive]
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
  // METHOD: async update (abbreviation) {}
  //  Updates the object of the given abbreviation.id
  // -----------------------------------------------------------------
  // PARAMS:  
  //  abbreviation: Development abbr (see src/models/Abbreviation.js) with properties...
  //    id:         [INT>0], id of object. If id is null, then
  //                MAX(id)+1 is taken.
  //    abbr:   [STRING<=8, if UNDEFINED=>NOT_UPDATED]
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

  async update (abbreviation) {
    debugUpdate('INPUT: abbreviation=%o', abbreviation)
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
    values = [abbreviation.id]
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (abbreviation.abbr!==undefined) {
      properties.push('abbr')
      values.push(abbreviation.abbr)
    }
    if (abbreviation.name!==undefined) { 
      properties.push('name')
      values.push(abbreviation.name)
    }
    if (abbreviation.active!==undefined) {
      properties.push('active')
      values.push(abbreviation.active)
    }

    text = QueryBuildHelpers.createUpdateStatement('abbreviations', primeKeys, properties)
    debugUpdate('Query: text="%s"', text)
    debugUpdate('Query: values=%o', values)
    // update
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to update does not exist
        retObj = {
          status  : 'error',
          code    : 1033,
          message : 'Abbreviation of id "' + id + '" not found, id is not defined',
          detail  : 'Abbreviation to be updated does not exist', 
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
    var   text = 'DELETE FROM abbreviations WHERE id=$1 RETURNING *'
    var   values = [id]
    var   retObj = {}
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to delete does not exist
        retObj = {
          status  : 'error',
          code    : 1032,
          message : 'Abbreviation of id "' + id + '" not found',
          detail  : 'Abbreviation to be deleted does not exist', 
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
    var   text = 'DELETE FROM abbreviations RETURNING *'
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