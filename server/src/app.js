const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')


const app = express() 		// define app to be an express app

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
// app.use(morgan('combined')) // use morgan log library to get logs while the server is running

app.use(bodyParser.json())	// parse body of http request

var corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true
}
app.use(cors(corsOptions)) 			// allow access from 3erd party web sites
// app.options('*', cors())

require('./routes')(app)

module.exports = app.listen(config.port)
console.log('Server started on port ' + config.port) 
