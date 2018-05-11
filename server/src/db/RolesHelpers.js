const { Pool } = require('pg')
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
  //  Returns all records of table roles.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  (none)
  // -----------------------------------------------------------------
  // RETURNS: Returns an object with a status of either "success"
  //  or "error". In case of an error the error object is added.
  //  In case of success, the data object with an array of all the 
  //  role objects in the table is returned.
  //          
  //          The structure of the returned object is:
  //          {
  //            status : "success"   || "error"
  //            data: [{role1}, ...] || error : { code, msg, dsc} 
  //          }
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
        'status': 'success', 
        'data'  : rows
      } 
      return retObj
    } catch (e) {
      const error = {
        'code': 'PostgreSQL-' + e.code,
        'msg' : e.message,
        'dsc' : e.detail
      } 
      retObj = {
        'status': 'error',
        'error' : error
      }
      return retObj
    } finally {
      debugGetAll('RETURNS: %o', retObj)
      pool.end()
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async get (id) {}
  //  Returns the record id of table roles.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  (none)
  // -----------------------------------------------------------------
  // RETURNS: Returns an object with a status of either "success"
  //  or "error". In case of an error the error object is added.
  //  In case of success, the data object with an array of all the 
  //  role objects in the table is returned.
  //          
  //          The structure of the returned object is:
  //          {
  //            status : "success"   || "error"
  //            data: [{role1}, ...] || error : { code, msg, dsc} 
  //          }
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
          'status': 'error',
          'message' : 'Role not found'
        }
      } else {
        retObj = {
          'status': 'success', 
          'data'  : rows
        } 
      }
      return retObj
    } catch (e) {
      retObj = {
        'status'  : 'error',
        'code'    : 'PostgreSQL-' + e.code,
        'message' : e.message,
        'detail'  : e.detail
      }
      return retObj
    } finally {
      debugGet('RETURNS: %o', retObj)
      pool.end()
    }
  },


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
 
  async findByName (name) {
    debugFindByName('INPUT: name="' + name + '"')
    const pool = new Pool()
    const text = 'SELECT * FROM roles WHERE name=$1'
    const values = [name]
    var retObj = {}    
    try {
      const { rows } = await pool.query(text, values)
      retObj = {'error': null, 'rows': rows} 
      return retObj
    } catch (e) {
      const error = {
        'code': 'PostgreSQL-' + e.code,
        'msg' : e.message,
        'dsc' : e.detail
      } 
      retObj = {'error': error, 'rows': []}
      return retObj
    } finally {
      debugFindByName('RETURNS: %o', retObj)
      pool.end()
    }
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async findById(id) {}
  //  Looks up a role of a given id in the db.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id: [POSITIV INTEGER, NOT NULL], id of role to look up.
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

  async findById (id) {
    debugFindById('INPUT: id=' + id)
    const pool = new Pool()
    const text = 'SELECT * FROM roles WHERE id=$1'
    const values = [id]
    var retObj = {}
    try {
      const { rows } = await pool.query(text, values)
      retObj = {'error': null, 'rows': rows}
      return retObj
    } catch (e) {
      const error = {
        'code': 'PostgreSQL-' + e.code,
        'msg' : e.message,
        'dsc' : e.detail
      } 
      retObj = {'error': error, 'rows': []}
      return retObj
    } finally {
      debugFindById('RETURNS: %o', retObj)
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async insert (id, name, dsc, active) {}
  //  Inserts a role record into the database.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id:     [POSITIVE INTEGER], id of role. If id is null, then
  //          MAX(id)+1 is taken.
  //  name:   [STRING, UNIQUE, NOT NULL], name of role to be inserted. 
  //  dsc:    [STRING], description of role to be inserted.
  //  active: [BOOLEAN, DEFAULTS TO TRUE]
  // -----------------------------------------------------------------
  // RETURNS: 
  //  An object with an error object and a rows array containing 
  //  the inserted row. If an no error occured, error is null.
  //  If an error occured the returned rows array is empty ([]).
  //
  //  The structure of the returned object is:
  //  {
  //    error : { code, msg, dsc},
  //    rows  : [{id, name, dsc, active}]
  //  }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async insert (id, name, dsc, active) {
    debugInsert('INPUT: id=%d, name="%s", dsc="%s", active=%s', id, name, dsc, active)
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   nextId = null

    // active defaults to true if not explicitly set to false
    const calcActive = ((active != false) ? true : false)

    // db contraints check, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - name is unique and not null, 

    // find next id if id is not specified
    if (id == null || id == undefined) {
      text = 'SELECT max(id)+1 AS nextid FROM roles'
      try {
        const { rows } = await pool.query(text)
        nextId = rows[0].nextid || 1
      } catch(e) {
        pool.end()
        debugInsert('RETURNS: error=%s', e.message)
        const error = {
          'code': 'PostgreSQL-' + e.code,
          'msg' : e.message,
          'dsc' : e.detail
        } 
        return {'error': error, 'rows': []}
      }
    } else {
      nextId = id
    }

    text = 'INSERT INTO roles(id, name, dsc, active) VALUES($1, $2, $3, $4) RETURNING *'
    values = [nextId, name, dsc, calcActive]
    var retObj = {}
    try {
      const { rows } = await pool.query(text, values)
      retObj = {'error': null, 'rows': rows}
      return retObj
    } catch(e) {
      const error = {
        'code': 'PostgreSQL-' + e.code,
        'msg' : e.message,
        'dsc' : e.detail
      } 
      retObj = {'error': error, 'rows': []}
      return retObj
    } finally {
      debugInsert('RETURNS: %o', retObj)
      pool.end()
    }
  },
  
  
  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async update (id, name, dsc, active) {}
  //  Updates the role record of the given id in the database.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  id:     [POSITIVE INTEGER, NOT NULL, MUST EXIST], id of role.
  //  name:   [STRING, UNIQUE, NOT NULL, NOT EMPTY], new name of role. 
  //  dsc:    [STRING, if UNDEFINED=>NOT_UPDATED], description of role
  //  active: [BOOLEAN, if UNDEFINED=>NOT_UPDATED]
  // -----------------------------------------------------------------
  // RETURNS: 
  //  Returns an error object and the updated record. If no 
  //  error occured, the error object is null. If an error
  //  occured, the returned rows object is empty ([]).
  //  
  //  The structure of the returned object is:
  //  {
  //    error : { code, msg, dsc},
  //    rows [{id, name, dsc, active}]
  //  }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async update (id, name, dsc, active) {
    debugUpdate('INPUT: id=%d, name="%s", dsc="%s", active=%s', id, name, dsc, active)
    const pool = new Pool()
    var   text = ''
    var   values = []
  
    // db contraints check, so we don't have to:
    //  - data types
    //  - id is unique and not null
    //  - name is unique and not null

    // check if dsc and active are provided or not
    if (dsc===undefined && active===undefined) {
      text = 'UPDATE roles SET name=$2 WHERE id=$1 RETURNING *'
      values = [id, name]
    } else if (active===undefined) {
      text = 'UPDATE roles SET name=$2, dsc=$3 WHERE id=$1 RETURNING *'
      values = [id, name, dsc]
    } else if (dsc===undefined) {
      text = 'UPDATE roles SET name=$2, active=$3 WHERE id=$1 RETURNING *'
      values = [id, name, active]
    } else { //dsc and active are defined
      text = 'UPDATE roles SET name=$2, dsc=$3, active=$4 WHERE id=$1 RETURNING *'
      values = [id, name, dsc, active]
    }

    // update
    try {
      var retObj = {}
      const { rows } = await pool.query(text, values)
      if (rows.length === 0) { // record to update does not exist
        const error = {
          'code': 1006,
          'msg' : 'Role of id "' + id + '" not found',     
          'dsc' : 'Role record to be updated does not exist'
        }
        retObj = {'error': error, 'rows': []}
      } else {
        retObj = {'error': null, 'rows': rows}
      }
      return retObj
    } catch(e) {
      const error = {
        'code': 'PostgreSQL-' + e.code,
        'msg' : e.message,
        'dsc' : e.detail
      } 
      retObj = {'error': error, 'rows': []}
      return retObj
    } finally {
      debugUpdate('RETURNS: %o', retObj)
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async updateName(id, name) {}
  // =================================================================  
  //          updates the role's name of the record with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be updated. 
  //                  Datatype: Positive Integer.
  //                  MUST NOT BE NULL. 
  //                  Must be an existing id.
  //          name:   Updated name of role.
  //                  Datatype: String.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows array is empty ([]).
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async updateName (id, name) {
    debugUpdateName('INPUT: id=%d, name="%s"', id, name)
    const pool = new Pool()
    var   text = ''
    var   values = []


    if (!name) {
      const error = {
        'code': 1003,
        'msg' : 'Required column NAME not specified',     
        'dsc' : 'Column NAME of table ROLES must not be null'
      }
      debugUpdateName('RETURNS: error=%s', error.msg)
      pool.end()
      return {'error': error, 'rows': []}
    }

    text = 'UPDATE roles SET name=$2 WHERE id=$1 RETURNING *'
    values = [id, name]
    try {
      const { rows } = await pool.query(text, values)
      debugUpdateName('RETURNS: rows=%o', rows)
      return {'error': null, 'rows': rows}
    } catch(e) {
      debugUpdateName('RETURNS: error=%s', e.message)
      const error = {
        'code': 2000,
        'msg' : e.message,
        'dsc' : 'Underlying PostgreSQL error'
      } 
      return {'error': error, 'rows': []}
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async updateDsc(id, dsc) {}
  // =================================================================  
  //          updates the role's description of the record with the 
  //          given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be updated.
  //                  Datatype: Positive Integer.
  //                  Must NOT BE NULL.
  //                  Must be an existing id.
  //          dsc:    Updated description of role.
  //                  Datatype: String.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows array is empty ([]).
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async updateDsc (id, dsc) {
    debugUpdateDsc('INPUT: id=%d, name="%s"', id, dsc)
    const pool = new Pool()
    var   text = ''
    var   values = []

    if (dsc == undefined || dsc == null) {
      dsc = ''
    }

    text = 'UPDATE roles SET dsc=$2 WHERE id=$1 RETURNING *'
    values = [id, dsc]
    try {
      const { rows } = await pool.query(text, values)
      debugUpdateDsc('RETURNS: rows=%o', rows)
      return {'error': null, 'rows': rows}
    } catch(e) {
      debugUpdateDsc('RETURNS: error=%s', e.message)
      const error = {
        'code': 2000,
        'msg' : e.message,
        'dsc' : 'Underlying PostgreSQL error'
      } 
      return {'error': error, 'rows': []}
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async delete(id) {}
  // =================================================================  
  //          deletes the role with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be deleted.
  //                  Datatype: Positive Integer.
  //                  Must be an existing id.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows array is empty ([]).
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async delete (id) {
    debugDelete('INPUT: id=' + id)
    const pool = new Pool()
    var   text = 'DELETE FROM roles WHERE id=$1 RETURNING *'
    var   values = [id]

    try {
      const { rows } = await pool.query(text, values)
      debugDelete('RETURNS: rows=%o', rows)
      return rows
    } catch(e) {
      debugDelete('RETURNS: error=%s', e.message)
      const error = {
        'code': 2000,
        'msg' : e.message,
        'dsc' : 'Underlying PostgreSQL error'
      } 
      return {'error': error, 'rows': []}
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async deleteAll () {}
  // =================================================================  
  //          deletes all roles in the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  (none)
  // -----------------------------------------------------------------
  // RETURNS: Returns an object with a status of either "success"
  //  or "error". In case of an error the error object is added.
  //  In case of success, the data object with a array of the 
  //  deleted objects is returned.
  //          
  //          The structure of the returned object is:
  //          {
  //            status : "success"  || "error"
  //            data: [{obj1}, ...] || error : { code, msg, dsc} 
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async deleteAll () {
    debugDeleteAll('INPUT: (none)')
    const pool = new Pool()
    const text = 'DELETE FROM roles RETURNING *'
    var retObj = {}  
    try {
      const { rows } = await pool.query(text)
      debugDeleteAll('RETURNS: status="success" and deleted roles')
      retObj = {
        'status' : 'success',
        'data'   : rows
      }
      return retObj
    } catch(e) {
      debugDelete('RETURNS: error=%s', e.message)
      const error = {
        'code': 2000,
        'msg' : e.message,
        'dsc' : 'Underlying PostgreSQL error'
      } 
      retObj = {
        'status' : 'error',
        'error'  : error
      }
      return retObj
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async activate(id) {}
  // =================================================================  
  //          activates (set active=true) the role with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be activated.
  //                  Datatype: Positive Integer.
  //                  Must NOT BE NULL.
  //                  Must be an existing id.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the activated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows array is empty ([]).
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
  
  async activate (id) {
    debugActivate('INPUT: id=' + id)
    const pool = new Pool()
    var text = 'UPDATE roles SET active=true WHERE id=$1 RETURNING *'
    var values = [id]

    try {
      const { rows } = await pool.query(text, values)
      debugActivate('RETURNS: rows=%o', rows)
      return {'error': null, 'rows': rows}
    } catch(e) {
      debugActivate('RETURNS: error=%s', e.message)
      const error = {
        'code': 2000,
        'msg' : e.message,
        'dsc' : 'Underlying PostgreSQL error'
      } 
      return {'error': error, 'rows': []}
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async inactivate(id) {}
  // =================================================================  
  //          inactivates (set active=false) the role with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be inactivated.
  //                  Datatype: Positive Integer.
  //                  Must NOT BE NULL.
  //                  Must be an existing id.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the inactivated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows array is empty ([]).
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
  
  async inactivate (id) {
    debugInactivate('INPUT: id=' + id)
    const pool = new Pool()
    var text = 'UPDATE roles SET active=false WHERE id=$1 RETURNING *'
    var values = [id]

    try {
      const { rows } = await pool.query(text, values)
      debugInactivate('RETURNS: rows=%o', rows)
      return {'error': null, 'rows': rows}
    } catch(e) {
      debugInactivate('RETURNS: error=%s', e.message)
      const error = {
        'code': 2000,
        'msg' : e.message,
        'dsc' : 'Underlying PostgreSQL error'
      } 
      return {'error': error, 'rows': []}
    } finally {
      pool.end()
    }
  }
}