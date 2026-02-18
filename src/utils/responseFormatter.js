const constants = require('../config/constants');

const successResponse = (res, data = {}, message = 'Success', statusCode = constants.HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const errorResponse = (res, message = 'Error', statusCode = constants.HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

const validationErrorResponse = (res, errors) => {
  return res.status(constants.HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    error: constants.MESSAGES.ERROR.VALIDATION_FAILED,
    message: 'Please check your input and try again',
    details: errors,
    timestamp: new Date().toISOString(),
  });
};

const notFoundResponse = (res, resource = 'Resource') => {
  return res.status(constants.HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `${resource} not found`,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
};
