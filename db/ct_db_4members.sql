-- Database: 4members

-- DROP DATABASE "4members";

CREATE DATABASE "4members"
    WITH 
    OWNER = "4members"
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE "4members"
    IS 'db for the 4members app';