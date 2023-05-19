const component = require('../controllers/component.controller');

// modules
require('dotenv').config();
const router = require('express').Router();

// GET
router.get('/', component.show);
router.get('/:component_uuid', component.index);
router.post('/', component.store);
router.put('/:component_uuid', component.update);
router.delete('/:component_uuid', component.destroy);

module.exports = router;
