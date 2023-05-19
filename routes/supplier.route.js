const supplier = require('../controllers/supplier.controller');

// modules
require('dotenv').config();
const router = require('express').Router();

// router supplier
router.get('/', supplier.show);
router.get('/:supplier_uuid', supplier.index);
router.post('/', supplier.store);
router.put('/:supplier_uuid', supplier.update);
router.delete('/:supplier_uuid', supplier.destroy);

// router procurement
router.post('/:supplier_uuid/components', supplier.store_procurement);
router.delete(
  '/supplied_component/:supplied_components_uuid',
  supplier.destroy_procurement
);

module.exports = router;
