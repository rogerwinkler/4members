const { Pool } = require('pg')
const AuthenticationHelpers = require('../db/AuthenticationHelpers')
const debug = require('debug')('4members.AuthenticationController')
const debugRegister = require('debug')('4members.AuthenticationController.register')


module.exports = {
  async register (req, res) {
    debugRegister('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    const pool = new Pool()
    await pool.connect()
    var text = ''
    var values = []
    var retObj = {}

    // get index of new entry
    var text = 'SELECT MAX(id)+1 AS nextuserid FROM users'
    var nextUserId

    try {
      const result = await pool.query(text)
      nextUserId = result.rows[0].nextuserid || 1
    } catch(e) {
      pool.end()
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
      debugRegister('RETURNS: sending 400... %o', retObj)
      return res.status(400).send(retObj)
    }

    // Validation Checks:
    // check if username is already in use
    text = 'SELECT COUNT(id) as count FROM users where username=$1'
    values = [req.body.username]

    // db contraints check, so we don't have to: 
    //  - data types
    //  - id is unique
    //  - username is unique and not null, 
    //  - active is not null

    text = 'INSERT INTO users(id, username, password, email, active) VALUES($1, $2, $3, $4, $5) RETURNING *'
    values = [nextUserId, req.body.username, AuthenticationHelpers.hashPassword(req.body.password), req.body.email, true]

    try {
      const result = await pool.query(text, values)
      if (result.rows.length!==1) {
        pool.end()
        retObj = {
          status  : 'error',
          code    : 1019,
          message : 'User object can not be inserted',
          detail  : 'A problem occured inserting the users record into the database'
        }
        debugRegister('RETURNS: sending 400... %o')
        return res.status(400).send(retObj)
      } else {
        pool.end()
        retObj = {
          status : 'success',
          data   : {
            user : result.rows[0],
            token: AuthenticationHelpers.jwtSignUser({
              user: {
                id       : result.rows[0].id,
                username : result.rows[0].username,
              }
            })
          }
        } 
        debugRegister('RETURNS: sending 200... %o', retObj)
        return res.status(200).send(retObj)       
      }
    } catch(e) {
      pool.end()
      retObj = {
        status  : 'error',
        code    : 'PostgreSQL-' + e.code,
        message : e.message,
        detail  : e.detail
      }
      debugRegister('RETURNS: sending 400... %o', retObj)
      return res.status(400).send(retObj)
    }
  },

  async login (req, res) {
    const pool = new Pool()
    await pool.connect()

    // find user
    text = 'SELECT * FROM users where username=$1'
    var values = [req.body.email]

    try {
      const result = await pool.query(text, values)
      // console.log(result.rows[0])
      // console.log(req.body)
      // console.log(comparePasswords(req.body.password, result.rows[0].password))
      if (AuthenticationHelpers.comparePasswords(req.body.password, result.rows[0].password)) {
        res.send({
          user: result.rows[0],
          token: AuthenticationHelpers.jwtSignUser({
            user: {
              id       : result.rows[0].id,
              username : result.rows[0].username
            }
          })
        })
        await pool.end()
      } else {
        res.status(403).send({error: 'Incorrect credentials'})
        await pool.end()
      }
    } catch(err) {
      console.log(err.stack)
      res.status(500).send({error: 'An error has occured trying to log in'})
      await pool.end()      
    }
  }
}
