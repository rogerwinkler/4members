drop table users cascade;
create table users 
(
	id			integer primary key,
	username	text unique,
	password	text,
	active		boolean
);
grant select, insert, update on table users to public;
