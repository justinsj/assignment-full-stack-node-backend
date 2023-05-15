// sequelize models with schema definitions
import { DataTypes } from 'sequelize';

export function userModel(sequelize) {
  const attributes = {
      username: { type: DataTypes.STRING, allowNull: false },
      hash: { type: DataTypes.STRING, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false }
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

  return sequelize.define('User', attributes, options);
}

