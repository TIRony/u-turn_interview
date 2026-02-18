module.exports = {
  CACHE: {
    DRIVER_LOCATION_TTL: 60,
    USER_TTL: 300,
    SEARCH_RESULTS_TTL: 30,
    ENABLED: process.env.CACHE_ENABLED !== 'false',
  },

  DATABASE: {
    MAX_DRIVERS_FETCH: 100,
    POOL_SIZE: parseInt(process.env.DB_POOL_SIZE) || 10,
    QUERY_TIMEOUT: 5000,
  },

  MONITORING: {
    ENABLED: process.env.NODE_ENV === 'development',
    SLOW_QUERY_THRESHOLD: 1000,
  },

  RESPONSE: {
    COMPRESSION: true,
    COMPRESSION_THRESHOLD: 1024,
  },
};
