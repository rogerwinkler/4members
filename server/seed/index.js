(async () => {
	const seed_roles = require('./seed_roles')
	await seed_roles.loadRoles()
})().catch(e => console.error(e.stack))
