const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const AccessCodeController = require('./controllers/AccessCodeController')
const RolesController = require('./controllers/RolesController')
const DefaultController = require('./controllers/DefaultController')

module.exports = (app) => {
	app.post('/register', 
		AuthenticationControllerPolicy.register,
		AuthenticationController.register)
	
	app.post('/login', 
		AuthenticationController.login)

	app.post('/access_code',
		AccessCodeController.create)

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
