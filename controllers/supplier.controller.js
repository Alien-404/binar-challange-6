const { suppliers, components, component_suppliers } = require('../models');

module.exports = {
  store: async (req, res, next) => {
    try {
      const { name, address } = req.body;

      // check
      if (!name || !address) {
        return res.status(400).json({
          status: false,
          message: 'please provide name and address!',
          data: null,
        });
      }

      // store to db
      const supplier = await suppliers.create({
        name,
        address,
      });

      res.status(201).json({
        status: true,
        message: 'created!',
        data: supplier,
      });
    } catch (err) {
      next(err);
    }
  },

  show: async (req, res, next) => {
    try {
      // query all suppliers
      const allSupplier = await suppliers.findAll({
        attributes: ['uuid', 'name', 'address'],
        include: [
          {
            model: components,
            as: 'supplied_components',
            attributes: ['uuid', 'name', 'description'],
            through: { attributes: ['uuid'] },
          },
        ],
      });

      res.status(200).json({
        status: true,
        message: 'success!',
        data: allSupplier,
      });
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const { supplier_uuid } = req.params;

      // delete
      const supplier = await suppliers.destroy({
        where: {
          uuid: supplier_uuid,
        },
      });

      if (!supplier) {
        return res.status(404).json({
          status: false,
          message: `can't find supplier with id ${supplier_uuid}!`,
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
      const { supplier_uuid } = req.params;

      // query supplier
      const supplier = await suppliers.findOne({
        where: {
          uuid: supplier_uuid,
        },
        attributes: ['uuid', 'name', 'address'],
        include: [
          {
            model: components,
            as: 'supplied_components',
            attributes: ['uuid', 'name', 'description'],
            through: { attributes: ['uuid'] },
          },
        ],
      });

      res.status(200).json({
        status: true,
        message: 'success!',
        data: supplier,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { supplier_uuid } = req.params;

      const supplier = await suppliers.update(req.body, {
        where: { uuid: supplier_uuid },
      });

      if (supplier[0] == 0) {
        return res.status(404).json({
          status: false,
          message: `can't find supplier with uuid ${supplier_uuid}!`,
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

  store_procurement: async (req, res, next) => {
    try {
      const { supplier_uuid } = req.params;
      const { components_uuid } = req.body;

      // check type
      if (!Array.isArray(components_uuid)) {
        return res.status(400).json({
          status: false,
          message: 'components_uuid must be array type!',
          data: null,
        });
      }

      // get all data
      let procurementData = [];
      components_uuid.forEach((component_uuid) => {
        procurementData.push({
          supplier_uuid,
          component_uuid,
        });
      });

      await component_suppliers.bulkCreate(procurementData);

      res.status(200).json({
        status: true,
        message: 'components added!',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },

  destroy_procurement: async (req, res, next) => {
    try {
      const { supplied_components_uuid } = req.params;

      const procurementDelete = await component_suppliers.destroy({
        where: {
          uuid: supplied_components_uuid,
        },
      });

      if (!procurementDelete) {
        return res.status(404).json({
          status: false,
          message: `can't find supplied_components with uuid ${supplied_components_uuid}!`,
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
