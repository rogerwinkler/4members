drop table business_units cascade;
create table business_units 
(
	id		integer primary key,
	name	varchar(64) unique not null,
	dsc		varchar(256),
	active	boolean not null
);
grant select, insert, update on table business_units to public;
