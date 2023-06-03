const product = require('../controllers/product.controller');
const { rbacHandler } = require('../middleware');
const { rbacModule } = require('../utils/enum');

// modules
require('dotenv').config();
const router = require('express').Router();

// router product
router.get(
  '/',
  rbacHandler(rbacModule.authorization, true, false),
  product.show
);
router.get(
  '/:product_uuid',
  rbacHandler(rbacModule.authorization, true, false),
  product.index
);
router.post(
  '/',
  rbacHandler(rbacModule.authorization, true, true),
  product.store
);
router.delete(
  '/:product_uuid',
  rbacHandler(rbacModule.authorization, true, true),
  product.destroy
);
router.put(
  '/:product_uuid',
  rbacHandler(rbacModule.authorization, true, true),
  product.update
);

// router product components
router.post(
  '/:product_uuid/components',
  rbacHandler(rbacModule.authorization, true, true),
  product.add_components
);
router.delete(
  '/components_used/:product_component_uuid',
  rbacHandler(rbacModule.authorization, true, true),
  product.destroy_component
);

module.exports = router;
