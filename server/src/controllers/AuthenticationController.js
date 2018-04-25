const { Pool } = require('pg')

module.exports = {
	async register (req, res) {
		const pool = new Pool()
		await pool.connect()

		// get index of new entry
		var text = 'SELECT MAX(id)+1 as nextuserid from users'
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

		// check if email is already in use
		text = 'SELECT COUNT(id) as count FROM users where username=$1'
		var values = [req.body.email]

		try {
		  const result = await pool.query(text, values)
		  console.log(result.rows[0])
		  if (result.rows[0].count > 0) {
			res.status(400).send({error: 'Username already in use!'})
		  	await pool.end()
		  	return // not required just a reminder
		  }
		} catch(err) {
		  console.log(err.stack)
		  res.status(400).send({error: err.severity + ': ' + err.detail})
		  await pool.end()			
		}

		text = 'INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *'
		values = [nextUserId, req.body.email, req.body.password]

		try {
		  const result = await pool.query(text, values)
		  console.log(result.rows[0])
		  res.send(result.rows[0])
		  // { id: 1, username: 'testing@gmail.com', password: '12345678' }
		} catch(err) {
		  console.log(err.stack)
		  res.status(400).send({error: err.severity + ': ' + err.detail})
		  // res.send(err.severity + ': ' + err.detail)
		}
		console.log('pool end reached')
		await pool.end()
	}
}
