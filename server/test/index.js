const testRolesHelpers = require('./testRolesHelpers')


////////////////////////////////////////////////////////////////////
// MAIN FUNCTION RUNNING ALL THE TESTS
////////////////////////////////////////////////////////////////////
{
	(async () => {
		// await testAcessCodesHelpers()
		await testRolesHelpers.test()
	})().catch(e => console.error(e.stack))
}