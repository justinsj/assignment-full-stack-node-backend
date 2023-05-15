const sequelize_fixtures = require('sequelize-fixtures');

  //a map of [model name] : model
  //see offical example on how to load models
  //https://github.com/sequelize/express-example/blob/master/models/index.js
  const models = require('./models');


  const data = require('../../data.json');

  // Reformat data to sequelize_fixures format
  // The input file format is { table: [{col: val},...] }
  // The required format is an array of { model, data: {col: val}}
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