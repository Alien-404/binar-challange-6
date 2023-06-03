'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class suppliers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      suppliers.belongsToMany(models.components, {
        through: 'component_suppliers',
        as: 'supplied_components',
        foreignKey: 'supplier_uuid',
      });
    }
  }
  suppliers.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      address: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'suppliers',
    }
  );
  return suppliers;
};
