const { DataTypes } = require('sequelize');

export function employeeModel(sequelize) {
  const attributes = {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      salary: { type: DataTypes.DECIMAL(65, 30), allowNull: false }
  };

  const options = {
      defaultScope: {
          // exclude password hash by default
          attributes: { exclude: ['hash'] }
      },
      scopes: {
          // include hash with this scope
          withHash: { attributes: {}, }
      }
  };

  return sequelize.define('Employee', attributes, options);
}

