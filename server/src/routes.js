const BusinessUnitsController = require('./controllers/BusinessUnitsController')
const BusinessUnitsUsersController = require('./controllers/BusinessUnitsUsersController')
const UsersControllerPolicy = require('./policies/UsersControllerPolicy')
const UsersController = require('./controllers/UsersController')
const RolesController = require('./controllers/RolesController')
const AccessCodesController = require('./controllers/AccessCodesController')
const DefaultController = require('./controllers/DefaultController')
const AuthenticationHelpers = require('./db/AuthenticationHelpers')
const DevShortcutsController = require('./controllers/DevShortcutsController')
const CountriesController = require('./controllers/CountriesController')
const cors = require('cors')

module.exports = (app) => {

  /////////////////////////////////////////////
  // users 
  app.get('/api/v0.01/users',
    AuthenticationHelpers.verifyToken,
    UsersController.getAll)

  app.get('/api/v0.01/users/:id',
    AuthenticationHelpers.verifyToken,
    UsersController.get)

  app.post('/api/v0.01/users',
    AuthenticationHelpers.verifyToken,
    UsersControllerPolicy.register,
    UsersController.insert)

  app.put('/api/v0.01/users/:id',
    AuthenticationHelpers.verifyToken,
    UsersController.update)

  app.delete('/api/v0.01/users',
    AuthenticationHelpers.verifyToken,
    UsersController.deleteAll)

  app.delete('/api/v0.01/users/:id',
    AuthenticationHelpers.verifyToken,
    UsersController.delete)

  // app.options('/api/v0.01/register', cors()) // enable pre-flight request for DELETE request
  app.post('/api/v0.01/register', 
    UsersControllerPolicy.register,
    UsersController.register)
  
  app.post('/api/v0.01/login', 
    UsersController.login)


  /////////////////////////////////////////////
  // roles 
  app.get('/api/v0.01/roles',
    AuthenticationHelpers.verifyToken,
    RolesController.getAll)

  app.get('/api/v0.01/roles/:id',
    AuthenticationHelpers.verifyToken,
    RolesController.get)

  app.post('/api/v0.01/roles',
    AuthenticationHelpers.verifyToken,
    RolesController.insert)

  app.put('/api/v0.01/roles/:id',
    AuthenticationHelpers.verifyToken,
    RolesController.update)

  app.delete('/api/v0.01/roles',
    AuthenticationHelpers.verifyToken,
    RolesController.deleteAll)

  app.delete('/api/v0.01/roles/:id',
    AuthenticationHelpers.verifyToken,
    RolesController.delete)


  /////////////////////////////////////////////
  // access_codes 
  app.get('/api/v0.01/access_codes',
    AuthenticationHelpers.verifyToken,
    AccessCodesController.getAll)

  app.get('/api/v0.01/access_codes/:id',
    AuthenticationHelpers.verifyToken,
    AccessCodesController.get)

  app.post('/api/v0.01/access_codes',
    AuthenticationHelpers.verifyToken,
    AccessCodesController.insert)

  app.put('/api/v0.01/access_codes/:id',
    AuthenticationHelpers.verifyToken,
    AccessCodesController.update)

  app.delete('/api/v0.01/access_codes',
    AuthenticationHelpers.verifyToken,
    AccessCodesController.deleteAll)

  app.delete('/api/v0.01/access_codes/:id',
    AuthenticationHelpers.verifyToken,
    AccessCodesController.delete)


  /////////////////////////////////////////////
  // dev_shortcuts 
  app.get('/api/v0.01/dev_shortcuts',
    AuthenticationHelpers.verifyToken,
    DevShortcutsController.getAll)

  app.get('/api/v0.01/dev_shortcuts/:id',
    AuthenticationHelpers.verifyToken,
    DevShortcutsController.get)

  app.post('/api/v0.01/dev_shortcuts',
    AuthenticationHelpers.verifyToken,
    DevShortcutsController.insert)

  app.put('/api/v0.01/dev_shortcuts/:id',
    AuthenticationHelpers.verifyToken,
    DevShortcutsController.update)

  app.delete('/api/v0.01/dev_shortcuts',
    AuthenticationHelpers.verifyToken,
    DevShortcutsController.deleteAll)

  app.delete('/api/v0.01/dev_shortcuts/:id',
    AuthenticationHelpers.verifyToken,
    DevShortcutsController.delete)


  /////////////////////////////////////////////
  // countries 
  app.get('/api/v0.01/countries',
    AuthenticationHelpers.verifyToken,
    CountriesController.getAll)

  app.get('/api/v0.01/countries/:id',
    AuthenticationHelpers.verifyToken,
    CountriesController.get)

  app.post('/api/v0.01/countries',
    AuthenticationHelpers.verifyToken,
    CountriesController.insert)

  app.put('/api/v0.01/countries/:id',
    AuthenticationHelpers.verifyToken,
    CountriesController.update)

  app.delete('/api/v0.01/countries',
    AuthenticationHelpers.verifyToken,
    CountriesController.deleteAll)

  app.delete('/api/v0.01/countries/:id',
    AuthenticationHelpers.verifyToken,
    CountriesController.delete)


  /////////////////////////////////////////////
  // business_units 
  app.get('/api/v0.01/business_units',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsController.getAll)

  app.get('/api/v0.01/business_units/:id',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsController.get)

  app.post('/api/v0.01/business_units',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsController.insert)

  app.put('/api/v0.01/business_units/:id',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsController.update)

  app.delete('/api/v0.01/business_units',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsController.deleteAll)

  app.delete('/api/v0.01/business_units/:id',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsController.delete)


  /////////////////////////////////////////////
  // business_units_users 
  app.get('/api/v0.01/business_units_users',
    // AuthenticationHelpers.verifyToken,
    BusinessUnitsUsersController.get)

  // app.get('/api/v0.01/business_units_users/:id',
  //   AuthenticationHelpers.verifyToken,
  //   RolesController.get)

  app.post('/api/v0.01/business_units_users',
    // AuthenticationHelpers.verifyToken,
    BusinessUnitsUsersController.insert)

  app.put('/api/v0.01/business_units_users/:id',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsUsersController.update)

  app.delete('/api/v0.01/business_units_users',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsUsersController.deleteAll)

  app.delete('/api/v0.01/business_units_users/:id',
    AuthenticationHelpers.verifyToken,
    BusinessUnitsUsersController.delete)


  /////////////////////////////////////////////
  // catch-all for get, post, put, delete & patch...
  app.get('*', 
    AuthenticationHelpers.verifyToken,
    DefaultController.catchAll)
  app.post('*', 
    AuthenticationHelpers.verifyToken,
    DefaultController.catchAll)
  app.put('*', 
    AuthenticationHelpers.verifyToken,
    DefaultController.catchAll)
  app.delete('*', 
    AuthenticationHelpers.verifyToken,
    DefaultController.catchAll)
  app.patch('*', 
    AuthenticationHelpers.verifyToken,
    DefaultController.catchAll)
}
