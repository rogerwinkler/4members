const { Pool } = require('pg')
const QueryBuildHelpers = require('./QueryBuildHelpers')
const debug           = require('debug')('4members.BusinessUnitsUsersHelpers')
// const debugGetAll     = require('debug')('4members.BusinessUnitsUsersHelpers.getAll')
const debugGet        = require('debug')('4members.BusinessUnitsUsersHelpers.get')
const debugInsert     = require('debug')('4members.BusinessUnitsUsersHelpers.insert')
const debugUpdate     = require('debug')('4members.BusinessUnitsUsersHelpers.update')
const debugDelete     = require('debug')('4members.BusinessUnitsUsersHelpers.delete')
const debugDeleteAll  = require('debug')('4members.BusinessUnitsUsersHelpers.deleteAll')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async get (businessUnitUser) {}
  //  Returns objects of the given relation
  // -----------------------------------------------------------------
  // PARAMS:  
  //  businessUnitUser: Relational object of business units and users.
  //    bu_id:    [INTEGER>=0], if null all BUs of the user are returned
  //    user_id:  [INTEGER>0], if null all users of the BU are returned
  //              if bu_id and user_id are null, all users of all BUs are returned
  //    active:   [BOOL], if null active and inactive records are returned 
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
 
  async get (businessUnitUser) {
    debugGet('INPUT: businessUnitUser=%o', businessUnitUser)
    const pool = new Pool()
    var text   = 'SELECT * FROM business_units_users '
    var values = []
    var retObj = {}    

    // remove properties that are undefined
    var primeKeys = []
    // values = []
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (businessUnitUser.bu_id!==undefined && businessUnitUser.bu_id!==null) { 
      properties.push('bu_id')
      values.push(businessUnitUser.bu_id)
    }
    if (businessUnitUser.user_id!==undefined && businessUnitUser.user_id!==null) {
      properties.push('user_id')
      values.push(businessUnitUser.user_id)
    }
    if (businessUnitUser.active!==undefined && businessUnitUser.active!==null) {
      properties.push('active')
      values.push(businessUnitUser.active)
    }

    const whereClause = QueryBuildHelpers.createWhereClause(primeKeys, properties)

    if (whereClause!=='') {
      text = text + whereClause
    }
    debugGet('Query: text="%s"', text)
    debugGet('Query: values=%o', values)

    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) {
        retObj = {
          status  : 'error',
          code    : 1040,
          message : 'Business unit user not found',
          detail  : 'Business unit user not found in table "business_units_users"'
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
  // METHOD: async insert (businessUnitUser) {}
  //  Inserts an object into the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  businessUnitUser:     Business unit user object (see src/models/Business unit user.js)
  //    bu_id:    [INT>=0], business unit
  //              MAX(id)+1 is taken.
  //    user_id:  [INT>0], user 
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

  async insert (businessUnitUser) {
    debugInsert('INPUT: businessUnitUser=%o', businessUnitUser)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   retObj = {}

    // active defaults to true if not explicitly set to false
    const calcActive = ((businessUnitUser.active != false) ? true : false)

    // db contraints check, so we don't have to: 
    //  - data types
    //  - bu_id/user_id is unique
    //  - active is not null

    text = 'INSERT INTO business_units_users(bu_id, user_id, active) VALUES($1, $2, $3) RETURNING *'
    values = [businessUnitUser.bu_id, businessUnitUser.user_id, calcActive]
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
  // METHOD: async update (businessUnitUser) {}
  //  Updates the object of the given id.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  businessUnitUser:     Business unit user object (see src/models/Business unit user.js)
  //    id:     [INT>0, NOT NULL]
  //    name:   [STRING, UNIQUE, NOT NULL, NOT EMPTY] 
  //    dsc:    [STRING, if UNDEFINED=>NOT_UPDATED]
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

  async update (businessUnitUser) {
    debugUpdate('INPUT: businessUnitUser=%o', businessUnitUser)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   retObj = {}
  
    // db contraints check, so we don't have to:
    //  - data types
    //  - bu_id/user_id is unique
    //  - active ist not null

    // remove properties that are undefined
    var primeKeys = []
    // values = []
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (businessUnitUser.bu_id!==undefined) { 
      properties.push('bu_id')
      values.push(businessUnitUser.bu_id)
    }
    if (businessUnitUser.user_id!==undefined) {
      properties.push('user_id')
      values.push(businessUnitUser.user_id)
    }
    if (businessUnitUser.active!==undefined) {
      properties.push('active')
      values.push(businessUnitUser.active)
    }

    text = QueryBuildHelpers.createUpdateStatement('business_units_users', primeKeys, properties)
    debugUpdate('Query: text="%s"', text)
    debugUpdate('Query: values=%o', values)
    // update
    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to update does not exist
        retObj = {
          status  : 'error',
          code    : 1042,
          message : 'Business unit user not found, id is not defined',
          detail  : 'Business unit user to be updated does not exist', 
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
  // METHOD:  async delete(bu_id, user_id) {}
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

  async delete (businessUnitUser) {
    debugDelete('INPUT: id=' + id)
    const pool = new Pool()
    var   text = 'DELETE FROM business_units_users '
    var   values = []
    var   retObj = {}

    // remove properties that are undefined
    var primeKeys = []
    // values = []
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (businessUnitUser.bu_id!==undefined && businessUnitUser.bu_id!==null) { 
      properties.push('bu_id')
      values.push(businessUnitUser.bu_id)
    }
    if (businessUnitUser.user_id!==undefined && businessUnitUser.user_id!==null) {
      properties.push('user_id')
      values.push(businessUnitUser.user_id)
    }
    if (businessUnitUser.active!==undefined && businessUnitUser.active!==null) {
      properties.push('active')
      values.push(businessUnitUser.active)
    }

    const whereClause = QueryBuildHelpers.createWhereClause(primeKeys, properties)

    if (whereClause!=='') {
      text = text + whereClause
    }
    text = text + ' RETURNING *'
    debugGet('Query: text="%s"', text)
    debugGet('Query: values=%o', values)

    try {
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to delete does not exist
        retObj = {
          status  : 'error',
          code    : 1041,
          message : 'Business unit user not found',
          detail  : 'Business unit user to be deleted does not exist', 
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
    var   text = 'DELETE FROM business_units_users RETURNING *'
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