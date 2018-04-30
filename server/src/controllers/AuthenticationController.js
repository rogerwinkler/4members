const { Pool } = require('pg')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

// const Promise = require('bluebird')
// const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const bcrypt = require('bcrypt-nodejs')


//helper function
function jwtSignUser(user) {
	const ONE_WEEK = 60 * 60 * 24 * 7
	return jwt.sign(user, config.authentication.jwtSecret, {
		expiresIn: ONE_WEEK
	})
}

function hashPassword (password) {
	const SALT_FACTOR = 8
	return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR))
}

// function hashPasswordAsync (password) {
// 	const SALT_FACTOR = 8
// 	var myHash

// 	bcrypt
// 		.genSaltAsync(SALT_FACTOR)
// 		.then(salt => bcrypt.hashAsync(password, salt, null))
// 		.then(hash => {
// 			console.log(hash)
// 			myHash = hash
// 			return myHash
// 		})
// 	// return myHash
// }

function comparePasswords(pwd, encryptedPwd) {
	return bcrypt.compareSync(pwd, encryptedPwd)
}


module.exports = {
	async register (req, res) {
		// console.log('pwd:  ' + req.body.password)
		// console.log('hash: ' + hashPassword(req.body.password))


		const pool = new Pool()
		await pool.connect()

		// get index of new entry
		var text = 'SELECT MAX(id)+1 AS nextuserid FROM users'
		var nextUserId

		try {
			const result = await pool.query(text)
			nextUserId = result.rows[0].nextuserid || 1
			// res.send({"nextUserId": nextUserId})
			// await pool.end()
		} catch(err) {
		  console.log(err.stack)
		  res.status(400).send({error: err.severity + ': ' + err.detail})
		  await pool.end()			
		}

		// Validation Checks:
		// check if email is already in use
		text = 'SELECT COUNT(id) as count FROM users where username=$1'
		var values = [req.body.email]

		try {
			const result = await pool.query(text, values)
			console.log(result.rows[0])
			if (result.rows[0].count > 0) {
				res.status(400).send({error: 'Username already in use'})
				await pool.end()
			}
		} catch(err) {
			console.log(err.stack)
			res.status(400).send({error: err.severity + ': ' + err.detail})
			await pool.end()			
		}

		text = 'INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *'
		values = [nextUserId, req.body.email, hashPassword(req.body.password)]

		try {
		  	const result = await pool.query(text, values)
		  	console.log(result.rows[0])
			res.send({
				user: result.rows[0],
				token: jwtSignUser({user: result.rows[0].username})
			})
		} catch(err) {
			console.log(err.stack)
			res.status(400).send({error: err.severity + ': ' + err.detail})
		}
		// console.log('pool end reached')
		await pool.end()
	},

	async login (req, res) {
		const pool = new Pool()
		await pool.connect()

		// find user
		text = 'SELECT * FROM users where username=$1'
		var values = [req.body.email]

		try {
			const result = await pool.query(text, values)
			// console.log(result.rows[0])
			// console.log(req.body)
			// console.log(comparePasswords(req.body.password, result.rows[0].password))
			if (comparePasswords(req.body.password, result.rows[0].password)) {
				res.send({
					user: result.rows[0],
					token: jwtSignUser({user: result.rows[0].username})
				})
				await pool.end()
			} else {
				res.status(403).send({error: 'Incorrect credentials'})
				await pool.end()
			}
		} catch(err) {
			console.log(err.stack)
			res.status(500).send({error: 'An error has occured trying to log in'})
			await pool.end()			
		}
	}
}
