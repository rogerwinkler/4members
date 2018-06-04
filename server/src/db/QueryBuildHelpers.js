const debugCreateUpdateStatement = require('debug')('4members.QueryBuildHelpers.createUpdateStatement')

module.exports = {
  createWhereClause( arrayOfPrimeKeys, arrayOfProperties) {
    var whereClause = ''
    for (var i=0; i<arrayOfPrimeKeys.length; i++) {
      whereClause = whereClause + arrayOfPrimeKeys[i] + '=$' + (i+1).toString()
      if (i<arrayOfPrimeKeys.length-1) { // add "and"
        whereClause = whereClause + ' and '
      } else { // last property no "and" required...
        whereClause = whereClause + ' '
      }
    }
    if (whereClause!=='') {
      whereClause = 'WHERE ' + whereClause
    }
    return whereClause
  },

  createUpdateClause( tableName, arrayOfPrimeKeys, arrayOfProperties) {
    var updateClause = 'UPDATE ' + tableName + ' SET ' 
    for (var i=0; i<arrayOfProperties.length; i++) {
      updateClause = updateClause + arrayOfProperties[i] + '=$' + (parseInt(arrayOfPrimeKeys.length)+i+1).toString()
      if (i<arrayOfProperties.length-1) { // add comma...
        updateClause = updateClause + ', '
      } else { // at end => no comma added...
        updateClause = updateClause + ' '
      }
    }
    return updateClause
  },

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
    var updateStmt = this.createUpdateClause(tableName, arrayOfPrimeKeys, arrayOfProperties)
    updateStmt = updateStmt + this.createWhereClause(arrayOfPrimeKeys, arrayOfProperties)
    updateStmt = updateStmt + ' returning *'

    debugCreateUpdateStatement('RETURNS: %s', updateStmt)
    return updateStmt
  }

}