drop table addr_types cascade;
create table addr_types 
(
	id		integer primary key,
	name	varchar(32) unique not null,
	dsc		varchar(128),
	active	boolean not null
);
grant select, insert, update on table addr_types to public;
