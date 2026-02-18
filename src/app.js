require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const apiRoutes = require('./routes/index');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { successResponse } = require('./utils/responseFormatter');
const { performanceMonitor, cacheStatsEndpoint } = require('./middleware/performance');
const constants = require('./config/constants');
const performanceConfig = require('./config/performance');

const app = express();
const { ENV } = constants.SERVER;

if (ENV === 'development') {
  app.use(performanceMonitor);
}

if (performanceConfig.RESPONSE.COMPRESSION) {
  app.use(compression({
    threshold: performanceConfig.RESPONSE.COMPRESSION_THRESHOLD,
    level: 6,
  }));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

if (ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.get('/', (req, res) => {
  successResponse(res, {
    name: 'U-Turn Ride Matching API',
    environment: ENV,
    endpoints: {
      rideRequest: 'POST /api/ride/request',
    },
  }, 'Welcome to U-Turn API');
});

app.get('/stats', cacheStatsEndpoint);
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
