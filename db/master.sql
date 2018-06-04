/* This master sql script file is used to create all 4members database objects in
   dependable order */

/* developemnt */
\i ct_dev_shortcuts.sql
/* general */
\i ct_business_units.sql
/* user management */
\i ct_access_codes.sql
\i ct_roles.sql
\i ct_roles_access_codes.sql
\i ct_users.sql
\i ct_users_roles.sql
\i ct_business_units_users.sql
/* address management */
\i ct_countries.sql
\i ct_addr_types.sql
\i ct_addresses.sql
/* membership management */
