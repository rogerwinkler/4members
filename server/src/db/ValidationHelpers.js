const debugCheckObjectHasOnlyValidProperties = require('debug')('4members.validationHelpers.checkObjectHasOnlyValidProperties')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: checkObjectHasOnlyValidProperties( obj, arrayOfProperties) {}
  //  Checks if the input object's properties belong to those provided
  //  by the given array. However, this method does NOT check for 
  //  completeness (e.g. if all items in the array are in the object)!!! 
  // -----------------------------------------------------------------
  // PARAMS:  
  //  obj: [OBJECT], object to be checked.
  //  arrayOfValidProperties: [ARRAY], array of valid properties
  // -----------------------------------------------------------------
  // RETURNS: The result of the check in the standard structure in the 
  //  body of the http response:
  //
  //  in case of success:             in case of an error:
  //
  //    {                             {
  //      status : "success",           status : "error",
  //      data   : null                 code:  : "an error code..."
  //    }                               message: "an error message..."
  //                                    detail : "detailed error message"
  //                                  }
  //  
  //  ...where in case of an error, "status" and "message" are required,
  //  and "code" and "detail" are optional.
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
 
  checkObjectHasOnlyValidProperties( obj, arrayOfValidProperties) {
    debugCheckObjectHasOnlyValidProperties('INPUT: obj=%o, arrayOfValidProperties=%o', obj, arrayOfValidProperties)
    var retObj = {}
    for (var property in obj) {
      if (obj.hasOwnProperty(property) && !(arrayOfValidProperties.indexOf(property)>-1)) {
        retObj = {
          status  : 'error',
          code    : 1007,
          message : 'No such property "' + property + '"',
          detail  : 'Query object contains an illegal property'
        }
        debugCheckObjectHasOnlyValidProperties('RETURNS: %o', retObj)
        return retObj
      }
    }
    retObj = {
      status : "success",
      data   : null
    }
    debugCheckObjectHasOnlyValidProperties('RETURNS: %o', retObj)
    return retObj
  }
}