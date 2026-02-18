const constants = require('../config/constants');

function createUserNotFoundError() {
  const error = new Error(constants.MESSAGES.ERROR.USER_NOT_FOUND);
  error.statusCode = constants.HTTP_STATUS.NOT_FOUND;
  return error;
}

function createInvalidCoordinatesError() {
  const error = new Error(constants.MESSAGES.ERROR.INVALID_COORDINATES);
  error.statusCode = constants.HTTP_STATUS.BAD_REQUEST;
  return error;
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = constants.HTTP_STATUS.BAD_REQUEST;
  return error;
}

module.exports = {
  createUserNotFoundError,
  createInvalidCoordinatesError,
  createValidationError,
};
