drop table roles_access_codes cascade;
create table roles_access_codes 
(
	role_id			integer references roles(id),
	access_code_id 	integer references access_codes(id), 
	active			boolean,
	unique			(role_id, access_code_id)
);
grant select, insert, update on table roles_access_codes to public;
