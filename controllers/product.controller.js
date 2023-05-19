const { Op } = require('sequelize');
const { products, components, product_components } = require('../models');

module.exports = {
  show: async (req, res, next) => {
    try {
      const allProducts = await products.findAll({
        attributes: ['uuid', 'name', 'quantity'],
        include: [
          {
            model: components,
            as: 'components_used',
            attributes: ['uuid', 'name', 'description'],
            through: { attributes: ['uuid'] },
          },
        ],
      });

      res.status(200).json({
        status: true,
        message: 'success!',
        data: allProducts,
      });
    } catch (err) {
      next(err);
    }
  },

  store: async (req, res, next) => {
    try {
      const { name, quantity, components_name } = req.body;
      // check
      if (
        !name ||
        !quantity ||
        !components_name ||
        !Array.isArray(components_name)
      ) {
        return res.status(400).json({
          status: false,
          message: 'please provide name, quantity, and components_name(array)!',
          data: null,
        });
      }

      const lower_components_name = components_name.map((name) =>
        name.toLowerCase()
      );

      const components_uuid = await components.findAll({
        attributes: ['uuid'],
        where: {
          name: {
            [Op.in]: lower_components_name,
          },
        },
      });

      // check components_uuid available
      if (components_uuid.length <= 0) {
        return res.status(404).json({
          status: false,
          message: 'please enter the registered component name at least 1!',
          data: null,
        });
      }

      // store product
      const newProduct = await products.create({
        name,
        quantity,
      });

      // store all components
      let product_components_data = [];
      components_uuid.forEach((item) => {
        product_components_data.push({
          product_uuid: newProduct.uuid,
          component_uuid: item.uuid,
        });
      });

      await product_components.bulkCreate(product_components_data);

      // success
      res.status(201).json({
        status: true,
        message: 'created!',
        data: newProduct,
      });
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const { product_uuid } = req.params;

      // delete
      const product = await products.destroy({
        where: {
          uuid: product_uuid,
        },
      });

      if (!product) {
        return res.status(404).json({
          status: false,
          message: `can't find product with id ${product_uuid}!`,
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'success!',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { product_uuid } = req.params;

      const product = await products.update(req.body, {
        where: { uuid: product_uuid },
      });

      if (product[0] == 0) {
        return res.status(404).json({
          status: false,
          message: `can't find product with uuid ${product_uuid}!`,
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'success!',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },

  index: async (req, res, next) => {
    try {
      const { product_uuid } = req.params;

      // query product
      const product = await products.findOne({
        where: {
          uuid: product_uuid,
        },
        attributes: ['uuid', 'name', 'quantity'],
        include: [
          {
            model: components,
            as: 'components_used',
            attributes: ['uuid', 'name', 'description'],
            through: { attributes: ['uuid'] },
          },
        ],
      });

      res.status(200).json({
        status: true,
        message: 'success!',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },

  add_components: async (req, res, next) => {
    try {
      const { product_uuid } = req.params;
      const { components_name } = req.body;

      // check type
      if (!Array.isArray(components_name)) {
        return res.status(400).json({
          status: false,
          message: 'components_name must be array type!',
          data: null,
        });
      }

      const lower_components_name = components_name.map((name) =>
        name.toLowerCase()
      );

      const components_uuid = await components.findAll({
        attributes: ['uuid'],
        where: {
          name: {
            [Op.in]: lower_components_name,
          },
        },
      });

      // check components_uuid available
      if (components_uuid.length <= 0) {
        return res.status(404).json({
          status: false,
          message: 'please enter the registered component name at least 1!',
          data: null,
        });
      }

      // store all components
      let product_components_data = [];
      components_uuid.forEach((item) => {
        product_components_data.push({
          product_uuid,
          component_uuid: item.uuid,
        });
      });

      await product_components.bulkCreate(product_components_data);

      const product_updated = await products.findOne({
        where: {
          uuid: product_uuid,
        },
        include: [
          {
            model: components,
            as: 'components_used',
            attributes: ['uuid', 'name', 'description'],
            through: { attributes: ['uuid'] },
          },
        ],
      });

      // success
      res.status(200).json({
        status: true,
        message: 'added!',
        data: product_updated,
      });
    } catch (err) {
      next(err);
    }
  },

  destroy_component: async (req, res, next) => {
    try {
      const { product_component_uuid } = req.params;

      // delete
      const componentDelete = await product_components.destroy({
        where: {
          uuid: product_component_uuid,
        },
      });

      if (!componentDelete) {
        return res.status(404).json({
          status: false,
          message: `can't find product component with id ${product_component_uuid}!`,
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'success!',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
