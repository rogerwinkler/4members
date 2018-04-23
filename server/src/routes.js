const AuthenticationController = require('./controllers/AuthenticationController')

module.exports = function (app) {
	app.post('/register', AuthenticationController.register)	
}