# AI Invoice Processing App

## install requirements
1. run `pip install -r requirements.txt` to install all python module requirements
1. run `npm install` to install all required node modules


## starting services in wsl
1. Docker: `sudo service docker start`
1. PSQL: `sudo service postgresql start`

## Load default database tables

* `sudo -u postgres psql -f script.sql`
* in the PSQL shell : 
```
 -- Create the user with password
CREATE USER invoice_app WITH PASSWORD 'secure_password';

-- Create the database
CREATE DATABASE invoice_processing;

-- Grant privileges to the user on the database
GRANT ALL PRIVILEGES ON DATABASE invoice_processing TO invoice_app;

-- Connect to the new database to set schema permissions
\c invoice_processing

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO invoice_app;
```

## Running
you can either use `npm run client` and `npm run server` to run each component individually on separate terminals or you can use `npm run dev` to run both simultaneously from the same terminal