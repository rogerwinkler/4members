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
dependencies from `package.json`. Change to the client directory and enter `npm install`:

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
 
7. Download and install PostgreSQL and pgAdmin 4 (or newer) from https://www.postgresql.org.
pgAdmin 4 is used to administrate PostgreSQL.

8. Run `pgAdmin 4` (or newer) and create a new Login/Group Role *4members* and 
remember the passwords, you'll need them in step 10.

9. Set environment variables for the database connection. This may deviate
from the following lines depending on the operating system and installation you're using:

    ```
    export PGHOST="database.server.com"
    export PGUSER="4members"
    export PGDATABASE="4members"
    export PGPASSWORD="secretpassword"
    export PGPORT=5432
    ```

    Or set them globally in `/etc/environment`, but then without the `export` keyword.

10. Create file `.pgpwd` in directory `db` and put your passwords there in the
following format:

    ```
    localhost:5432:postgres:postgres:yoursecretpassword
    localhost:5432:4members:4members:yoursecretpassword
    ```

11. To create the database and database objects, go to the `db` directory and
run the `ct_db_4members.sh` script:

    ```
    bash ct_db_4members.sh
    ```

12. Install brianc's node-postgres, a PostgreSQL client for Node:

     ```
     npm install --save pg
     ```

    Brian has also set up a wonderful documentation site for node-postgres.
    Check it out at https://node-postgres.com/.

13. Start the server by entering `npm start` in the `server` directory.

    ```
    cd server
    npm start
    ```

14. Start the client by entering `npm run dev` (for a development environment)
in the `client` directory.

    ```
    cd client
    npm run dev
    ```

15. Start the app in your browser, depending on where it is located:

    ```
    http://localhost:8080/
    ```

## MIT License

Copyright (c) 2018 rogerwinkler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
