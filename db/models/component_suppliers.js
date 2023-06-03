'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class component_suppliers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  component_suppliers.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      component_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'components',
          key: 'uuid',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      supplier_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'suppliers',
          key: 'uuid',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    {
      sequelize,
      modelName: 'component_suppliers',
    }
  );
  return component_suppliers;
};
