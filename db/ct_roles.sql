drop table roles cascade;
create table roles 
(
	id		integer primary key,
	name	varchar(32) unique not null,
	dsc		varchar(128),
	active	boolean not null
);
grant select, insert, update on table roles to public;
