const { Sequelize } = require('sequelize');
// const { serverRuntimeConfig } = getConfig();

// const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;

const database = 'db';
const user = 'root';
const password = '2204';
const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
const modelDefiners = [
	require('./user.model'),
	require('./employee.model'),
	// Add more models here...
	// require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;