const { Pool } = require('pg')
const QueryBuildHelpers = require('./QueryBuildHelpers')
const AuthenticationHelpers = require('./AuthenticationHelpers')
const TxHelpers = require('./TxHelpers')
const debug = require('debug')('4members.UsersHelpers')
const debugGetAll = require('debug')('4members.UsersHelpers.getAll')
const debugGet = require('debug')('4members.UsersHelpers.get')
const debugInsert = require('debug')('4members.UsersHelpers.insert')
const debugUpdate = require('debug')('4members.UsersHelpers.update')
const debugDelete = require('debug')('4members.UsersHelpers.delete')
const debugDeleteAll = require('debug')('4members.UsersHelpers.deleteAll')
const debugLogin = require('debug')('4members.UsersHelpers.login')
const debugRegister = require('debug')('4members.UsersHelpers.register')


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
  // METHOD: async insert (user) {}
  //  Inserts an object into the table.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  user    : User object (see src/models/User.js) with properties...
  //    id      : [INT>0], id of object. If id is null, then
  //              MAX(id)+1 is taken.
  //    username: [STRING, UNIQUE, NOT NULL], username. 
  //    password: [STRING, NOT NULL], password.
  //    email   : [STRING], email address
  //    active  : [BOOL, DEFAULTS TO TRUE]
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

    text = 'INSERT INTO users(id, username, password, fullname, email, active) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
    values = [nextId, user.username, AuthenticationHelpers.hashPassword(user.password), user.fullname, user.email, calcActive]
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
  // METHOD: async update (user) {}
  //  Updates the object of the given id.
  // -----------------------------------------------------------------
  // PARAMS: 
  //  user: User object (see src/models/User.js) with properties... 
  //    id:       [INT>0, NOT NULL], id of object.
  //    username: [STRING, UNIQUE, NOT NULL, NOT EMPTY], username 
  //    password: [STRING, HASHED], password
  //    active:   [BOOLEAN, if UNDEFINED=>NOT_UPDATED]
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

  async update (user) {
    debugUpdate('INPUT: user=%o', user)
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
    values = [user.id]
    var properties = []
    // careful null===undefined ==> false, null==undefined ==> true
    // but null must be allowed!!!
    if (user.username!==undefined) { 
      properties.push('username')
      values.push(user.username)
    }
    if (user.password!==undefined) {
      properties.push('password')
      values.push(AuthenticationHelpers.hashPassword(user.password))
    }
    if (user.fullname!==undefined) {
      properties.push('fullname')
      values.push(user.fullname)
    }
    if (user.email!==undefined) {
      properties.push('email')
      values.push(user.email)
    }
    if (user.active!==undefined) {
      properties.push('active')
      values.push(user.active)
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
          code    : 1025,
          message : 'User of id "' + id + '" not found, id does not exist, id is not defined',
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
          code    : 1025,
          message : 'User of id "' + id + '" not found, id is not defined',
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
  },


  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD:  async login(user) {}
  //  Logs the user in.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  user  The user's credentials: username and password
  // -----------------------------------------------------------------
  // RETURNS: The user and bu objects of the logged in user in the 
  //  standard structure in the body of the http response:
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

  async login (user) {
    debugLogin('INPUT: user=%o', user)
    const pool = new Pool()
    retObj = {}

    // find user
    text = 'SELECT * FROM users where username=$1'
    var values = [user.username]

    try {
      const result = await pool.query(text, values)
      // debugLogin('result.rows=%o', result.rows)
      if (result.rows.length===0) {
        pool.end()
        retObj = {
          status  : 'error',
          code    : 1026,
          message : 'No such user',
          detail  : 'User of specified username not found'
        }
        debugLogin('RETURNS: %o', retObj)
        return retObj
      }

      if (AuthenticationHelpers.comparePasswords(user.password, result.rows[0].password)) {
        pool.end()
        retObj = {
          status : "success",
          data   : [{
            user : {
              id       : result.rows[0].id,
              username : result.rows[0].username,
              password : result.rows[0].password,
              fullname : result.rows[0].fullname,
              email    : result.rows[0].email,
              active   : result.rows[0].active
            },
            token : AuthenticationHelpers.jwtSignUser({
              user: {
                id       : result.rows[0].id,
                username : result.rows[0].username
              }
            })
          }]
        }
        debugLogin('RETURNS: %o', retObj)
        return retObj
      } else {
        pool.end()
        retObj = {
          status : 'error',
          code    : 1027,
          message : 'Login failed',
          detail  : 'Incorrect credentials, login failed'
        }
        debugLogin('RETURNS: %o', retObj)
        return retObj
      }
    } catch(e) {
      pool.end()
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
      debugLogin('RETURNS: %o', retObj)
      return retObj
    }
  },

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD:  async register (bu, user) {}
  //  Registrates a new organization (bu) and the registrating user.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  bu    business unit
  //  user  user 
  // -----------------------------------------------------------------
  // RETURNS: The registrated objects as one object (user) in the 
  //  standard structure in the body of the http response:
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

  async register (bu, user) {
    debugRegister('INPUT: bu=%o, user=%o', bu, user)

    // db contraints check on business_units, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - name is unique and not null, 
    //  - active is not null

    // db contraints check on users, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - username is unique and not null, 
    //  - active is not null

    // insert bu and user in a single db transaction
    const result = await TxHelpers.dbTransaction(async client => {
      var   text = ''
      var   values = []
      var   BUnextId = null
      var   userNextId = null
      var   retObj = {}
      // active defaults to true if not explicitly set to false
      const BUcalcActive = ((bu.active != false) ? true : false)
      const calcActive = ((user.active != false) ? true : false)

      // find next id if bu.id is not specified
      if (bu.id === null || bu.id === undefined) {
        text = 'SELECT max(id)+1 AS nextid FROM business_units'
        const { rows } = await client.query(text)
        BUnextId = (rows[0].nextid || 1)
      } else {
        BUnextId = bu.id
      }
      text = 'INSERT INTO business_units(id, name, dsc, active) VALUES($1, $2, $3, $4) RETURNING *'
      values = [BUnextId, bu.name, bu.dsc, BUcalcActive]
      const { rows } = await client.query(text, values)
      retObj = {
        status: 'success',
        data  : {
          bu_id  : rows[0].id,
          bu_name: rows[0].name
        }
      }

      //find next id if user.id is not specified
      if (user.id === null || user.id === undefined) {
        text = 'SELECT max(id)+1 AS nextid FROM users'
        const { rows } = await client.query(text)
        userNextId = (rows[0].nextid || 1)
      } else {
        userNextId = user.id
      }
      text = 'INSERT INTO users(bu_id, id, username, password, fullname, email, active) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
      console.log('text=', text)
      values = [BUnextId, userNextId, user.username, AuthenticationHelpers.hashPassword(user.password), user.fullname, user.email, calcActive]
      const result2 = await client.query(text, values)
      retObj.data.user_id  = result2.rows[0].id
      retObj.data.username = result2.rows[0].username
      retObj.data.password = result2.rows[0].password
      retObj.data.fullname = result2.rows[0].fullname
      retObj.data.email    = result2.rows[0].email
      return retObj
    })

    debugRegister('RETURNS: %o', result)
    return result
  }

}