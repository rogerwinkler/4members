const { Pool } = require('pg')
const AccessCode = require('../models/AccessCode.js')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // METHOD: findByName(name, cb)
  // Looks up access codes of a given name in the db and
  // calls the provided callback (cb) with the error and result
  // objects from the underlying node-postgres call.
  // PARAMS:
  // name: Name of access code to look up.
  // cb:   Callback function called when the db query returns.
  ////////////////////////////////////////////////////////////////////  
 
  async findByName (name) {
    // console.log('call stack: AccessCodeHelpers.findByName("' + name + '")')
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

  // findByName (name, cb) {
  //   // console.log('call stack: AccessCodeHelpers.findByName("' + name + '")')
  //   const pool = new Pool()
  //   const text = 'SELECT * FROM access_codes WHERE name=$1'
  //   const values = [name]

  //   pool.query(text, values, (err, res) => {
  //     cb(err, res)
  //     pool.end()
  //   })
  // },

  ////////////////////////////////////////////////////////////////////
  // METHOD: findById(id, cb)
  // Looks up access codes of a given id in the db and
  // calls the provided callback (cb) with the error and result
  // objects from the underlying node-postgres call.
  // PARAMS:
  // id: Id of access code to look up.
  // cb: Callback function called when the db query returns.
  ////////////////////////////////////////////////////////////////////  

  async findById (id) {
    // console.log('call stack: AccessCodeHelpers.findById(' + id + ')')
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

  // findById (id, cb) {
  //   // console.log('call stack: AccessCodeHelpers.findById(' + id + ')')
  //   const pool = new Pool()
  //   const text = 'SELECT * FROM access_codes WHERE id=$1'
  //   const values = [id]

  //   pool.query(text, values, (err, res) => {
  //     cb(err, res)
  //     pool.end()
  //   })
  // },

  ////////////////////////////////////////////////////////////////////
  // METHOD: insert(id, name, dsc, active, cb)
  // Insert an access code into the db and call a callback with the
  // error and result objects from the underlying node-postgres call.
  // PARAMS:
  // id:     Id of access code. If id IS NULL then MAX(id)+1 is taken.                                                 //
  // name:   Name of access code to be inserted. MUST NOT BE NULL!
  // dsc:    Description of access code to be inserted.
  // active: True if record is active, falls if record is inactive.
  //         If left NULL or UNDEFINED active will be set to true 
  //         (default).
  // cb:     Callback function called when the db query returns.
  ////////////////////////////////////////////////////////////////////  

  async insert (id, name, dsc, active) {
    // console.log('call stack: AccessCodeHelpers.insert(' + id + ', "' + name + '", ...)')
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
  
  // insert (id, name, dsc, active, cb) {
  //   // console.log('call stack: AccessCodeHelpers.insert(' + id + ', "' + name + '", ...)')
  //   const pool = new Pool()
  //   var   text = ''
  //   var   values = []
  //   var   nextId = null
  //   var   calActive = false

  //   if (!name) {
  //     const error = {
  //       'code': 1000,
  //       'msg' : 'Required column NAME not specified',     
  //       'dsc' : 'Column NAME of table ACCESS_CODES must not be null'
  //     }
  //     cb(error, null)
  //     pool.end()
  //   }

  //   if (active != false) { calActive = true }

  //   // name MUST BE UNIQUE
  //   this.findByName(name, (err1, res1) => {
  //     if (err1) {
  //       cb(err1, res1)
  //       pool.end()
  //     } else {
  //       if (res1.rows.length > 0) {
  //         const error = {
  //           'code': 1001,
  //           'msg' : 'Access code of name "' + name + '" already exists',     
  //           'dsc' : 'Column NAME of table ACCESS_CODES must be unique'
  //         }
  //         pool.end()
  //         return cb(error, null)
  //       }

  //       // find next id if id is not specified
  //       // console.log('id: ' + id)
  //       if (id == null || id == UNDEFINED) {
  //         text = 'SELECT max(id)+1 AS nextid FROM access_codes'
  //         pool.query(text, (err2, res2) => {
  //           if (err2) {
  //             cb(err2, res2)
  //             pool.end()
  //           } else {
  //             nextId = res2.rows[0].nextid || 1
  //             // console.log('nextId: ' + nextId)
  //             // create record in the db with given next id
  //             text = 'INSERT INTO access_codes(id, name, dsc, active) VALUES($1, $2, $3, $4) RETURNING *'
  //             values = [nextId, name, dsc, calActive]
  //             pool.query(text, values, (err5, res5) => {
  //               cb(err5, res5)
  //               pool.end()
  //             })
  //           }
  //         })
  //       } else { // check if id already exists
  //         this.findById(id, (err3, res3) => {
  //           if (err3) {
  //             cb(err3, res3)
  //             pool.end()
  //           } else {
  //             if (res3.rows.length > 0) {
  //             const error = {
  //               'code': 1002,
  //               'msg' : 'Access code of id ' + id + ' already exists',     
  //               'dsc' : 'Column Id of table ACCESS_CODES must be unique'
  //             }
  //             cb(error, null)
  //             pool.end()
  //             }
  //             // create record in the db with given id
  //             text = 'INSERT INTO access_codes(id, name, dsc, active) VALUES($1, $2, $3, $4) RETURNING *'
  //             values = [id, name, dsc, calActive]
  //             pool.query(text, values, (err4, res4) => {
  //               cb(err4, res4)
  //               pool.end()
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  //------------------------------------------------------//

  update (id, name, dsc, active, cb) {

  },

  //------------------------------------------------------//

  insertOrUpdate (id, name, dsc, active, cb) {

  },

  //------------------------------------------------------//

  deleteById (id, cb) {

  },

  //------------------------------------------------------//

  deleteByName (name, cb) {

  },

  //------------------------------------------------------//

  activate (id, cb) {

  },

  //------------------------------------------------------//

  inactivate (id, cb) {

  }
}