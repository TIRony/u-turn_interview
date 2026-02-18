module.exports = {
  SERVER: {
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV || 'development',
    API_VERSION: 'v1',
  },

  VALIDATION: {
    USER_ID: {
      MIN: 1,
      MAX: 2147483647,
    },
    LATITUDE: {
      MIN: -90,
      MAX: 90,
    },
    LONGITUDE: {
      MIN: -180,
      MAX: 180,
    },
    RADIUS: {
      MIN: 0.1,
      MAX: 100,
    },
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  MESSAGES: {
    SUCCESS: {
      DRIVERS_FOUND: (count, radius) => `Found ${count} driver(s) within ${radius}km`,
      NO_DRIVERS: 'No available drivers found in your area',
    },
    ERROR: {
      USER_NOT_FOUND: 'User not found',
      INVALID_COORDINATES: 'Invalid coordinates provided',
      SERVER_ERROR: 'Internal server error occurred',
      VALIDATION_FAILED: 'Validation failed',
    },
  },

  DATABASE: {
    MAX_QUERY_TIMEOUT: 10000,
  },
};
