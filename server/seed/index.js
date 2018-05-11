////////////////////////////////////////////////////////////////////
// =================================================================
// FILE: 	.../server/seed/index.js 
// =================================================================  
// 			seed/index.js is used to load seed data into an empty 
//			database.
// -----------------------------------------------------------------
// 			It is a PREREQUISITE that the db be empty!!!!
// -----------------------------------------------------------------
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// async function loadAccessCodes () {}
////////////////////////////////////////////////////////////////////
const access_codes = require('./access_codes.json')
const AccessCodesHelpers = require('../src/db/AccessCodesHelpers')

async function loadAcessCodes () {
	for (var i=0; i<access_codes.length; i++) {
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


////////////////////////////////////////////////////////////////////
// async function loadRoles () {}
////////////////////////////////////////////////////////////////////
const roles = require('./roles.json')
const RolesHelpers = require('../src/db/RolesHelpers')

async function loadRoles () {
	for (var i=0; i<roles.length; i++) {
		try {
			const res = await RolesHelpers.insert(roles[i].id, roles[i].name, roles[i].dsc, roles[i].active)
			if (res.error) {
				console.log('Error ' + res.error.code + ': ' + res.error.msg + '.')
			} else {
				console.log('Success: Role "' + roles[i].name + '" inserted.')
			}
		} catch(e) {
			console.log(e.stack)
		}
	}
}


////////////////////////////////////////////////////////////////////
// MAIN FUNCTION RUNNING ALL OF THE LOADING FUNCTIONS ABOVE....
////////////////////////////////////////////////////////////////////
(async () => {
	// await loadAcessCodes()
	await loadRoles()
})().catch(e => console.error(e.stack))
