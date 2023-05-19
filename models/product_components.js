'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_components extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_components.init(
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
      product_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'products',
          key: 'uuid',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    {
      sequelize,
      modelName: 'product_components',
    }
  );
  return product_components;
};
