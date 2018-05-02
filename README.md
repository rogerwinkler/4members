# 4members
An open-source membership management solution for clubs and associations, designed to be serviced
from the cloud.

## Setup
1. Download and install Node.js from https://nodejs.org/en/download/.

2. npm is automatically installed with Node. To check if you have Node.js installed, 
    run this command in your terminal:
    
    ```
    node -v
    ```
    
    To confirm that you have npm installed you can run this command in your terminal:
    
    ```
    npm -v
    ```

3. In your terminal change to the directory in which you want to install 4members. 

4. Clone the project from GitHub:

    ```
    git clone https://github.com/rogerwinkler/4members.git
    ```
    
5. Since node modules are not included in the repository, you have to `npm install` the
dependencies from `package.json`. Change to the client directory and enter `npm install':

    ```
    cd client
    npm install
    ```
    
6. Do the same in the server directory:

    ```
    cd ..
    cd server
    npm install
    ```
 
7. Download and install PostgreSQL and pgAdmin 4 (or newer), which is used to 
administrate PostgreSQL, from https://www.postgresql.org.

8. Run `pgAdmin 4` (or newer) and create a new Login/Group Role *4members* and 
remember the password, you'll need it in the next step.

9. Set environment variables for the database connection. This may deviate
from the following lines depending on the operating system you're using:

    ```
    export PGHOST="database.server.com"
    export PGUSER="4members"
    export PGDATABASE="4members"
    export PGPASSWORD="secretpassword"
    export PGPORT=5432
    ```

    Or set them globally in `/etc/environment`, but then without the `export` keyword.

10. Create file `.pgpwd` in directory `db` and put your password there in the
following format:

    ```
    localhost:5432:postgres:postgres:yoursecretpassword
    localhost:5432:4members:4members:yoursecretpassword
    ```

11. Create the database and database objects. Go to the `db` directory and
run the `ct_db_4members.sh` script:

```
bash ct_db_4members.sh
```

12. Install brianc's node-postgres, a PostgreSQL client for Node:
 
 ```
 npm install --save pg
 ```
 
13. Start the server by entering `npm start` in the `server` directory.

14. Start the client by entering `npm run dev` in the `client` directory.

15. Start the app in your browser, depending on where it is located:

```
http://localhost:8080/
```

## License
MIT
