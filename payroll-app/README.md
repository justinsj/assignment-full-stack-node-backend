# Payroll App

## Installation
1. Do the setup in the [`database`](./database/) folder.
2. Install the dependencies for the Payroll App.
```
npm install
```

## Usage
1. Start the MySQL database
```
docker-compose -f database\docker-compose-windows.yaml up
```

2. Initialize the data in the database
```
npm run init-db
```

3. Start the Payroll App, which includes API endpoints.
```
npm run dev
```

## Production 
1. Update the db root password in the `.env` file
2. Update the db root password in the `database/db_root_password.secret` file
3. Build the server (this may take a few minutes)
```
npm run build
```
4. Start the server
```
npm run start
```