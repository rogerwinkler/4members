(async () => {
	const seed_roles = require('./seed_roles')
	await seed_roles.loadRoles()
	const seed_access_codes = require('./seed_access_codes')
	await seed_access_codes.loadAccessCodes()
	const seed_users = require('./seed_users')
	await seed_users.loadUsers()
})().catch(e => console.error(e.stack))
