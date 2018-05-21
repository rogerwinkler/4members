drop table addrs_addr_types cascade;
create table addrs_addr_types 
(
	addr_id		 	integer references addrs(id),
	addr_type_id 	integer references addr_types(id), 
	active			boolean,
	unique			(addr_id, addr_type_id)
);
grant select, insert, update on table addrs_addr_types to public;
