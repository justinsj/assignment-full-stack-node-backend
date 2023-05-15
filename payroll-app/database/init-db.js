import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import getConfig from 'next/config';
import { employeeModel } from './models/employee.model';
import { userModel } from './models/user.model';
const sequelize_fixtures = require('sequelize-fixtures');
const { Sequelize } = require('sequelize');
// const { serverRuntimeConfig } = getConfig();
import {serverRuntimeConfig} from '../next.config';


function initializeFixtures({data, models}){
  /*
  * Load database fixtures from a file
  * @param {string} filepath - The path to the file to load
  * @param {object} models - The sequelize models to load the fixtures into
  * 
  * @returns undefined
  */
  const dataToLoad = [];
  for (const [table, rows] of Object.entries(data)) {
    for (const row of rows) {
      const objData = { model: table, data: row };
      if (table === 'users') {
        objData.keys = ["username"];
        objData.data.hash = bcrypt.hashSync(row.password, 10);
        // objData.data.id = row.username;
      }
      dataToLoad.push(objData);
    }
  }
  //from file
  sequelize_fixtures.loadFixtures(dataToLoad, models).then(function(){
    console.log("Data loaded");
  });
}
export function initializeData(sequelize){
  // Load the models mapping
  const models = {
    'employees': employeeModel(sequelize),
    'users': userModel(sequelize)
  }

  const employeesData = require('../../data.json');
  const usersData = require('../../users.json');
  initializeFixtures({data: employeesData, models});
  initializeFixtures({data: usersData, models});
}


async function initialize() {
  /*
  This function will initialize the user and employee data.
  It will add records if they do not exist, but will not update or remove existing records.

  */
  // create db if it doesn't already exist
  const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;
  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

  // sync all models with database
  await sequelize.sync({ alter: true });
  
  initializeData(sequelize)

}

// Call the initialize function
(async () => await initialize())();


