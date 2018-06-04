drop table business_units cascade;
create table business_units 
(
	id		integer primary key,
	name	varchar(32) unique not null,
	dsc		varchar(128),
	active	boolean not null
);
grant select, insert, update on table business_units to public;
