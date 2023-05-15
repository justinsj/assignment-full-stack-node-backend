import { userModel } from './models/user.model';
import { employeeModel } from './models/employee.model';
const sequelize_fixtures = require('sequelize-fixtures');

export function initializeData(sequelize){
  // Load the models mapping
  const models = {
    'employees': employeeModel(sequelize),
    'user': userModel(sequelize)
  }

  // Reformat data to sequelize_fixures format
  // The input file format is { table: [{col: val},...] }
  // The required format is an array of { model, data: {col: val}}
  const data = require('../../data.json');
  const dataToLoad = [];
  for (const [table, rows] of Object.entries(data)) {
    for (const row of rows) {
      dataToLoad.push({ model: table, data: row });
    }
  }
  //from file
  sequelize_fixtures.loadFixtures(dataToLoad, models).then(function(){
    console.log("Data loaded");
  });
}