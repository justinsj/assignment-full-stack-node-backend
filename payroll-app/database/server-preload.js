import bcrypt from 'bcryptjs';
import { employeeModel } from './models/employee.model';
import { userModel } from './models/user.model';
const sequelize_fixtures = require('sequelize-fixtures');


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
      console.log({row})
      if (row.password) {
        
        objData.data.hash = bcrypt.hashSync(row.password, 10);
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