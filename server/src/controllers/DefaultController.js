const debug          = require('debug')('4members.DefaultController')
const debugCatchAll  = require('debug')('4members.RolesController.catchAll')


module.exports = {

  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: async catchAll (req, res) {}
  //  Returns a standard error message for unsupported routes.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  req: http request (receiving)
  //  res: response object (answering)        
  // -----------------------------------------------------------------
  // RETURNS: An error of status 400 in the standard structure in the 
  //  body of the http response:
  //
  //  {
  //    status : "error",
  //    code:  : 1011,
  //    message: "Route not supported",
  //    detail : "Route not supported, check http verb and path"
  //  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  

  async catchAll (req, res) {
    debugCatchAll('INPUT: req.params=%o, req.body=%o, req.query=%o', req.params, req.body, req.query)
    var retObj = {
      status : 'error',
      code   : 1011,
      message: 'Route not supported',
      detail : 'Route not supported, check http verb and path'
    
    }
    debugCatchAll('RETURNS: sending 400... %o', retObj)
    res.status(400).send(retObj)
  }
}
