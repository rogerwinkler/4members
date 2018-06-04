drop table addresses cascade;
create table addresses 
(
	id			integer primary key,
	name		varchar(128),
	street		text, 				/* can be multi-line */
	zip			varchar(32),
	city    	varchar(128),
	country_id 	integer references countries(id),
	active		boolean not null
);
grant select, insert, update on table addresses to public;
