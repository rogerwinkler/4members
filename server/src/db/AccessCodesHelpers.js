const { Pool } = require('pg')
//const AccessCode = require('../models/AccessCode.js')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async findByName(name) {}
  // =================================================================  
  //          Looks up an access codes of a given name in the db.
  // -----------------------------------------------------------------
  // PARAMS:  name: Name of access code to look up.
  // -----------------------------------------------------------------
  // RETURNS: Returns an array with a single access code object.
  //          [id, name, dsc, active]
  //          If a db error occurs an empty array is returned ([]):
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
 
  async findByName (name) {
    // console.log('call stack: AccessCodesHelpers.findByName("' + name + '")')
    const pool = new Pool()
    const text = 'SELECT * FROM access_codes WHERE name=$1'
    const values = [name]

    try {
      const { rows } = await pool.query(text, values)
      // console.log('rows:', rows)
      return rows
    } catch (e) {
      throw e
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async findById(id) {}
  // =================================================================  
  //          Looks up access codes of a given id in the db.
  // -----------------------------------------------------------------
  // PARAMS:  id: Id of access code to look up.
  // -----------------------------------------------------------------
  // RETURNS: Returns an array with a single access code object.
  //          [id, name, dsc, active]
  //          If a db error occurs an empty array is returned ([]):
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async findById (id) {
    // console.log('call stack: AccessCodesHelpers.findById(' + id + ')')
    const pool = new Pool()
    const text = 'SELECT * FROM access_codes WHERE id=$1'
    const values = [id]

    try {
      const { rows } = await pool.query(text, values)
      // console.log('rows:', rows)
      return rows
    } catch (e) {
      throw e
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async insert(id, name, dsc, active) {}
  // =================================================================  
  //          inserts an access code record into the db.
  // PARAMS:  id:     Id of access code. If id IS NULL then MAX(id)+1 is taken.
  //          name:   Name of access code to be inserted. MUST BE UNIQUE AND NOT NULL!
  //          dsc:    Description of access code to be inserted.
  //          active: True if record is active, false if record is inactive.
  //                  If left NULL or UNDEFINED active will be set to TRUE BY DEFAULT.
  // RETURNS: An object with an error object and a rows array containing the inserted row.
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  ////////////////////////////////////////////////////////////////////  

  async insert (id, name, dsc, active) {
    // console.log('call stack: AccessCodesHelpers.insert(' + id + ', "' + name + '", ...)')
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   nextId = null
    var   calcActive = false

    if (!name) {
      const error = {
        'code': 1000,
        'msg' : 'Required column NAME not specified',     
        'dsc' : 'Column NAME of table ACCESS_CODES must not be null'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    if (active != false) { calcActive = true }

    // name MUST BE UNIQUE
    const rows = await this.findByName(name)
    if (rows.length != 0) {
      const error = {
        'code': 1001,
        'msg' : 'Access code of name "' + name + '" already exists',     
        'dsc' : 'Column NAME of table ACCESS_CODES must be unique'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // find next id if id is not specified
    // console.log('id: ' + id)
    if (id == null || id == UNDEFINED) {
      text = 'SELECT max(id)+1 AS nextid FROM access_codes'
      try {
        const { rows } = await pool.query(text)
        nextId = rows[0].nextid || 1
      } catch(e) {
        pool.end()
        throw e
      }
    } else { // check if id already exists
      const rows = await this.findById(id)
      if (rows.length != 0) {
        const error = {
          'code': 1002,
          'msg' : 'Access code of id ' + id + ' already exists',     
          'dsc' : 'Column Id of table ACCESS_CODES must be unique'
        }
        pool.end()
        return {'error': error, 'rows': []}
      } else {
        nextId = id
      }
    }

    // finally insert record
    text = 'INSERT INTO access_codes(id, name, dsc, active) VALUES($1, $2, $3, $4) RETURNING *'
    values = [nextId, name, dsc, calcActive]
    try {
      const { rows } = await pool.query(text, values)
      return {'error': null, 'rows': rows}
    } catch(e) {
      throw e
    } finally {
      pool.end()
    }
  },
  
  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async update (id, name, dsc, active) {}
  // =================================================================  
  //          updates the access code with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of access code to be updated.
  //          name:   Updated name. Must not be UNIQUE and NOT NULL!
  //          dsc:    Updated description of access code.
  //          active: Updated record status. Unless active == false it
  //                  is set to true!
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows object is null.
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async update (id, name, dsc, active) {
    // console.log('call stack: AccessCodesHelpers.update(' + id + ', "' + name + '", ...)')
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   calcActive = false

    if (active != false) { calcActive = true }

    // check if name is provided
    if (!name) {
      const error = {
        'code': 1003,
        'msg' : 'Required column NAME not specified',     
        'dsc' : 'Column NAME of table ACCESS_CODES must not be null'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // check if record exists
    const rows1 = await this.findById(id)
    if (rows1.length == 0) {
      const error = {
        'code': 1006,
        'msg' : 'Access code of id "' + id + '" not found',     
        'dsc' : 'Access code record to be updated does not exist'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // check if name is UNIQUE
    const rows2 = await this.findByName(name)
    if (rows2.length == 1 && rows2[0].id != id) {
      const error = {
        'code': 1004,
        'msg' : 'Access code of name "' + name + '" already exists',     
        'dsc' : 'Column NAME of table ACCESS_CODES must be unique'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // finally update record
    text = 'UPDATE access_codes SET name=$2, dsc=$3, active=$4 WHERE id=$1 RETURNING *'
    values = [id, name, dsc, calcActive]
    try {
      const { rows } = await pool.query(text, values)
      return {'error': null, 'rows': rows}
    } catch(e) {
      throw e
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async updateName(id, name) {}
  // =================================================================  
  //          updates the access code's name of the record with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be updated.
  //          name:   Updated name of access code.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows object is null.
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async updateName (id, name) {
    // console.log('call stack: AccessCodesHelpers.updateName(' + id + ', "' + name + '", ...)')
    const pool = new Pool()
    var   text = ''
    var   values = []

    // check if name is provided
    if (!name) {
      const error = {
        'code': 1003,
        'msg' : 'Required column NAME not specified',     
        'dsc' : 'Column NAME of table ACCESS_CODES must not be null'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    text = 'UPDATE access_codes SET name=$2 WHERE id=$1 RETURNING *'
    values = [id, name]
    try {
      const { rows } = await pool.query(text, values)
      return {'error': null, 'rows': rows}
    } catch(e) {
      throw e
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async updateName(id, name) {}
  // =================================================================  
  //          updates the access code's name of the record with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be updated.
  //          name:   Updated name of access code.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows object is null.
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async updateDsc (id, dsc) {
    // console.log('call stack: AccessCodesHelpers.updateDsc(' + id + ', "' + dsc + '", ...)')
    const pool = new Pool()
    var   text = ''
    var   values = []

    if (dsc == undefined || dsc == null) {
      dsc = ''
    }

    text = 'UPDATE access_codes SET dsc=$2 WHERE id=$1 RETURNING *'
    values = [id, dsc]
    try {
      const { rows } = await pool.query(text, values)
      return {'error': null, 'rows': rows}
    } catch(e) {
      throw e
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async delete(id) {}
  // =================================================================  
  //          deletes the access code with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be deleted.
  // -----------------------------------------------------------------
  // RETURNS: Returns an array containing the deleted object. Empty
  //          array if no record was deleted: [{id, name, dsc, active}] 
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async delete (id) {
    // console.log('call stack: AccessCodesHelpers.delete(' + id + ')')
    const pool = new Pool()
    var   text = 'DELETE FROM access_codes WHERE id=$1 RETURNING *'
    var   values = [id]

    try {
      const { rows } = await pool.query(text, values)
      return rows
    } catch(e) {
      throw e
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async activate(id) {}
  // =================================================================  
  //          activates (set active=true) the access code with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be activated.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows object is null.
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
  
  async activate (id) {
    // console.log('call stack: AccessCodesHelpers.activate(' + id + ')')
    const pool = new Pool()
    var text = 'UPDATE access_codes SET active=true WHERE id=$1 RETURNING *'
    var values = [id]

    try {
      const { rows } = await pool.query(text, values)
      return {'error': null, 'rows': rows}
    } catch(e) {
      throw e
    } finally {
      pool.end()
    }
  },

  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async inactivate(id) {}
  // =================================================================  
  //          inactivates (set active=false) the access code with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be inactivated.
  // -----------------------------------------------------------------
  // RETURNS: Returns an error object and the updated record. If no 
  //          error occured, the error object is null. If an error
  //          occured, the returned rows object is null.
  //          
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
  
  async inactivate (id) {
    // console.log('call stack: AccessCodesHelpers.inactivate(' + id + ')')
    const pool = new Pool()
    var text = 'UPDATE access_codes SET active=false WHERE id=$1 RETURNING *'
    var values = [id]

    try {
      const { rows } = await pool.query(text, values)
      return {'error': null, 'rows': rows}
    } catch(e) {
      throw e
    } finally {
      pool.end()
    }
  }
}