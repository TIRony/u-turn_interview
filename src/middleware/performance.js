const performanceConfig = require('../config/performance');
const cache = require('../utils/cache');

function performanceMonitor(req, res, next) {
  if (!performanceConfig.MONITORING.ENABLED) {
    return next();
  }

  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  req.performanceStart = start;
  req.requestId = requestId;

  const originalSend = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    logPerformance({
      requestId,
      method: req.method,
      url: req.url,
      duration,
      statusCode: res.statusCode,
    });

    res.setHeader('X-Response-Time', `${duration}ms`);
    res.setHeader('X-Request-ID', requestId);

    return originalSend.call(this, data);
  };

  next();
}

function logPerformance(metrics) {
  const { requestId, method, url, duration, statusCode } = metrics;
  const threshold = performanceConfig.MONITORING.SLOW_QUERY_THRESHOLD;

  if (duration > threshold) {
    console.warn(
      `SLOW REQUEST [${requestId}]: ${method} ${url} - ${duration}ms (Status: ${statusCode})`
    );
  } else {
    console.log(
      `[${requestId}]: ${method} ${url} - ${duration}ms (Status: ${statusCode})`
    );
  }
}

function cacheStatsEndpoint(req, res) {
  const stats = cache.getStats();
  
  res.json({
    success: true,
    cache: {
      enabled: performanceConfig.CACHE.ENABLED,
      ...stats,
    },
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  performanceMonitor,
  cacheStatsEndpoint,
};
