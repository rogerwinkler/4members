const { Pool } = require('pg')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // =================================================================  
  // METHOD:  async findByName(name) {}
  // =================================================================
  //          Looks up a role of a given name in the db.
  // -----------------------------------------------------------------
  // PARAMS:  name: Name of role to look up.
  // -----------------------------------------------------------------
  // RETURNS: Returns an array with a single role object.
  //          [id, name, dsc, active]
  //          If a db error occurs an empty array is returned ([]):
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
 
  async findByName (name) {
    // console.log('call stack: RolesHelpers.findByName("' + name + '")')
    const pool = new Pool()
    const text = 'SELECT * FROM roles WHERE name=$1'
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
  //          Looks up a role of a given id in the db.
  // -----------------------------------------------------------------
  // PARAMS:  id: Id of role to look up.
  // -----------------------------------------------------------------
  // RETURNS: Returns an array with a single role object.
  //          [id, name, dsc, active]
  //          If a db error occurs an empty array is returned ([]):
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async findById (id) {
    // console.log('call stack: RolesHelpers.findById(' + id + ')')
    const pool = new Pool()
    const text = 'SELECT * FROM roles WHERE id=$1'
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
  // METHOD:  async insert (id, name, dsc, active) {}
  // =================================================================  
  //          inserts a role record into the db.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of role. If id IS NULL then MAX(id)+1 is taken.
  //          name:   Name of role to be inserted. MUST BE UNIQUE AND NOT NULL!
  //          dsc:    Description of role to be inserted.
  //          active: True if record is active, false if record is inactive.
  //                  If left NULL or UNDEFINED active will be set to TRUE BY DEFAULT.
  // -----------------------------------------------------------------
  // RETURNS: An object with an error object and a rows array containing the inserted row.
  //          The structure of the returned object is:
  //          {
  //            error : { code, msg, dsc},
  //            rows [{id, name, dsc, active}]
  //          }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async insert (id, name, dsc, active) {
    // console.log('call stack: RolesHelpers.insert(' + id + ', "' + name + '", ...)')
    const pool = new Pool()
    var   text = ''
    var   values = []
    var   nextId = null
    var   calcActive = false

    if (active != false) { calcActive = true }

    // check if name is provided
    if (!name) {
      const error = {
        'code': 1003,
        'msg' : 'Required column NAME not specified',     
        'dsc' : 'Column NAME of table ROLES must not be null'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // check if name is UNIQUE
    const rows = await this.findByName(name)
    if (rows.length != 0) {
      const error = {
        'code': 1004,
        'msg' : 'Role of name "' + name + '" already exists',     
        'dsc' : 'Column NAME of table ROLES must be unique'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // find next id if id is not specified
    // console.log('id: ' + id)
    if (id == null || id == UNDEFINED) {
      text = 'SELECT max(id)+1 AS nextid FROM roles'
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
          'code': 1005,
          'msg' : 'Role of id ' + id + ' already exists',     
          'dsc' : 'Column Id of table ROLES must be unique'
        }
        pool.end()
        return {'error': error, 'rows': []}
      } else {
        nextId = id
      }
    }

    // finally insert record
    text = 'INSERT INTO roles(id, name, dsc, active) VALUES($1, $2, $3, $4) RETURNING *'
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
  //          updates the role record of the given id in the db.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of role to be updated.
  //          name:   Updated name. Must not be UNIQUE and NOT NULL!
  //          dsc:    Updated description of role.
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
    // console.log('call stack: RolesHelpers.update(' + id + ', "' + name + '", ...)')
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
        'dsc' : 'Column NAME of table ROLES must not be null'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // check if record exists
    const rows1 = await this.findById(id)
    if (rows1.length == 0) {
      const error = {
        'code': 1006,
        'msg' : 'Role of id "' + id + '" not found',     
        'dsc' : 'Role record to be updated does not exist'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // check if name is UNIQUE
    const rows2 = await this.findByName(name)
    if (rows2.length == 1 && rows2[0].id != id) {
      const error = {
        'code': 1004,
        'msg' : 'Role of name "' + name + '" already exists',     
        'dsc' : 'Column NAME of table ROLES must be unique'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    // finally update record
    text = 'UPDATE roles SET name=$2, dsc=$3, active=$4 WHERE id=$1 RETURNING *'
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
  //          updates the role's name of the record with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be updated.
  //          name:   Updated name of role.
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
    // console.log('call stack: RolesHelpers.updateName(' + id + ', "' + name + '", ...)')
    const pool = new Pool()
    var   text = ''
    var   values = []

    // check if name is provided
    if (!name) {
      const error = {
        'code': 1003,
        'msg' : 'Required column NAME not specified',     
        'dsc' : 'Column NAME of table ROLES must not be null'
      }
      pool.end()
      return {'error': error, 'rows': []}
    }

    text = 'UPDATE roles SET name=$2 WHERE id=$1 RETURNING *'
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
  //          updates the role's name of the record with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be updated.
  //          name:   Updated name of role.
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
    // console.log('call stack: RolesHelpers.updateDsc(' + id + ', "' + dsc + '", ...)')
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
  //          deletes the role with the given id.
  // -----------------------------------------------------------------
  // PARAMS:  id:     Id of record to be deleted.
  // -----------------------------------------------------------------
  // RETURNS: Returns an array containing the deleted object. Empty
  //          array if no record was deleted: [{id, name, dsc, active}] 
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async delete (id) {
    // console.log('call stack: RolesHelpers.delete(' + id + ')')
    const pool = new Pool()
    var   text = 'DELETE FROM roles WHERE id=$1 RETURNING *'
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
  //          activates (set active=true) the role with the given id.
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
    // console.log('call stack: RolesHelpers.activate(' + id + ')')
    const pool = new Pool()
    var text = 'UPDATE roles SET active=true WHERE id=$1 RETURNING *'
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
  //          inactivates (set active=false) the role with the given id.
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
    // console.log('call stack: RolesHelpers.inactivate(' + id + ')')
    const pool = new Pool()
    var text = 'UPDATE roles SET active=false WHERE id=$1 RETURNING *'
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