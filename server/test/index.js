const testAccessCodesHelpers = require('./testAccessCodesHelpers')
const testRolesHelpers = require('./testRolesHelpers')


////////////////////////////////////////////////////////////////////
// MAIN FUNCTION RUNNING ALL THE TESTS
////////////////////////////////////////////////////////////////////
{
	(async () => {
		await testAccessCodesHelpers.test()
		await testRolesHelpers.test()
	})().catch(e => console.error(e.stack))
}