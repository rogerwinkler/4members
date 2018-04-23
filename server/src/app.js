const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')

const { Pool, Client } = require('pg')


const app = express() 		// define app to be an express app
app.use(morgan('combined')) // use morgan log library to get logs while the server is running
app.use(bodyParser.json())	// parse body of http request
app.use(cors()) 			// allow access from 3erd party web sites

require('./routes')(app)

app.get('/db', async function(req, res) {
	const client = new Client()
	await client.connect()

	const result = await client.query('SELECT NOW()')
	console.log(result.rows[0].now)
	res.send(result.rows[0].now)
	await client.end()
})

app.listen(config.port)
console.log('Server started on port ' + config.port) 
