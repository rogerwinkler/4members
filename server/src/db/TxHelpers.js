const { Pool } = require('pg')
const debug = require('debug')('4members.TxHelpers')
const debugDbTransaction = require('debug')('4members.TxHelpers.dbTransaction')

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
 
  async dbTransaction (callback) { 
    debugDbTransaction('INPUT: callback()')
    var retObj = {}
    const pool = new Pool()
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      try {
        retObj = await callback(client)
        client.query('COMMIT')
      } catch(e) {
        debugDbTransaction('transaction is rolled back!!!!!!!!!!')
        client.query('ROLLBACK')
        retObj = {
          status  : 'error',
          code    : 'PostgreSQL-' + e.code,
          message : e.message,
          detail  : e.detail
        }
      }
    } finally {
      debugDbTransaction('RETURNS: %o', retObj)
      client.release()
      return retObj
    }
  }
}

