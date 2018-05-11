-- Database: 4members_test01

-- DROP DATABASE "4members_test01";

CREATE DATABASE "4members_test01"
    WITH 
    OWNER = "4members"
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE "4members_test01"
    IS 'test db for the 4members app';