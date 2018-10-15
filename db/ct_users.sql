drop table users cascade;
create table users 
(
	bu_id		integer,
	id			integer primary key,
	username	varchar(32) unique not null,
	password	varchar(256) not null,
	fullname	varchar(64),
	email		varchar(64),
	active		boolean not null,
	unique		(bu_id, id)		
);
grant select, insert, update on table users to public;
