// seed/index.js is used to load seed data into an empty database
// It is a PREREQUISITE that the db be empty!!!!

////////////////////////////////////////////////////////////////
// Load Access Codes:
const access_codes = require('./access_codes.json')
const AccessCodesHelpers = require('../src/db/AccessCodesHelpers')

async function loadAcessCodes () {
	for (i=0; i<access_codes.length; i++) {
		try {
			const res = await AccessCodesHelpers.insert(null, access_codes[i].name, access_codes[i].dsc, true)
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

loadAcessCodes()


////////////////////////////////////////////////////////////////
// Load Roles:
const roles = require('./roles.json')
const RolesHelpers = require('../src/db/RolesHelpers')

async function loadRoles () {
	for (i=0; i<roles.length; i++) {
		try {
			const res = await RolesHelpers.insert(null, roles[i].name, roles[i].dsc, true)
			if (res.error) {
				console.log('Error ' + res.error.code + ': ' + res.error.msg + '.')
			} else {
				console.log('Success: Role "' + access_codes[i].name + '" inserted.')
			}
		} catch(e) {
			console.log(e.stack)
		}
	}
}

loadAcessCodes()

