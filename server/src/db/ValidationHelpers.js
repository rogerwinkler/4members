const debugCheckObjectHasInvalidProperties = require('debug')('4members.validationHelpers.checkObjectHasInvalidProperties')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: checkObjectHasInvalidProperties( obj, arrayOfProperties) {}
  //  Checks if the input object's properties belong to those provided
  //  by the given array. However, this method does NOT check for 
  //  completeness (e.g. if all items in the array are also properties
  //  of the object)!!! 
  // -----------------------------------------------------------------
  // PARAMS:  
  //  obj: [OBJECT], object to be checked.
  //  arrayOfValidProperties: [ARRAY], array of valid properties
  // -----------------------------------------------------------------
  // RETURNS: 
  //  An error if the object contains a property that is not in the
  //  array of valid properties.
  //  An error of NULL is returned, if all properties of the object 
  //  are valid.
  //  
  //  The structure of the returned error is:
  //  {
  //    error : { code, msg, dsc} || null
  //  }
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
 
  checkObjectHasInvalidProperties( obj, arrayOfValidProperties) {
    debugCheckObjectHasInvalidProperties('INPUT: obj=%o, arrayOfValidProperties=%o', obj, arrayOfValidProperties)
    var retObj = {}
    for (var property in obj) {
      if (obj.hasOwnProperty(property) && !(arrayOfValidProperties.indexOf(property)>-1)) {
        const error = {
          'code' : 1007,
          'msg'  : 'No such property "' + property + '"',
          'dsc'  : 'Query object contains an illegal property'
        }
        const retObj = {'error': error}
        debugCheckObjectHasInvalidProperties('RETURNS: %o', retObj)
        return retObj
      }
    }
    retObj = { 'error': null }
    debugCheckObjectHasInvalidProperties('RETURNS: %o', retObj)
    return retObj
  }
}