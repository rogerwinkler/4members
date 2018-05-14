drop table access_codes cascade;
create table access_codes 
(
	id		integer primary key,
	name	varchar(32) unique not null,
	dsc		varchar(128),
	active	boolean not null
);
grant select, insert, update on table access_codes to public;
