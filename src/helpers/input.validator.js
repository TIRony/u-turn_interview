const constants = require('../config/constants');

function validateUserId(userId) {
  if (!userId || userId <= 0) {
    throw new Error('Invalid user ID provided');
  }
}

function validateCoordinates(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Coordinates must be numbers');
  }

  if (!isFinite(lat) || !isFinite(lng)) {
    throw new Error('Invalid coordinate values provided');
  }

  if (lat < constants.VALIDATION.LATITUDE.MIN || lat > constants.VALIDATION.LATITUDE.MAX) {
    throw new Error(`Latitude must be between ${constants.VALIDATION.LATITUDE.MIN} and ${constants.VALIDATION.LATITUDE.MAX}`);
  }

  if (lng < constants.VALIDATION.LONGITUDE.MIN || lng > constants.VALIDATION.LONGITUDE.MAX) {
    throw new Error(`Longitude must be between ${constants.VALIDATION.LONGITUDE.MIN} and ${constants.VALIDATION.LONGITUDE.MAX}`);
  }
}

function validateRadius(radiusKm) {
  if (typeof radiusKm !== 'number' || !isFinite(radiusKm)) {
    throw new Error('Radius must be a valid number');
  }

  if (radiusKm <= 0) {
    throw new Error('Radius must be greater than 0');
  }

  if (radiusKm < constants.VALIDATION.RADIUS.MIN) {
    throw new Error(`Radius must be at least ${constants.VALIDATION.RADIUS.MIN} km`);
  }

  if (radiusKm > constants.VALIDATION.RADIUS.MAX) {
    throw new Error(`Radius cannot exceed ${constants.VALIDATION.RADIUS.MAX} km`);
  }
}

function validateRideRequest(userId, pickupLat, pickupLng, radiusKm) {
  validateUserId(userId);
  validateCoordinates(pickupLat, pickupLng);
  validateRadius(radiusKm);
}

module.exports = {
  validateUserId,
  validateCoordinates,
  validateRadius,
  validateRideRequest,
};
