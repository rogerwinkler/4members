const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const UsersController = require('./controllers/UsersController')
const RolesController = require('./controllers/RolesController')
const AccessCodesController = require('./controllers/AccessCodesController')
const DefaultController = require('./controllers/DefaultController')

module.exports = (app) => {

  /////////////////////////////////////////////
  // users 
  app.get('/api/v0.01/users',
    UsersController.getAll)

  app.get('/api/v0.01/users/:id',
    UsersController.get)

  app.post('/api/v0.01/users',
    UsersController.insert)

  app.put('/api/v0.01/users/:id',
    UsersController.update)

  app.delete('/api/v0.01/users',
    UsersController.deleteAll)

  app.delete('/api/v0.01/users/:id',
    UsersController.delete)

  app.post('/api/v0.01/register', 
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  
  app.post('/api/v0.01/login', 
    AuthenticationController.login)


  /////////////////////////////////////////////
  // roles 
  app.get('/api/v0.01/roles',
    RolesController.getAll)

  app.get('/api/v0.01/roles/:id',
    RolesController.get)

  app.post('/api/v0.01/roles',
    RolesController.insert)

  app.put('/api/v0.01/roles/:id',
    RolesController.update)

  app.delete('/api/v0.01/roles',
    RolesController.deleteAll)

  app.delete('/api/v0.01/roles/:id',
    RolesController.delete)

  /////////////////////////////////////////////
  // access codes 
  app.get('/api/v0.01/access_codes',
    AccessCodesController.getAll)

  app.get('/api/v0.01/access_codes/:id',
    AccessCodesController.get)

  app.post('/api/v0.01/access_codes',
    AccessCodesController.insert)

  app.put('/api/v0.01/access_codes/:id',
    AccessCodesController.update)

  app.delete('/api/v0.01/access_codes',
    AccessCodesController.deleteAll)

  app.delete('/api/v0.01/access_codes/:id',
    AccessCodesController.delete)

  /////////////////////////////////////////////
  // catch-all for get, post, put, delete & patch...
  app.get('*', 
    DefaultController.catchAll)
  app.post('*', 
    DefaultController.catchAll)
  app.put('*', 
    DefaultController.catchAll)
  app.delete('*', 
    DefaultController.catchAll)
  app.patch('*', 
    DefaultController.catchAll)
}
