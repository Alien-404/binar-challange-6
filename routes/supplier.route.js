const supplier = require('../controllers/supplier.controller');
const { rbacHandler } = require('../middleware');
const { rbacModule } = require('../utils/enum');

// modules
require('dotenv').config();
const router = require('express').Router();

// router supplier
router.get(
  '/',
  rbacHandler(rbacModule.authorization, true, false),
  supplier.show
);
router.get(
  '/:supplier_uuid',
  rbacHandler(rbacModule.authorization, true, false),
  supplier.index
);
router.post(
  '/',
  rbacHandler(rbacModule.authorization, true, true),
  supplier.store
);
router.put(
  '/:supplier_uuid',
  rbacHandler(rbacModule.authorization, true, true),
  supplier.update
);
router.delete(
  '/:supplier_uuid',
  rbacHandler(rbacModule.authorization, true, true),
  supplier.destroy
);

// router procurement
router.post(
  '/:supplier_uuid/components',
  rbacHandler(rbacModule.authorization, true, true),
  supplier.store_procurement
);
router.delete(
  '/supplied_component/:supplied_components_uuid',
  rbacHandler(rbacModule.authorization, true, true),
  supplier.destroy_procurement
);

module.exports = router;
