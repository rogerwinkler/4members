const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const AccessCodeController = require('./controllers/AccessCodeController')

module.exports = (app) => {
	app.post('/register', 
		AuthenticationControllerPolicy.register,
		AuthenticationController.register)
	
	app.post('/login', 
		AuthenticationController.login)

	app.post('/access_code',
		AccessCodeController.create)
}