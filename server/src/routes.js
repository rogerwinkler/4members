const UsersControllerPolicy = require('./policies/UsersControllerPolicy')
const UsersController = require('./controllers/UsersController')
const RolesController = require('./controllers/RolesController')
const AccessCodesController = require('./controllers/AccessCodesController')
const DefaultController = require('./controllers/DefaultController')
const AuthenticationHelpers = require('./db/AuthenticationHelpers')

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
  // access codes 
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
