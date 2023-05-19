const { suppliers, components } = require('../models');

module.exports = {
  show: async (req, res, next) => {
    try {
      const allComponents = await components.findAll();

      res.status(200).json({
        status: true,
        message: 'success!',
        data: allComponents,
      });
    } catch (err) {
      next(err.message);
    }
  },

  store: async (req, res, next) => {
    try {
      const { name, description } = req.body;

      // check
      if (!name || !description) {
        return res.status(400).json({
          status: false,
          message: 'please provide name and description!',
          data: null,
        });
      }

      // store to db
      const component = await components.create({
        name,
        description,
      });

      res.status(201).json({
        status: true,
        message: 'created!',
        data: component,
      });
    } catch (err) {
      next(err.message);
    }
  },

  index: async (req, res, next) => {
    try {
      const { component_uuid } = req.params;

      // query component
      const component = await components.findOne({
        where: {
          uuid: component_uuid,
        },
        attributes: ['uuid', 'name', 'description'],
      });

      res.status(200).json({
        status: true,
        message: 'success!',
        data: component,
      });
    } catch (err) {
      next(err.message);
    }
  },

  update: async (req, res, next) => {
    try {
      const { component_uuid } = req.params;

      const component = await components.update(req.body, {
        where: { uuid: component_uuid },
      });

      if (component[0] == 0) {
        return res.status(404).json({
          status: false,
          message: `can't find component with uuid ${component_uuid}!`,
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'success!',
        data: null,
      });
    } catch (err) {
      next(err.message);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const { component_uuid } = req.params;

      // delete
      const component = await components.destroy({
        where: {
          uuid: component_uuid,
        },
      });

      if (!component) {
        return res.status(404).json({
          status: false,
          message: `can't find component with id ${component_uuid}!`,
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: 'success!',
        data: null,
      });
    } catch (err) {
      next(err.message);
    }
  },
};
