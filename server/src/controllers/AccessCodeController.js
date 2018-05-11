const { Pool } = require('pg')
const ac = require('../models/AccessCode')
const debug = require('debug')('AccessCodeController')
const debugCreate = require('debug')('AccessCodeController.create')

module.exports = {
	async create (req, res) {
		debugCreate('req:', req)
		const pool = new Pool()
		await pool.connect()

		// get index of new entry
		var text = 'SELECT MAX(id)+1 as nextid FROM access_codes'
		var nextId

		try {
			const result = await pool.query(text)
			nextId = result.rows[0].nextid || 1
			// res.send({"nextId": nextId})
			// await pool.end()
		} catch(err) {
		  console.log(err.stack)
		  res.status(400).send({error: err.severity + ': ' + err.detail})
		  await pool.end()			
		}

		// Validation Checks:
		// check if name is already in use
		text = 'SELECT COUNT(id) as count FROM access_codes WHERE name=$1'
		var values = [req.body.name]

		try {
			const result = await pool.query(text, values)
			// console.log(result.rows[0])
			if (result.rows[0].count > 0) {
				res.status(400).send({error: 'Access code already in use'})
				await pool.end()
			}
		} catch(err) {
			console.log(err.stack)
			res.status(400).send({error: err.severity + ': ' + err.detail})
			await pool.end()			
		}

		text = 'INSERT INTO access_codes(id, name, dsc) VALUES($1, $2, $3) RETURNING *'
		values = [nextId, req.body.name, req.body.dsc]

		try {
		  	const result = await pool.query(text, values)
		  	// console.log(result.rows[0])
			res.send({
				accessCode: result.rows[0]
			})
		} catch(err) {
			console.log(err.stack)
			res.status(400).send({error: err.severity + ': ' + err.detail})
		}
		// console.log('pool end reached')
		await pool.end()
	}
}
