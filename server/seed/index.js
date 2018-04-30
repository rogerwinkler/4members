// seed/index.js is used to load seed data into an empty database
// It is a PREREQUISITE that the db be empty!!!!

////////////////////////////////////////////////////////////////
// Load Access Codes:
// const access_codes = require('./access_codes.json')
// const AccessCodeHelpers = require('../src/db/AccessCodeHelpers')

// function insertAccessCode (i) {
// 	// console.log('call stack: index.insert(' + i + ')')
// 	if (i >= access_codes.length) {
// 		// console.log('access_codes.length >= i, return')
// 		return
// 	}

// 	AccessCodeHelpers.insert(null, access_codes[i].name, access_codes[i].dsc, true, (err, res) => {
// 		if (err && err.stack) { // node-postgres error
// 			console.log(err.stack)
// 			return
// 		} else {
// 			if (err && err.code) { // 4members db error
// 				console.log('Error ' + err.code + ': ' + err.msg + '.')
// 			} else {
// 				console.log('Success: Access code "' + access_codes[i].name + '" inserted.')
// 			}
// 			// continue inserting next object, even if 4members db error 1xxx
// 			// console.log('recursive call i: ' + (parseInt(i)+1).toString())
// 			insertAccessCode(i+1)
// 		}
// 	})
// }

// insertAccessCode(0)



const access_codes = require('./access_codes.json')
const AccessCodeHelpers = require('../src/db/AccessCodeHelpers')

async function test () {
	for (i=0; i<access_codes.length; i++) {
		try {
			const res = await AccessCodeHelpers.insert(null, access_codes[i].name, access_codes[i].dsc, true)
			if (res.error) {
				console.log('Error ' + res.error.code + ': ' + res.error.msg + '.')
			} else {
				console.log('Success: Access code "' + access_codes[i].name + '" inserted.')
			}
		} catch(e) {
			console.log(e.stack)
		}
	}
}

test()