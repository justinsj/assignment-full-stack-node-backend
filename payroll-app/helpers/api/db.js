import getConfig from 'next/config';
import mysql from 'mysql2/promise';
import { Sequelize, DataTypes } from 'sequelize';
import { userModel } from '../../database/models/user.model';
import { employeeModel } from '../../database/models/employee.model';
const { serverRuntimeConfig } = getConfig();

export const db = {
    initialized: false,
    initialize
};


// initialize db and models, called on first api request from /helpers/api/api-handler.js
async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = userModel(sequelize);
    db.Employee = employeeModel(sequelize);

    // sync all models with database
    await sequelize.sync({ alter: true });
    
    db.initialized = true;
}