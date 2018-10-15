drop table abbreviations cascade;
create table abbreviations 
(
	id			integer primary key,
	abbr 		varchar (8) unique not null,
	name		varchar(32) unique not null,
	active		boolean not null
);
grant select, insert, update on table abbreviations to public;
