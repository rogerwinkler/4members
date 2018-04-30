drop table users cascade;
create table users 
(
	id			integer primary key,
	username	text unique,
	password	text,
	role_id		integer references roles(id)
);
grant select, insert, update on table users to public;
