'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class components extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      components.belongsToMany(models.suppliers, {
        through: 'component_suppliers',
        foreignKey: 'component_uuid',
      });
      components.belongsToMany(models.products, {
        through: 'product_components',
        foreignKey: 'component_uuid',
      });
    }
  }
  components.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'components',
    }
  );
  return components;
};
