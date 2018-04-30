drop table access_codes cascade;
create table access_codes 
(
	id		integer primary key,
	name	text unique not null,
	dsc		text,
	active	boolean
);
grant select, insert, update on table access_codes to public;
