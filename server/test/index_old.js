////////////////////////////////////////////////////////////////////
// =================================================================
// FILE: 	.../server/test/index.js 
// =================================================================  
// test/index.js is used to regression test the server side database 
// functions.
// -----------------------------------------------------------------
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// =================================================================
// FUNCTION: async function testAccessCodesHelpers () {}
// =================================================================
// 			 Runs all necessary methods of db module 
//			 AccessCodesHelpers.js
// -----------------------------------------------------------------
////////////////////////////////////////////////////////////////////
const access_codes = require('./access_codes.json')
const AccessCodesHelpers = require('../src/db/AccessCodesHelpers')

async function testAcessCodesHelpers () {
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
// =================================================================
// FUNCTION: async function testRolesHelpers () {}
// =================================================================
// 			 Runs all necessary methods of db module 
//			 RolesHelpers.js
// -----------------------------------------------------------------
////////////////////////////////////////////////////////////////////
const roles = require('./roles.json')
const RolesHelpers = require('../src/db/RolesHelpers')

async function testRolesHelpers () {
	var testIDs = []
	console.log('START TEST ***** RolesHelpers (roles) *****')
	console.log('. findByName() test roles and delete() them if found...')
	for (var i=0; i<roles.length; i++) {
    	const rows1 = await RolesHelpers.findByName(roles[i].name)
    	if (rows1.length>0) { 
    		console.log('.. role found: id=' + rows1[0].id + ', name="' + rows1[0].name + '"')
    		const rows2  = await RolesHelpers.delete(rows1[0].id)
    		if (rows2 == []) {
				console.log('.. ERROR deleting test role of id=' + rows1[0].id)
			} else {
    			console.log('.. role deleted: id=' + rows2[0].id + ', name="' + rows2[0].name + '"')
			}
    	}
    }

	console.log('. insert() test roles from "roles.json"...')
	for (var i=0; i<roles.length; i++) {
		try {
			const res = await RolesHelpers.insert(null, roles[i].name, roles[i].dsc, true)
			if (res.error && res.error.code != 1001) { // ignore already exists
				console.log('.. ERROR on insert(),' + res.error.code + ', ' + res.error.msg)
			} else {
				testIDs.push(res.rows[0].id)
				console.log('.. role id=' + res.rows[0].id + ', "' + roles[i].name + '" successfully inserted.')
			}
		} catch(e) {
			console.log(e.stack)
		}
	}
	console.log('.. testIDs', testIDs)

	console.log('. update() test roles...')
	var changedIDs = []
	for (var i=0; i<roles.length; i++) {
		try {
	    	const rows1 = await RolesHelpers.findByName(roles[i].name)
	    	if (rows1.length>0) { 
	    		console.log('.. role found: id=' + rows1[0].id + ', name="' + rows1[0].name + '", dsc="' + rows1[0].dsc + '", active=' + rows1[0].active)
	    		const res  = await RolesHelpers.update(rows1[0].id, 'testRoleName'+i, 'testRoleDsc'+i, false)
	    		if (res.error) {
					console.log('.. ERROR on update(), ' + res.error.code + ', ' + res.error.msg)
	    		} else {
	    			console.log('.. role updated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
	    		}
    	}
		} catch(e) {
			console.log(e.stack)
		}
	}

	console.log('. delete() updated test roles...')
	for (var i=0; i<testIDs.length; i++) {
		const rows = await RolesHelpers.delete(testIDs[i])
		if (rows == []) {
			console.log('.. ERROR deleting test role of id=' + testIDs[i])
		} else {
			console.log('.. role deleted: id=' + rows[0].id + ', name="' + rows[0].name + '"')
		}
	}

	testIDs = []
	console.log('. insert() test roles from "roles.json"...')
	for (var i=0; i<roles.length; i++) {
		try {
			const res = await RolesHelpers.insert(null, roles[i].name, roles[i].dsc, true)
			if (res.error && res.error.code != 1001) { // ignore already exists
				console.log('.. ERROR on insert(),' + res.error.code + ', ' + res.error.msg)
			} else {
				testIDs.push(res.rows[0].id)
				console.log('.. role id=' + res.rows[0].id + ', "' + roles[i].name + '" successfully inserted.')
			}
		} catch(e) {
			console.log(e.stack)
		}
	}
	console.log('.. testIDs', testIDs)
}


////////////////////////////////////////////////////////////////////
// MAIN FUNCTION RUNNING ALL OF THE LOADING FUNCTIONS ABOVE....
////////////////////////////////////////////////////////////////////
(async () => {
	// await testAcessCodesHelpers()
	await testRolesHelpers()
})().catch(e => console.error(e.stack))
