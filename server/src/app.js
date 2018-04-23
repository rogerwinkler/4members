const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const { Pool, Client } = require('pg')


const app = express() 		// define app to be an express app
app.use(morgan('combined')) // use morgan log library to get logs while the server is running
app.use(bodyParser.json())	// parse body of http request
app.use(cors()) 			// allow access from 3erd party web sites

app.post('/register', function(req, res) {
	res.send({
		message: 'Hello '+req.body.email+'! Your user was registered! Have Fun!'
	})
})

app.get('/db', async function(req, res) {
	const client = new Client()
	await client.connect()

	const result = await client.query('SELECT NOW()')
	console.log(result.rows[0].now)
	res.send(result.rows[0].now)
	await client.end()
})

app.listen(process.env.PORT || 8081) 
