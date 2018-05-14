const debugCreateUpdateStatement = require('debug')('4members.QueryBuildHelpers.createUpdateStatement')

module.exports = {
  ////////////////////////////////////////////////////////////////////
  // -----------------------------------------------------------------
  // METHOD: createUpdateStatement( tableName, arrayOfPrimeKeys, arrayOfProperties) {}
  //  Creates an update statement from the given prime keys and properties
  //  for table 'tableName'.
  // -----------------------------------------------------------------
  // PARAMS:  
  //  tableName: Name of table.
  //  arrayOfPrimeKeys:  [ARRAY], array containing the literals for the
  //                              primary keys.
  //  arrayOfProperties: [ARRAY], array of properties
  // -----------------------------------------------------------------
  // RETURNS: The update statement as a string.
  // -----------------------------------------------------------------
  ////////////////////////////////////////////////////////////////////  
 
  createUpdateStatement( tableName, arrayOfPrimeKeys, arrayOfProperties) {
    debugCreateUpdateStatement('INPUT: tableName=%s, arrayOfPrimeKeys=%o, arrayOfProperties=%o', tableName, arrayOfPrimeKeys, arrayOfProperties)

    var updateStmt = 'UPDATE ' + tableName + ' SET ' 

    for (var i=0; i<arrayOfProperties.length; i++) {
      updateStmt = updateStmt + arrayOfProperties[i] + '=$' + (parseInt(arrayOfPrimeKeys.length)+i+1).toString()
      if (i<arrayOfProperties.length-1) { // add comma...
        updateStmt = updateStmt + ', '
      } else { // at end => no comma added...
        updateStmt = updateStmt + ' '
      }
    }

    updateStmt = updateStmt + 'WHERE '

    for (var i=0; i<arrayOfPrimeKeys.length; i++) {
      updateStmt = updateStmt + arrayOfPrimeKeys[i] + '=$' + (i+1).toString()
      if (i<arrayOfPrimeKeys.length-1) { // add "and"
        updateStmt = updateStmt + ' and '
      } else { // last property no "and" required...
        updateStmt = updateStmt + ' '
      }
    }

    updateStmt = updateStmt + ' returning *'

    debugCreateUpdateStatement('RETURNS: %s', updateStmt)
    return updateStmt
  }
}