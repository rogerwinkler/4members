drop table users_roles cascade;
create table users_roles 
(
	user_id		integer references users(id),
	role_id 	integer references roles(id), 
	active		boolean,
	unique		(user_id, role_id)
);
grant select, insert, update on table users_roles to public;
