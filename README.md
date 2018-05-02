# 4members
An open-source membership management solution for clubs and associations, designed to be serviced
from the cloud.

## Setup
1. Download and install Node.js: https://nodejs.org/en/download/
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
 
 7. Install PostgreSQL
 
 8. Install node-postgres
 
 9. Create the database and database objects 
