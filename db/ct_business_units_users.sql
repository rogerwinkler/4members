drop table business_units_users cascade;
create table business_units_users 
(
	bu_id		integer references business_units(id),
	user_id 	integer references users(id), 
	active		boolean,
	unique		(bu_id, user_id)
);
grant select, insert, update on table business_units_users to public;
