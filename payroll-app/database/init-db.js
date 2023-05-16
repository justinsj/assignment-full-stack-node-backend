import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import getConfig from 'next/config';
import { employeeModel } from './models/employee.model';
import { userModel } from './models/user.model';
const sequelize_fixtures = require('sequelize-fixtures');
const { Sequelize } = require('sequelize');
import { serverRuntimeConfig } from '../next.config';

function initializeFixtures({ data, models }) {
  return new Promise((resolve, reject) => {
    const dataToLoad = [];
    for (const [table, rows] of Object.entries(data)) {
      for (const row of rows) {
        const objData = { model: table, data: row };
        if (table === 'users') {
          objData.keys = ["username"];
          objData.data.hash = bcrypt.hashSync(row.password, 10);
        }
        dataToLoad.push(objData);
      }
    }
    
    sequelize_fixtures.loadFixtures(dataToLoad, models).then(() => {
      console.log("Data loaded");
      resolve();
    }).catch(reject);
  });
}

export async function initializeData(sequelize) {
  const models = {
    'employees': employeeModel(sequelize),
    'users': userModel(sequelize)
  }
  await sequelize.sync({ alter: true });

  const employeesData = require('../../data.json');
  const usersData = require('../../users.json');

  await initializeFixtures({ data: employeesData, models });
  await initializeFixtures({ data: usersData, models });
}

async function initialize() {
  const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;
  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
  

  await initializeData(sequelize);
}

(async () => {
  try {
    await initialize();
    process.exit(0); // Terminate the script after successful execution
  } catch (error) {
    console.error("An error occurred during initialization:", error);
    process.exit(1); // Terminate the script with an error code
  }
})();
