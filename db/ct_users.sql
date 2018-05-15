drop table users cascade;
create table users 
(
	id			integer primary key,
	username	varchar(32) unique not null,
	password	varchar(256) not null,
	email		varchar(64),
	active		boolean not null
);
grant select, insert, update on table users to public;
