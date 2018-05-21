/* This master sql script file is used to create all 4members database objects in
   dependable order */

/* developemnt */
\i ct_dev_shortcuts.sql
/* user management */
\i ct_access_codes.sql
\i ct_roles.sql
\i ct_roles_access_codes.sql
\i ct_users.sql
\i ct_users_roles.sql
/* address management */
\i ct_countries.sql
\i ct_addr_types.sql
\i ct_addrs.sql
\i ct_addrs_addr_types.sql
