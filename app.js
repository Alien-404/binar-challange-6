// modules
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const Sentry = require('@sentry/node');
const { rateLimit } = require('express-rate-limit');

// local modules
const indexRouter = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware');
const limiter = require('./config/limiter.config');
const file = fs.readFileSync('./docs.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

// sentry
Sentry.init({
  dsn: process.env.DSN,
  environment: process.env.ENVIRONMENT || 'development',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// middlewares
app.use(rateLimit(limiter));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// middleware sentry
app.use(
  Sentry.Handlers.requestHandler({
    ip: true,
  })
);
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// middlewares route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // api docs swagger

// router
app.use(indexRouter);

// Middleware error Sentry
app.use(Sentry.Handlers.errorHandler());

// error handling middleware
app.use(notFoundHandler);
app.use((err, req, res, next) => {
  Sentry.captureException(err);
  errorHandler(err, req, res, next);
});

// export
module.exports = app;
