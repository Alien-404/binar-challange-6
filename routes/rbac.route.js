const { roleaccess, roles, modules } = require('../controllers/rbac');
const { rbacHandler } = require('../middleware');
const { rbacModule } = require('../utils/enum');

// modules
require('dotenv').config();
const router = require('express').Router();

// role
router.get(
  '/roles',
  rbacHandler(rbacModule.authorization, true, false),
  roles.index
);
router.post(
  '/roles',
  rbacHandler(rbacModule.authorization, true, true),
  roles.store
);

// module
router.get(
  '/modules',
  rbacHandler(rbacModule.authorization, true, false),
  modules.index
);
router.post(
  '/modules',
  rbacHandler(rbacModule.authorization, true, true),
  modules.store
);

// role access
router.get(
  '/roleaccess',
  rbacHandler(rbacModule.authorization, true, false),
  roleaccess.index
);
router.post(
  '/roleaccess',
  rbacHandler(rbacModule.authorization, true, true),
  roleaccess.store
);

module.exports = router;
