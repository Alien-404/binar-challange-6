const notFoundHandler = require('./notfound.middleware');
const errorHandler = require('./error.middleware');
const authHandler = require('./auth.middleware');
const rbacHandler = require('./rbac.middleware');

module.exports = {
  notFoundHandler,
  errorHandler,
  authHandler,
  rbacHandler,
};
