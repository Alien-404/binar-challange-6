const product = require('../controllers/product.controller');

// modules
require('dotenv').config();
const router = require('express').Router();

// router product
router.get('/', product.show);
router.get('/:product_uuid', product.index);
router.post('/', product.store);
router.delete('/:product_uuid', product.destroy);
router.put('/:product_uuid', product.update);

// router product components
router.post('/:product_uuid/components', product.add_components);
router.delete(
  '/components_used/:product_component_uuid',
  product.destroy_component
);

module.exports = router;
