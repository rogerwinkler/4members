(async () => {
	const seed_roles = require('./seed_roles')
	await seed_roles.loadRoles()
	const seed_access_codes = require('./seed_access_codes')
	await seed_access_codes.loadAccessCodes()
})().catch(e => console.error(e.stack))
