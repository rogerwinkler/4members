drop table users cascade;
create table users 
(
	id			integer primary key,
	username	text unique,
	password	text
);
grant select, insert, update on table users to public;
