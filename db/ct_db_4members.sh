# let PGPASSFILE point to local file that stores passwords
export PGPASSFILE=.pgpwd
#
#
#
#
#
#
#
# connect to PostgreSQL and create database 4members
/Library/PostgreSQL/10/bin/psql --username=postgres --no-password --host=localhost --port=5432 --file=ct_db_4members.sql
#
#
#
#
# connect to db 4members and execute master scripts (master.sql) to load data definitions in 
# depending order into 4members db
/Library/PostgreSQL/10/bin/psql --username=4members --no-password --host=localhost --port=5432 --dbname=4members --file=master.sql