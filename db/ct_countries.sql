drop table countries cascade;
create table countries 
(
	id		integer primary key,
	iso2    char(2) unique not null,
	name	varchar(128) unique not null,
	active	boolean not null
);
grant select, insert, update on table countries to public;
