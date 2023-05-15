import { DataTypes } from 'sequelize';

export function employeeModel(sequelize) {
  const attributes = {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      salary: { type: DataTypes.DECIMAL, allowNull: false }
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