drop table roles cascade;
create table roles 
(
	id		integer primary key,
	name	text unique,
	dsc		text,
	active	boolean
);
grant select, insert, update on table roles to public;
