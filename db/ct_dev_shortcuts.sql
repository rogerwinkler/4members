drop table dev_shortcuts cascade;
create table dev_shortcuts 
(
	id			integer primary key,
	shortcut 	varchar (8) unique not null,
	name		varchar(32) unique not null,
	active		boolean not null
);
grant select, insert, update on table dev_shortcuts to public;
