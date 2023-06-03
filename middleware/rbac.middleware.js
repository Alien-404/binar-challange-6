const { Module, RoleAccess } = require('../db/models');

const rbacHandler = (moduleName, is_read = false, is_write = false) => {
  return async (req, res, next) => {
    try {
      // dapatkan role_id dari data user
      const { role_id } = req.user;
      // validasi role_id
      if (!role_id) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      // cari module where name = moduleName
      const module = await Module.findOne({ where: { name: moduleName } });
      if (!module) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      // cari role access where role_id = role_id and module_id = module.id
      const roleAccess = await RoleAccess.findOne({
        where: { module_id: module.id, role_id: role_id },
      });

      if (!roleAccess) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      // cocokkan isread dan iswrite yang ada di roleacess dengan parameter
      if (is_read && !roleAccess.is_read) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      if (is_write && !roleAccess.is_write) {
        return res.status(401).json({
          status: false,
          message: "you're not authorizeaad!",
          data: null,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = rbacHandler;
