// module
require('dotenv').config();
const router = require('express').Router();

// router
const authRouter = require('./auth.route');
const componentRouter = require('./component.route');
const productRouter = require('./product.route');
const supplierRouter = require('./supplier.route');

// middleware
const { authHandler } = require('../middleware');

// auth route
router.use('/auth', authRouter);

// middleware auth handler
router.use(authHandler);

// component route
router.use('/component', componentRouter);

// product route
router.use('/product', productRouter);

// supplier route
router.use('/supplier', supplierRouter);

module.exports = router;
